import React from 'react';
import { TrendingDown, TrendingUp, ShieldCheck, DollarSign, AlertTriangle, ArrowRight, Package, Users } from 'lucide-react';

/**
 * ImpactCard — Displays quantifiable before/after business impact of a recommended action.
 * Shows cost, savings, risk change, supplier concentration, and service continuity.
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

  const riskColors = {
    LOW: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50',
    MEDIUM: 'text-amber-400 bg-amber-950/40 border-amber-800/50',
    HIGH: 'text-rose-400 bg-rose-950/40 border-rose-800/50',
    CRITICAL: 'text-red-400 bg-red-950/40 border-red-800/50',
  };

  const stockoutDelta = stockout_risk_before - stockout_risk_after;
  const concentrationDelta = supplier_concentration_before - supplier_concentration_after;

  if (compact) {
    return (
      <div className="glass-card p-3 border-cyan-500/20 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-300">{action_title}</span>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${riskColors[risk_level] || riskColors.LOW}`}>
            {risk_level}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-emerald-400">
            <DollarSign className="w-3 h-3" />
            <span>₹{estimated_savings_inr.toLocaleString()}</span>
          </div>
          {stockoutDelta > 0 && (
            <div className="flex items-center gap-1 text-cyan-400">
              <TrendingDown className="w-3 h-3" />
              <span>-{stockoutDelta.toFixed(0)}% risk</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 border-cyan-500/15 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-white">{action_title}</h4>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${riskColors[risk_level] || riskColors.LOW}`}>
          {risk_level} RISK
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Cost */}
        <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-800/60">
          <div className="text-[10px] text-slate-400 mb-0.5 flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> Total Cost
          </div>
          <div className="text-sm font-bold text-white">₹{cost_inr.toLocaleString()}</div>
        </div>

        {/* Savings */}
        <div className="bg-emerald-950/30 rounded-lg p-2.5 border border-emerald-800/40">
          <div className="text-[10px] text-emerald-400/80 mb-0.5 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> Est. Savings
          </div>
          <div className="text-sm font-bold text-emerald-400">₹{estimated_savings_inr.toLocaleString()}</div>
        </div>

        {/* Stockout Risk Change */}
        <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-800/60">
          <div className="text-[10px] text-slate-400 mb-0.5 flex items-center gap-1">
            <Package className="w-3 h-3" /> Stockout Risk
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-rose-400">{stockout_risk_before}%</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="text-xs text-emerald-400">{stockout_risk_after}%</span>
            {stockoutDelta > 0 && (
              <span className="text-[10px] text-emerald-500 font-mono">(-{stockoutDelta.toFixed(0)})</span>
            )}
          </div>
        </div>

        {/* Supplier Diversification */}
        <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-800/60">
          <div className="text-[10px] text-slate-400 mb-0.5 flex items-center gap-1">
            <Users className="w-3 h-3" /> Concentration
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-amber-400">{supplier_concentration_before}%</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="text-xs text-cyan-400">{supplier_concentration_after}%</span>
          </div>
        </div>
      </div>

      {/* Service Continuity */}
      {service_continuity_improvement_pct > 0 && (
        <div className="flex items-center gap-2 text-xs text-cyan-300 bg-cyan-950/20 px-3 py-1.5 rounded-lg border border-cyan-800/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>+{service_continuity_improvement_pct}% service continuity improvement</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        {onViewEvidence && (
          <button
            onClick={onViewEvidence}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all"
          >
            <ShieldCheck className="w-3 h-3" />
            Review Evidence ({evidence_count})
          </button>
        )}
        {onSimulate && (
          <button
            onClick={onSimulate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:text-white hover:border-indigo-500/40 transition-all"
          >
            <TrendingUp className="w-3 h-3" />
            Simulate What-If
          </button>
        )}
        {onApprove && (
          <button
            onClick={onApprove}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 text-white hover:from-cyan-500 hover:to-indigo-500 shadow-glow-cyan transition-all"
          >
            <AlertTriangle className="w-3 h-3" />
            Approve Action
          </button>
        )}
      </div>
    </div>
  );
}
