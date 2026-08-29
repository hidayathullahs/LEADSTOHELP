import React from 'react';
import {
  Users,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  MapPin,
  Sparkles,
  ArrowRight,
  Sliders
} from 'lucide-react';
import Drawer from './Drawer';

export default function SupplierDetailDrawer({
  isOpen,
  onClose,
  supplier,
  onOpenProcurement,
  onOpenAskAI
}) {
  if (!isOpen || !supplier) return null;

  const score = supplier.reliability_score || supplier.rating || 92;
  const isHighRisk = score < 80;
  const isModerateRisk = score >= 80 && score < 90;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={supplier.name}
      subtitle={`Category: ${supplier.category || 'Specialty Coffee & Agri'} • Hub: ${supplier.location || 'Karnataka'}`}
      badge={`${Math.round(score)}% Reliability`}
      badgeType={isHighRisk ? 'rose' : isModerateRisk ? 'amber' : 'emerald'}
      width="max-w-lg"
      footer={
        <div className="flex items-center justify-between gap-2">
          {onOpenAskAI && (
            <button
              onClick={() => {
                onClose();
                onOpenAskAI(`Review supplier performance and risk profile for ${supplier.name}`);
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
                onOpenProcurement('COFFEE-001');
              }}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 ml-auto"
            >
              <span>Simulate Procurement</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </button>
          )}
        </div>
      }
    >
      {/* Supplier Score Header */}
      <div className="p-4 rounded-2xl bg-surface-2/80 border border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500">Partner Tier</span>
            <h4 className="text-xs font-bold text-white mt-0.5">
              {supplier.tier || (score > 90 ? 'Tier-1 Strategic Partner' : 'Secondary Supplier')}
            </h4>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500">SLA Rating</span>
            <div className="text-xl font-extrabold text-brand-accent font-mono">
              {score}%
            </div>
          </div>
        </div>

        {/* SLA Breakdown Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.04] text-center text-xs">
          <div>
            <span className="text-[10px] text-slate-500 block font-mono">On-Time Rate</span>
            <span className="font-bold text-emerald-400 font-mono">{supplier.on_time_rate || '94%'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block font-mono">Fulfillment</span>
            <span className="font-bold text-slate-200 font-mono">{supplier.fulfillment_rate || '98%'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block font-mono">Invoice Match</span>
            <span className={`font-bold font-mono ${
              supplier.invoice_accuracy === 'Flagged (8L)' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {supplier.invoice_accuracy || '99.2%'}
            </span>
          </div>
        </div>
      </div>

      {/* Identified Strengths & Operational Risks */}
      <div className="space-y-2">
        <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <h4 className="text-xs font-bold text-emerald-400">Verified Strengths</h4>
          </div>
          <p className="text-[11px] text-slate-300 pl-5 leading-relaxed">
            {supplier.strengths || 'Estate-grade Arabica consistency, competitive volume discounts, established QA inspection protocol.'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <h4 className="text-xs font-bold text-amber-300">Operational Risk Factors</h4>
          </div>
          <p className="text-[11px] text-slate-300 pl-5 leading-relaxed">
            {supplier.risks || '3-day transit lead time from Chikmagalur can create stockout risks if demand spikes unexpectedly.'}
          </p>
        </div>
      </div>

      {/* Recommended Role in Network */}
      <div className="p-3.5 rounded-2xl bg-surface-2/60 border border-white/[0.06] space-y-2">
        <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">
          LEADSTOHELP Optimization Role
        </span>
        <p className="text-xs text-slate-200 font-medium leading-relaxed">
          {supplier.recommended_role || 'Recommended for 70% bulk volume allocation to minimize baseline cost, paired with 30% rapid local distributor buffer.'}
        </p>
      </div>
    </Drawer>
  );
}
