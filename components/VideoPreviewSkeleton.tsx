
import React from 'react';

const VideoPreviewSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 p-4 border border-gray-200 dark:border-gray-700/60 rounded-xl">
        <div className="bg-gray-300 dark:bg-gray-700 rounded-md w-full sm:w-48 h-28 sm:h-auto flex-shrink-0 aspect-video"></div>
        <div className="flex-grow space-y-3 py-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
        </div>
        </div>
    </div>
  );
};

export default VideoPreviewSkeleton;
