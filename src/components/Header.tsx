import React from 'react';
import { Sparkles, Heart, Keyboard } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  favoritesCount: number;
  onOpenFavorites: () => void;
}

export const Header: React.FC<HeaderProps> = ({ favoritesCount, onOpenFavorites }) => {
  return (
    <header className="w-full max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-3 select-none">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 transform hover:scale-105 transition-transform duration-300">
          <Sparkles className="w-5 h-5 text-amber-200" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 font-sans">
            Quote<span className="text-indigo-600 dark:text-indigo-400">Spark</span>
          </h1>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wide uppercase">
            Daily Wisdom & Inspiration
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Keyboard shortcut info tooltip/pill */}
        <div
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 shadow-sm"
          title="Press Space or 'N' anytime to get a new quote"
        >
          <Keyboard className="w-3.5 h-3.5 text-indigo-500" />
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-100 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-200 font-mono">
            Space
          </kbd>
        </div>

        {/* Favorites trigger button */}
        <button
          onClick={onOpenFavorites}
          id="btn-open-favorites"
          className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-full glass-pill text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          aria-label={`Open favorites drawer (${favoritesCount} saved)`}
        >
          <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
          <span className="text-xs font-semibold hidden sm:inline">Favorites</span>
          {favoritesCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
};
