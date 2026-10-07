import type { Quote } from '../types/quote';

const DUMMY_JSON_URL = 'https://dummyjson.com/quotes/random';
const FETCH_TIMEOUT_MS = 5000;

export async function fetchRandomQuoteFromApi(): Promise<Quote> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(DUMMY_JSON_URL, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store', // Avoid browser aggressive caching of random quotes
    });

    if (!response.ok) {
      throw new Error(`API responded with HTTP status ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.quote) {
      throw new Error('Malformed quote data received from API');
    }

    return {
      id: `api-${data.id || Date.now()}`,
      quote: data.quote.trim(),
      author: data.author ? data.author.trim() : 'Unknown',
      source: 'api',
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
