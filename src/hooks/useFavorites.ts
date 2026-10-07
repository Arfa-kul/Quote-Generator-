import { useCallback } from 'react';
import confetti from 'canvas-confetti';
import type { Quote } from '../types/quote';
import { useLocalStorage } from './useLocalStorage';

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<Quote[]>('quotespark_favorites', []);

  const isFavorite = useCallback(
    (quote: Quote | null) => {
      if (!quote) return false;
      return favorites.some(
        (fav) => fav.id === quote.id || (fav.quote === quote.quote && fav.author === quote.author)
      );
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (quote: Quote): boolean => {
      let isAdded = false;

      setFavorites((prev) => {
        const exists = prev.some(
          (fav) => fav.id === quote.id || (fav.quote === quote.quote && fav.author === quote.author)
        );

        if (exists) {
          isAdded = false;
          return prev.filter(
            (fav) => !(fav.id === quote.id || (fav.quote === quote.quote && fav.author === quote.author))
          );
        } else {
          isAdded = true;
          return [{ ...quote, addedAt: Date.now() }, ...prev];
        }
      });

      // Fire subtle heart confetti when adding a favorite
      try {
        confetti({
          particleCount: 28,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#f43f5e', '#ec4899', '#d946ef', '#fb7185'],
          ticks: 150,
          gravity: 1.2,
          scalar: 0.85,
        });
      } catch (err) {
        // Confetti fallback safely ignored
      }

      return isAdded;
    },
    [setFavorites]
  );

  const removeFavorite = useCallback(
    (id: string | number, quoteText?: string) => {
      setFavorites((prev) =>
        prev.filter((fav) => {
          if (fav.id === id) return false;
          if (quoteText && fav.quote === quoteText) return false;
          return true;
        })
      );
    },
    [setFavorites]
  );

  const clearAllFavorites = useCallback(() => {
    setFavorites([]);
  }, [setFavorites]);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearAllFavorites,
  };
}
