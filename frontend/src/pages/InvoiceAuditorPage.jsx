import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Upload,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  FileText,
  ShieldAlert,
  Loader2,
  HelpCircle,
  DollarSign,
  Package,
  Layers,
  ChevronRight,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../components/ToastContext';

export default function InvoiceAuditorPage({ onOpenAskAI }) {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAudit, setActiveAudit] = useState(null);
  const [debitNoteGenerated, setDebitNoteGenerated] = useState(false);
  const { addToast } = useToast();

  const fetchAudits = async () => {
    setLoading(true);
    try {
      const res = await api.getInvoiceAudits();
      setAudits(res.audits || []);
      if (res.audits && res.audits.length > 0 && !activeAudit) {
        setActiveAudit(res.audits[0]);
      }
    } catch (err) {
      console.error('Failed to load audits', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  const handleGenerateDebitNote = () => {
    setDebitNoteGenerated(true);
    addToast({
      title: 'Debit Note DN-2026-004 Generated',
      message: '₹486.40 debit note drafted and sent to Kaveri Organic Dairy for credit adjustment.',
      type: 'success'
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-teal text-[10px] uppercase font-bold font-mono">
              Multimodal Vision Verification
            </span>
            <span className="text-xs text-slate-400">Automated 3-Way Cross-Check</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            <FileCheck className="w-5 h-5 text-brand-accent shrink-0" />
            Invoice Vision Audit & 3-Way Match
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated optical character recognition (OCR) and discrepancy detection cross-referencing Purchase Orders, Delivery Notes, and Invoices.
          </p>
        </div>

        <button
          onClick={() => onOpenAskAI("Why was Kaveri Dairy invoice INV-2026-0841 flagged for an 8L shortage?")}
          className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-black fill-black" />
          <span>Ask Copilot about Variance</span>
        </button>
      </div>

      {/* 4-Step 3-Way Match Visual Flow */}
      <div className="glass-card p-5 border-amber-500/30 bg-gradient-to-r from-surface-1 via-surface-1 to-surface-2 space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Flagged Discrepancy: Kaveri Organic Dairy Co-op (INV-2026-0841)
            </h3>
          </div>
          <span className="badge-amber text-[10px] font-mono font-bold">8L SHORTAGE DETECTED</span>
        </div>

        {/* 4-Node Sequence */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Step 1: ORDERED */}
          <div className="p-3.5 rounded-2xl bg-surface-2/60 border border-white/[0.04] space-y-1">
            <span className="text-[10px] font-mono text-slate-500 block">1. ORDERED (PO-10022)</span>
            <div className="text-sm font-bold text-white font-mono">20.0 Liters</div>
            <p className="text-[11px] text-slate-400">Full Cream Barista Milk @ ₹60.80/L</p>
          </div>

          {/* Step 2: INVOICED */}
          <div className="p-3.5 rounded-2xl bg-surface-2/60 border border-white/[0.04] space-y-1">
            <span className="text-[10px] font-mono text-slate-500 block">2. INVOICED (INV-0841)</span>
            <div className="text-sm font-bold text-amber-300 font-mono">20.0 Liters</div>
            <p className="text-[11px] text-slate-400">Billed Total: ₹1,216.00 + GST</p>
          </div>

          {/* Step 3: RECEIVED */}
          <div className="p-3.5 rounded-2xl bg-surface-2/60 border border-white/[0.04] space-y-1">
            <span className="text-[10px] font-mono text-slate-500 block">3. RECEIVED (GRN-0941)</span>
            <div className="text-sm font-bold text-rose-400 font-mono">12.0 Liters</div>
            <p className="text-[11px] text-slate-400">Store Hub Intake Count: 12 Bottles</p>
          </div>

          {/* Step 4: VERIFIED */}
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
            <span className="text-[10px] font-mono text-rose-400 font-bold block">4. VARIANCE AUDIT</span>
            <div className="text-sm font-extrabold text-rose-400 font-mono">-8.0 L (₹486.40)</div>
            <p className="text-[11px] text-rose-300">Overcharge flagged by vision engine</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
          <div className="text-xs text-slate-300">
            Recommended Action: Issue <strong>₹486.40 Debit Note</strong> against next billing cycle.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateDebitNote}
              disabled={debitNoteGenerated}
              className={`text-xs py-2 px-4 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                debitNoteGenerated
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'btn-primary'
              }`}
            >
              {debitNoteGenerated ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Debit Note Issued</span>
                </>
              ) : (
                <>
                  <span>Generate ₹486.40 Debit Note</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Invoice History & OCR Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Reconciled Invoices Table */}
        <div className="lg:col-span-2 glass-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-accent" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Recent Reconciled Invoices
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">8 Invoices Audited</span>
          </div>

          <div className="space-y-2">
            {[
              { id: 'INV-2026-0841', supplier: 'Kaveri Organic Dairy Co-op', sku: 'DAIRY-001 (Milk)', amount: '₹1,216.00', status: 'VARIANCE', variance: '-8L Shortage (₹486.40)' },
              { id: 'INV-2026-0839', supplier: 'Metro Wholesale Hub', sku: 'COFFEE-001 (Arabica)', amount: '₹42,000.00', status: 'MATCHED', variance: '100% Verified' },
              { id: 'INV-2026-0835', supplier: 'EcoPack India Ltd', sku: 'PACK-001 (Kraft Cups)', amount: '₹8,400.00', status: 'MATCHED', variance: '100% Verified' },
              { id: 'INV-2026-0828', supplier: 'Malnad Coffee Planters', sku: 'COFFEE-001 (Estate)', amount: '₹59,500.00', status: 'MATCHED', variance: '100% Verified' }
            ].map((inv) => (
              <div
                key={inv.id}
                onClick={() => setActiveAudit(inv)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  inv.status === 'VARIANCE'
                    ? 'bg-amber-500/5 border-amber-500/30 hover:bg-amber-500/10'
                    : 'bg-surface-2/60 border-white/[0.04] hover:bg-surface-2'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{inv.id}</span>
                    <span className="text-slate-400 text-xs">• {inv.supplier}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{inv.sku}</p>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-white text-xs">{inv.amount}</div>
                  <span className={`text-[10px] font-mono font-bold ${
                    inv.status === 'VARIANCE' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {inv.variance}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right (1 col): OCR Verification Engine Panel */}
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-accent" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                OCR Verification Engine
              </h3>
            </div>
            <span className="badge-emerald text-[9px] font-mono">100% OCR CONFIDENCE</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-surface-2/60 border border-white/[0.04] space-y-1">
              <span className="text-[10px] text-slate-500 font-mono">Line Item Extracted</span>
              <p className="text-slate-200 font-semibold">Pasteurized Full Cream Barista Milk (1L Pouches)</p>
            </div>

            <div className="p-3 rounded-xl bg-surface-2/60 border border-white/[0.04] space-y-1">
              <span className="text-[10px] text-slate-500 font-mono">GSTIN Tax Audit</span>
              <p className="text-slate-200 font-mono">29AABCK8891D1ZQ (Valid & Verified)</p>
            </div>

            <div className="p-3 rounded-xl bg-surface-2/60 border border-white/[0.04] space-y-1">
              <span className="text-[10px] text-slate-500 font-mono">Audit Decision</span>
              <p className="text-emerald-400 font-bold">Auto-Flagged for Operator Resolution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
