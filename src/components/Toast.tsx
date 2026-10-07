import React from 'react';
import { Check, Info, AlertCircle, X } from 'lucide-react';
import type { ToastMessage } from '../types/quote';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md transition-all duration-300 animate-fade-up border ${
              isError
                ? 'bg-rose-500/90 text-white border-rose-400/40 shadow-rose-500/20'
                : isInfo
                ? 'bg-indigo-600/95 text-white border-indigo-400/30 shadow-indigo-500/20'
                : 'bg-slate-900/90 dark:bg-slate-800/95 text-white border-slate-700/60 shadow-slate-950/30'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex-shrink-0">
                {isError ? (
                  <AlertCircle className="w-4 h-4 text-rose-200" />
                ) : isInfo ? (
                  <Info className="w-4 h-4 text-indigo-200" />
                ) : (
                  <Check className="w-4 h-4 text-emerald-400" />
                )}
              </span>
              <p className="text-sm font-medium tracking-tight truncate">{toast.text}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
