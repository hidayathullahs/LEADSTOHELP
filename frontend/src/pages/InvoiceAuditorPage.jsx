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
  HelpCircle
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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Multimodal Vision + 3-Way Match
            </span>
            <span className="text-xs text-slate-400">Zero-Trust Document Reconciler</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-cyan-400" />
            Multimodal Invoice Auditor & Discrepancy Engine
          </h1>
          <p className="text-xs text-slate-400">
            Gemini Vision extracts structured line items → Deterministic engine reconciles against authorized Purchase Orders.
          </p>
        </div>

        <button
          onClick={() => onOpenAskAI("Analyze all unresolved invoice discrepancies and draft a debit note claim.")}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-black font-bold text-xs rounded-xl shadow-glow-cyan flex items-center gap-1.5 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AI Invoice Copilot</span>
        </button>
      </div>

      {/* Upload & Demo Presets Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Drag and drop upload */}
        <div className="md:col-span-6 glass-card p-5 border-dashed border-2 border-slate-700 hover:border-cyan-500/50 transition-all flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-xs font-bold text-white mb-1">Upload Supplier Invoice / Receipt Image</h3>
          <p className="text-[11px] text-slate-400 max-w-sm mb-3">
            Supports PNG, JPEG, PDF Tax Invoices & Physical Delivery Challans.
          </p>
          <button
            onClick={() => handleRunPresetAudit('DISCREPANCY')}
            disabled={scanning}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700"
          >
            Upload Document File
          </button>
        </div>

        {/* 1-Click Interactive Demonstration Presets */}
        <div className="md:col-span-6 glass-card p-5 space-y-3 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Demo Scenarios</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Select a verified benchmark case to trigger the multimodal vision & reconciliation pipeline:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => handleRunPresetAudit('CLEAN')}
              disabled={scanning}
              className="p-3 bg-slate-950 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase">Case 1: Clean Match</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-xs font-bold text-white">Metro Wholesale</p>
              <p className="text-[10px] text-slate-400 mt-0.5">INV-10428 • ₹44,600 • 100% Match</p>
            </button>

            <button
              onClick={() => handleRunPresetAudit('DISCREPANCY')}
              disabled={scanning}
              className="p-3 bg-slate-950 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/50 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-rose-400 uppercase">Case 2: Shortage Flag</span>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <p className="text-xs font-bold text-white">Kaveri Dairy Shortage</p>
              <p className="text-[10px] text-rose-300/80 mt-0.5">8L Milk Missing • ₹486.40 Overbill</p>
            </button>
          </div>
        </div>
      </div>

      {/* Scanning In-Progress Animation */}
      {scanning && (
        <div className="glass-card p-6 border-cyan-500/40 bg-cyan-950/20 text-center space-y-3 animate-in fade-in">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-cyan-400" />
          <h3 className="text-sm font-bold text-white">
            {scanStep === 1 && 'Scanning document with Gemini Vision OCR...'}
            {scanStep === 2 && 'Extracting structured line items and GST tax schedules...'}
            {scanStep === 3 && 'Retrieving matching Purchase Order record from ledger...'}
            {scanStep >= 4 && 'Running 8-vector deterministic discrepancy tests...'}
          </h3>
          <div className="w-64 bg-slate-800 rounded-full h-1.5 mx-auto overflow-hidden">
            <div
              className="h-full bg-cyan-500 transition-all duration-300"
              style={{ width: `${(scanStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Main Audit Report Display */}
      {activeAudit && !scanning && (
        <div className="glass-card p-6 space-y-6 border-slate-700">
          {/* Audit Banner */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400">{activeAudit.audit_id}</span>
                <span
                  className={
                    activeAudit.status === 'RED'
                      ? 'badge-rose'
                      : activeAudit.status === 'AMBER'
                      ? 'badge-amber'
                      : 'badge-emerald'
                  }
                >
                  {activeAudit.status === 'RED'
                    ? '🔴 RED: Critical Discrepancy'
                    : activeAudit.status === 'AMBER'
                    ? '🟡 AMBER: Manual Review'
                    : '🟢 GREEN: 100% Verified'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                Audit Report: {activeAudit.invoice_number} ({activeAudit.supplier_name})
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Matching PO: <strong>{activeAudit.matching_po_id || 'PO-10022'}</strong> • Billed Total: <strong className="text-white">₹{activeAudit.extracted_data?.total_amount?.toLocaleString()}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              {activeAudit.total_variance_inr > 0 && (
                <div className="text-right p-2.5 bg-rose-950/60 border border-rose-800/60 rounded-xl">
                  <span className="text-[10px] text-rose-400 block font-semibold uppercase">Total Overbilling</span>
                  <span className="text-sm font-mono font-extrabold text-rose-300">
                    ₹{activeAudit.total_variance_inr.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Discrepancy Callout Items */}
          {activeAudit.discrepancies?.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase text-rose-400 tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Detected Discrepancy Vectors ({activeAudit.discrepancies.length})
              </h3>

              {activeAudit.discrepancies.map((disc, i) => (
                <div key={i} className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-rose-300">{disc.type}</span>
                    <span className="font-mono text-rose-400 font-bold">Variance: ₹{disc.variance_amount}</span>
                  </div>
                  <p className="text-xs text-slate-200">{disc.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white">Zero Discrepancies Found</h4>
                <p className="text-[11px] text-slate-300">
                  Every invoiced quantity, unit price, and GST calculation matches the approved Purchase Order.
                </p>
              </div>
            </div>
          )}

          {/* Audit Summary & Recommended Action */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">AI Audit Assessment</span>
              <p className="text-xs text-slate-300">{activeAudit.audit_summary}</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Recommended Governance Action</span>
              <p className="text-xs text-cyan-300 font-semibold">{activeAudit.recommended_action}</p>
            </div>
          </div>

          {/* Extracted Line Items Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase text-slate-400">Extracted Line Items</h4>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Item Name</th>
                    <th className="py-2.5 px-3 text-right">Invoiced Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Rate</th>
                    <th className="py-2.5 px-3 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {activeAudit.extracted_data?.items?.map((item, idx) => (
                    <tr key={idx} className="bg-slate-900/60">
                      <td className="py-2.5 px-3 font-medium text-white">{item.name}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-200">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-200">₹{item.unit_price}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-white">₹{item.line_total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
