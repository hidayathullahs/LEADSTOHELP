import React from 'react';
import {
  AlertTriangle,
  Clock,
  TrendingDown,
  Coffee,
  Package,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Layers,
  Sliders
} from 'lucide-react';
import Drawer from './Drawer';

export default function RiskDetailDrawer({
  isOpen,
  onClose,
  riskData,
  onOpenProcurement,
  onOpenWhatIf
}) {
  if (!isOpen) return null;

  const sku = riskData?.sku || 'COFFEE-001';
  const name = riskData?.name || 'Specialty Arabica Coffee Beans (Estate Grade)';
  const daysLeft = riskData?.days_until_stockout || 2.77;
  const stock = riskData?.current_stock || 36;
  const reorderPoint = riskData?.reorder_point || 50;
  const runRate = riskData?.daily_run_rate || 13;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Supply Risk Breakdown"
      subtitle={`Operational impact analysis for ${sku}`}
      badge="Critical Risk"
      badgeType="rose"
      width="max-w-lg"
      footer={
        <div className="flex items-center justify-between gap-2">
          {onOpenWhatIf && (
            <button
              onClick={() => {
                onClose();
                onOpenWhatIf(sku);
              }}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-brand-accent" />
              <span>Simulate What-If</span>
            </button>
          )}
          {onOpenProcurement && (
            <button
              onClick={() => {
                onClose();
                onOpenProcurement(sku);
              }}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 ml-auto"
            >
              <span>Review 6 Scenarios</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </button>
          )}
        </div>
      }
    >
      {/* Risk Alert Header Card */}
      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
        <div className="flex items-center justify-between">
          <span className="badge-rose text-[10px] font-mono font-bold">
            88% STOCKOUT PROBABILITY
          </span>
          <span className="text-[11px] font-mono text-rose-300 font-bold">
            ~{daysLeft.toFixed(1)} Days Remaining
          </span>
        </div>
        <h3 className="text-xs font-bold text-white leading-tight">
          {name}
        </h3>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Daily consumption velocity (13 kg/day) exceeds current safety buffer. Without rapid replenishment, Deccan Roast will deplete beans before weekend peak traffic.
        </p>
      </div>

      {/* Core Inventory Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-xl bg-surface-2/70 border border-white/[0.06] text-center">
          <span className="text-[10px] text-slate-400 block font-mono">Current Stock</span>
          <span className="text-sm font-extrabold text-rose-400 font-mono">{stock} kg</span>
        </div>
        <div className="p-3 rounded-xl bg-surface-2/70 border border-white/[0.06] text-center">
          <span className="text-[10px] text-slate-400 block font-mono">Reorder Point</span>
          <span className="text-sm font-extrabold text-slate-200 font-mono">{reorderPoint} kg</span>
        </div>
        <div className="p-3 rounded-xl bg-surface-2/70 border border-white/[0.06] text-center">
          <span className="text-[10px] text-slate-400 block font-mono">Daily Run Rate</span>
          <span className="text-sm font-extrabold text-amber-300 font-mono">{runRate} kg/d</span>
        </div>
      </div>

      {/* Business Revenue Impact */}
      <div className="p-3.5 rounded-2xl bg-surface-2/70 border border-white/[0.06] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-rose-400" />
            <h4 className="text-xs font-bold text-white">Financial Impact at Risk</h4>
          </div>
          <span className="text-xs font-bold text-rose-400 font-mono">₹14,500 / day</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          Coffee beans represent the core ingredient across 48% of all store beverage sales. A stockout would directly impact the top 3 store revenue drivers.
        </p>

        {/* Affected Beverages */}
        <div className="pt-2 border-t border-white/[0.04] space-y-1.5">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">
            Impacted Menu Offerings
          </span>
          <div className="flex flex-wrap gap-1.5">
            {['Deccan Signature Cappuccino', 'South Indian Cold Brew', 'Double Shot Espresso', 'Caramel Macchiato'].map((item, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-lg bg-surface-3 text-slate-300 text-[10px] font-medium border border-white/[0.06]"
              >
                ☕ {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* AI Mitigation Recommendation Preview */}
      <div className="p-3.5 rounded-2xl bg-brand-accent/5 border border-brand-accent/20 space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-accent" />
          <h4 className="text-xs font-bold text-white">Recommended Mitigation Plan</h4>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          <strong>Split-Order Strategy:</strong> Order 70 kg from Malnad Planters (bulk pricing ₹850/kg) + 30 kg rapid buffer from Metro Hub (1-day turnaround).
        </p>
        <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 pt-1">
          <span>✓ Risk reduced to 8%</span>
          <span>✓ Saves ₹8,672</span>
        </div>
      </div>
    </Drawer>
  );
}
