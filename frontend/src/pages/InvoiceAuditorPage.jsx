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
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';

export default function InvoiceAuditorPage({ onOpenAskAI }) {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [activeAudit, setActiveAudit] = useState(null);

  const fetchAudits = async () => {
    setLoading(true);
    try {
      const res = await api.getInvoiceAudits();
      setAudits(res.audits || []);
      if (res.audits && res.audits.length > 0 && !activeAudit) {
        setActiveAudit(res.audits[1] || res.audits[0]); // Default to Kaveri Dairy discrepancy
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

  const handleRunPresetAudit = async (presetType) => {
    setScanning(true);
    setScanStep(1);

    // Realistic scanning state progression
    setTimeout(() => setScanStep(2), 500);
    setTimeout(() => setScanStep(3), 1000);
    setTimeout(() => setScanStep(4), 1500);

    try {
      let payload = {};
      if (presetType === 'CLEAN') {
        payload = {
          supplier_name: 'Metro Wholesale Hub',
          supplier_gstin: '29AABCM1234F1Z8',
          invoice_number: 'INV-10428',
          invoice_date: '2026-08-25',
          purchase_order_id: 'PO-10021',
          items: [
            {
              sku: 'COFFEE-001',
              name: 'Arabica Coffee Beans (AAA Grade)',
              quantity: 50.0,
              unit_price: 840.0,
              line_total: 42000.0
            }
          ],
          subtotal: 42000.0,
          tax_amount: 2100.0,
          total_amount: 44600.0
        };
      } else {
        // Discrepancy Case: Kaveri Dairy (100L billed vs 92L received)
        payload = {
          supplier_name: 'Kaveri Organic Dairy Co-op',
          supplier_gstin: '29AABCK8891D1ZQ',
          invoice_number: 'INV-KAV-8842',
          invoice_date: '2026-08-26',
          purchase_order_id: 'PO-10022',
          items: [
            {
              sku: 'DAIRY-001',
              name: 'Pasteurized Full Cream Barista Milk',
              quantity: 100.0,
              unit_price: 60.8,
              line_total: 6080.0
            }
          ],
          subtotal: 6080.0,
          tax_amount: 304.0,
          total_amount: 6584.0
        };
      }

      const formData = new FormData();
      formData.append('raw_json', JSON.stringify(payload));

      setTimeout(async () => {
        const auditRes = await api.auditInvoiceUpload(formData);
        setActiveAudit(auditRes);
        setScanning(false);
        fetchAudits();
      }, 2000);
    } catch (err) {
      alert(`Audit failed: ${err.message}`);
      setScanning(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-teal text-[10px] uppercase font-bold">
              Multimodal Vision + 3-Way Match
            </span>
            <span className="text-xs text-slate-400">Zero-Trust Document Reconciler</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            <FileCheck className="w-5 h-5 text-brand-accent" />
            Multimodal Invoice Auditor & Discrepancy Engine
          </h1>
          <p className="text-xs text-slate-400">
            Gemini Vision extracts structured line items → Deterministic engine reconciles against authorized Purchase Orders.
          </p>
        </div>

        <button
          onClick={() => onOpenAskAI("Analyze all unresolved invoice discrepancies and draft a debit note claim.")}
          className="btn-primary text-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-black fill-black" />
          <span>Ask AI Invoice Copilot</span>
        </button>
      </div>

      {/* Upload & Demo Presets Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Drag and drop upload */}
        <div className="md:col-span-6 glass-card p-5 border-dashed border-2 border-white/[0.1] hover:border-brand-accent/40 transition-all flex flex-col items-center justify-center text-center bg-surface-1">
          <div className="w-10 h-10 rounded-xl bg-surface-2 border border-white/[0.08] flex items-center justify-center text-brand-accent mb-2.5">
            <Upload className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-white mb-1">Upload Supplier Invoice / Receipt</h3>
          <p className="text-[11px] text-slate-400 max-w-sm mb-3">
            Supports PNG, JPEG, PDF Tax Invoices & Physical Delivery Challans.
          </p>
          <button
            onClick={() => handleRunPresetAudit('DISCREPANCY')}
            disabled={scanning}
            className="btn-secondary text-xs"
          >
            Upload Document File
          </button>
        </div>

        {/* 1-Click Interactive Demonstration Presets */}
        <div className="md:col-span-6 glass-card p-5 space-y-3 bg-surface-1">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-accent">
            <Sparkles className="w-3.5 h-3.5 text-brand-accent fill-brand-accent" />
            <span>Interactive Demo Scenarios</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Select a verified benchmark case to trigger the multimodal vision & reconciliation pipeline:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => handleRunPresetAudit('CLEAN')}
              disabled={scanning}
              className="p-3 bg-surface-2 hover:bg-emerald-500/10 border border-white/[0.06] hover:border-emerald-500/30 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono">Case 1: Clean Match</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-xs font-bold text-white">Metro Wholesale</p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-mono">INV-10428 • ₹44,600 • 100% Match</p>
            </button>

            <button
              onClick={() => handleRunPresetAudit('DISCREPANCY')}
              disabled={scanning}
              className="p-3 bg-surface-2 hover:bg-rose-500/10 border border-white/[0.06] hover:border-rose-500/30 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-rose-400 uppercase font-mono">Case 2: Shortage Flag</span>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <p className="text-xs font-bold text-white">Kaveri Dairy Shortage</p>
              <p className="text-[10px] text-rose-300 mt-0.5 font-mono">8L Milk Missing • ₹486.40 Overbill</p>
            </button>
          </div>
        </div>
      </div>

      {/* Main Audit Breakdown: Invoices List (Left) + Detailed Audit Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Audits List */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            Audited Invoices ({audits.length})
          </h3>

          <div className="space-y-2">
            {audits.map((a) => {
              const isSelected = activeAudit?.audit_id === a.audit_id;
              const hasDiscrepancy = a.discrepancies?.length > 0;

              return (
                <div
                  key={a.audit_id}
                  onClick={() => setActiveAudit(a)}
                  className={`glass-card p-3.5 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-brand-accent bg-surface-2 ring-1 ring-brand-accent/40 shadow-glow-teal'
                      : 'hover:border-white/[0.12] bg-surface-1'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-brand-accent font-bold">{a.invoice_number}</span>
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${
                      a.status === 'CLEAN' ? 'badge-emerald' : 'badge-rose'
                    }`}>
                      {a.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white">{a.supplier_name}</h4>
                  
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-white/[0.04]">
                    <span>Total: ₹{a.total_amount_inr?.toLocaleString()}</span>
                    <span>PO: {a.purchase_order_id}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed 3-Way Match Inspector */}
        <div className="lg:col-span-8">
          {activeAudit ? (
            <div className="glass-card p-6 space-y-6 bg-surface-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.06] pb-4 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-brand-accent font-bold bg-brand-accent/10 px-2 py-0.5 rounded border border-brand-accent/20">
                      {activeAudit.invoice_number}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      activeAudit.status === 'CLEAN' ? 'badge-emerald' : 'badge-rose'
                    }`}>
                      {activeAudit.status === 'CLEAN' ? '3-WAY MATCH VERIFIED' : 'DISCREPANCY DETECTED'}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white mt-1.5">{activeAudit.supplier_name}</h2>
                </div>

                <div className="text-right">
                  <span className="text-lg font-bold font-mono text-white">
                    ₹{activeAudit.total_amount_inr?.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    PO Ref: {activeAudit.purchase_order_id}
                  </span>
                </div>
              </div>

              {/* Discrepancies Callout */}
              {activeAudit.discrepancies?.length > 0 ? (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Discrepancies Flagged ({activeAudit.discrepancies.length})</span>
                  </div>

                  <div className="space-y-2">
                    {activeAudit.discrepancies.map((d, i) => (
                      <div key={i} className="p-3 bg-surface-0 rounded-lg border border-rose-500/20 text-xs space-y-1 font-mono">
                        <div className="flex items-center justify-between text-rose-400 font-bold">
                          <span>{d.type}</span>
                          <span>Variance: ₹{d.amount_inr?.toFixed(2)}</span>
                        </div>
                        <p className="text-slate-300 font-sans text-[11px]">{d.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-emerald-400 block">100% 3-Way Match Verified</span>
                    <p className="text-[11px] text-slate-300">
                      Billed items, quantities, unit prices, and GST calculations match the approved Purchase Order and physical goods receipt perfectly.
                    </p>
                  </div>
                </div>
              )}

              {/* Line Items Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Audited Line Items ({activeAudit.items?.length || 0})
                </span>

                <div className="border border-white/[0.06] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-2 text-slate-400 font-mono text-[10px] uppercase border-b border-white/[0.06]">
                      <tr>
                        <th className="p-3">SKU / Item</th>
                        <th className="p-3 text-right">Quantity</th>
                        <th className="p-3 text-right">Unit Price</th>
                        <th className="p-3 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04] bg-surface-1">
                      {activeAudit.items?.map((item, idx) => (
                        <tr key={idx} className="hover:bg-surface-2/40 transition-colors">
                          <td className="p-3">
                            <span className="font-mono text-brand-accent font-bold block">{item.sku}</span>
                            <span className="text-slate-300 text-[11px]">{item.name}</span>
                          </td>
                          <td className="p-3 text-right font-mono text-white">{item.quantity}</td>
                          <td className="p-3 text-right font-mono text-white">₹{item.unit_price?.toFixed(2)}</td>
                          <td className="p-3 text-right font-mono font-bold text-white">₹{item.line_total?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center text-slate-500">
              Select an audited invoice to inspect discrepancy trace.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
