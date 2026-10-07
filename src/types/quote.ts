export type Category = 'All' | 'Motivation' | 'Life' | 'Wisdom' | 'Love' | 'Success';

export interface Quote {
  id: string | number;
  quote: string;
  author: string;
  category?: Category;
  source?: 'api' | 'fallback';
  addedAt?: number;
}

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'error';
}

export interface GradientTheme {
  id: string;
  name: string;
  lightBg: string;
  darkBg: string;
  accent: string;
  tagColor: string;
}
