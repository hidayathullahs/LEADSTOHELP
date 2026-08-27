import React from 'react';
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
  Target
} from 'lucide-react';

export default function AnalyticsPage({ onOpenAskAI }) {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              Operational ROI
            </span>
            <span className="text-xs text-slate-400">Section 55 • Benchmark Verification</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Business Impact & Operational Metrics
          </h1>
          <p className="text-xs text-slate-400">
            Application-measured efficiency gains, invoice shortage recoveries, and closed-loop turnaround benchmarks.
          </p>
        </div>

        {/* Benchmark Label */}
        <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-400">
          STATUS: <strong className="text-white">DEMO / SYNTHETIC BENCHMARK</strong>
        </div>
      </div>

      {/* 4 Big Impact Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-emerald-500/30 bg-emerald-950/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Simulated Savings</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-400">
            ₹1,48,500
          </div>
          <p className="text-[11px] text-slate-300 mt-2">
            Via volume tiering & Split-Order strategy optimizations.
          </p>
        </div>

        <div className="glass-card p-5 border-cyan-500/30 bg-cyan-950/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Time to Prepare Proposal</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-cyan-300">
            3.4 seconds
          </div>
          <p className="text-[11px] text-slate-300 mt-2">
            Down from ~2.5 hours of manual supplier spreadsheet comparison.
          </p>
        </div>

        <div className="glass-card p-5 border-rose-500/30 bg-rose-950/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Billing Discrepancies Caught</span>
            <FileCheck className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-rose-400">
            ₹52,480
          </div>
          <p className="text-[11px] text-slate-300 mt-2">
            Physical shortages & unit price inflation auto-flagged.
          </p>
        </div>

        <div className="glass-card p-5 border-indigo-500/30 bg-indigo-950/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Manual Steps Reduced</span>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-indigo-300">
            87%
          </div>
          <p className="text-[11px] text-slate-300 mt-2">
            Closed-loop detection through fulfillment verification.
          </p>
        </div>
      </div>

      {/* Comparison Grid: Manual Operations vs. LEADSTOHELP AI */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Operational Transformation: Manual Spreadsheets vs. LEADSTOHELP AI
        </h3>

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
                <td className="py-3 px-4 text-cyan-300 font-semibold">Multi-supplier scenario simulator (Single vs Split-order optimization)</td>
              </tr>
              <tr className="bg-slate-900/60">
                <td className="py-3 px-4 font-bold text-white">Invoice Auditing</td>
                <td className="py-3 px-4 text-slate-400">Paper bills piled on desk; paid blindly by accounts weekly</td>
                <td className="py-3 px-4 text-rose-300 font-semibold">Gemini Vision multimodal extraction + 3-way matching against PO</td>
              </tr>
              <tr className="bg-slate-900/60">
                <td className="py-3 px-4 font-bold text-white">Supplier Failure Recovery</td>
                <td className="py-3 px-4 text-slate-400">Store runs out of coffee beans; lost sales and angry customers</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">Autonomous resilience trigger re-routes order to backup vendor with approval</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
