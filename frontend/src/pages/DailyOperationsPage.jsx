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
  Search,
  Eye,
  Check
} from 'lucide-react';
import { useToast } from '../components/ToastContext';

export default function DailyOperationsPage({
  onNavigateTo,
  onOpenAskAI,
  overviewData,
  onOpenProcurement
}) {
  const [isRunningChecks, setIsRunningChecks] = useState(false);
  const [checksCompleted, setChecksCompleted] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({});
  const { addToast } = useToast();

  const handleRunAllSafeChecks = async () => {
    setIsRunningChecks(true);
    setTimeout(() => {
      setIsRunningChecks(false);
      setChecksCompleted(true);
      addToast({
        title: 'Diagnostic Sweep Completed',
        message: '65 SKUs and 5 suppliers evaluated. 1 Critical Alert, 1 Invoice Discrepancy flagged.',
        type: 'success'
      });
    }, 700);
  };

  const handleToggleTask = (taskId, taskTitle) => {
    setCompletedTasks(prev => {
      const nextState = !prev[taskId];
      if (nextState) {
        addToast({
          title: 'Task Completed',
          message: `${taskTitle} marked as completed for today.`,
          type: 'info'
        });
      }
      return { ...prev, [taskId]: nextState };
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header & Morning Briefing */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-teal text-[10px] uppercase font-bold font-mono">
              Daily Operations Workspace
            </span>
            <span className="text-xs text-slate-400">Deccan Roast Specialty Hub • Bangalore</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            <Activity className="w-5 h-5 text-brand-accent shrink-0" />
            Good Morning, Arjun — Today's Operational Work Queue
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            AI daily briefings, automated read-only health checks, and task orchestration for store operations.
          </p>
        </div>

        {/* Global Action Triggers */}
        <div className="flex flex-wrap items-center gap-2">
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
            <span>Copilot Daily Brief</span>
          </button>
        </div>
      </div>

      {/* AI Morning Brief Box */}
      <div className="glass-card p-5 border-brand-accent/30 bg-gradient-to-r from-surface-1 via-surface-1 to-surface-2 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-accent" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              AI Morning Operational Brief
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Refreshed 5m ago</span>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed">
          Deccan Roast Hub #BLR-01 is operating with <strong>65 monitored SKUs</strong>. Today's primary focus is resolving the <strong>Arabica beans stockout window (~2.8 days runway)</strong> and reviewing the <strong>Kaveri Dairy 8L invoice shortage</strong> before afternoon barista shifts.
        </p>

        {/* 3 Top Priorities */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="p-3 rounded-xl bg-surface-2/70 border border-rose-500/20 space-y-1">
            <span className="text-[10px] font-mono text-rose-400 font-bold block">PRIORITY 1</span>
            <h4 className="text-xs font-bold text-white">Prevent Arabica Stockout</h4>
            <p className="text-[11px] text-slate-300">36kg stock remaining vs 13kg/d velocity. Split-order PO recommended.</p>
          </div>

          <div className="p-3 rounded-xl bg-surface-2/70 border border-amber-500/20 space-y-1">
            <span className="text-[10px] font-mono text-amber-300 font-bold block">PRIORITY 2</span>
            <h4 className="text-xs font-bold text-white">Resolve Kaveri 8L Shortage</h4>
            <p className="text-[11px] text-slate-300">Invoiced 20L vs 12L received. Issue ₹486.40 debit note.</p>
          </div>

          <div className="p-3 rounded-xl bg-surface-2/70 border border-emerald-500/20 space-y-1">
            <span className="text-[10px] font-mono text-emerald-400 font-bold block">PRIORITY 3</span>
            <h4 className="text-xs font-bold text-white">Sign Off Approval Queue</h4>
            <p className="text-[11px] text-slate-300">1 high-impact PO (₹86,328) ready for human governance.</p>
          </div>
        </div>
      </div>

      {/* Two-Column Layout: Task Queue & Safe Automations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Operational Task Work Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Today's Action Queue
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {Object.values(completedTasks).filter(Boolean).length} of 4 Completed
            </span>
          </div>

          {/* Task 1: Arabica Crisis (Critical) */}
          <div className={`p-4 rounded-2xl border transition-all ${
            completedTasks['task-1']
              ? 'bg-surface-2/40 border-white/[0.04] opacity-60'
              : 'bg-surface-1 border-rose-500/30 shadow-lg'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={!!completedTasks['task-1']}
                  onChange={() => handleToggleTask('task-1', 'Arabica Replenishment')}
                  className="mt-1 rounded bg-surface-2 border-white/[0.2] text-brand-accent focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge-rose text-[9px] font-mono font-bold">CRITICAL</span>
                    <h4 className={`text-xs font-bold ${completedTasks['task-1'] ? 'line-through text-slate-400' : 'text-white'}`}>
                      Review & Submit Arabica Split-Order Replenishment
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    COFFEE-001 has ~2.8 days of safety stock left. Review 70kg Malnad + 30kg Metro scenario.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onOpenProcurement ? onOpenProcurement('COFFEE-001') : onNavigateTo('procurement')}
                className="btn-primary text-[11px] py-1.5 px-3 shrink-0 flex items-center gap-1"
              >
                <span>Review PO</span>
                <ArrowRight className="w-3 h-3 text-black" />
              </button>
            </div>
          </div>

          {/* Task 2: Kaveri Invoice Variance (Action Required) */}
          <div className={`p-4 rounded-2xl border transition-all ${
            completedTasks['task-2']
              ? 'bg-surface-2/40 border-white/[0.04] opacity-60'
              : 'bg-surface-1 border-amber-500/30 shadow-lg'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={!!completedTasks['task-2']}
                  onChange={() => handleToggleTask('task-2', 'Kaveri Invoice Audit')}
                  className="mt-1 rounded bg-surface-2 border-white/[0.2] text-brand-accent focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge-amber text-[9px] font-mono font-bold">ACTION REQUIRED</span>
                    <h4 className={`text-xs font-bold ${completedTasks['task-2'] ? 'line-through text-slate-400' : 'text-white'}`}>
                      Resolve Kaveri Organic Dairy 8L Shortage Variance
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Invoice INV-2026-0841 billed 20L Barista Milk vs 12L physically received. Generate ₹486.40 debit note.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTo('invoices')}
                className="btn-secondary text-[11px] py-1.5 px-3 shrink-0 flex items-center gap-1"
              >
                <span>Audit Invoice</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Task 3: Authorize Approval Queue */}
          <div className={`p-4 rounded-2xl border transition-all ${
            completedTasks['task-3']
              ? 'bg-surface-2/40 border-white/[0.04] opacity-60'
              : 'bg-surface-1 border-white/[0.08]'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={!!completedTasks['task-3']}
                  onChange={() => handleToggleTask('task-3', 'Approval Queue Sign-off')}
                  className="mt-1 rounded bg-surface-2 border-white/[0.2] text-brand-accent focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge-teal text-[9px] font-mono font-bold">DUE TODAY</span>
                    <h4 className={`text-xs font-bold ${completedTasks['task-3'] ? 'line-through text-slate-400' : 'text-white'}`}>
                      Sign Off Purchase Order PO-2026-0884 (₹86,328)
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Human governance gate sign-off for Arabica beans order commitment.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTo('approvals')}
                className="btn-secondary text-[11px] py-1.5 px-3 shrink-0 flex items-center gap-1"
              >
                <span>Open Queue</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Task 4: Eco Cups Stock Buffer Check */}
          <div className={`p-4 rounded-2xl border transition-all ${
            completedTasks['task-4']
              ? 'bg-surface-2/40 border-white/[0.04] opacity-60'
              : 'bg-surface-1 border-white/[0.08]'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={!!completedTasks['task-4']}
                  onChange={() => handleToggleTask('task-4', 'Eco Cups Buffer Audit')}
                  className="mt-1 rounded bg-surface-2 border-white/[0.2] text-brand-accent focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge-neutral text-[9px] font-mono font-bold">ROUTINE</span>
                    <h4 className={`text-xs font-bold ${completedTasks['task-4'] ? 'line-through text-slate-400' : 'text-white'}`}>
                      Audit 12oz Eco Kraft Cups Buffer (PACK-001)
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Verify physical count matches system level (1,200 units on hand, 8.5d buffer).
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTo('inventory')}
                className="btn-secondary text-[11px] py-1.5 px-3 shrink-0 flex items-center gap-1"
              >
                <span>Check Inventory</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Right (1 col): Safe Operations & Diagnostic Status */}
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Safe Operations
              </h3>
            </div>
            <span className="badge-emerald text-[10px] font-mono">100% Read-Only</span>
          </div>

          <p className="text-[11px] text-slate-300 leading-snug">
            Automated diagnostic scans run continuously without committing spend or modifying external orders.
          </p>

          {/* Safe Check Items */}
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-surface-2/60 border border-white/[0.04] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-brand-accent" />
                <span className="text-slate-200">Inventory Health Check</span>
              </div>
              <span className="badge-emerald text-[9px] font-mono">PASSED</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-2/60 border border-white/[0.04] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-brand-accent" />
                <span className="text-slate-200">Supplier Reliability Scan</span>
              </div>
              <span className="badge-emerald text-[9px] font-mono">PASSED</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-2/60 border border-white/[0.04] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-200">Invoice 3-Way Match</span>
              </div>
              <span className="badge-amber text-[9px] font-mono">1 VARIANCE</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-2/60 border border-white/[0.04] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-200">RBAC Governance Rules</span>
              </div>
              <span className="badge-emerald text-[9px] font-mono">ENFORCED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
