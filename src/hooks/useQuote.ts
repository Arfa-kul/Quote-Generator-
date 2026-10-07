import { useState, useEffect, useCallback, useRef } from 'react';
import type { Quote, Category } from '../types/quote';
import { fetchRandomQuoteFromApi } from '../lib/api';
import { LOCAL_FALLBACK_QUOTES } from '../lib/quotes';

function pickRandomLocalQuote(category: Category, currentQuote: Quote | null): Quote {
  let pool = LOCAL_FALLBACK_QUOTES;
  if (category !== 'All') {
    pool = LOCAL_FALLBACK_QUOTES.filter((q) => q.category === category);
  }

  if (pool.length === 0) {
    pool = LOCAL_FALLBACK_QUOTES;
  }

  // Avoid repeating the same quote immediately
  const candidatePool = currentQuote && pool.length > 1
    ? pool.filter((q) => q.quote !== currentQuote.quote)
    : pool;

  const randomIndex = Math.floor(Math.random() * candidatePool.length);
  return candidatePool[randomIndex];
}

export function useQuote() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [quoteHistory, setQuoteHistory] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(() => !navigator.onLine);
  const [usedFallback, setUsedFallback] = useState<boolean>(false);

  // Keep a ref to the latest quote to reliably prevent back-to-back repeats
  const currentQuoteRef = useRef<Quote | null>(null);
  currentQuoteRef.current = currentQuote;

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getNewQuote = useCallback(
    async (targetCategory?: Category) => {
      const activeCategory = targetCategory !== undefined ? targetCategory : selectedCategory;
      setIsLoading(true);
      setError(null);

      // If a specific category other than 'All' is selected, use categorized local quotes
      if (activeCategory !== 'All') {
        // Small artificial delay for visual smoothness & transition
        await new Promise((r) => setTimeout(r, 220));
        const picked = pickRandomLocalQuote(activeCategory, currentQuoteRef.current);
        setCurrentQuote(picked);
        setUsedFallback(true);
        setIsLoading(false);
        setQuoteHistory((prev) => [picked, ...prev.slice(0, 19)]);
        return;
      }

      // If user is offline, immediately pick from local fallback quotes
      if (!navigator.onLine) {
        await new Promise((r) => setTimeout(r, 180));
        const fallbackQuote = pickRandomLocalQuote('All', currentQuoteRef.current);
        setCurrentQuote(fallbackQuote);
        setUsedFallback(true);
        setIsLoading(false);
        setQuoteHistory((prev) => [fallbackQuote, ...prev.slice(0, 19)]);
        return;
      }

      // Try fetching from DummyJSON API
      try {
        const quoteFromApi = await fetchRandomQuoteFromApi();

        // Check if API returned identical quote to current
        if (
          currentQuoteRef.current &&
          quoteFromApi.quote.trim().toLowerCase() === currentQuoteRef.current.quote.trim().toLowerCase()
        ) {
          // Fetch another or pick a local one to guarantee no consecutive repetition
          const alternative = pickRandomLocalQuote('All', currentQuoteRef.current);
          setCurrentQuote(alternative);
          setUsedFallback(true);
        } else {
          setCurrentQuote(quoteFromApi);
          setUsedFallback(false);
        }

        setQuoteHistory((prev) => [quoteFromApi, ...prev.slice(0, 19)]);
      } catch (err) {
        console.warn('API fetch failed or offline, falling back to local quotes:', err);
        // Fallback gracefully
        const fallbackQuote = pickRandomLocalQuote('All', currentQuoteRef.current);
        setCurrentQuote(fallbackQuote);
        setUsedFallback(true);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCategory]
  );

  // Initial load
  useEffect(() => {
    getNewQuote('All');
  }, []); // Run once on mount

  // Handle category change
  const handleCategoryChange = useCallback(
    (newCategory: Category) => {
      if (newCategory === selectedCategory) return;
      setSelectedCategory(newCategory);
      getNewQuote(newCategory);
    },
    [selectedCategory, getNewQuote]
  );

  return {
    currentQuote,
    selectedCategory,
    isLoading,
    error,
    isOffline,
    usedFallback,
    quoteHistory,
    getNewQuote: () => getNewQuote(),
    setCategory: handleCategoryChange,
  };
}
