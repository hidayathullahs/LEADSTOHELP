import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Info, X, ShieldAlert } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type = 'info', duration = 4000, action = null }) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type, action }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Non-blocking Toast Container */}
      <div 
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((toast) => {
          let Icon = Info;
          let borderClass = 'border-brand-accent/40 bg-surface-1/95 text-slate-100 shadow-glow-teal';
          let iconColor = 'text-brand-accent';

          if (toast.type === 'success') {
            Icon = CheckCircle2;
            borderClass = 'border-emerald-500/40 bg-surface-1/95 text-slate-100 shadow-glow-emerald';
            iconColor = 'text-emerald-400';
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle;
            borderClass = 'border-amber-500/40 bg-surface-1/95 text-slate-100';
            iconColor = 'text-amber-300';
          } else if (toast.type === 'error') {
            Icon = ShieldAlert;
            borderClass = 'border-rose-500/40 bg-surface-1/95 text-slate-100 shadow-glow-rose';
            iconColor = 'text-rose-400';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-3.5 rounded-2xl border backdrop-blur-md shadow-2xl flex items-start gap-3 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${borderClass}`}
            >
              <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
              <div className="flex-1 min-w-0">
                {toast.title && (
                  <h4 className="text-xs font-bold text-white leading-tight mb-0.5">
                    {toast.title}
                  </h4>
                )}
                <p className="text-[11px] text-slate-300 leading-snug">
                  {toast.message}
                </p>
                {toast.action && (
                  <button
                    onClick={() => {
                      toast.action.onClick();
                      removeToast(toast.id);
                    }}
                    className="mt-2 text-[11px] font-bold text-brand-accent hover:underline flex items-center gap-1"
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
