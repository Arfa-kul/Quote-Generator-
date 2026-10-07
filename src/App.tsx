import { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { QuoteCard } from './components/QuoteCard';
import { SkeletonCard } from './components/SkeletonCard';
import { ActionButtons } from './components/ActionButtons';
import { CategoryChips } from './components/CategoryChips';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { Toast } from './components/Toast';
import { useQuote } from './hooks/useQuote';
import { useFavorites } from './hooks/useFavorites';
import { GRADIENT_THEMES, getNextTheme } from './lib/gradients';
import type { ToastMessage, Quote } from './types/quote';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

export function App() {
  const {
    currentQuote,
    selectedCategory,
    isLoading,
    error,
    isOffline,
    getNewQuote,
    setCategory,
  } = useQuote();

  const {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearAllFavorites,
  } = useFavorites();

  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [themeIndex, setThemeIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedQuoteOverride, setSelectedQuoteOverride] = useState<Quote | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const currentTheme = GRADIENT_THEMES[themeIndex] || GRADIENT_THEMES[0];

  // Toast dispatcher
  const showToast = useCallback((text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Handler for New Quote: triggers background gradient shift & smooth card transition
  const handleNewQuote = useCallback(() => {
    setSelectedQuoteOverride(null);
    setIsChanging(true);
    const { nextIndex } = getNextTheme(themeIndex);
    setThemeIndex(nextIndex);

    setTimeout(() => {
      getNewQuote();
      setTimeout(() => {
        setIsChanging(false);
      }, 150);
    }, 180);
  }, [themeIndex, getNewQuote]);

  // Keyboard shortcut listener (Space or N = new quote)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is interacting with form controls or drawer is open
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (
        activeTag === 'input' ||
        activeTag === 'textarea' ||
        activeTag === 'select' ||
        isFavoritesOpen
      ) {
        return;
      }

      if (e.code === 'Space' || e.key === ' ' || e.key === 'n' || e.key === 'N') {
        e.preventDefault(); // Prevent page scroll on Space
        if (!isLoading) {
          handleNewQuote();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNewQuote, isFavoritesOpen, isLoading]);

  const activeDisplayQuote = selectedQuoteOverride || currentQuote;

  const handleToggleFavorite = () => {
    if (!activeDisplayQuote) return;
    const added = toggleFavorite(activeDisplayQuote);
    if (added) {
      showToast('Saved to your Favorites! ✨', 'success');
    } else {
      showToast('Removed from Favorites', 'info');
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors duration-1000 bg-gradient-to-br ${currentTheme.lightBg} dark:${currentTheme.darkBg} relative overflow-x-hidden selection:bg-indigo-500/20`}
    >
      {/* Ambient background decoration orbs */}
      <div className="fixed top-12 left-1/4 w-96 h-96 rounded-full bg-white/20 dark:bg-indigo-900/10 blur-3xl pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-12 right-1/4 w-96 h-96 rounded-full bg-purple-200/30 dark:bg-purple-950/20 blur-3xl pointer-events-none transform translate-x-1/2 translate-y-1/2" />

      {/* Top Header */}
      <Header
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative z-10 max-w-4xl mx-auto w-full">
        {/* Category Filter Chips */}
        <div className="mb-8 sm:mb-10 w-full">
          <CategoryChips
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedQuoteOverride(null);
              setCategory(cat);
              const { nextIndex } = getNextTheme(themeIndex);
              setThemeIndex(nextIndex);
            }}
            disabled={isLoading}
          />
        </div>

        {/* Quote Card or Skeleton or Error */}
        <div className="w-full flex justify-center">
          {isLoading && !activeDisplayQuote ? (
            <SkeletonCard />
          ) : error && !activeDisplayQuote ? (
            <div className="w-full max-w-2xl mx-auto rounded-3xl p-8 sm:p-12 glass-card text-center border-rose-200/50 dark:border-rose-900/40 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-rose-500 mx-auto flex items-center justify-center mb-4">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Wisdom is momentarily paused
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                {error || 'Unable to load a quote right now. Please try again or check your connection.'}
              </p>
              <button
                onClick={handleNewQuote}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          ) : activeDisplayQuote ? (
            <QuoteCard
              ref={cardRef}
              quote={activeDisplayQuote}
              isFavorite={isFavorite(activeDisplayQuote)}
              onToggleFavorite={handleToggleFavorite}
              isChanging={isChanging}
            />
          ) : (
            <SkeletonCard />
          )}
        </div>

        {/* Action Buttons (New Quote, Copy, Favorite, Share, PNG Export, Voice) */}
        {activeDisplayQuote && (
          <ActionButtons
            quote={activeDisplayQuote}
            cardRef={cardRef}
            isFavorite={isFavorite(activeDisplayQuote)}
            onToggleFavorite={handleToggleFavorite}
            onNewQuote={handleNewQuote}
            isLoading={isLoading}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 select-none border-t border-slate-200/40 dark:border-slate-800/40">
        <div className="flex items-center gap-2">
          <span>QuoteSpark</span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                <span>Offline Mode (Curated library active)</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                <span>Connected & Ready</span>
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">Theme: {currentTheme.name}</span>
          <span className="hidden sm:inline">•</span>
          <span>Crafted for daily inspiration</span>
        </div>
      </footer>

      {/* Favorites Slide-over Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onRemoveFavorite={removeFavorite}
        onClearAll={() => {
          if (window.confirm('Are you sure you want to clear all favorite quotes?')) {
            clearAllFavorites();
            showToast('All favorites cleared', 'info');
          }
        }}
        onSelectQuote={(quote) => {
          setSelectedQuoteOverride(quote);
        }}
        onShowToast={showToast}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
