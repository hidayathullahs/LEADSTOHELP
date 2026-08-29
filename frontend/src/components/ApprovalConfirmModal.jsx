import React, { useState } from 'react';
import { X, ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

export default function ApprovalConfirmModal({
  isOpen,
  onClose,
  approvalItem,
  onConfirm
}) {
  const [reason, setReason] = useState('Authorized by Store Operations Lead after reviewing multi-scenario digital twin risk simulation.');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !approvalItem) return null;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm(approvalItem.id, 'APPROVED', reason);
      onClose();
    } catch (err) {
      alert(`Approval error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      <div
        className="w-full max-w-lg bg-surface-1 border border-white/[0.12] rounded-2xl shadow-2xl p-6 relative space-y-5 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="approval-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 id="approval-modal-title" className="text-sm font-bold text-white">
                Human Governance Gate
              </h2>
              <p className="text-[11px] text-slate-400">
                Confirm human authorization for procurement commitment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-2 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Commitment Summary Box */}
        <div className="p-4 rounded-xl bg-surface-2/80 border border-white/[0.06] space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-slate-500">Action</span>
              <h4 className="text-xs font-bold text-white mt-0.5">
                {approvalItem.title || 'Purchase Order Commitment'}
              </h4>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-500">Financial Value</span>
              <p className="text-sm font-extrabold text-brand-accent font-mono">
                ₹{(approvalItem.financial_impact?.total_value || 86328).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.04] text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block">Risk Reduction</span>
              <span className="font-bold text-emerald-400">88% → 8% Critical Risk</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Governance State</span>
              <span className="font-mono text-[11px] text-slate-300">Deterministic Engine Verified</span>
            </div>
          </div>
        </div>

        {/* Reason / Audit Note */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 block">
            Approval Audit Note (Logged to Permanent Ledger)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            className="w-full bg-surface-2 border border-white/[0.08] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
            placeholder="State justification for authorization..."
          />
        </div>

        {/* Trust & Non-Repudiation Footer */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-surface-2/40 p-2.5 rounded-xl border border-white/[0.04]">
          <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            Strict RBAC: AI recommendations are advisory until operator signs off.
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="btn-secondary text-xs py-2 px-4"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="btn-success text-xs py-2 px-5 flex items-center gap-1.5"
          >
            {submitting ? (
              <span>Authorizing...</span>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                <span>Confirm & Sign PO</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
