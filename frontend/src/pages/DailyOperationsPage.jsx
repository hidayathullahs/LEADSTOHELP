import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ShieldCheck,
  Package,
  FileCheck,
  ShoppingCart,
  CheckSquare,
  RotateCcw,
  ArrowRight,
  Sliders,
  Play,
  Zap,
  Coffee,
  Calendar,
  Lock,
  Search
} from 'lucide-react';
import { api } from '../services/api';

export default function DailyOperationsPage({
  onNavigateTo,
  onOpenAskAI,
  overviewData
}) {
  const [isRunningChecks, setIsRunningChecks] = useState(false);
  const [checksCompleted, setChecksCompleted] = useState(false);
  const [completedAutomations, setCompletedAutomations] = useState({});

  const handleRunAllSafeChecks = async () => {
    setIsRunningChecks(true);
    // Simulate real diagnostic sweep
    setTimeout(() => {
      setIsRunningChecks(false);
      setChecksCompleted(true);
      setCompletedAutomations({
        inventory: '65 SKUs evaluated • 1 Critical Alert identified (COFFEE-001)',
        suppliers: '10 Vetted partners monitored • Average SLA reliability 88.0%',
        invoices: '8 Invoices reconciled • 1 Discrepancy flagged (Kaveri Dairy 8L)',
        governance: '1 Proposed action staged in Human Approval Queue'
      });
    }, 900);
  };

  const handleRunSingleAutomation = (key, name) => {
    setCompletedAutomations((prev) => ({
      ...prev,
      [key]: `Completed at ${new Date().toLocaleTimeString()} — Status: Nominal.`
    }));
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Morning Briefing */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-violet text-[10px] uppercase font-bold">
              Track 3 • Daily Operations & Productivity Hub
            </span>
            <span className="text-xs text-slate-400">Deccan Roast Specialty Hub • Bangalore</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            <Activity className="w-5 h-5 text-brand-accent" />
            Good Morning, Arjun — Today's Operational Priorities
          </h1>
          <p className="text-xs text-slate-400">
            Autonomous daily briefings, automated read-only health checks, and human-in-the-loop task orchestration.
          </p>
        </div>

        {/* Global Task Triggers */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRunAllSafeChecks}
            disabled={isRunningChecks}
            className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
          >
            {isRunningChecks ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin text-black" />
                <span>Running Diagnostic Sweep...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-black fill-black" />
                <span>Run All Safe Checks</span>
              </>
            )}
          </button>

          <button
            onClick={() => onOpenAskAI("Provide today's morning operational risk briefing for Deccan Roast.")}
            className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            <span>Start AI Morning Brief</span>
          </button>
        </div>
      </div>

      {/* AI Daily Priorities Ribbon (The 3 Critical Tasks) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            AI-Prioritized Daily Action Queue (3 High-Impact Items)
          </h2>
          <span className="text-[10px] text-slate-500 font-mono">Ranked by Operational Urgency</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Priority 1: Arabica Stockout Prevention */}
          <div className="glass-card p-4 border-rose-500/30 bg-surface-1 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="badge-rose text-[9px]">
                  Priority 1 • Immediate Risk
                </span>
                <span className="text-[10px] font-mono text-rose-400 font-bold">2.8 Days Left</span>
              </div>
              <h3 className="text-sm font-bold text-white">Prevent Arabica Coffee Stockout</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Stock is at 36kg with 13kg/day run-rate. Split-order PO staged to secure 100kg before Friday peak rush.
              </p>
            </div>
            <button
              onClick={() => onNavigateTo('procurement')}
              className="btn-primary text-xs py-1.5 w-full flex items-center justify-center gap-1.5"
            >
              <span>Review Split-Order PO</span>
              <ArrowRight className="w-3 h-3 text-black" />
            </button>
          </div>

          {/* Priority 2: Kaveri Dairy Invoice Shortage */}
          <div className="glass-card p-4 border-amber-500/30 bg-surface-1 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="badge-amber text-[9px]">
                  Priority 2 • Financial Audit
                </span>
                <span className="text-[10px] font-mono text-amber-300 font-bold">₹486.40 Leakage</span>
              </div>
              <h3 className="text-sm font-bold text-white">Resolve Kaveri Dairy Shortage</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Invoice INV-KAV-8842 billed 100L but only 92L verified received at store loading bay. Debit note staged.
              </p>
            </div>
            <button
              onClick={() => onNavigateTo('invoices')}
              className="btn-secondary text-xs py-1.5 w-full flex items-center justify-center gap-1.5"
            >
              <span>Inspect & Dispute Invoice</span>
              <ArrowRight className="w-3 h-3 text-slate-300" />
            </button>
          </div>

          {/* Priority 3: Human Governance Sign-Off */}
          <div className="glass-card p-4 border-emerald-500/30 bg-surface-1 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="badge-emerald text-[9px]">
                  Priority 3 • Human Sign-off
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">1 In Queue</span>
              </div>
              <h3 className="text-sm font-bold text-white">Authorize Replenishment Order</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                ₹86,328 split-order commitment requires operator sign-off to transmit POs to Metro and Malnad suppliers.
              </p>
            </div>
            <button
              onClick={() => onNavigateTo('approvals')}
              className="btn-success text-xs py-1.5 w-full flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3 h-3 text-black" />
              <span>Authorize in Approval Queue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Safe Automated Workflows & Health Sweeps */}
      <div className="glass-card p-5 bg-surface-1 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.06] pb-3 gap-2">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Daily Operational Automation Sweeps (Read-Only & Governed)
            </h2>
            <p className="text-xs text-slate-400">
              Autonomous agents execute continuous background monitoring without modifying financial state.
            </p>
          </div>
          {checksCompleted && (
            <span className="badge-emerald text-xs">
              All 4 Checks Completed
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Automation 1 */}
          <div className="p-3.5 bg-surface-2 rounded-xl border border-white/[0.04] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white">Morning Risk Scan</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <p className="text-[11px] text-slate-400">
              {completedAutomations.inventory || 'Continuous scan of 65 raw material safety thresholds.'}
            </p>
            <button
              onClick={() => handleRunSingleAutomation('inventory', 'Morning Risk Scan')}
              className="text-[11px] text-brand-accent hover:underline font-semibold flex items-center gap-1 pt-1"
            >
              <Play className="w-3 h-3" /> Run Scan Now
            </button>
          </div>

          {/* Automation 2 */}
          <div className="p-3.5 bg-surface-2 rounded-xl border border-white/[0.04] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white">Supplier SLA Tracker</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <p className="text-[11px] text-slate-400">
              {completedAutomations.suppliers || 'Tracks on-time delivery rates across 10 active vendors.'}
            </p>
            <button
              onClick={() => handleRunSingleAutomation('suppliers', 'Supplier SLA Tracker')}
              className="text-[11px] text-brand-accent hover:underline font-semibold flex items-center gap-1 pt-1"
            >
              <Play className="w-3 h-3" /> Run Tracker Now
            </button>
          </div>

          {/* Automation 3 */}
          <div className="p-3.5 bg-surface-2 rounded-xl border border-white/[0.04] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white">3-Way Invoice Reconciler</span>
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            </div>
            <p className="text-[11px] text-slate-400">
              {completedAutomations.invoices || 'OCR audits incoming delivery challans against PO line items.'}
            </p>
            <button
              onClick={() => handleRunSingleAutomation('invoices', '3-Way Invoice Reconciler')}
              className="text-[11px] text-brand-accent hover:underline font-semibold flex items-center gap-1 pt-1"
            >
              <Play className="w-3 h-3" /> Run Reconciler Now
            </button>
          </div>

          {/* Automation 4 */}
          <div className="p-3.5 bg-surface-2 rounded-xl border border-white/[0.04] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white">Governance Shield</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <p className="text-[11px] text-slate-400">
              {completedAutomations.governance || 'Enforces zero autonomous financial commitments without sign-off.'}
            </p>
            <button
              onClick={() => handleRunSingleAutomation('governance', 'Governance Shield')}
              className="text-[11px] text-brand-accent hover:underline font-semibold flex items-center gap-1 pt-1"
            >
              <Play className="w-3 h-3" /> Verify Shield
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
