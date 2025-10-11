
import React from 'react';
import { HistoryItem } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';

interface HistoryProps {
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

const History: React.FC<HistoryProps> = ({ history, onSelectItem, onClearHistory }) => {
  if (history.length === 0) {
    return null; // Don't render anything if there's no history
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <HistoryIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">History</h2>
        </div>
        <button
          onClick={onClearHistory}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
          aria-label="Clear summary history"
        >
          <TrashIcon className="h-4 w-4" />
          Clear History
        </button>
      </div>
      <div className="space-y-4">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectItem(item)}
            className="w-full text-left flex items-center gap-4 p-3 bg-white/60 dark:bg-gray-800/40 hover:bg-gray-200/60 dark:hover:bg-gray-700/50 border border-gray-200 dark:border-gray-700/60 rounded-xl shadow-md dark:shadow-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <img
              src={item.videoMeta.thumbnail_url}
              alt={`Thumbnail for ${item.videoMeta.title}`}
              className="w-32 aspect-video object-cover rounded-md flex-shrink-0"
            />
            <div className="flex-grow overflow-hidden">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 truncate">
                {item.videoMeta.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-gray-500 dark:text-gray-400">
                <UserCircleIcon className="h-4 w-4 flex-shrink-0" />
                <p className="text-xs font-medium truncate">{item.videoMeta.author_name}</p>
              </div>
               <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Summarized on {new Date(item.timestamp).toLocaleDateString()}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default History;
