import React, { useState } from 'react';
import {
  Package,
  Layers,
  TrendingUp,
  TrendingDown,
  Truck,
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  History
} from 'lucide-react';
import Drawer from './Drawer';

export default function InventoryDetailDrawer({
  isOpen,
  onClose,
  item,
  onOpenProcurement,
  onOpenAskAI
}) {
  if (!isOpen || !item) return null;

  const isCritical = item.status === 'CRITICAL' || item.days_left < 3;
  const isWarning = item.status === 'LOW' || (item.days_left >= 3 && item.days_left < 6);

  let badgeText = 'Healthy Buffer';
  let badgeType = 'emerald';
  if (isCritical) {
    badgeText = 'Critical Stockout Risk';
    badgeType = 'rose';
  } else if (isWarning) {
    badgeText = 'Low Stock Buffer';
    badgeType = 'amber';
  }

  const stockPct = Math.min(100, Math.round((item.current_stock / (item.reorder_point * 1.5)) * 100));

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={item.name}
      subtitle={`SKU: ${item.sku} • Category: ${item.category || 'Raw Materials'}`}
      badge={badgeText}
      badgeType={badgeType}
      width="max-w-lg"
      footer={
        <div className="flex items-center justify-between gap-2">
          {onOpenAskAI && (
            <button
              onClick={() => {
                onClose();
                onOpenAskAI(`Analyze inventory stock and supplier options for ${item.sku}`);
              }}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
              <span>Ask Copilot</span>
            </button>
          )}
          {onOpenProcurement && (
            <button
              onClick={() => {
                onClose();
                onOpenProcurement(item.sku);
              }}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 ml-auto"
            >
              <span>Procurement Decision</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </button>
          )}
        </div>
      }
    >
      {/* Current Inventory Balance Card */}
      <div className="p-4 rounded-2xl bg-surface-2/80 border border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500">Current Stock</span>
            <div className="text-xl font-extrabold text-white font-mono mt-0.5">
              {item.current_stock} <span className="text-xs font-normal text-slate-400">{item.unit || 'kg'}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500">Days Coverage</span>
            <div className={`text-xl font-extrabold font-mono mt-0.5 ${
              isCritical ? 'text-rose-400' : isWarning ? 'text-amber-300' : 'text-emerald-400'
            }`}>
              ~{item.days_left || (item.current_stock / (item.daily_run_rate || 1)).toFixed(1)}d
            </div>
          </div>
        </div>

        {/* Stock Level Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Safety Threshold: {item.reorder_point} {item.unit || 'kg'}</span>
            <span>{stockPct}% of optimal buffer</span>
          </div>
          <div className="h-2 w-full bg-surface-3 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${stockPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Operational Velocity & Lead Time Matrix */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-3 rounded-xl bg-surface-2/60 border border-white/[0.04] space-y-1">
          <span className="text-[10px] text-slate-500 font-mono">Daily Run Rate</span>
          <p className="font-bold text-slate-200 font-mono">
            {item.daily_run_rate || 13.0} {item.unit || 'kg'}/day
          </p>
          <span className="text-[10px] text-slate-400">7-day trailing velocity</span>
        </div>

        <div className="p-3 rounded-xl bg-surface-2/60 border border-white/[0.04] space-y-1">
          <span className="text-[10px] text-slate-500 font-mono">Reorder Lead Time</span>
          <p className="font-bold text-slate-200 font-mono">
            {item.lead_time_days || 3} Days
          </p>
          <span className="text-[10px] text-slate-400">Primary supplier dispatch</span>
        </div>
      </div>

      {/* Primary Supplier & Location */}
      <div className="p-3.5 rounded-2xl bg-surface-2/60 border border-white/[0.06] space-y-2">
        <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">
          Supply Network & Storage
        </span>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Primary Supplier:</span>
            <span className="font-semibold text-white">{item.primary_supplier || 'Malnad Coffee Planters'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Storage Location:</span>
            <span className="font-mono text-slate-300">{item.storage_zone || 'Cold Dry Storage • Bay B-04'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Unit Cost (Est):</span>
            <span className="font-mono font-bold text-brand-accent">₹{item.unit_cost || 850}/kg</span>
          </div>
        </div>
      </div>

      {/* Automated Telemetry Note */}
      <div className="p-3 rounded-xl bg-surface-3/60 border border-white/[0.04] text-[11px] text-slate-400 flex items-start gap-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
        <span>
          Inventory telemetry is synced in real-time with POS register debits and verified purchase receipts.
        </span>
      </div>
    </Drawer>
  );
}
