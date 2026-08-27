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
  UserCheck
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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
              Human-in-the-Loop Barrier
            </span>
            <span className="text-xs text-slate-400">Zero-Trust Operational Governance</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-amber-400" />
            Human Approval Center
          </h1>
          <p className="text-xs text-slate-400">
            High-impact financial orders, supplier commitments, and fallback re-routes strictly require authorized manager approval.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === s
                  ? 'bg-amber-500 text-black font-bold shadow-glow-amber'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Approvals Queue (Left) + Decision Dossier (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Approvals Queue (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-400">
            Decision Queue ({approvals.length})
          </h3>

          {loading ? (
            <div className="text-xs text-slate-400 py-8 text-center">Loading queue...</div>
          ) : approvals.length === 0 ? (
            <div className="glass-card p-8 text-center text-slate-500 text-xs">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400/60 mb-2" />
              <p className="font-semibold text-slate-300">No {statusFilter.toLowerCase()} approvals.</p>
              <p className="mt-1">All actions processed.</p>
            </div>
          ) : (
            approvals.map((appr) => (
              <div
                key={appr.approval_id}
                onClick={() => setSelectedApproval(appr)}
                className={`glass-card p-4 cursor-pointer transition-all ${
                  selectedApproval?.approval_id === appr.approval_id
                    ? 'border-amber-500 bg-amber-950/20 shadow-glow-amber'
                    : 'hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10px] text-cyan-400 font-bold">{appr.approval_id}</span>
                  <span
                    className={
                      appr.status === 'PENDING'
                        ? 'badge-amber'
                        : appr.status === 'APPROVED'
                        ? 'badge-emerald'
                        : 'badge-rose'
                    }
                  >
                    {appr.status}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white line-clamp-1">{appr.title}</h4>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{appr.supplier_name}</p>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Investment:</span>
                  <strong className="font-mono text-white">₹{appr.cost_inr.toLocaleString()}</strong>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Decision Dossier (8 Cols) */}
        {selectedApproval ? (
          <div className="lg:col-span-8 glass-card p-6 space-y-6">
            {/* Top Dossier Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-400">{selectedApproval.approval_id}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Type: {selectedApproval.type}
                  </span>
                </div>
                <h2 className="text-base font-bold text-white mt-1">{selectedApproval.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{selectedApproval.description}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Spend Required</span>
                <span className="text-xl font-extrabold font-mono text-white">
                  ₹{selectedApproval.cost_inr.toLocaleString()}
                </span>
                {selectedApproval.potential_savings_inr > 0 && (
                  <span className="text-xs font-mono text-emerald-400 block">
                    +₹{selectedApproval.potential_savings_inr.toLocaleString()} savings
                  </span>
                )}
              </div>
            </div>

            {/* Explainable Decision Dossier (4 Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-cyan-400">1. What Will Happen:</span>
                <p className="text-xs text-slate-200">{selectedApproval.what_will_happen}</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400">2. Why It Is Recommended:</span>
                <p className="text-xs text-slate-200">{selectedApproval.why_recommended}</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-400">3. Expected Operational Impact:</span>
                <p className="text-xs text-slate-200">{selectedApproval.expected_benefit}</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-indigo-400">4. Grounded Data Sources:</span>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-0.5">
                  {selectedApproval.data_sources_used?.map((ds, i) => (
                    <li key={i}>{ds}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Approval Decision Controls */}
            {selectedApproval.status === 'PENDING' ? (
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">
                    Manager Sign-off Note / Authorization Comments (Optional)
                  </label>
                  <input
                    type="text"
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    placeholder="e.g. Authorized for weekend demand surge..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => handleDecision('REJECTED')}
                    disabled={processing}
                    className="px-4 py-2 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Action</span>
                  </button>

                  <button
                    onClick={() => handleDecision('APPROVED')}
                    disabled={processing}
                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-lg shadow-glow-emerald transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authorize & Execute</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-200">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Decided by {selectedApproval.decided_by_name || 'Arjun Rao'}</span>
                </div>
                <p className="font-mono text-[11px] text-slate-500">Timestamp: {selectedApproval.decided_at}</p>
                <p className="text-slate-300">Reason: {selectedApproval.decision_reason}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-8 glass-card p-12 text-center text-slate-500">
            Select a pending decision to review explainable factors and grant execution approval.
          </div>
        )}
      </div>
    </div>
  );
}
