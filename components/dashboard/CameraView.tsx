"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Camera, CameraOff, Activity } from "lucide-react"
import usePostureTracker from "../../hooks/usePostureTracker"
import { PostureStatus, type PostureHistoryItem } from "../../types"
import { savePostureSession } from "../../utils/storage"

const getStatusColor = (status: PostureStatus) => {
  switch (status) {
    case PostureStatus.GOOD:
      return "bg-green-500"
    case PostureStatus.SLOUCHING:
    case PostureStatus.LEANING:
      return "bg-red-500"
    case PostureStatus.IDLE:
      return "bg-gray-400"
    default:
      return "bg-yellow-500"
  }
}

const getStatusText = (status: PostureStatus) => {
  switch (status) {
    case PostureStatus.GOOD:
      return "Good Posture"
    case PostureStatus.SLOUCHING:
      return "Slouching Detected"
    case PostureStatus.LEANING:
      return "Leaning Detected"
    case PostureStatus.IDLE:
      return "Idle"
    default:
      return "Detecting..."
  }
}

const CameraView: React.FC = () => {
  const [isCameraEnabled, setIsCameraEnabled] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)

  const handlePostureChange = useCallback((status: PostureStatus) => {
    // Handle posture status changes if needed
  }, [])

  const handleSessionEnd = useCallback((session: PostureHistoryItem) => {
    savePostureSession(session)
  }, [])

  const { videoRef, postureStatus, startCamera, stopCamera, goodPostureSeconds, totalSessionSeconds } =
    usePostureTracker({
      onPostureChange: handlePostureChange,
      enabled: isCameraEnabled,
      onSessionEnd: handleSessionEnd,
    })

  const handleToggleCamera = async () => {
    if (isCameraEnabled) {
      stopCamera()
      setIsCameraEnabled(false)
      setSessionStartTime(null)
    } else {
      await startCamera()
      setIsCameraEnabled(true)
      setSessionStartTime(Date.now())
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    }
    return `${minutes}m ${secs}s`
  }

  const postureScore = totalSessionSeconds > 0 ? Math.round((goodPostureSeconds / totalSessionSeconds) * 100) : 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Live Posture Tracking</CardTitle>
          <CardDescription>Monitor your posture in real-time using your webcam</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Video Feed */}
          <div className="relative aspect-video bg-gray-900 dark:bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover transform -scale-x-100"
            />
            {!isCameraEnabled && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                <CameraOff className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg">Camera is off</p>
                <p className="text-sm text-gray-400 mt-2">Click Start Tracking to begin</p>
              </div>
            )}
            {isCameraEnabled && postureStatus === PostureStatus.IDLE && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4 text-center">
                <Activity className="w-12 h-12 mb-3 opacity-50" />
                <p className="text-lg font-semibold">You seem to be idle</p>
                <p className="mt-2 text-sm">Move your mouse or press a key to resume tracking.</p>
              </div>
            )}
          </div>

          {/* Status and Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`w-4 h-4 rounded-full ${getStatusColor(postureStatus)}`}></span>
              <p className="font-semibold text-lg">{getStatusText(postureStatus)}</p>
            </div>
            <Button
              onClick={handleToggleCamera}
              variant={isCameraEnabled ? "destructive" : "default"}
              size="lg"
              className="min-w-[150px]"
            >
              {isCameraEnabled ? (
                <>
                  <CameraOff className="w-4 h-4 mr-2" />
                  Stop Tracking
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Start Tracking
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Session Stats */}
      {isCameraEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>Current Session</CardTitle>
            <CardDescription>Real-time statistics for this tracking session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Time</p>
                <p className="text-2xl font-bold text-blue-600">{formatTime(totalSessionSeconds)}</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Good Posture</p>
                <p className="text-2xl font-bold text-green-600">{formatTime(goodPostureSeconds)}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Score</p>
                <p className="text-2xl font-bold text-purple-600">{postureScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Tracking Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Position yourself so your head, shoulders, and upper body are visible in the camera</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Ensure good lighting for accurate detection</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Sit at a comfortable distance from the camera (about arm's length)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Keep your back straight and shoulders relaxed for best posture</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default CameraView
