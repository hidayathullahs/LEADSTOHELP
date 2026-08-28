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
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export default function ApprovalCenterPage({ onOpenAskAI }) {
  const [approvals, setApprovals] = useState([]);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [actionReason, setActionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      const res = await api.getApprovals(statusFilter !== 'ALL' ? statusFilter : undefined);
      setApprovals(res.approvals || []);
      if (res.approvals && res.approvals.length > 0) {
        setSelectedApproval(res.approvals[0]);
      } else {
        setSelectedApproval(null);
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

  const handleDecision = async (decision) => {
    if (!selectedApproval) return;
    setProcessing(true);
    try {
      await api.submitApprovalDecision(
        selectedApproval.approval_id,
        decision,
        actionReason || (decision === 'APPROVED' ? 'Approved by operations manager.' : 'Rejected.')
      );
      setActionReason('');
      fetchApprovals();
    } catch (err) {
      alert(`Decision recording failed: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-amber text-[10px] uppercase font-bold">
              Human-in-the-Loop Governance
            </span>
            <span className="text-xs text-slate-400">Zero Autonomous Financial Commitments</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            <CheckSquare className="w-5 h-5 text-amber-400" />
            Human Approval Queue & Governance Barrier
          </h1>
          <p className="text-xs text-slate-400">
            Every high-impact purchase order, vendor re-allocation, or price adjustment requires cryptographic human sign-off.
          </p>
        </div>

        <button
          onClick={() => onOpenAskAI("Review pending approval queue and provide operational impact summary.")}
          className="btn-primary text-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-black fill-black" />
          <span>Ask AI Risk Assessment</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
        {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === st
                ? 'bg-surface-2 text-white border border-white/[0.1] shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Main Grid: Approvals List (Left) + Detailed Approval Dossier (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Approvals List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {loading ? (
            <div className="glass-card p-12 text-center text-slate-400">
              Loading approval queue...
            </div>
          ) : approvals.length === 0 ? (
            <div className="glass-card p-12 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
              <p>No actions matching filter "{statusFilter}".</p>
            </div>
          ) : (
            approvals.map((appr) => {
              const isSelected = selectedApproval?.approval_id === appr.approval_id;

              return (
                <div
                  key={appr.approval_id}
                  onClick={() => setSelectedApproval(appr)}
                  className={`glass-card p-4 transition-all cursor-pointer group ${
                    isSelected
                      ? 'border-amber-500/80 bg-surface-2 ring-1 ring-amber-500/40 shadow-glow-teal'
                      : 'hover:border-white/[0.12] bg-surface-1'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] text-brand-accent font-bold">{appr.approval_id}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      appr.status === 'PENDING' ? 'badge-amber' :
                      appr.status === 'APPROVED' ? 'badge-emerald' : 'badge-rose'
                    }`}>
                      {appr.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white leading-tight">{appr.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{appr.why_recommended}</p>

                  <div className="flex items-center justify-between text-xs font-mono mt-3 pt-2 border-t border-white/[0.04]">
                    <span className="text-slate-400">Commitment:</span>
                    <strong className="text-white font-bold">₹{appr.cost_inr.toLocaleString()}</strong>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detailed Approval Dossier (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedApproval ? (
            <div className="glass-card p-6 space-y-5 bg-surface-1">
              {/* Top Meta Header */}
              <div className="flex items-start justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-brand-accent font-bold bg-brand-accent/10 px-2 py-0.5 rounded border border-brand-accent/20">
                      {selectedApproval.approval_id}
                    </span>
                    <span className="badge-amber font-mono text-[10px]">
                      {selectedApproval.type}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white">{selectedApproval.title}</h2>
                </div>

                <div className="text-right">
                  <span className="text-xl font-bold font-mono text-white">
                    ₹{selectedApproval.cost_inr.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">Net Outlay</span>
                </div>
              </div>

              {/* Dossier Sections */}
              <div className="space-y-3.5 text-xs">
                {/* 1. What Will Happen */}
                <div className="p-3.5 bg-surface-2 rounded-xl border border-white/[0.04] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-brand-accent tracking-wider block">
                    1. Proposed Operational Action
                  </span>
                  <p className="text-slate-200 leading-relaxed">{selectedApproval.what_will_happen}</p>
                </div>

                {/* 2. Why Recommended */}
                <div className="p-3.5 bg-surface-2 rounded-xl border border-white/[0.04] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                    2. Strategic Rationale & Benefit
                  </span>
                  <p className="text-slate-200 leading-relaxed">{selectedApproval.why_recommended}</p>
                  {selectedApproval.expected_benefit && (
                    <p className="text-emerald-300 font-semibold mt-1">
                      Expected ROI: {selectedApproval.expected_benefit}
                    </p>
                  )}
                </div>

                {/* 3. Risk Assessment */}
                <div className="p-3.5 bg-surface-2 rounded-xl border border-white/[0.04] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                    3. Risk Assessment & Inaction Impact
                  </span>
                  <p className="text-slate-300 leading-relaxed">{selectedApproval.risk_of_inaction || 'Failure to approve triggers severe stockout risk.'}</p>
                </div>
              </div>

              {/* Action Controls (if pending) */}
              {selectedApproval.status === 'PENDING' && (
                <div className="pt-4 border-t border-white/[0.06] space-y-3">
                  <input
                    type="text"
                    placeholder="Optional manager decision notes..."
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    className="w-full bg-surface-2 border border-white/[0.08] text-xs text-white placeholder-slate-500 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-accent"
                  />

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDecision('APPROVED')}
                      disabled={processing}
                      className="flex-1 btn-success text-xs py-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Authorize & Dispatch Action</span>
                    </button>

                    <button
                      onClick={() => handleDecision('REJECTED')}
                      disabled={processing}
                      className="btn-danger text-xs py-2 px-4"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-12 text-center text-slate-500">
              Select an item from the queue to inspect governance dossier.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
