import { useState, useEffect, useRef, useCallback } from 'react';
import { PostureStatus, PostureHistoryItem } from '../types';
import { sendNotification, playBeep } from '../services/notificationService';

// TypeScript declarations for global variables from script tags in index.html
declare var poseDetection: any;

interface UsePostureTrackerProps {
  onPostureChange: (status: PostureStatus) => void;
  enabled: boolean;
  onSessionEnd: (session: PostureHistoryItem) => void;
}

const BAD_POSTURE_THRESHOLD_MS = 60000; // 1 minute
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const MIN_KEYPOINT_SCORE = 0.3;
const MIN_SESSION_DURATION_SECONDS = 60;

const usePostureTracker = ({ onPostureChange, enabled, onSessionEnd }: UsePostureTrackerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const detectorRef = useRef<any>(null); // To hold the pose detector
  const requestRef = useRef<number | undefined>(undefined); // For requestAnimationFrame
  const [postureStatus, setPostureStatus] = useState<PostureStatus>(PostureStatus.UNKNOWN);
  const streamRef = useRef<MediaStream | null>(null);
  const badPostureTimer = useRef<number | null>(null);
  const lastNotificationTime = useRef<number>(0);
  const inactivityTimerRef = useRef<number | null>(null);

  const [goodPostureSeconds, setGoodPostureSeconds] = useState(0);
  const [totalSessionSeconds, setTotalSessionSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const postureStatusRef = useRef(postureStatus);

  useEffect(() => {
    postureStatusRef.current = postureStatus;
  }, [postureStatus]);

  const updatePostureStatus = useCallback((newStatus: PostureStatus) => {
    setPostureStatus(newStatus);
    onPostureChange(newStatus);
  }, [onPostureChange]);

  const analyzePose = (pose: any): PostureStatus => {
    if (!pose || !pose.keypoints) {
      return PostureStatus.UNKNOWN;
    }
    const keypoints = pose.keypoints.reduce((acc: any, keypoint: any) => {
        if (keypoint.score > MIN_KEYPOINT_SCORE) {
            acc[keypoint.name] = keypoint;
        }
        return acc;
    }, {});

    const requiredKeypoints = ['left_shoulder', 'right_shoulder', 'left_ear', 'right_ear'];
    for (const kp of requiredKeypoints) {
        if (!keypoints[kp]) {
            return PostureStatus.UNKNOWN; // Not enough keypoints visible
        }
    }
    
    const { left_shoulder, right_shoulder, left_ear, right_ear } = keypoints;
    
    // 1. Leaning check
    const shoulderYDiff = Math.abs(left_shoulder.y - right_shoulder.y);
    const shoulderWidth = Math.abs(left_shoulder.x - right_shoulder.x);
    if (shoulderYDiff > shoulderWidth * 0.15) { // 15% difference in height suggests leaning
        return PostureStatus.LEANING;
    }

    // 2. Slouching (Forward Head) check
    // Since the camera is mirrored, a smaller x value means 'further into the scene' or 'more forward'
    const earAvgX = (left_ear.x + right_ear.x) / 2;
    const shoulderAvgX = (left_shoulder.x + right_shoulder.x) / 2;
    
    // A significant forward position of the ear indicates slouching
    if (shoulderAvgX - earAvgX > shoulderWidth * 0.20) { // Ear is 20% of shoulder width forward of shoulder
        return PostureStatus.SLOUCHING;
    }

    return PostureStatus.GOOD;
  };

  const runDetection = useCallback(async () => {
    if (
      detectorRef.current &&
      videoRef.current &&
      videoRef.current.readyState >= 3 && // Ensure video has enough data
      postureStatusRef.current !== PostureStatus.IDLE
    ) {
      try {
        const poses = await detectorRef.current.estimatePoses(videoRef.current);
        if (poses && poses.length > 0) {
            const newStatus = analyzePose(poses[0]);
            updatePostureStatus(newStatus);
        } else {
            updatePostureStatus(PostureStatus.UNKNOWN);
        }
      } catch (error) {
        console.error("Error during pose estimation:", error);
      }
    }
    requestRef.current = requestAnimationFrame(runDetection);
  }, [updatePostureStatus]);

  const loadAndRunModel = useCallback(async () => {
    try {
        updatePostureStatus(PostureStatus.UNKNOWN);
        if (!detectorRef.current) {
            const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING };
            const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
            detectorRef.current = detector;
        }
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
        runDetection();
    } catch(error) {
        console.error("Failed to load the pose detection model.", error);
    }
  }, [runDetection, updatePostureStatus]);

  const stopDetection = useCallback(() => {
    if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = undefined;
    }
    if(detectorRef.current) {
      detectorRef.current.dispose();
      detectorRef.current = null;
    }
  }, []);

  const stopCamera = useCallback(() => {
    stopDetection();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    
    if (totalSessionSeconds > MIN_SESSION_DURATION_SECONDS) {
        onSessionEnd({
            date: new Date().toISOString(),
            duration: totalSessionSeconds,
            goodDuration: goodPostureSeconds,
        });
    }

    setTotalSessionSeconds(0);
    setGoodPostureSeconds(0);
    updatePostureStatus(PostureStatus.UNKNOWN);
  }, [updatePostureStatus, stopDetection, totalSessionSeconds, goodPostureSeconds, onSessionEnd]);

  const startCamera = useCallback(async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
            }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
              loadAndRunModel();
          };
        }
        await Notification.requestPermission();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      updatePostureStatus(PostureStatus.UNKNOWN);
    }
  }, [updatePostureStatus, loadAndRunModel]);
  
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (postureStatusRef.current === PostureStatus.IDLE) {
      updatePostureStatus(PostureStatus.UNKNOWN);
    }
    inactivityTimerRef.current = window.setTimeout(() => {
      updatePostureStatus(PostureStatus.IDLE);
    }, INACTIVITY_TIMEOUT_MS);
  }, [updatePostureStatus]);
  
  useEffect(() => {
    if (enabled) {
      const activityEvents: (keyof WindowEventMap)[] = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
      activityEvents.forEach(event => window.addEventListener(event, resetInactivityTimer));
      resetInactivityTimer();

      return () => {
        activityEvents.forEach(event => window.removeEventListener(event, resetInactivityTimer));
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
        }
      };
    }
  }, [enabled, resetInactivityTimer]);

  useEffect(() => {
    if (enabled) {
      intervalRef.current = window.setInterval(() => {
        setTotalSessionSeconds(prev => prev + 1);
        if (postureStatusRef.current === PostureStatus.GOOD) {
          setGoodPostureSeconds(prev => prev + 1);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled]);

  useEffect(() => {
    if (postureStatus === PostureStatus.SLOUCHING || postureStatus === PostureStatus.LEANING) {
      if (badPostureTimer.current === null) {
        badPostureTimer.current = window.setTimeout(() => {
          const now = Date.now();
          if (now - lastNotificationTime.current > 120000) { 
            sendNotification('Posture Alert!', 'Please check your posture.');
            playBeep();
            lastNotificationTime.current = now;
          }
        }, BAD_POSTURE_THRESHOLD_MS);
      }
    } else {
      if (badPostureTimer.current) {
        clearTimeout(badPostureTimer.current);
        badPostureTimer.current = null;
      }
    }

    return () => {
        if (badPostureTimer.current) {
            clearTimeout(badPostureTimer.current);
        }
    };
  }, [postureStatus]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return { videoRef, postureStatus, startCamera, stopCamera, goodPostureSeconds, totalSessionSeconds };
};

export default usePostureTracker;
