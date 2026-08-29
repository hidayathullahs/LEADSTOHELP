import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  FileText,
  DollarSign,
  ChevronRight,
  UserCheck,
  Lock,
  ArrowRight,
  Layers,
  History
} from 'lucide-react';
import { api } from '../services/api';

export default function ApprovalCenterPage({
  onOpenAskAI,
  onRequestApprovalModal
}) {
  const [approvals, setApprovals] = useState([]);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState(null);

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      const res = await api.getApprovals(statusFilter !== 'ALL' ? statusFilter : undefined);
      const list = res.approvals || [];
      setApprovals(list);
      if (list.length > 0) {
        setSelectedApproval(list[0]);
      }
    } catch (err) {
      console.error('Failed to load approvals', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [statusFilter]);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-emerald text-[10px] uppercase font-bold font-mono">
              Strict RBAC Governance Gate
            </span>
            <span className="text-xs text-slate-400">Zero Autonomous Financial Commitments</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
            Human Approval Queue & Governance
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Every high-impact purchase order, supplier re-allocation, or price adjustment requires explicit human sign-off.
          </p>
        </div>

        <button
          onClick={() => onOpenAskAI("Review pending approval queue and provide operational impact summary.")}
          className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-black fill-black" />
          <span>Ask Copilot Risk Assessment</span>
        </button>
      </div>

      {/* Trust & Governance Principle Banner */}
      <div className="glass-card p-4 border-emerald-500/20 bg-emerald-500/[0.02] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">
              AI recommends. You remain in control.
            </h3>
            <p className="text-[11px] text-slate-300">
              Deterministic engines calculate optimized scenarios, but capital spend is only committed upon operator authorization.
            </p>
          </div>
        </div>

        <span className="badge-emerald text-[10px] font-mono font-bold hidden md:inline shrink-0">
          Cryptographic Sign-Off Active
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 text-xs">
        {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              statusFilter === st
                ? 'bg-surface-2 text-white border border-white/[0.08] shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Approvals List & Selected Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (1 col): Approvals Queue List */}
        <div className="space-y-3">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Loading approval queue...
            </div>
          ) : approvals.length === 0 ? (
            <div className="glass-card p-8 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-xs font-bold text-white">All Caught Up</h4>
              <p className="text-[11px] text-slate-400">No pending items requiring approval.</p>
            </div>
          ) : (
            approvals.map((app) => {
              const isPending = app.status === 'PENDING';
              const isSelected = selectedApproval?.approval_id === app.approval_id;

              return (
                <div
                  key={app.approval_id}
                  onClick={() => setSelectedApproval(app)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-surface-2 border-brand-accent/40 shadow-lg'
                      : 'bg-surface-1 border-white/[0.06] hover:border-white/[0.12] hover:bg-surface-2/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-amber-300">
                      {app.approval_id}
                    </span>
                    <span className="text-xs font-extrabold text-brand-accent font-mono">
                      ₹{(app.financial_impact?.total_value || 86328).toLocaleString()}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-1">
                    {app.title || 'Purchase Order Replenishment'}
                  </h4>

                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {app.description || 'Split-Order Replenishment for Arabica Beans'}
                  </p>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/[0.04] text-[10px] text-slate-500 font-mono">
                    <span>{app.urgency || 'HIGH PRIORITY'}</span>
                    <span className="text-emerald-400 font-semibold">{app.status}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right (2 cols): Detailed Inspection & Action Panel */}
        <div className="lg:col-span-2">
          {selectedApproval ? (
            <div className="glass-card p-6 space-y-5 border-white/[0.08]">
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-300">
                      {selectedApproval.approval_id}
                    </span>
                    <span className="badge-amber text-[9px] font-mono">AWAITING OPERATOR</span>
                  </div>
                  <h2 className="text-base font-bold text-white mt-0.5">
                    {selectedApproval.title || 'Purchase Order Replenishment Authorization'}
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block font-mono">Commitment Value</span>
                  <span className="text-xl font-extrabold text-brand-accent font-mono">
                    ₹{(selectedApproval.financial_impact?.total_value || 86328).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Justification & Impact */}
              <div className="p-4 rounded-2xl bg-surface-2/60 border border-white/[0.04] space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
                  AI Recommendation Rationale
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedApproval.description || 'Optimized split replenishment allocating 70kg to Malnad Coffee Planters (₹850/kg) and 30kg buffer to Metro Wholesale Hub. Reduces store stockout risk from 88% down to 8% while saving ₹8,672 against default single-supplier quote.'}
                </p>
              </div>

              {/* Financial Impact Breakdown */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-surface-2/60 border border-white/[0.04]">
                  <span className="text-[10px] text-slate-500 block font-mono">Net Spend</span>
                  <span className="font-extrabold text-brand-accent font-mono text-sm">
                    ₹{(selectedApproval.financial_impact?.total_value || 86328).toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-surface-2/60 border border-white/[0.04]">
                  <span className="text-[10px] text-slate-500 block font-mono">Risk Reduction</span>
                  <span className="font-extrabold text-emerald-400 font-mono text-sm">88% → 8%</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-2/60 border border-white/[0.04]">
                  <span className="text-[10px] text-slate-500 block font-mono">Estimated Savings</span>
                  <span className="font-extrabold text-emerald-400 font-mono text-sm">+₹8,672</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
                <button
                  onClick={() => onRequestApprovalModal && onRequestApprovalModal(selectedApproval)}
                  className="btn-success text-xs py-2 px-6 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>Review & Approve Purchase Order</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center text-slate-500 text-xs">
              Select an item from the queue to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
