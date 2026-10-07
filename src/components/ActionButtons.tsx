import React, { useState } from 'react';
import { Copy, Share2, Heart, Download, RefreshCw, Volume2, VolumeX, Check } from 'lucide-react';
import { toPng } from 'html-to-image';
import type { Quote } from '../types/quote';

interface ActionButtonsProps {
  quote: Quote | null;
  cardRef: React.RefObject<HTMLDivElement | null>;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onNewQuote: () => void;
  isLoading: boolean;
  onShowToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  quote,
  cardRef,
  isFavorite,
  onToggleFavorite,
  onNewQuote,
  isLoading,
  onShowToast,
}) => {
  const [hasCopied, setHasCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 1. Copy quote to clipboard
  const handleCopy = async () => {
    if (!quote) return;
    const textToCopy = `"${quote.quote}" — ${quote.author}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setHasCopied(true);
      onShowToast('Quote copied to clipboard!', 'success');
      setTimeout(() => setHasCopied(false), 2000);
    } catch (err) {
      // Fallback copy
      try {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setHasCopied(true);
        onShowToast('Quote copied to clipboard!', 'success');
        setTimeout(() => setHasCopied(false), 2000);
      } catch (fallbackErr) {
        onShowToast('Failed to copy quote', 'error');
      }
    }
  };

  // 2. Share via Web Share API or Twitter/X
  const handleShare = async () => {
    if (!quote) return;
    const shareText = `"${quote.quote}" — ${quote.author}`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QuoteSpark Inspiration',
          text: shareText,
          url: shareUrl,
        });
        onShowToast('Shared successfully!', 'success');
        return;
      } catch (err) {
        // User canceled share or share not supported
        if ((err as Error).name === 'AbortError') return;
      }
    }

    // Fallback: Twitter / X share intent
    const tweetText = encodeURIComponent(`${shareText}\n\n#quotes #inspiration`);
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
    onShowToast('Opening Twitter / X to share...', 'info');
  };

  // 3. Download card as PNG using html-to-image
  const handleDownloadImage = async () => {
    if (!quote || !cardRef.current || isExporting) return;

    try {
      setIsExporting(true);
      onShowToast('Generating high-res image...', 'info');

      // Small delay to ensure styles settle
      await new Promise((r) => setTimeout(r, 100));

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
      });

      const sanitizedAuthor = (quote.author || 'quote')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .slice(0, 20);

      const link = document.createElement('a');
      link.download = `quotespark-${sanitizedAuthor}-${Date.now().toString().slice(-4)}.png`;
      link.href = dataUrl;
      link.click();

      onShowToast('Image downloaded successfully!', 'success');
    } catch (err) {
      console.error('Failed to export quote image:', err);
      onShowToast('Could not generate image. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // 4. Text to Speech
  const handleToggleSpeech = () => {
    if (!quote || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onShowToast('Speech synthesis is not supported on this browser', 'error');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending utterances
    const textToSpeak = `${quote.quote}. By ${quote.author}.`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-2xl mx-auto mt-6">
      {/* Primary Action Button: "New Quote" */}
      <div className="w-full sm:w-auto flex justify-center">
        <button
          onClick={onNewQuote}
          disabled={isLoading}
          id="btn-new-quote"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-base shadow-lg shadow-indigo-500/25 dark:shadow-indigo-950/50 hover:shadow-xl hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          aria-label="Generate new quote (Shortcut: Space or N)"
        >
          <RefreshCw
            className={`w-5 h-5 transition-transform duration-500 ${
              isLoading ? 'animate-spin' : 'group-hover:rotate-180'
            }`}
          />
          <span>{isLoading ? 'Seeking Wisdom...' : 'New Quote'}</span>
          <span className="hidden md:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono tracking-wider bg-white/20 rounded text-white/90">
            SPACE
          </span>
        </button>
      </div>

      {/* Secondary Tool Actions (Copy, Favorite, Share, Image Download, Speech) */}
      <div className="flex items-center justify-center flex-wrap gap-2.5 sm:gap-3 p-2 rounded-2xl glass-panel shadow-sm">
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          id="btn-copy-quote"
          className={`relative p-3 rounded-xl transition-all duration-200 group active:scale-95 ${
            hasCopied
              ? 'bg-emerald-500 text-white'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label="Copy quote to clipboard"
          title="Copy quote"
        >
          {hasCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />}
        </button>

        {/* Favorite (Heart) Button */}
        <button
          onClick={onToggleFavorite}
          id="btn-favorite-quote"
          className={`relative p-3 rounded-xl transition-all duration-200 group active:scale-95 ${
            isFavorite
              ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-rose-500 dark:hover:text-rose-400'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart
            className={`w-5 h-5 transition-transform duration-200 ${
              isFavorite ? 'fill-rose-500 scale-110' : 'group-hover:scale-110'
            }`}
          />
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          id="btn-share-quote"
          className="p-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 group active:scale-95"
          aria-label="Share quote"
          title="Share quote (Web Share / Twitter)"
        >
          <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        {/* Download as Image Button */}
        <button
          onClick={handleDownloadImage}
          disabled={isExporting}
          id="btn-download-image"
          className="p-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-200 group active:scale-95 disabled:opacity-50"
          aria-label="Download quote as image"
          title="Download card as PNG"
        >
          <Download className={`w-5 h-5 group-hover:scale-110 transition-transform ${isExporting ? 'animate-bounce' : ''}`} />
        </button>

        {/* Text to Speech Button */}
        <button
          onClick={handleToggleSpeech}
          id="btn-speech-quote"
          className={`p-3 rounded-xl transition-all duration-200 group active:scale-95 ${
            isSpeaking
              ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 animate-pulse'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400'
          }`}
          aria-label={isSpeaking ? 'Stop audio' : 'Listen to quote'}
          title={isSpeaking ? 'Stop reading' : 'Listen to quote'}
        >
          {isSpeaking ? (
            <VolumeX className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          ) : (
            <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>
    </div>
  );
};
