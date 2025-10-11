
import { Language } from './types';

// This regex robustly matches standard YouTube video URLs and youtu.be shortlinks.
// It specifically handles two main formats:
// 1. youtube.com/watch?v=... with optional parameters starting with '&'.
// 2. youtu.be/... with optional parameters starting with '?'.
export const YOUTUBE_VIDEO_URL_REGEX = /^(https?:\/\/)?(www\.)?(?:(?:youtube\.com\/watch\?v=[\w-]{11}(?:&\S*)?)|(?:youtu\.be\/[\w-]{11}(?:\?\S*)?))$/;

export const LANGUAGES: Language[] = [
  { code: 'ar', name: 'Arabic', rtl: true },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'hi', name: 'Hindi' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'es', name: 'Spanish' },
].sort((a, b) => a.name.localeCompare(b.name));
