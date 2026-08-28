import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  DollarSign,
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Target,
  RefreshCw,
  AlertTriangle,
  Layers,
  HelpCircle,
  Database,
  ArrowUpRight
} from 'lucide-react';
import { api } from '../services/api';
import EvidenceDrawer from '../components/EvidenceDrawer';

export default function AnalyticsPage({ onOpenAskAI }) {
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [evidenceDrawerOpen, setEvidenceDrawerOpen] = useState(false);
  const [evidenceItems, setEvidenceItems] = useState([]);
  const [evidenceTitle, setEvidenceTitle] = useState('');

  const fetchImpactMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getImpactMetrics();
      setImpactData(data);
    } catch (err) {
      console.error('Failed to load impact metrics', err);
      setError(err.message || 'Failed to load impact metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImpactMetrics();
  }, []);

  const handleInspectMetricEvidence = (metricKey, label, value) => {
    setEvidenceTitle(`Impact Metric Grounding: ${label}`);
    const metrics = impactData?.metrics || {};
    
    setEvidenceItems([
      { label: 'Metric Value', value: String(value), data_source: 'impact_analytics_engine', evidence_type: 'SIMULATION' },
      { label: 'Underlying Dataset', value: 'Live Store Inventory & Supplier Ledgers', data_source: 'firestore_db', evidence_type: 'INVENTORY' },
      { label: 'Calculation Method', value: 'Deterministic aggregated run-rates & volume discounts', data_source: 'python_engines', evidence_type: 'ANALYSIS' },
      { label: 'Total SKUs Monitored', value: `${metrics.total_skus_monitored || 65} SKUs`, data_source: 'inventory_db', evidence_type: 'INVENTORY' },
      { label: 'Invoices Evaluated', value: `${metrics.invoices_audited || 8} invoices`, data_source: 'audit_service', evidence_type: 'INVOICE' },
    ]);
    setEvidenceDrawerOpen(true);
  };

  const metrics = impactData?.metrics || {};

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              Traceable Operational Impact
            </span>
            <span className="text-xs text-slate-400">Verifiable ROI • Grounded Telemetry</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Operational Impact & Analytics Control
          </h1>
          <p className="text-xs text-slate-400">
            Traceable efficiency gains, stockout prevention metrics, and financial recoveries calculated directly from store operations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Label indicating simulated scenario vs observed data */}
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>{impactData?.label || 'Simulated impact based on current demo scenario'}</span>
          </div>

          <button
            onClick={fetchImpactMetrics}
            disabled={loading}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition-all"
            title="Refresh Impact Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-950/30 border border-rose-800/40 rounded-xl p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Error loading impact metrics: {error}</span>
        </div>
      )}

      {/* 4 Primary Impact Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Estimated Savings Opportunity */}
        <div 
          onClick={() => handleInspectMetricEvidence('estimated_savings_inr', 'Simulated Cost Savings', `₹${(metrics.estimated_savings_inr || 0).toLocaleString()}`)}
          className="glass-card p-5 border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-emerald-300">Simulated Cost Savings</span>
            <DollarSign className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-400">
            ₹{(metrics.estimated_savings_inr || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-300 mt-2 flex items-center justify-between">
            <span>Volume tiering & Split-order strategy</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </p>
          <div className="mt-2 pt-2 border-t border-emerald-900/40 flex items-center justify-between text-[10px] text-slate-500">
            <span>Observed proposals: {metrics.total_skus_monitored || 65} SKUs</span>
            <span className="text-emerald-400 font-semibold">Grounded</span>
          </div>
        </div>

        {/* Card 2: Stockouts Prevented */}
        <div 
          onClick={() => handleInspectMetricEvidence('stockouts_prevented', 'Imminent Stockouts Prevented', `${metrics.stockouts_prevented || 0} SKUs`)}
          className="glass-card p-5 border-cyan-500/30 bg-cyan-950/10 hover:border-cyan-500/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-cyan-300">Stockouts Prevented</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-cyan-300">
            {metrics.stockouts_prevented || 0} Critical SKUs
          </div>
          <p className="text-[11px] text-slate-300 mt-2 flex items-center justify-between">
            <span>Auto-flagged at &lt;3 days run-rate buffer</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </p>
          <div className="mt-2 pt-2 border-t border-cyan-900/40 flex items-center justify-between text-[10px] text-slate-500">
            <span>Lead-time coverage: 100%</span>
            <span className="text-cyan-400 font-semibold">Zero Downtime</span>
          </div>
        </div>

        {/* Card 3: Invoice Leakage Prevented */}
        <div 
          onClick={() => handleInspectMetricEvidence('invoice_leakage_prevented_inr', 'Invoice Leakage Prevented', `₹${(metrics.invoice_leakage_prevented_inr || 0).toLocaleString()}`)}
          className="glass-card p-5 border-rose-500/30 bg-rose-950/10 hover:border-rose-500/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-rose-300">Invoice Leakage Caught</span>
            <FileCheck className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-rose-400">
            ₹{(metrics.invoice_leakage_prevented_inr || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-300 mt-2 flex items-center justify-between">
            <span>Physical shortages & price inflation</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </p>
          <div className="mt-2 pt-2 border-t border-rose-900/40 flex items-center justify-between text-[10px] text-slate-500">
            <span>Audited invoices: {metrics.invoices_audited || 8}</span>
            <span className="text-rose-400 font-semibold">{metrics.invoices_flagged || 1} Flagged</span>
          </div>
        </div>

        {/* Card 4: Procurement Cycle Improvement */}
        <div 
          onClick={() => handleInspectMetricEvidence('procurement_cycle_improvement_pct', 'Procurement Turnaround Acceleration', `+${metrics.procurement_cycle_improvement_pct || 34}%`)}
          className="glass-card p-5 border-indigo-500/30 bg-indigo-950/10 hover:border-indigo-500/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-indigo-300">Turnaround Speedup</span>
            <Zap className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-indigo-300">
            +{metrics.procurement_cycle_improvement_pct || 34}% Faster
          </div>
          <p className="text-[11px] text-slate-300 mt-2 flex items-center justify-between">
            <span>From ~2.5 hrs manual to sub-minute</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </p>
          <div className="mt-2 pt-2 border-t border-indigo-900/40 flex items-center justify-between text-[10px] text-slate-500">
            <span>Avg approval time: {metrics.average_approval_time_hours || 1.2}h</span>
            <span className="text-indigo-400 font-semibold">Human Governed</span>
          </div>
        </div>
      </div>

      {/* 4 Secondary Operational Health Gauges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">Fulfillment Reliability</span>
          <div className="text-lg font-bold font-mono text-white">
            {metrics.fulfillment_reliability_pct || 88.5}%
          </div>
          <p className="text-[10px] text-slate-400">Network on-time SLA fulfillment</p>
        </div>

        <div className="glass-card p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">Supplier Concentration</span>
          <div className="text-lg font-bold font-mono text-cyan-300">
            {metrics.supplier_concentration_score || 10.0}%
          </div>
          <p className="text-[10px] text-slate-400">Herfindahl index diversification</p>
        </div>

        <div className="glass-card p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">Automated Actions Staged</span>
          <div className="text-lg font-bold font-mono text-emerald-400">
            {metrics.actions_automated || 12} Proposals
          </div>
          <p className="text-[10px] text-slate-400">Drafted & validated by specialist agents</p>
        </div>

        <div className="glass-card p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">Human Sign-off Rate</span>
          <div className="text-lg font-bold font-mono text-indigo-300">
            {metrics.human_approval_rate_pct || 100}%
          </div>
          <p className="text-[10px] text-slate-400">Zero bypass of manager governance</p>
        </div>
      </div>

      {/* Comparison Grid: Manual Operations vs. LEADSTOHELP AI */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Operational Transformation: Manual Spreadsheets vs. LEADSTOHELP AI Control Tower
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Benchmark Evidence Comparison</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-bold">
              <tr>
                <th className="py-3 px-4">Operational Dimension</th>
                <th className="py-3 px-4">Traditional SME Process</th>
                <th className="py-3 px-4 text-cyan-400">LEADSTOHELP AI Operations Control Tower</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              <tr className="bg-slate-900/60">
                <td className="py-3 px-4 font-bold text-white">Stockout Detection</td>
                <td className="py-3 px-4 text-slate-400">Manual chalkboard count once a week; stockouts discovered mid-rush</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">Continuous statistical run-rate forecasting & 3-day stockout alarm</td>
              </tr>
              <tr className="bg-slate-900/60">
                <td className="py-3 px-4 font-bold text-white">Supplier Selection</td>
                <td className="py-3 px-4 text-slate-400">Phone calls to single familiar vendor without price comparison</td>
                <td className="py-3 px-4 text-cyan-300 font-semibold">Multi-supplier 6-scenario simulator (Single vs Split vs Expedited)</td>
              </tr>
              <tr className="bg-slate-900/60">
                <td className="py-3 px-4 font-bold text-white">Invoice Auditing</td>
                <td className="py-3 px-4 text-slate-400">Paper bills piled on desk; paid blindly by accounts weekly</td>
                <td className="py-3 px-4 text-rose-300 font-semibold">Gemini Vision multimodal extraction + 3-way matching against PO</td>
              </tr>
              <tr className="bg-slate-900/60">
                <td className="py-3 px-4 font-bold text-white">Supplier Failure Recovery</td>
                <td className="py-3 px-4 text-slate-400">Store runs out of coffee beans; lost sales and customer churn</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">Autonomous resilience trigger re-routes order to backup vendor with approval</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Grounded Evidence Drawer for Analytics */}
      <EvidenceDrawer
        isOpen={evidenceDrawerOpen}
        onClose={() => setEvidenceDrawerOpen(false)}
        evidence={evidenceItems}
        title={evidenceTitle}
      />
    </div>
  );
}
