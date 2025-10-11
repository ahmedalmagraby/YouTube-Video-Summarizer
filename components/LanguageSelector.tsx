
import React from 'react';
import { LANGUAGES } from '../constants';
import { LanguageIcon } from './icons/LanguageIcon';

interface LanguageSelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange, disabled }) => {
  return (
    <div>
      <label htmlFor="language-select" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
        Language for Summary
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <LanguageIcon className="h-5 w-5 text-gray-400 dark:text-gray-400" />
        </div>
        <select
          id="language-select"
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-red-500 focus:border-red-500 block pl-10 p-2.5 transition duration-200"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.name} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageSelector;