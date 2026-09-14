import React, { useState, useEffect } from 'react';
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
  Check,
  Filter,
  Users,
  Receipt,
  FileText,
  TrendingDown,
  Layers,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { useToast } from '../components/ToastContext';

// Canonical Deterministic Daily Operations State
const INITIAL_TASKS = [
  {
    id: 'task-arabica',
    priority: 'CRITICAL',
    title: 'Prevent COFFEE-001 Stockout',
    asset: 'Specialty Arabica Beans (AAA Grade)',
    sku: 'COFFEE-001',
    reason: '2.77 days runway remaining at 13.0 kg/day burn rate',
    aiPrep: '70kg Malnad + 30kg Metro Split-Order replenishment PO prepared',
    owner: 'Arjun Rao (Operations Lead)',
    status: 'AI Prepared',
    due: 'Today (Before 18:00 Rush)',
    actionLabel: 'Review PO',
    category: 'Procurement',
    revenueRisk: '₹14,500/day (48% menu orders)',
    evidenceCount: 8,
    isApprovalReq: true
  },
  {
    id: 'task-kaveri',
    priority: 'HIGH',
    title: 'Review Kaveri Dairy Invoice Variance',
    asset: 'Invoice #KD-8839 (Kaveri Dairy Collective)',
    sku: 'DAIRY-001',
    reason: 'Vision OCR flagged 8L quantity shortage (Billed 20L vs 12L physically received)',
    aiPrep: '₹486.40 debit note drafted & ready for vendor transmission',
    owner: 'Finance / Store Ops',
    status: 'AI Prepared',
    due: 'Today',
    actionLabel: 'Review Audit',
    category: 'Invoice Audit',
    revenueRisk: '₹486.40 overbill',
    evidenceCount: 4,
    isApprovalReq: false
  },
  {
    id: 'task-sla',
    priority: 'MEDIUM',
    title: 'Verify Malnad Planters SLA Reliability',
    asset: 'Malnad Coffee Planters (Vendor #MCP-01)',
    sku: 'COFFEE-001',
    reason: '94% on-time delivery score verified across past 18 dispatches (3-day lead time)',
    aiPrep: 'Supplier reliability scorecard compiled for procurement clearance',
    owner: 'Procurement Lead',
    status: 'AI Prepared',
    due: 'Today',
    actionLabel: 'Review SLA',
    category: 'Supplier Network',
    revenueRisk: 'SLA Buffer Check',
    evidenceCount: 6,
    isApprovalReq: false
  },
  {
    id: 'task-cups',
    priority: 'LOW',
    title: 'Verify Eco Kraft Cups Buffer',
    asset: '12oz Double-Wall Eco Cups',
    sku: 'PACK-001',
    reason: '14.1 days inventory on hand (1,240 units vs 800 safety reorder threshold)',
    aiPrep: 'Stock runway confirmed healthy across next 2 weekend cycles',
    owner: 'Store Team',
    status: 'Healthy',
    due: 'This Week',
    actionLabel: 'Inspect',
    category: 'Inventory',
    revenueRisk: 'No immediate risk',
    evidenceCount: 2,
    isApprovalReq: false
  }
];

const AUTOMATION_TIMELINE = [
  { time: '09:42', type: 'DETECT', title: 'AI detected COFFEE-001 stockout risk', detail: 'On-hand stock fell to 36.0 kg (2.77 days runway at current POS run-rate).' },
  { time: '09:43', type: 'ANALYZE', title: 'Inventory exposure analysis completed', detail: 'Evaluated 48% beverage order dependency; ₹32,400 weekend revenue at risk.' },
  { time: '09:43', type: 'PREPARE', title: 'Procurement recommendation prepared', detail: '6-scenario digital twin generated optimal Split-Order (70kg Malnad + 30kg Metro) saving ₹8,672.' },
  { time: '09:44', type: 'DETECT', title: 'Kaveri invoice discrepancy flagged', detail: 'Vision OCR detected 8L shortage on Invoice #KD-8839 against physical GRN record.' },
  { time: '09:45', type: 'VERIFY', title: 'Supplier SLA & lead times validated', detail: 'Confirmed Malnad Planters 94% on-time SLA and Metro Hub 24h rapid delivery capability.' },
  { time: '09:46', type: 'QUEUE', title: 'Daily operations action queue updated', detail: '3 high-priority operational actions staged for human review.' }
];

export default function DailyOperationsPage({
  overviewData,
  onNavigateTo,
  onOpenAskAI,
  onOpenProcurement,
  onOpenEvidence,
  onOpenRiskDetail,
  onOpenSupplierDetail
}) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [completedTaskIds, setCompletedTaskIds] = useState({});
  const [filterPriority, setFilterPriority] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'
  const [searchQuery, setSearchQuery] = useState('');
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleToggleTaskCompletion = (taskId, taskTitle) => {
    setCompletedTaskIds(prev => {
      const isNowCompleted = !prev[taskId];
      if (isNowCompleted) {
        addToast({
          title: 'Task Marked as Reviewed',
          message: `${taskTitle} completed in today's operations ledger.`,
          type: 'success'
        });
      }
      return { ...prev, [taskId]: isNowCompleted };
    });
  };

  const handleRunDiagnosticSweep = () => {
    setIsDiagnosticRunning(true);
    setTimeout(() => {
      setIsDiagnosticRunning(false);
      setHasError(false);
      addToast({
        title: 'Operations Diagnostic Sweep Complete',
        message: '65 SKUs, 10 suppliers, and 14 invoice manifests scanned. 3 actions prepared.',
        type: 'success'
      });
    }, 600);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesPriority = filterPriority === 'ALL' || task.priority === filterPriority;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const completedCount = Object.values(completedTaskIds).filter(Boolean).length;
  const activePrioritiesCount = tasks.filter(t => t.priority === 'CRITICAL' || t.priority === 'HIGH' || t.priority === 'MEDIUM').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto select-none">
      
      {/* ------------------------------------------------------------------------- */}
      {/* 1. HEADER */}
      {/* ------------------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-white/[0.08] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="badge-teal text-[10px] uppercase font-bold tracking-wider font-mono">
              AI PRODUCTIVITY ENGINE
            </span>
            <span className="text-xs text-slate-400">Deccan Roast Specialty Hub • BLR-01</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Autonomous Triage Active
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            Daily Operations Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
            Turn daily supply-chain signals into prioritized, ready-to-review operational actions.
          </p>
        </div>

        {/* Top-Right Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onOpenAskAI ? onOpenAskAI("Analyze today's prioritized operations and summarize recommended actions.") : null}
            className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5"
            title="Launch Contextual AI Operations Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            <span>Ask Copilot (⌘J)</span>
          </button>

          <button
            onClick={handleRunDiagnosticSweep}
            disabled={isDiagnosticRunning}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-glow-teal font-bold"
          >
            {isDiagnosticRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                <span>Running Sweep...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-black fill-black" />
                <span>Refresh Operations</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* 2. TOP KPI STRIP (4 Compact Metric Cards) */}
      {/* ------------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Priority Actions */}
        <div className="glass-card p-4 border-rose-500/30 bg-rose-500/[0.03] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Priority Actions</span>
            <span className="badge-rose text-[9px] font-mono font-bold">TODAY</span>
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono flex items-center gap-2">
            <span>3</span>
            <span className="text-xs font-normal text-slate-400 font-sans">urgent signals</span>
          </div>
          <p className="text-[11px] text-slate-300">Stockout risk, invoice variance, SLA check</p>
        </div>

        {/* Metric 2: AI Prepared */}
        <div className="glass-card p-4 border-brand-accent/30 bg-brand-accent/[0.03] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">AI Prepared</span>
            <span className="badge-teal text-[9px] font-mono font-bold">ZERO MANUAL DRAFTING</span>
          </div>
          <div className="text-2xl font-black text-brand-accent font-mono flex items-center gap-2">
            <span>3</span>
            <span className="text-xs font-normal text-slate-400 font-sans">actions ready</span>
          </div>
          <p className="text-[11px] text-slate-300">Purchase orders & debit notes auto-drafted</p>
        </div>

        {/* Metric 3: Awaiting Review */}
        <div 
          onClick={() => onNavigateTo ? onNavigateTo('approvals') : null}
          className="glass-card-interactive p-4 border-amber-500/30 bg-amber-500/[0.03] space-y-1 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Awaiting Review</span>
            <span className="badge-amber text-[9px] font-mono font-bold">HUMAN GATE</span>
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono flex items-center gap-2">
            <span>1</span>
            <span className="text-xs font-normal text-slate-400 font-sans">high-impact PO</span>
          </div>
          <p className="text-[11px] text-slate-300">₹86,328 PO requires Operations Lead seal</p>
        </div>

        {/* Metric 4: Completed Today */}
        <div className="glass-card p-4 border-emerald-500/30 bg-emerald-500/[0.03] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Completed Today</span>
            <span className="badge-emerald text-[9px] font-mono font-bold">ROUTINE OPS</span>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono flex items-center gap-2">
            <span>12</span>
            <span className="text-xs font-normal text-slate-400 font-sans">verified checks</span>
          </div>
          <p className="text-[11px] text-slate-300">POS sync, temperature logs, safe audits</p>
        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* 3. AI PRODUCTIVITY PANEL */}
      {/* ------------------------------------------------------------------------- */}
      <div className="glass-card p-6 border-brand-accent/40 bg-gradient-to-r from-surface-1 via-surface-1 to-surface-2 relative overflow-hidden space-y-4 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-brand-accent/5 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="badge-teal text-[10px] font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-accent" />
                AI OPERATIONS ASSISTANT
              </span>
              <span className="text-xs font-mono text-slate-400">Continuous 24/7 Agent Telemetry</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              “3 actions are ready for your review.”
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              LEADSTOHELP AI continuously monitors inventory consumption rates, invoice OCR manifests, and supplier SLAs to eliminate operational bottlenecks before store opening.
            </p>
          </div>

          {/* Assistant Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto text-xs font-mono">
            <div className="p-3 rounded-xl bg-surface-2/80 border border-white/[0.06] space-y-0.5">
              <span className="text-[9px] text-slate-400 uppercase block">Detected</span>
              <span className="font-bold text-white text-sm">3 signals</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-2/80 border border-white/[0.06] space-y-0.5">
              <span className="text-[9px] text-slate-400 uppercase block">Analyzed</span>
              <span className="font-bold text-brand-accent text-sm">Stock + Manifests</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-2/80 border border-white/[0.06] space-y-0.5">
              <span className="text-[9px] text-slate-400 uppercase block">Prepared</span>
              <span className="font-bold text-emerald-400 text-sm">3 Actions</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-2/80 border border-white/[0.06] space-y-0.5">
              <span className="text-[9px] text-slate-400 uppercase block">Human Gate</span>
              <span className="font-bold text-amber-300 text-sm">1 Required</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* 4. PRIMARY SECTION — TODAY'S PRIORITIES (3 Rich Cards) */}
      {/* ------------------------------------------------------------------------- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight uppercase font-mono">
              Today's Priorities
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {activePrioritiesCount} High-Impact Operational Tasks
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Priority 1: Prevent Arabica Stockout (Critical) */}
          <div className="glass-card p-5 border-rose-500/40 bg-rose-500/[0.02] flex flex-col justify-between space-y-4 relative">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="badge-rose text-[10px] font-mono font-bold">1. CRITICAL PRIORITY</span>
                <span className="text-[10px] font-mono text-slate-400">Due: Today (Before 18:00)</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">Prevent COFFEE-001 Stockout</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Specialty Arabica Beans (AAA Grade)</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-2/80 border border-white/[0.06] space-y-1.5 text-xs">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-400">Current Stock: <strong className="text-white">36.0 kg</strong></span>
                  <span className="text-rose-400 font-bold">~2.77 Days Runway</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-3 overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full w-[36%]" />
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  At 13.0 kg/day run rate, store runs out of Arabica before Friday peak rush (48% beverage order risk).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-1 text-xs">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block">
                  AI Prepared Action
                </span>
                <p className="text-slate-200 text-[11px] leading-snug">
                  Review 70kg Malnad + 30kg Metro Split-Order replenishment PO (₹86,328, captures ₹8,672 volume savings).
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
              <button
                onClick={() => onOpenProcurement ? onOpenProcurement('COFFEE-001') : onNavigateTo('procurement')}
                className="btn-primary text-xs py-2 px-3.5 flex-1 flex items-center justify-center gap-1.5 shadow-glow-teal font-bold"
              >
                <span>Review PO</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </button>
              <button
                onClick={() => onOpenEvidence ? onOpenEvidence('COFFEE-001') : null}
                className="btn-secondary text-xs py-2 px-3 flex items-center gap-1"
                title="View Grounded Telemetry Evidence"
              >
                <FileCheck className="w-3.5 h-3.5 text-brand-accent" />
                <span>Evidence (8)</span>
              </button>
            </div>
          </div>

          {/* Priority 2: Review Kaveri Dairy Invoice (High) */}
          <div className="glass-card p-5 border-amber-500/40 bg-amber-500/[0.02] flex flex-col justify-between space-y-4 relative">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="badge-amber text-[10px] font-mono font-bold">2. HIGH PRIORITY</span>
                <span className="text-[10px] font-mono text-slate-400">Due: Today</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">Review Kaveri Dairy Invoice</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Invoice #KD-8839 • Kaveri Organic Dairy</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-2/80 border border-white/[0.06] space-y-1.5 text-xs">
                <div className="grid grid-cols-3 gap-1 text-[11px] font-mono text-center">
                  <div className="p-1 rounded bg-surface-1">
                    <span className="text-slate-500 block text-[9px]">BILLED</span>
                    <span className="font-bold text-white">20 L</span>
                  </div>
                  <div className="p-1 rounded bg-surface-1 border border-amber-500/30">
                    <span className="text-amber-400 block text-[9px]">RECEIVED</span>
                    <span className="font-bold text-amber-300">12 L</span>
                  </div>
                  <div className="p-1 rounded bg-surface-1 border border-rose-500/30">
                    <span className="text-rose-400 block text-[9px]">SHORTFALL</span>
                    <span className="font-bold text-rose-400">8 L</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Vision OCR identified an 8L milk quantity shortfall against the physical Good Receipt Note (GRN).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-1 text-xs">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block">
                  AI Prepared Action
                </span>
                <p className="text-slate-200 text-[11px] leading-snug">
                  Review discrepancy and issue ₹486.40 debit note to recover shortage before payment settlement.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
              <button
                onClick={() => onNavigateTo ? onNavigateTo('invoices') : null}
                className="btn-primary text-xs py-2 px-3.5 flex-1 flex items-center justify-center gap-1.5 shadow-glow-teal font-bold"
              >
                <span>Review Audit</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </button>
              <button
                onClick={() => onOpenEvidence ? onOpenEvidence('DAIRY-001') : null}
                className="btn-secondary text-xs py-2 px-3 flex items-center gap-1"
                title="View Grounded Telemetry Evidence"
              >
                <FileCheck className="w-3.5 h-3.5 text-brand-accent" />
                <span>Evidence (4)</span>
              </button>
            </div>
          </div>

          {/* Priority 3: Verify Supplier SLA (Medium) */}
          <div className="glass-card p-5 border-brand-accent/40 bg-brand-accent/[0.02] flex flex-col justify-between space-y-4 relative">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="badge-teal text-[10px] font-mono font-bold">3. MEDIUM PRIORITY</span>
                <span className="text-[10px] font-mono text-slate-400">Due: Today</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">Verify Supplier SLA</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Malnad Planters & Metro Wholesale Hub</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-2/80 border border-white/[0.06] space-y-1.5 text-xs">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-400">Malnad On-Time SLA:</span>
                  <span className="text-brand-accent font-bold">94% (18 Dispatches)</span>
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-400">Metro Buffer SLA:</span>
                  <span className="text-emerald-400 font-bold">92% (24h Delivery)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Reliability scoring confirms dual-sourcing strategy eliminates stockout exposure with zero buffer lag.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-1 text-xs">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block">
                  AI Prepared Action
                </span>
                <p className="text-slate-200 text-[11px] leading-snug">
                  Review supplier reliability signals and approve dual-vendor dispatch routing.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
              <button
                onClick={() => onNavigateTo ? onNavigateTo('suppliers') : null}
                className="btn-primary text-xs py-2 px-3.5 flex-1 flex items-center justify-center gap-1.5 shadow-glow-teal font-bold"
              >
                <span>Open Supplier Network</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </button>
              <button
                onClick={() => onOpenSupplierDetail ? onOpenSupplierDetail({ id: 'SUP-001', name: 'Malnad Coffee Planters' }) : onNavigateTo('suppliers')}
                className="btn-secondary text-xs py-2 px-3 flex items-center gap-1"
                title="View Supplier Scorecard"
              >
                <Users className="w-3.5 h-3.5 text-brand-accent" />
                <span>Scorecard</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* 5. ACTION QUEUE (Clean Table / List) */}
      {/* ------------------------------------------------------------------------- */}
      <div className="glass-card p-6 border-white/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-brand-accent" />
              Operational Action Queue
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Prioritized daily action items generated by AI telemetry with human governance review gates.
            </p>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-2 border border-white/[0.08] text-xs text-white placeholder-slate-500 rounded-lg pl-8 pr-2 py-1.5 focus:outline-none focus:border-brand-accent"
              />
            </div>

            <div className="flex items-center gap-1 text-[10px] font-mono">
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterPriority(f)}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                    filterPriority === f
                      ? 'bg-brand-accent text-black font-bold'
                      : 'bg-surface-2 text-slate-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Queue Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-slate-400 font-mono text-[10px] uppercase">
                <th className="pb-3 pl-2">Done</th>
                <th className="pb-3">Priority</th>
                <th className="pb-3">Task & Asset</th>
                <th className="pb-3">Operational Reason</th>
                <th className="pb-3">AI Preparation</th>
                <th className="pb-3">Owner</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 pr-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredTasks.map((task) => {
                const isCompleted = !!completedTaskIds[task.id];
                return (
                  <tr
                    key={task.id}
                    className={`hover:bg-surface-2/40 transition-colors ${
                      isCompleted ? 'opacity-60 bg-surface-2/20' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 pl-2">
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => handleToggleTaskCompletion(task.id, task.title)}
                        className="rounded bg-surface-2 border-white/[0.2] text-brand-accent focus:ring-0 w-4 h-4 cursor-pointer"
                      />
                    </td>

                    {/* Priority Badge */}
                    <td className="py-3.5">
                      <span className={`badge-${task.priority === 'CRITICAL' ? 'rose' : task.priority === 'HIGH' ? 'amber' : task.priority === 'MEDIUM' ? 'teal' : 'slate'} text-[9px] font-mono font-bold`}>
                        {task.priority}
                      </span>
                    </td>

                    {/* Task & Asset */}
                    <td className="py-3.5 pr-2">
                      <div className={`font-bold ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                        {task.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{task.asset}</div>
                    </td>

                    {/* Operational Reason */}
                    <td className="py-3.5 pr-2 text-slate-300 max-w-xs text-[11px] leading-snug">
                      {task.reason}
                    </td>

                    {/* AI Preparation */}
                    <td className="py-3.5 pr-2 text-brand-accent/90 max-w-xs text-[11px] leading-snug font-mono">
                      {task.aiPrep}
                    </td>

                    {/* Owner */}
                    <td className="py-3.5 pr-2 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {task.owner}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono ${
                        isCompleted
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : task.isApprovalReq
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                            : 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20'
                      }`}>
                        {isCompleted ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{isCompleted ? 'Completed' : task.status}</span>
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 pr-2 text-right whitespace-nowrap">
                      {task.id === 'task-arabica' ? (
                        <button
                          onClick={() => onOpenProcurement ? onOpenProcurement('COFFEE-001') : onNavigateTo('procurement')}
                          className="btn-primary text-[11px] py-1.5 px-3"
                        >
                          Review PO
                        </button>
                      ) : task.id === 'task-kaveri' ? (
                        <button
                          onClick={() => onNavigateTo ? onNavigateTo('invoices') : null}
                          className="btn-secondary text-[11px] py-1.5 px-3"
                        >
                          Review Audit
                        </button>
                      ) : (
                        <button
                          onClick={() => onNavigateTo ? onNavigateTo('suppliers') : null}
                          className="btn-secondary text-[11px] py-1.5 px-3"
                        >
                          Open View
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* 6. TWO-COLUMN: AUTOMATION TIMELINE & HUMAN-IN-THE-LOOP GOVERNANCE */}
      {/* ------------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Activity & Automation Timeline */}
        <div className="glass-card p-6 border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-accent" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Automation & Telemetry Timeline
              </h3>
            </div>
            <span className="badge-teal text-[9px] font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
              LIVE TELEMETRY
            </span>
          </div>

          <div className="space-y-3">
            {AUTOMATION_TIMELINE.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <span className="font-mono text-[10px] text-brand-accent shrink-0 pt-0.5 bg-surface-2 px-2 py-0.5 rounded border border-white/[0.06]">
                  {item.time}
                </span>
                <div className="space-y-0.5 flex-1">
                  <div className="font-bold text-slate-100 flex items-center gap-1.5">
                    <span>{item.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Human-in-the-Loop Governance */}
        <div className="glass-card p-6 border-white/[0.08] space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Human-in-the-Loop Governance
                </h3>
              </div>
              <span className="badge-emerald text-[9px] font-mono font-bold">STRICT RBAC</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/20 space-y-2">
              <h4 className="text-sm font-bold text-white">AI Prepares. Humans Approve.</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                High-impact financial commitments (purchase orders, vendor switches, invoice debit notes) are never silently executed. The AI Productivity Engine evaluates scenarios, verifies supplier SLAs, and drafts the purchase order—but requires authorized cryptographic sign-off before transmission.
              </p>
            </div>

            {/* 6-Step Visual Workflow */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                Decision Execution Architecture
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center text-[10px] font-mono">
                {[
                  { step: '1. Detect', label: 'POS Burst', color: 'bg-surface-2 text-brand-accent' },
                  { step: '2. Analyze', label: 'Run-Rate', color: 'bg-surface-2 text-brand-accent' },
                  { step: '3. Recommend', label: '70/30 Split', color: 'bg-surface-2 text-brand-accent' },
                  { step: '4. Review', label: 'Lead Sign', color: 'bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold' },
                  { step: '5. Execute', label: 'PO Dispatch', color: 'bg-surface-2 text-emerald-400' },
                  { step: '6. Verify', label: 'GRN Match', color: 'bg-surface-2 text-emerald-400' }
                ].map((st, i) => (
                  <div key={i} className={`p-2 rounded-lg ${st.color} space-y-0.5`}>
                    <span className="block font-bold">{st.step}</span>
                    <span className="text-[9px] text-slate-400 block truncate">{st.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateTo ? onNavigateTo('approvals') : null}
              className="btn-primary text-xs py-2 px-4 w-full flex items-center justify-center gap-1.5 shadow-glow-teal font-bold"
            >
              <Lock className="w-3.5 h-3.5 text-black" />
              <span>Open Approval Queue & Authorize PO</span>
            </button>
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* 7. PRODUCTIVITY SUMMARY & IMPACT */}
      {/* ------------------------------------------------------------------------- */}
      <div className="glass-card p-6 border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Today's AI-Assisted Operations Impact
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">+₹8,672 SAVINGS CAPTURED</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-surface-2/60 border border-white/[0.04] space-y-1">
            <span className="text-[10px] text-slate-400 block">COMPLETED ACTIONS</span>
            <span className="text-xl font-bold text-white">12</span>
            <span className="text-[10px] text-emerald-400 block">100% verified</span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-2/60 border border-white/[0.04] space-y-1">
            <span className="text-[10px] text-slate-400 block">ACTIONS PREPARED</span>
            <span className="text-xl font-bold text-brand-accent">3</span>
            <span className="text-[10px] text-slate-400 block">Zero manual drafting</span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-2/60 border border-white/[0.04] space-y-1">
            <span className="text-[10px] text-slate-400 block">CRITICAL RISKS</span>
            <span className="text-xl font-bold text-rose-400">1</span>
            <span className="text-[10px] text-rose-400 block">Arabica resolved</span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-2/60 border border-white/[0.04] space-y-1">
            <span className="text-[10px] text-slate-400 block">SIMULATED SAVINGS</span>
            <span className="text-xl font-bold text-emerald-400">₹8,672</span>
            <span className="text-[10px] text-emerald-400 block">10.1% discount</span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-2/60 border border-white/[0.04] space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 block">INVOICE AUDIT</span>
            <span className="text-xl font-bold text-amber-300">1</span>
            <span className="text-[10px] text-amber-300 block">8L shortage caught</span>
          </div>
        </div>
      </div>

    </div>
  );
}
