
import React, { useState, useCallback, useEffect } from 'react';
import { summarizeYouTubeVideoStream } from './services/geminiService';
import { LANGUAGES, YOUTUBE_VIDEO_URL_REGEX } from './constants';
import { HistoryItem, VideoMeta } from './types';
import LanguageSelector from './components/LanguageSelector';
import UrlInput from './components/UrlInput';
import SummaryDisplay from './components/SummaryDisplay';
import ThemeToggle from './components/ThemeToggle';
import VideoPreview from './components/VideoPreview';
import VideoPreviewSkeleton from './components/VideoPreviewSkeleton';
import History from './components/History';
import { YouTubeIcon } from './components/icons/YouTubeIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { XCircleIcon } from './components/icons/XCircleIcon';

const HISTORY_STORAGE_KEY = 'yt-summarizer-history';

const App: React.FC = () => {
  const defaultLanguage = LANGUAGES.find(lang => lang.name === 'English') || LANGUAGES[0];
  const [url, setUrl] = useState<string>('');
  const [language, setLanguage] = useState<string>(defaultLanguage.name);
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRtl, setIsRtl] = useState<boolean>(!!defaultLanguage.rtl);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [videoMeta, setVideoMeta] = useState<VideoMeta | null>(null);
  const [isFetchingMeta, setIsFetchingMeta] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load theme from local storage
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Load history from local storage
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
      localStorage.removeItem(HISTORY_STORAGE_KEY); // Clear corrupted data
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const isUrlValid = (videoUrl: string): boolean => {
    return YOUTUBE_VIDEO_URL_REGEX.test(videoUrl);
  };

  useEffect(() => {
    if (!isUrlValid(url)) {
      setVideoMeta(null);
      return;
    }

    const handler = setTimeout(async () => {
      setIsFetchingMeta(true);
      setVideoMeta(null);
      setError(null);
      try {
        const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
        if (!response.ok) {
          throw new Error('Could not fetch video details.');
        }
        const data = await response.json();
        setVideoMeta(data);
      } catch (e) {
        setVideoMeta(null);
        console.error(e);
      } finally {
        setIsFetchingMeta(false);
      }
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [url]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguageName = e.target.value;
    setLanguage(newLanguageName);
    const lang = LANGUAGES.find(l => l.name === newLanguageName);
    setIsRtl(!!lang?.rtl);
  };

  const handleSummarize = useCallback(async () => {
    if (!isUrlValid(url)) {
      setError('Please enter a valid YouTube video URL (e.g., youtube.com/watch?v=...).');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummary('');
    let fullSummary = '';

    try {
      await summarizeYouTubeVideoStream(url, language, (chunk) => {
        setSummary((prev) => prev + chunk);
        fullSummary += chunk;
      });

      if (videoMeta) {
        const newHistoryItem: HistoryItem = {
          id: new Date().toISOString() + url, // Create a more unique ID
          url,
          summary: fullSummary,
          language,
          timestamp: new Date().toISOString(),
          videoMeta,
        };
        
        setHistory(prevHistory => {
          // Avoid duplicates by filtering out existing entries with the same URL
          const filteredHistory = prevHistory.filter(item => item.url !== url);
          const updatedHistory = [newHistoryItem, ...filteredHistory].slice(0, 20); // Keep max 20 items
          localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
          return updatedHistory;
        });
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [url, language, videoMeta]);

  const handleClear = () => {
    setUrl('');
    setSummary('');
    setError(null);
    setVideoMeta(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your entire summary history? This cannot be undone.')) {
        setHistory([]);
        localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setIsLoading(false);
    setError(null);
    setUrl(item.url);
    setLanguage(item.language);
    setVideoMeta(item.videoMeta);
    setSummary(item.summary);
    const lang = LANGUAGES.find(l => l.name === item.language);
    setIsRtl(!!lang?.rtl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 text-gray-800 dark:text-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans transition-colors duration-300">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <div className="absolute top-4 right-4">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <YouTubeIcon className="h-12 w-12 text-red-600" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
              Video Summarizer
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Get key insights from any YouTube video in your chosen language.
          </p>
        </header>

        <main className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-700/60 space-y-8">
          <div className="space-y-6">
            <UrlInput value={url} onChange={(e) => setUrl(e.target.value)} onPaste={setUrl} disabled={isLoading} />
            <LanguageSelector
              value={language}
              onChange={handleLanguageChange}
              disabled={isLoading}
            />
            <div className="flex items-center gap-4">
              <button
                onClick={handleSummarize}
                disabled={isLoading || !url || !videoMeta}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500/50"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Summarizing...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5" />
                    Generate Summary
                  </>
                )}
              </button>
              <button
                onClick={handleClear}
                disabled={isLoading}
                className="flex-shrink-0 flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 disabled:bg-gray-500/50 dark:disabled:bg-gray-700/50 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/50"
                aria-label="Clear input and results"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        
          {(isFetchingMeta || videoMeta) && (
            <div>
              {isFetchingMeta && <VideoPreviewSkeleton />}
              {videoMeta && !isFetchingMeta && <VideoPreview meta={videoMeta} />}
            </div>
          )}

          <SummaryDisplay isLoading={isLoading} error={error} summary={summary} isRtl={isRtl} />
        </main>
        
        <History history={history} onSelectItem={handleSelectHistoryItem} onClearHistory={handleClearHistory} />

        <footer className="text-center mt-8 pb-4 text-gray-500 dark:text-gray-500 text-sm">
          <p>Powered by Google Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
