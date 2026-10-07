import { forwardRef } from 'react';
import { Quote as QuoteIcon, Sparkles, WifiOff, Cloud } from 'lucide-react';
import type { Quote } from '../types/quote';

interface QuoteCardProps {
  quote: Quote;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isChanging?: boolean;
}

export const QuoteCard = forwardRef<HTMLDivElement, QuoteCardProps>(
  ({ quote, isChanging = false }, ref) => {
    const isFromApi = quote.source === 'api';

    return (
      <div
        ref={ref}
        id="quote-render-target"
        className={`w-full max-w-2xl mx-auto rounded-3xl p-8 sm:p-12 md:p-14 glass-card transition-all duration-500 relative overflow-hidden text-center group ${
          isChanging ? 'opacity-0 scale-98 translate-y-2' : 'opacity-100 scale-100 translate-y-0 animate-fade-up'
        }`}
      >
        {/* Soft atmospheric gradient accents inside card */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-rose-500/10 dark:bg-rose-500/15 blur-3xl pointer-events-none" />

        {/* Top Badges / Metadata */}
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8 text-xs font-medium relative z-10">
          {/* Category Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-400/15 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
            <Sparkles className="w-3 h-3" />
            <span>{quote.category || 'General'}</span>
          </div>

          {/* Source Indicator */}
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-normal transition-colors ${
              isFromApi
                ? 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-slate-200/80 dark:border-slate-700/60'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
            }`}
            title={isFromApi ? 'Fetched live from DummyJSON API' : 'Curated local wisdom library'}
          >
            {isFromApi ? (
              <>
                <Cloud className="w-3 h-3 text-slate-400" />
                <span>API</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-amber-500" />
                <span>Curated</span>
              </>
            )}
          </div>
        </div>

        {/* Decorative Quote Mark */}
        <div className="relative z-10 flex justify-center mb-4 sm:mb-6">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-slate-800/60 text-indigo-500 dark:text-indigo-400 shadow-sm border border-indigo-100/50 dark:border-slate-700/50 transform group-hover:scale-105 transition-transform duration-300">
            <QuoteIcon className="w-6 h-6 rotate-180" />
          </div>
        </div>

        {/* Quote Content */}
        <blockquote className="relative z-10 my-4 sm:my-6">
          <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-slate-900 dark:text-slate-100 leading-snug sm:leading-relaxed tracking-tight selection:bg-indigo-500/20">
            "{quote.quote}"
          </p>
        </blockquote>

        {/* Subtle separator */}
        <div className="w-16 h-0.5 mx-auto my-6 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent rounded-full" />

        {/* Author Attribution */}
        <footer className="relative z-10 mt-2">
          <cite className="not-italic font-sans text-base sm:text-lg font-semibold tracking-wide text-slate-700 dark:text-slate-200">
            — {quote.author || 'Unknown'}
          </cite>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest font-mono">
            QuoteSpark Inspiration
          </div>
        </footer>
      </div>
    );
  }
);

QuoteCard.displayName = 'QuoteCard';
