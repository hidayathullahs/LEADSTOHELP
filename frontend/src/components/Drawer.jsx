import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  badgeType = 'teal',
  width = 'max-w-xl', // max-w-lg, max-w-xl, max-w-2xl
  children,
  footer = null
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  let badgeClass = 'badge-teal';
  if (badgeType === 'rose') badgeClass = 'badge-rose';
  if (badgeType === 'amber') badgeClass = 'badge-amber';
  if (badgeType === 'emerald') badgeClass = 'badge-emerald';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        className={`relative w-full ${width} bg-surface-1 border-l border-white/[0.1] shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200 select-none`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-start justify-between gap-3 bg-surface-1/90 backdrop-blur-md shrink-0">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 id="drawer-title" className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                {title}
              </h2>
              {badge && (
                <span className={`${badgeClass} text-[10px] font-mono font-bold shrink-0`}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-400 leading-snug">
                {subtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-2 transition-colors shrink-0"
            aria-label="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {children}
        </div>

        {/* Sticky Action Footer (Optional) */}
        {footer && (
          <div className="p-4 border-t border-white/[0.08] bg-surface-2/80 backdrop-blur-md shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
