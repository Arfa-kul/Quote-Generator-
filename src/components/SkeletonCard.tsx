import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div
      className="w-full max-w-2xl mx-auto rounded-3xl p-8 sm:p-12 glass-card shadow-glass dark:shadow-glass-dark relative overflow-hidden animate-pulse"
      aria-busy="true"
      aria-label="Loading quote..."
    >
      {/* Decorative background quote mark placeholder */}
      <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-slate-200/50 dark:bg-slate-800/40" />

      {/* Category / Source Badge Skeleton */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-6 w-20 rounded-full bg-slate-200/60 dark:bg-slate-800/50" />
      </div>

      {/* Quote lines shimmer */}
      <div className="space-y-4 my-8 relative z-10">
        <div className="h-7 sm:h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-11/12 mx-auto" />
        <div className="h-7 sm:h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-full mx-auto" />
        <div className="h-7 sm:h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-4/5 mx-auto" />
      </div>

      {/* Divider */}
      <div className="w-16 h-0.5 mx-auto my-6 bg-slate-200/70 dark:bg-slate-800/60 rounded-full" />

      {/* Author attribution skeleton */}
      <div className="flex flex-col items-center justify-center gap-2 mt-4 relative z-10">
        <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-3.5 w-24 bg-slate-200/60 dark:bg-slate-800/50 rounded-md" />
      </div>

      {/* Shimmer overlay gradient */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent pointer-events-none" />
    </div>
  );
};
