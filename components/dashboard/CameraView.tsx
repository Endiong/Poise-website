import React from 'react';
import { PostureStatus } from '../../types';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  postureStatus: PostureStatus;
  onToggleCamera: () => void;
  isCameraEnabled: boolean;
}

const getStatusColor = (status: PostureStatus) => {
  switch (status) {
    case PostureStatus.GOOD:
      return 'bg-green-500';
    case PostureStatus.SLOUCHING:
    case PostureStatus.LEANING:
      return 'bg-red-500';
    case PostureStatus.IDLE:
      return 'bg-gray-400';
    default:
      return 'bg-yellow-500';
  }
};

const CameraView: React.FC<CameraViewProps> = ({ videoRef, postureStatus, onToggleCamera, isCameraEnabled }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="relative aspect-video bg-gray-900 dark:bg-black rounded-lg overflow-hidden mb-4">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform -scale-x-100"></video>
        {!isCameraEnabled && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                <p className="mb-4">Camera is off</p>
            </div>
        )}
        {isCameraEnabled && postureStatus === PostureStatus.IDLE && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4 text-center">
                <p className="text-lg font-semibold">You seem to be idle</p>
                <p className="mt-2 text-sm">Move your mouse or press a key to resume tracking.</p>
            </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`w-4 h-4 rounded-full ${getStatusColor(postureStatus)}`}></span>
          <p className="font-semibold text-lg text-gray-900 dark:text-white">{postureStatus}</p>
        </div>
        <button
          onClick={onToggleCamera}
          className={`px-6 py-2 rounded-full font-semibold text-white transition-colors ${
            isCameraEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isCameraEnabled ? 'Stop Camera' : 'Start Camera'}
        </button>
      </div>
    </div>
  );
};

export default CameraView;
