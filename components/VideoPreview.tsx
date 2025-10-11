
import React from 'react';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { VideoMeta } from '../types';

interface VideoPreviewProps {
  meta: VideoMeta;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ meta }) => {
  if (!meta) return null;

  return (
    <div>
      <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Video Preview</h2>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/60 rounded-xl overflow-hidden shadow-sm">
        <img
          src={meta.thumbnail_url}
          alt={`Thumbnail for ${meta.title}`}
          className="aspect-video w-full sm:w-48 h-auto object-cover rounded-md flex-shrink-0"
        />
        <div className="flex flex-col justify-center">
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 line-clamp-2">
            {meta.title}
          </h3>
          <div className="flex items-center gap-2 mt-2 text-gray-500 dark:text-gray-400">
            <UserCircleIcon className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium truncate">{meta.author_name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
