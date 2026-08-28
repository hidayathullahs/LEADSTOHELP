import React from 'react';
import {
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  Package,
  Users,
  Sliders,
  CheckCircle2,
  Lock
} from 'lucide-react';

/**
 * ImpactCard — Displays quantifiable before/after business impact of a recommended strategy.
 */
export default function ImpactCard({ impact, onViewEvidence, onSimulate, onApprove, compact = false }) {
  if (!impact) return null;

  const {
    action_title = 'Action Impact',
    cost_inr = 0,
    estimated_savings_inr = 0,
    stockout_risk_before = 0,
    stockout_risk_after = 0,
    supplier_concentration_before = 0,
    supplier_concentration_after = 0,
    service_continuity_improvement_pct = 0,
    risk_level = 'LOW',
    evidence_count = 0,
  } = impact;

  const stockoutDelta = stockout_risk_before - stockout_risk_after;
  const concentrationDelta = supplier_concentration_before - supplier_concentration_after;

  if (compact) {
    return (
      <div className="glass-card p-3 border-brand-accent/20 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-200">{action_title}</span>
          <span className="badge-emerald font-mono text-[10px]">
            {risk_level} RISK
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-emerald-400 font-bold font-mono">
            <DollarSign className="w-3 h-3" />
            <span>₹{estimated_savings_inr.toLocaleString()}</span>
          </div>
          {stockoutDelta > 0 && (
            <div className="flex items-center gap-1 text-brand-accent font-medium">
              <TrendingDown className="w-3 h-3" />
              <span>-{stockoutDelta.toFixed(0)}% risk</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 border-white/[0.08] bg-surface-2/60 space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <h4 className="text-xs font-bold text-white tracking-tight">{action_title}</h4>
        </div>
        <span className="badge-emerald font-mono text-[10px]">
          {risk_level} RISK
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Total Cost */}
        <div className="bg-surface-1 rounded-lg p-2.5 border border-white/[0.04]">
          <div className="text-[10px] font-medium text-slate-400 mb-0.5 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-slate-500" /> Total Outlay
          </div>
          <div className="text-sm font-bold text-white font-mono">₹{cost_inr.toLocaleString()}</div>
        </div>

        {/* Savings */}
        <div className="bg-emerald-500/10 rounded-lg p-2.5 border border-emerald-500/20">
          <div className="text-[10px] font-medium text-emerald-400/80 mb-0.5 flex items-center gap-1">
            <TrendingDown className="w-3 h-3 text-emerald-400" /> Net Savings
          </div>
          <div className="text-sm font-bold text-emerald-400 font-mono">₹{estimated_savings_inr.toLocaleString()}</div>
        </div>

        {/* Stockout Risk Change */}
        <div className="bg-surface-1 rounded-lg p-2.5 border border-white/[0.04]">
          <div className="text-[10px] font-medium text-slate-400 mb-0.5 flex items-center gap-1">
            <Package className="w-3 h-3 text-slate-500" /> Stockout Risk
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-xs text-rose-400 line-through">{stockout_risk_before}%</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="text-xs text-emerald-400 font-bold">{stockout_risk_after}%</span>
            {stockoutDelta > 0 && (
              <span className="text-[10px] text-emerald-400">(-{stockoutDelta.toFixed(0)}%)</span>
            )}
          </div>
        </div>

        {/* Supplier Diversification */}
        <div className="bg-surface-1 rounded-lg p-2.5 border border-white/[0.04]">
          <div className="text-[10px] font-medium text-slate-400 mb-0.5 flex items-center gap-1">
            <Users className="w-3 h-3 text-slate-500" /> Concentration
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-xs text-amber-400">{supplier_concentration_before}%</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="text-xs text-brand-accent font-bold">{supplier_concentration_after}%</span>
          </div>
        </div>
      </div>

      {/* Service Continuity Pill */}
      {service_continuity_improvement_pct > 0 && (
        <div className="flex items-center gap-2 text-xs text-brand-accent bg-brand-accent/10 px-3 py-1.5 rounded-lg border border-brand-accent/20 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>+{service_continuity_improvement_pct}% operational continuity improvement via split-supplier buffer</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {onViewEvidence && (
          <button
            onClick={onViewEvidence}
            className="btn-secondary text-xs px-3 py-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-brand-accent" />
            <span>Review Evidence ({evidence_count})</span>
          </button>
        )}
        {onSimulate && (
          <button
            onClick={onSimulate}
            className="btn-secondary text-xs px-3 py-1.5 text-accent-violet hover:border-accent-violet/30"
          >
            <Sliders className="w-3.5 h-3.5 text-accent-violet" />
            <span>Simulate What-If</span>
          </button>
        )}
        {onApprove && (
          <button
            onClick={onApprove}
            className="btn-primary text-xs px-4 py-1.5 ml-auto"
          >
            <Lock className="w-3.5 h-3.5 text-black" />
            <span>Approve & Authorize PO</span>
          </button>
        )}
      </div>
    </div>
  );
}
