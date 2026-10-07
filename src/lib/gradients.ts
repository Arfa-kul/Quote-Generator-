import type { GradientTheme } from '../types/quote';

export const GRADIENT_THEMES: GradientTheme[] = [
  {
    id: 'lavender-twilight',
    name: 'Lavender Twilight',
    lightBg: 'from-violet-100 via-indigo-50 to-purple-100',
    darkBg: 'from-slate-950 via-indigo-950/70 to-purple-950/60',
    accent: 'indigo',
    tagColor: 'text-indigo-600 bg-indigo-50/80 border-indigo-200/60 dark:text-indigo-300 dark:bg-indigo-950/40 dark:border-indigo-800/40',
  },
  {
    id: 'sunset-blush',
    name: 'Sunset Blush',
    lightBg: 'from-rose-100 via-orange-50 to-amber-100',
    darkBg: 'from-slate-950 via-rose-950/60 to-stone-950',
    accent: 'rose',
    tagColor: 'text-rose-600 bg-rose-50/80 border-rose-200/60 dark:text-rose-300 dark:bg-rose-950/40 dark:border-rose-800/40',
  },
  {
    id: 'aurora-breeze',
    name: 'Aurora Breeze',
    lightBg: 'from-emerald-100 via-teal-50 to-cyan-100',
    darkBg: 'from-slate-950 via-emerald-950/60 to-teal-950/60',
    accent: 'emerald',
    tagColor: 'text-emerald-600 bg-emerald-50/80 border-emerald-200/60 dark:text-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800/40',
  },
  {
    id: 'ocean-whisper',
    name: 'Ocean Whisper',
    lightBg: 'from-sky-100 via-blue-50 to-indigo-100',
    darkBg: 'from-slate-950 via-sky-950/70 to-blue-950/60',
    accent: 'sky',
    tagColor: 'text-sky-600 bg-sky-50/80 border-sky-200/60 dark:text-sky-300 dark:bg-sky-950/40 dark:border-sky-800/40',
  },
  {
    id: 'golden-dawn',
    name: 'Golden Dawn',
    lightBg: 'from-amber-100 via-yellow-50 to-orange-100',
    darkBg: 'from-slate-950 via-amber-950/60 to-yellow-950/50',
    accent: 'amber',
    tagColor: 'text-amber-600 bg-amber-50/80 border-amber-200/60 dark:text-amber-300 dark:bg-amber-950/40 dark:border-amber-800/40',
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    lightBg: 'from-pink-100 via-rose-50 to-fuchsia-100',
    darkBg: 'from-slate-950 via-pink-950/60 to-fuchsia-950/50',
    accent: 'pink',
    tagColor: 'text-pink-600 bg-pink-50/80 border-pink-200/60 dark:text-pink-300 dark:bg-pink-950/40 dark:border-pink-800/40',
  },
  {
    id: 'nordic-frost',
    name: 'Nordic Frost',
    lightBg: 'from-cyan-100 via-slate-50 to-blue-100',
    darkBg: 'from-slate-950 via-cyan-950/60 to-slate-900',
    accent: 'cyan',
    tagColor: 'text-cyan-600 bg-cyan-50/80 border-cyan-200/60 dark:text-cyan-300 dark:bg-cyan-950/40 dark:border-cyan-800/40',
  },
];

export function getNextTheme(currentIndex: number): { theme: GradientTheme; nextIndex: number } {
  let nextIndex = Math.floor(Math.random() * GRADIENT_THEMES.length);
  if (nextIndex === currentIndex && GRADIENT_THEMES.length > 1) {
    nextIndex = (currentIndex + 1) % GRADIENT_THEMES.length;
  }
  return {
    theme: GRADIENT_THEMES[nextIndex],
    nextIndex,
  };
}
