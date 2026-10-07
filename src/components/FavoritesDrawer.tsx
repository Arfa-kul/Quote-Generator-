import React, { useState, useMemo } from 'react';
import { X, Trash2, Copy, Search, Heart, Sparkles, Check, ArrowRight } from 'lucide-react';
import type { Quote } from '../types/quote';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Quote[];
  onRemoveFavorite: (id: string | number, quoteText?: string) => void;
  onClearAll: () => void;
  onSelectQuote?: (quote: Quote) => void;
  onShowToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onClearAll,
  onSelectQuote,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  // Filter favorites based on search
  const filteredFavorites = useMemo(() => {
    if (!searchQuery.trim()) return favorites;
    const query = searchQuery.toLowerCase();
    return favorites.filter(
      (fav) =>
        fav.quote.toLowerCase().includes(query) ||
        fav.author.toLowerCase().includes(query) ||
        (fav.category && fav.category.toLowerCase().includes(query))
    );
  }, [favorites, searchQuery]);

  const handleCopyQuote = (fav: Quote) => {
    const text = `"${fav.quote}" — ${fav.author}`;
    navigator.clipboard.writeText(text);
    setCopiedId(fav.id);
    onShowToast('Quote copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Favorite Quotes Drawer">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-auto">
        <div className="w-screen max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col animate-fade-in">
          {/* Header */}
          <div className="p-6 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-500">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Favorites
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                    {favorites.length}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your curated collection of wisdom
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              id="btn-close-favorites"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close favorites panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search bar & Quick controls */}
          {favorites.length > 0 && (
            <div className="p-4 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search quotes or authors..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div className="flex items-center justify-between mt-2.5 px-1">
                <span className="text-xs text-slate-400">
                  {filteredFavorites.length} {filteredFavorites.length === 1 ? 'quote' : 'quotes'} found
                </span>
                <button
                  onClick={onClearAll}
                  className="text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 font-medium hover:underline transition-colors cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}

          {/* List of Favorites */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
            {favorites.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 dark:text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-base mb-1">
                  No saved quotes yet
                </h3>
                <p className="text-sm max-w-xs text-slate-500 dark:text-slate-400 mb-6">
                  Click the heart icon on any quote that touches you to build your personal treasury of inspiration.
                </p>
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
                >
                  <span>Explore Quotes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : filteredFavorites.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p className="text-sm">No quotes matching "{searchQuery}"</p>
              </div>
            ) : (
              filteredFavorites.map((fav) => (
                <div
                  key={fav.id}
                  className="group relative p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {/* Category tag */}
                  {fav.category && (
                    <div className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 mb-2">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>{fav.category}</span>
                    </div>
                  )}

                  {/* Quote text */}
                  <p className="font-serif italic text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-snug line-clamp-4 mb-3">
                    "{fav.quote}"
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[170px]">
                      — {fav.author}
                    </span>

                    <div className="flex items-center gap-1">
                      {/* View / select on main card */}
                      {onSelectQuote && (
                        <button
                          onClick={() => {
                            onSelectQuote(fav);
                            onClose();
                            onShowToast('Quote displayed on card', 'info');
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="Show on main card"
                          aria-label="Show quote on main card"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Copy */}
                      <button
                        onClick={() => handleCopyQuote(fav)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Copy to clipboard"
                        aria-label="Copy favorite quote"
                      >
                        {copiedId === fav.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Remove */}
                      <button
                        onClick={() => {
                          onRemoveFavorite(fav.id, fav.quote);
                          onShowToast('Removed from favorites', 'info');
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Remove from favorites"
                        aria-label="Remove favorite"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
