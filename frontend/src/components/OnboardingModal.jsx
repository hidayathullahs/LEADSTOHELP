import React from 'react';
import {
  Sparkles,
  Package,
  Sliders,
  ShieldCheck,
  ArrowRight,
  X
} from 'lucide-react';

export default function OnboardingModal({ isOpen, onClose, onStartDemo }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-surface-1 border border-white/[0.1] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center shadow-glow-teal">
              <Sparkles className="w-5 h-5 text-black fill-black" />
            </div>
            <div>
              <span className="badge-teal text-[10px] uppercase font-bold">
                Welcome to LEADSTOHELP AI
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">Your Retail Operations Control Tower</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          LEADSTOHELP unifies fragmented store signals—inventory run-rates, supplier reliability, and invoices—to help operations managers detect risks early and stage human-governed actions.
        </p>

        {/* 3 Steps */}
        <div className="space-y-3">
          <div className="p-3.5 bg-surface-2 rounded-2xl border border-white/[0.04] flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 font-mono font-bold text-xs">
              1
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">See What Needs Attention</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Spot urgent 2.8-day stockouts (e.g. Arabica Coffee) and invoice shortages before operations stall.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-surface-2 rounded-2xl border border-white/[0.04] flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent shrink-0 font-mono font-bold text-xs">
              2
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Ask AI Why & Simulate Options</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Inspect 8 grounded evidence data points and run 6-scenario simulations with the What-If Digital Twin.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-surface-2 rounded-2xl border border-white/[0.04] flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 font-mono font-bold text-xs">
              3
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Approve & Execute with Human Control</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Authorize purchase orders through cryptographic governance barrier with full decision trace auditability.
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => {
              onClose();
              if (onStartDemo) onStartDemo();
            }}
            className="text-xs text-brand-accent hover:underline font-semibold flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch 3-Minute Guided Demo</span>
          </button>

          <button
            onClick={onClose}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-glow-teal font-bold"
          >
            <span>Access Operations Workspace</span>
            <ArrowRight className="w-3.5 h-3.5 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}
