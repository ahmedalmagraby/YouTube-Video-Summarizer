
import React from 'react';
import { YouTubeIcon } from './icons/YouTubeIcon';
import { ClipboardPasteIcon } from './icons/ClipboardPasteIcon';
import { YOUTUBE_VIDEO_URL_REGEX } from '../constants';

interface UrlInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPaste: (text: string) => void;
  disabled?: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ value, onChange, onPaste, disabled }) => {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      // Only paste if it looks like a YouTube video URL
      if (YOUTUBE_VIDEO_URL_REGEX.test(text)) {
        onPaste(text);
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  return (
    <div>
      <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
        YouTube Video URL
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <YouTubeIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="url"
          id="youtube-url"
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500 block pl-10 p-2.5 transition duration-200 placeholder-gray-400 dark:placeholder-gray-500"
        />
        {!value && (
            <button 
                onClick={handlePaste} 
                disabled={disabled}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Paste YouTube URL from clipboard"
            >
                <ClipboardPasteIcon className="h-5 w-5 mr-1" />
                <span className="text-sm font-semibold">Paste</span>
            </button>
        )}
      </div>
    </div>
  );
};

export default UrlInput;
