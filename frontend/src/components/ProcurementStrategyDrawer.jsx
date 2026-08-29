import React from 'react';
import {
  ShoppingCart,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Percent,
  Sparkles,
  ArrowRight,
  Layers,
  Lock
} from 'lucide-react';
import Drawer from './Drawer';

export default function ProcurementStrategyDrawer({
  isOpen,
  onClose,
  strategy,
  sku = 'COFFEE-001',
  onSubmitProposal
}) {
  if (!isOpen || !strategy) return null;

  const isRecommended = strategy.is_recommended || strategy.id === 'STRAT_SPLIT_OPTIMAL' || strategy.id === 'SCENARIO_1_BALANCED';

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={strategy.title || strategy.name || 'Procurement Strategy'}
      subtitle={`Evaluated strategy for ${sku} replenishment`}
      badge={isRecommended ? 'AI Recommended' : 'Alternative Strategy'}
      badgeType={isRecommended ? 'emerald' : 'neutral'}
      width="max-w-xl"
      footer={
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            Total Spend: <strong className="text-brand-accent text-sm">₹{(strategy.total_cost || strategy.cost || 86328).toLocaleString()}</strong>
          </div>
          <button
            onClick={() => {
              onClose();
              if (onSubmitProposal) onSubmitProposal(strategy);
            }}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <span>Submit for Human Approval</span>
            <ArrowRight className="w-3.5 h-3.5 text-black" />
          </button>
        </div>
      }
    >
      {/* Strategy Summary Card */}
      <div className={`p-4 rounded-2xl border space-y-2 ${
        isRecommended
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : 'bg-surface-2/80 border-white/[0.08]'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
            Strategy Profile
          </span>
          <span className="text-xs font-bold text-emerald-400 font-mono">
            {strategy.risk_level || 'Low Risk (8%)'}
          </span>
        </div>
        <h3 className="text-sm font-bold text-white leading-snug">
          {strategy.description || 'Optimized multi-supplier split balancing bulk pricing with immediate buffer delivery.'}
        </h3>
      </div>

      {/* Metrics Comparison Grid */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-3 rounded-xl bg-surface-2/70 border border-white/[0.06]">
          <span className="text-[10px] text-slate-500 block font-mono">Total Spend</span>
          <span className="text-sm font-extrabold text-brand-accent font-mono">
            ₹{(strategy.total_cost || strategy.cost || 86328).toLocaleString()}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-surface-2/70 border border-white/[0.06]">
          <span className="text-[10px] text-slate-500 block font-mono">Turnaround</span>
          <span className="text-sm font-extrabold text-slate-200 font-mono">
            {strategy.delivery_days || strategy.lead_time_days || '1-3'} Days
          </span>
        </div>
        <div className="p-3 rounded-xl bg-surface-2/70 border border-white/[0.06]">
          <span className="text-[10px] text-slate-500 block font-mono">Net Savings</span>
          <span className="text-sm font-extrabold text-emerald-400 font-mono">
            +₹{(strategy.savings || 8672).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Supplier Volume Allocation Breakdown */}
      <div className="p-4 rounded-2xl bg-surface-2/70 border border-white/[0.06] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
            Supplier Volume Allocation
          </span>
          <span className="text-[10px] font-mono text-slate-500">100 kg Total Replenishment</span>
        </div>

        <div className="space-y-2">
          {/* Supplier 1: Malnad */}
          <div className="p-3 rounded-xl bg-surface-3/60 border border-white/[0.04] flex items-center justify-between text-xs">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white">Malnad Coffee Planters</span>
                <span className="badge-emerald text-[9px]">Primary (70%)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">70 kg @ ₹850/kg • 3-day transit</p>
            </div>
            <span className="font-bold text-white font-mono">₹59,500</span>
          </div>

          {/* Supplier 2: Metro Wholesale */}
          <div className="p-3 rounded-xl bg-surface-3/60 border border-white/[0.04] flex items-center justify-between text-xs">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white">Metro Wholesale Hub</span>
                <span className="badge-teal text-[9px]">Buffer (30%)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">30 kg @ ₹894.27/kg • 24h rapid dispatch</p>
            </div>
            <span className="font-bold text-white font-mono">₹26,828</span>
          </div>
        </div>
      </div>

      {/* Governance & Approval State */}
      <div className="p-3 rounded-xl bg-surface-2/40 border border-white/[0.04] text-[11px] text-slate-400 flex items-start gap-2">
        <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
        <span>
          Submitting creates a pending item in the Human Approval Queue. No capital is spent without your explicit authorization.
        </span>
      </div>
    </Drawer>
  );
}
