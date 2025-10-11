
export interface Language {
  code: string;
  name: string;
  rtl?: boolean;
}

export interface VideoMeta {
  thumbnail_url: string;
  title: string;
  author_name: string;
}

export interface HistoryItem {
  id: string;
  url: string;
  summary: string;
  language: string;
  timestamp: string;
  videoMeta: VideoMeta;
}
