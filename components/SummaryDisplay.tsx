import React, { useState, useMemo } from 'react';
import { ErrorIcon } from './icons/ErrorIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';


interface SummaryDisplayProps {
  isLoading: boolean;
  error: string | null;
  summary: string;
  isRtl?: boolean;
}

const Placeholder: React.FC = () => (
  <div className="text-center text-gray-400 dark:text-gray-500 w-full">
    <DocumentTextIcon className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
    <p className="font-semibold text-gray-500 dark:text-gray-400">Your Summary Will Appear Here</p>
    <p className="text-sm">The key insights from the video will be generated for you.</p>
  </div>
);

// A component to safely format and render the summary text
const FormattedText: React.FC<{ text: string; isRtl?: boolean; isLoading: boolean }> = ({ text, isRtl, isLoading }) => {
  const { title, insightsHeader, keyPoints } = useMemo(() => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    const titleLine = lines.find(line => line.toLowerCase().startsWith('title:'));
    const title = titleLine ? titleLine.substring(6).trim() : 'Summary';

    const headerLine = lines.find(line => line.toLowerCase().startsWith('insightsheader:'));
    const insightsHeader = headerLine ? headerLine.substring(15).trim() : 'Key Insights';

    const keyPoints = lines
      .filter(line => line.trim().startsWith('*'))
      .map(line => line.trim().substring(1).trim());
      
    return { title, insightsHeader, keyPoints };
  }, [text]);

  return (
    <div className={`space-y-4 w-full ${isRtl ? 'text-right' : 'text-left'}`}>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h3>
      <div className={`h-1 rounded-full bg-gradient-to-r from-red-500 to-orange-500 ${isRtl ? 'ml-auto w-1/3' : 'w-1/3'}`} />
      
      {keyPoints.length > 0 && (
        <>
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 pt-4">{insightsHeader}</h4>
          <ul className="space-y-3">
            {keyPoints.map((line, lineIndex) => (
              <li key={lineIndex} className="flex items-start gap-3 p-2 rounded-md transition-colors hover:bg-red-500/10">
                <CheckCircleIcon className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">{line}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      {isLoading && <span className="inline-block w-2 h-5 bg-gray-600 dark:bg-gray-400 blinking-cursor" />}
    </div>
  );
};

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ isLoading, error, summary, isRtl }) => {
  const [isCopied, setIsCopied] = useState(false);

  const textToCopy = useMemo(() => {
    if (!summary) return '';

    const lines = summary.split('\n').filter(line => line.trim() !== '');

    const titleLine = lines.find(line => line.toLowerCase().startsWith('title:'));
    const rawTitle = titleLine ? titleLine.substring(6).trim() : '';

    const headerLine = lines.find(line => line.toLowerCase().startsWith('insightsheader:'));
    const rawInsightsHeader = headerLine ? headerLine.substring(15).trim() : '';

    const keyPoints = lines
        .filter(line => line.trim().startsWith('*'))
        .map(line => line.trim().substring(1).trim());

    return [
        rawTitle,
        (rawInsightsHeader && keyPoints.length > 0 ? `\n${rawInsightsHeader}` : ''),
        ...keyPoints.map(point => `• ${point}`)
    ].filter(Boolean).join('\n').trim();
  }, [summary]);

  const handleCopy = () => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      })
      .catch(err => console.error('Failed to copy text: ', err));
  };
  
  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center text-red-500 dark:text-red-400 w-full">
          <ErrorIcon className="h-8 w-8 mx-auto mb-2"/>
          <p className="font-semibold">An Error Occurred</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    }
    if (summary) {
      return <FormattedText text={summary} isRtl={isRtl} isLoading={isLoading} />;
    }
    return <Placeholder />;
  };


  return (
    <div className="mt-8">
      <div className="relative p-0.5 rounded-xl bg-gradient-to-br from-red-500 via-orange-400 to-red-500 shadow-lg">
        <div 
          className="relative bg-gray-50 dark:bg-gray-900/95 p-4 sm:p-6 rounded-lg min-h-[200px] flex items-center justify-center transition-colors duration-300"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {summary && !isLoading && !error && (
              <button
                  onClick={handleCopy}
                  className={`absolute top-3 px-3 py-1.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-200/50 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 ${isRtl ? 'left-3' : 'right-3'}`}
                  aria-label="Copy summary to clipboard"
              >
                  {isCopied ? (
                      <div className="flex items-center gap-1.5 text-green-500 dark:text-green-400">
                          <CheckIcon className="h-5 w-5" />
                          <span>Copied!</span>
                      </div>
                  ) : (
                      <div className="flex items-center gap-1.5">
                          <ClipboardIcon className="h-5 w-5" />
                          <span>Copy</span>
                      </div>
                  )}
              </button>
          )}

          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SummaryDisplay;