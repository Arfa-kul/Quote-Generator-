import React from 'react';
import { Sparkles, Flame, Compass, BookOpen, Heart, Award } from 'lucide-react';
import type { Category } from '../types/quote';

interface CategoryChipsProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  disabled?: boolean;
}

interface CategoryOption {
  label: Category;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryOption[] = [
  { label: 'All', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { label: 'Motivation', icon: <Flame className="w-3.5 h-3.5" /> },
  { label: 'Life', icon: <Compass className="w-3.5 h-3.5" /> },
  { label: 'Wisdom', icon: <BookOpen className="w-3.5 h-3.5" /> },
  { label: 'Love', icon: <Heart className="w-3.5 h-3.5" /> },
  { label: 'Success', icon: <Award className="w-3.5 h-3.5" /> },
];

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategory,
  onSelectCategory,
  disabled = false,
}) => {
  return (
    <div
      className="flex items-center justify-center flex-wrap gap-2 sm:gap-2.5 max-w-xl mx-auto px-2"
      role="tablist"
      aria-label="Filter quotes by mood or category"
    >
      {CATEGORIES.map(({ label, icon }) => {
        const isSelected = selectedCategory === label;

        return (
          <button
            key={label}
            role="tab"
            aria-selected={isSelected}
            disabled={disabled}
            onClick={() => onSelectCategory(label)}
            className={`group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer select-none active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              isSelected
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md shadow-slate-900/10 dark:shadow-white/10 ring-2 ring-slate-900/20 dark:ring-white/20'
                : 'glass-pill text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/90 dark:hover:bg-slate-800/90 shadow-sm'
            }`}
          >
            <span
              className={`transition-transform duration-200 ${
                isSelected ? 'scale-110' : 'group-hover:scale-110 opacity-70 group-hover:opacity-100'
              }`}
            >
              {icon}
            </span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};
