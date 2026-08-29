import React, { useState } from 'react';
import {
  AlertTriangle,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  DollarSign,
  Radar,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  RefreshCw,
  Sliders,
  Store,
  Activity,
  ArrowUpRight,
  TrendingDown,
  Lock,
  Radio,
  Package,
  Users,
  Eye,
  Info,
  MapPin,
  Check,
  Play,
  Search,
  Filter,
  BarChart3,
  Receipt,
  FileCheck,
  Zap,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown
} from 'lucide-react';
import { useToast } from '../components/ToastContext';

// 5 Key SKUs for the Left Data Rail Watchlist
const WATCHLIST_SKUS = [
  {
    sku: 'COFFEE-001',
    name: 'Specialty Arabica Coffee Beans',
    category: 'Coffee & Espresso',
    current_stock: 36.0,
    unit: 'kg',
    reorder_point: 50.0,
    daily_run_rate: 13.0,
    days_runway: 2.77,
    status: 'CRITICAL',
    statusLabel: 'Critical 2.8d',
    statusColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    dotColor: 'bg-rose-400',
    exposure: '48% of daily beverage revenue (₹14,500/day)',
    supplier: 'Malnad Coffee Planters (Primary)',
    depletionSchedule: [
      { day: 'Wed (Today)', stock: 36.0, status: 'Active' },
      { day: 'Thu', stock: 23.0, status: 'Depleting' },
      { day: 'Fri (Rush)', stock: 10.0, status: 'Cliff' },
      { day: 'Sat', stock: 0.0, status: 'Stockout' },
      { day: 'Sun', stock: 0.0, status: 'Loss' }
    ]
  },
  {
    sku: 'DAIRY-001',
    name: 'Farm Fresh Barista Milk (3.5% Fat)',
    category: 'Dairy & Alternatives',
    current_stock: 12.0,
    unit: 'L',
    reorder_point: 30.0,
    daily_run_rate: 22.0,
    days_runway: 3.8,
    status: 'VARIANCE',
    statusLabel: '8L Shortage',
    statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    dotColor: 'bg-amber-400',
    exposure: 'Variance on Invoice #KD-8839 (₹486.40 debit required)',
    supplier: 'Kaveri Dairy Collective',
    depletionSchedule: [
      { day: 'Wed (Today)', stock: 12.0, status: 'Active' },
      { day: 'Thu', stock: 2.0, status: 'Critical' },
      { day: 'Fri', stock: 0.0, status: 'Stockout' }
    ]
  },
  {
    sku: 'PACK-001',
    name: '12oz Eco Kraft Double-Wall Cups',
    category: 'Packaging & Consumables',
    current_stock: 1240,
    unit: 'units',
    reorder_point: 800,
    daily_run_rate: 88,
    days_runway: 14.1,
    status: 'HEALTHY',
    statusLabel: 'Healthy 14d',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    dotColor: 'bg-emerald-400',
    exposure: 'Adequate stock covering next 2 weekend cycles',
    supplier: 'GreenPack India Solutions',
    depletionSchedule: [
      { day: 'Week 1', stock: 1240, status: 'Healthy' },
      { day: 'Week 2', stock: 624, status: 'Healthy' }
    ]
  },
  {
    sku: 'SYRUP-001',
    name: 'Artisan Madagascar Vanilla Syrup',
    category: 'Flavors & Syrups',
    current_stock: 45,
    unit: 'bottles',
    reorder_point: 20,
    daily_run_rate: 2.1,
    days_runway: 21.4,
    status: 'HEALTHY',
    statusLabel: 'Healthy 21d',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    dotColor: 'bg-emerald-400',
    exposure: 'Optimal inventory level',
    supplier: 'Monin Specialty Imports',
    depletionSchedule: []
  },
  {
    sku: 'TEA-001',
    name: 'Single Estate Imperial Earl Grey',
    category: 'Tea & Tisanes',
    current_stock: 18.5,
    unit: 'kg',
    reorder_point: 10.0,
    daily_run_rate: 0.6,
    days_runway: 30.8,
    status: 'HEALTHY',
    statusLabel: 'Healthy 30d',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    dotColor: 'bg-emerald-400',
    exposure: 'Optimal inventory level',
    supplier: 'Darjeeling Estate Teas',
    depletionSchedule: []
  }
];

const TELEMETRY_FEED = [
  { id: 1, time: '14:22:10', type: 'POS_SURGE', text: 'POS Register 02 logged +4.2kg Arabica bean depletion during lunch rush.' },
  { id: 2, time: '14:15:05', type: 'INVOICE_VARIANCE', text: 'Vision OCR flagged 8L Milk shortfall on Invoice #KD-8839 (Kaveri Dairy).' },
  { id: 3, time: '14:02:40', type: 'SIMULATION_OPTIMIZED', text: '6-scenario digital twin generated optimal Split-Order (70kg Malnad + 30kg Metro).' },
  { id: 4, time: '13:45:12', type: 'SLA_VERIFIED', text: 'Malnad Coffee Planters SLA confirmed at 94% on-time delivery across 18 shipments.' }
];

export default function OverviewPage({
  overviewData,
  onNavigateTo,
  onOpenAskAI,
  onQuickApprove,
  onOpenEvidence,
  onOpenRiskDetail,
  onOpenProcurement
}) {
  const [selectedSku, setSelectedSku] = useState('COFFEE-001');
  const [skuSearch, setSkuSearch] = useState('');
  const [skuFilter, setSkuFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'VARIANCE' | 'HEALTHY'
  const [activeTab, setActiveTab] = useState('triage'); // 'triage' | 'scenarios' | 'suppliers' | 'invoices'
  const [isRailExpanded, setIsRailExpanded] = useState(true);
  const safeData = overviewData || {
    metrics: {
      total_skus: 65,
      critical_count: 1,
      low_stock_count: 3,
      healthy_count: 61,
      pending_approvals: 1,
      potential_savings: 8672.0,
      active_suppliers: 10,
      avg_supplier_sla: 91.4
    },
    risk_radar: { overall_score: 84.5, risk_level: 'HIGH' }
  };

  const activeSkuData = WATCHLIST_SKUS.find(s => s.sku === selectedSku) || WATCHLIST_SKUS[0];

  const filteredSkus = WATCHLIST_SKUS.filter(item => {
    const matchesSearch = item.sku.toLowerCase().includes(skuSearch.toLowerCase()) ||
      item.name.toLowerCase().includes(skuSearch.toLowerCase());
    const matchesFilter = skuFilter === 'ALL' || item.status === skuFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto select-none">
      
      {/* 1. Header Command Ribbon */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-white/[0.08] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="badge-teal text-[10px] uppercase font-bold tracking-wider font-mono">
              Live Operations Control Tower
            </span>
            <span className="text-xs text-slate-400">Hub BLR-01 • Deccan Roast Specialty Hub</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              All Engines Synchronized
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Supply Chain Command Center & Decision Console
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Rail Slide/Toggle Button */}
          <button
            onClick={() => setIsRailExpanded(!isRailExpanded)}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
            title={isRailExpanded ? 'Collapse Left Data Rail' : 'Expand Left Data Rail'}
          >
            {isRailExpanded ? <PanelLeftClose className="w-3.5 h-3.5 text-brand-accent" /> : <PanelLeftOpen className="w-3.5 h-3.5 text-brand-accent" />}
            <span className="hidden sm:inline">{isRailExpanded ? 'Hide Data Rail' : 'Show Data Rail'}</span>
          </button>

          <button
            onClick={() => onOpenAskAI("Analyze current store risks and summarize recommended replenishment actions.")}
            className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent-violet" />
            <span>Ask Copilot (⌘J)</span>
          </button>

          <button
            onClick={() => onOpenProcurement('COFFEE-001')}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-glow-teal"
          >
            <span>Review & Approve PO</span>
            <ArrowRight className="w-3.5 h-3.5 text-black" />
          </button>
        </div>
      </div>

      {/* 2. Top 4 High-Density KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Critical Risks */}
        <div 
          onClick={() => onOpenRiskDetail && onOpenRiskDetail(activeSkuData)}
          className="glass-card-interactive p-4 border-rose-500/30 bg-rose-500/[0.03] space-y-1.5 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Critical Risks</span>
            <span className="badge-rose text-[9px] font-mono font-bold">1 ACTION REQ</span>
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono flex items-center gap-2">
            <span>1 SKU</span>
            <span className="text-xs font-normal text-slate-400 font-sans">at stockout risk</span>
          </div>
          <p className="text-[11px] text-slate-300 truncate">
            COFFEE-001 Arabica depletion in ~2.8 days
          </p>
        </div>

        {/* KPI 2: Stockout Exposure Runway */}
        <div 
          onClick={() => onOpenProcurement('COFFEE-001')}
          className="glass-card-interactive p-4 border-amber-500/30 bg-amber-500/[0.03] space-y-1.5 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Stockout Runway</span>
            <span className="badge-amber text-[9px] font-mono font-bold">CLIFF: FRIDAY</span>
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono flex items-center gap-2">
            <span>2.77 Days</span>
          </div>
          <p className="text-[11px] text-slate-300 truncate">
            Velocity: 13.0 kg/day across 48% menu orders
          </p>
        </div>

        {/* KPI 3: Savings Captured */}
        <div 
          onClick={() => onNavigateTo('analytics')}
          className="glass-card-interactive p-4 border-emerald-500/30 bg-emerald-500/[0.03] space-y-1.5 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Procurement Savings</span>
            <span className="badge-emerald text-[9px] font-mono font-bold">+10.1% SAVINGS</span>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono flex items-center gap-2">
            <span>+₹8,672</span>
          </div>
          <p className="text-[11px] text-slate-300 truncate">
            Captured via 70/30 Split-Order allocation
          </p>
        </div>

        {/* KPI 4: Supplier Reliability SLA */}
        <div 
          onClick={() => onNavigateTo('suppliers')}
          className="glass-card-interactive p-4 border-brand-accent/30 bg-brand-accent/[0.03] space-y-1.5 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Partner Network SLA</span>
            <span className="badge-teal text-[9px] font-mono font-bold">10 VETTED</span>
          </div>
          <div className="text-2xl font-black text-brand-accent font-mono flex items-center gap-2">
            <span>91.4%</span>
            <span className="text-xs font-normal text-slate-400 font-sans">on-time avg</span>
          </div>
          <p className="text-[11px] text-slate-300 truncate">
            Malnad Planters: 94% • Metro Hub: 92%
          </p>
        </div>
      </div>

      {/* 3. Master 2-Column Command Workspace (Left Data Rail + Right Console) */}
      <div className={`grid grid-cols-1 ${isRailExpanded ? 'lg:grid-cols-12' : 'lg:grid-cols-1'} gap-6 items-start transition-all duration-200`}>
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Slide-Out / Collapsible Operational Data Rail (4 Cols) */}
        {/* ========================================================================= */}
        {isRailExpanded && (
          <div className="lg:col-span-4 space-y-4 animate-in slide-in-from-left duration-150">
            
            {/* Data Rail Container */}
            <div className="glass-card p-4 border-white/[0.08] space-y-4">
              
              {/* Rail Header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-brand-accent" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Inventory Watchlist
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-surface-2 px-2 py-0.5 rounded-full border border-white/[0.06]">
                  {filteredSkus.length} of {WATCHLIST_SKUS.length} SKUs
                </span>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter SKUs by code, name..."
                    value={skuSearch}
                    onChange={(e) => setSkuSearch(e.target.value)}
                    className="w-full bg-surface-2 border border-white/[0.08] text-xs text-white placeholder-slate-500 rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-brand-accent transition-colors"
                  />
                </div>

                {/* Status Filter Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-mono">
                  {['ALL', 'CRITICAL', 'VARIANCE', 'HEALTHY'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setSkuFilter(f)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        skuFilter === f
                          ? 'bg-brand-accent text-black shadow-sm'
                          : 'bg-surface-2 text-slate-400 hover:text-white hover:bg-surface-3'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable SKU Cards List */}
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {filteredSkus.map((item) => {
                  const isSelected = selectedSku === item.sku;
                  const stockPercent = Math.min(100, Math.round((item.current_stock / item.reorder_point) * 100));

                  return (
                    <div
                      key={item.sku}
                      onClick={() => setSelectedSku(item.sku)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-surface-2/95 border-brand-accent shadow-glow-teal ring-1 ring-brand-accent/50'
                          : 'bg-surface-2/50 border-white/[0.04] hover:bg-surface-2 hover:border-white/[0.12]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${item.dotColor} shrink-0 animate-pulse`} />
                            <span className="font-mono font-bold text-xs text-white truncate">
                              {item.sku}
                            </span>
                          </div>
                          <h4 className="text-[11px] font-semibold text-slate-200 truncate">
                            {item.name}
                          </h4>
                        </div>

                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${item.statusColor}`}>
                          {item.statusLabel}
                        </span>
                      </div>

                      {/* Stock vs Reorder Bar */}
                      <div className="space-y-1 text-[10px]">
                        <div className="flex justify-between text-slate-400 font-mono">
                          <span>Stock: <strong className="text-white">{item.current_stock} {item.unit}</strong></span>
                          <span>Reorder: {item.reorder_point} {item.unit}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-surface-3 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              item.status === 'CRITICAL' ? 'bg-rose-400' : item.status === 'VARIANCE' ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${stockPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Telemetry Feed */}
            <div className="glass-card p-4 border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <div className="flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
                  <h4 className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">
                    Live Event Stream
                  </h4>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 font-bold">REALTIME</span>
              </div>

              <div className="space-y-2 text-[11px]">
                {TELEMETRY_FEED.map((feed) => (
                  <div key={feed.id} className="p-2 rounded-lg bg-surface-2/60 border border-white/[0.04] space-y-0.5">
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                      <span className="text-brand-accent font-semibold">{feed.type}</span>
                      <span>{feed.time}</span>
                    </div>
                    <p className="text-slate-300 text-[10px] leading-snug">
                      {feed.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Master Multi-View Operations Workspace (8 or 12 Cols) */}
        {/* ========================================================================= */}
        <div className={`${isRailExpanded ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-4 transition-all duration-200`}>
          
          {/* View Mode Tabs */}
          <div className="glass-card p-2 border-white/[0.08] flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-1 text-xs">
              {[
                { id: 'triage', label: 'Incident Triage & Split-Order', icon: AlertTriangle },
                { id: 'scenarios', label: '6-Scenario Digital Twin', icon: Sliders },
                { id: 'suppliers', label: 'Supplier Reliability (10)', icon: Users },
                { id: 'invoices', label: '3-Way Invoice Match', icon: Receipt }
              ].map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-3 py-2 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-brand-accent text-black shadow-glow-teal'
                        : 'text-slate-400 hover:text-white hover:bg-surface-2'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-slate-400'}`} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onOpenEvidence && onOpenEvidence(activeSkuData.sku)}
              className="text-[11px] font-semibold text-brand-accent hover:underline flex items-center gap-1 shrink-0 px-2"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Evidence Trace (8 Sources)</span>
            </button>
          </div>

          {/* TAB 1: INCIDENT TRIAGE & REPLENISHMENT STRATEGY */}
          {activeTab === 'triage' && (
            <div className="space-y-4">
              
              {/* Active SKU Triage Card */}
              <div className="glass-card p-5 sm:p-6 border-white/[0.08] space-y-5">
                
                {/* Status Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge-rose text-[10px] font-mono font-bold">
                        {activeSkuData.status} RISK SIGNAL
                      </span>
                      <span className="text-xs font-mono text-slate-400">{activeSkuData.sku}</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-white">
                      {activeSkuData.name}
                    </h2>
                  </div>

                  <div className="text-left sm:text-right font-mono">
                    <span className="text-[10px] text-slate-400 block uppercase">Stockout Window</span>
                    <span className="text-xl font-black text-rose-400">
                      {activeSkuData.days_runway} Days
                    </span>
                  </div>
                </div>

                {/* 7-Day Stock Runway Interactive Visual Curve */}
                <div className="p-4 rounded-2xl bg-surface-2/70 border border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <BarChart3 className="w-4 h-4 text-brand-accent" />
                      <span>7-Day Depletion Velocity & Stockout Cliff Analysis</span>
                    </div>
                    <span className="text-[10px] font-mono text-rose-400 font-bold">13.0 kg/day burn rate</span>
                  </div>

                  {/* Horizontal Visual Timeline Gauge */}
                  <div className="grid grid-cols-5 gap-2 pt-1 font-mono text-xs">
                    {[
                      { day: 'Wed (Today)', stock: '36.0 kg', color: 'bg-brand-accent/20 border-brand-accent text-brand-accent', note: 'Active' },
                      { day: 'Thu', stock: '23.0 kg', color: 'bg-amber-500/20 border-amber-500 text-amber-300', note: 'Depleting' },
                      { day: 'Fri (Rush)', stock: '10.0 kg', color: 'bg-rose-500/20 border-rose-500 text-rose-400', note: 'Cliff Risk' },
                      { day: 'Sat', stock: '0.0 kg', color: 'bg-rose-900/40 border-rose-600 text-rose-500', note: 'STOCKOUT' },
                      { day: 'Sun', stock: '0.0 kg', color: 'bg-rose-900/40 border-rose-600 text-rose-500', note: 'REVENUE LOSS' }
                    ].map((step, idx) => (
                      <div key={idx} className={`p-2.5 rounded-xl border ${step.color} space-y-1 text-center`}>
                        <span className="text-[10px] text-slate-400 block">{step.day}</span>
                        <div className="font-bold text-xs">{step.stock}</div>
                        <span className="text-[9px] uppercase font-bold block opacity-80">{step.note}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-tight pt-1">
                    Without replenishment before Friday 18:00, store runs out of Arabica coffee for peak weekend traffic.
                  </p>
                </div>

                {/* Why This Matters Section */}
                <div className="p-4 rounded-xl bg-surface-2/60 border border-white/[0.04] space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-brand-accent font-bold">
                    <Zap className="w-3.5 h-3.5" />
                    <span>OPERATIONAL & REVENUE IMPACT</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {activeSkuData.exposure}. Stockout before Friday night peak traffic will cause immediate customer churn and an estimated <strong className="text-white font-mono">₹32,400 weekend revenue loss</strong> across flat whites, americanos, and cold brews.
                  </p>
                </div>

                {/* 5-Node Reasoning Chain */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                    AI Decision Reasoning Circuit (Grounded in Verified Telemetry)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px]">
                    {[
                      { step: '1. POS Signal', val: '36.0 kg on hand', sub: 'Safety threshold: 50kg', icon: Package },
                      { step: '2. Velocity', val: '13.0 kg/day', sub: 'Depletion in ~2.8d', icon: Activity },
                      { step: '3. Menu Exposure', val: '48% of Sales', sub: '₹14,500 daily risk', icon: DollarSign },
                      { step: '4. Supplier SLA', val: '94% SLA', sub: 'Malnad: 3d lead time', icon: Users },
                      { step: '5. Optimal PO', val: '70kg + 30kg', sub: 'Split-Order allocation', icon: CheckCircle2 }
                    ].map((node, nIdx) => {
                      const NodeIcon = node.icon;
                      return (
                        <div key={nIdx} className="p-2.5 rounded-xl bg-surface-2/80 border border-white/[0.04] space-y-1">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-brand-accent">
                            <NodeIcon className="w-3 h-3" />
                            <span>{node.step}</span>
                          </div>
                          <div className="font-bold text-white font-mono text-xs">{node.val}</div>
                          <div className="text-[9px] text-slate-400">{node.sub}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recommended Split-Order Allocation */}
                <div className="p-5 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/25 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <span className="badge-emerald text-[10px] font-mono font-bold">
                        RECOMMENDED ACTION: SPLIT-ORDER (OPTIMAL)
                      </span>
                      <h3 className="text-base font-bold text-white mt-1">
                        100 kg Total Replenishment Split Across 2 Partners
                      </h3>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-[10px] text-slate-400 block uppercase">Total Cost</span>
                      <span className="text-xl font-black text-emerald-400">₹86,328</span>
                      <span className="text-[10px] text-emerald-400 font-bold block">+₹8,672 Savings</span>
                    </div>
                  </div>

                  {/* Supplier Allocation Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-surface-1 border border-white/[0.08] space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white">Malnad Coffee Planters</span>
                        <span className="badge-teal text-[9px] font-mono">70 kg (Bulk Tier)</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Unit Cost: <strong className="text-white">₹850.00/kg</strong> • Lead Time: <strong className="text-white">3 Days</strong>. Captures bulk volume discount.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-surface-1 border border-white/[0.08] space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white">Metro Wholesale Hub</span>
                        <span className="badge-teal text-[9px] font-mono">30 kg (Buffer Tier)</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Unit Cost: <strong className="text-white">₹894.27/kg</strong> • Lead Time: <strong className="text-white">24 Hours</strong>. Guarantees safety buffer for Friday.
                      </p>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-500/20">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Governance: Human approval required before purchase order dispatch.</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenRiskDetail && onOpenRiskDetail(activeSkuData)}
                        className="btn-secondary text-xs py-2 px-3.5"
                      >
                        Risk Breakdown
                      </button>
                      <button
                        onClick={() => onOpenProcurement('COFFEE-001')}
                        className="btn-success text-xs py-2 px-4 shadow-glow-emerald"
                      >
                        Submit for Human Approval
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: 6-SCENARIO DIGITAL TWIN */}
          {activeTab === 'scenarios' && (
            <div className="glass-card p-6 border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    6-Scenario Deterministic Procurement Matrix
                  </h3>
                  <p className="text-xs text-slate-400">Comparing lead time, unit economics, and stockout probability.</p>
                </div>
                <span className="badge-teal text-[10px] font-mono font-bold">ZERO HALLUCINATION</span>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'B. Split-Order Strategy (AI Recommended)', alloc: '70kg Malnad + 30kg Metro', cost: '₹86,328', time: '24h / 3d', risk: '8%', savings: '+₹8,672', rec: true },
                  { name: 'A. Single Supplier (Malnad Only)', alloc: '100kg Malnad Planters', cost: '₹84,000', time: '3.5 Days', risk: '72%', savings: '+₹11,000', rec: false },
                  { name: 'C. Emergency Metro Wholesale', alloc: '100kg Metro Hub', cost: '₹95,000', time: '24 Hours', risk: '4%', savings: '₹0', rec: false },
                  { name: 'D. Cheapest Option (Aura Commodities)', alloc: '100kg Aura Raw', cost: '₹79,500', time: '4.0 Days', risk: '85%', savings: '+₹15,500', rec: false }
                ].map((sc, sIdx) => (
                  <div
                    key={sIdx}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                      sc.rec
                        ? 'bg-emerald-500/[0.04] border-emerald-500/30'
                        : 'bg-surface-2/60 border-white/[0.04]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{sc.name}</span>
                        {sc.rec && <span className="badge-emerald text-[9px] font-mono font-bold">RECOMMENDED</span>}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{sc.alloc} • Lead Time: {sc.time}</p>
                    </div>

                    <div className="flex items-center gap-4 text-right font-mono">
                      <div>
                        <span className="text-[10px] text-slate-500 block">COST</span>
                        <span className="font-bold text-white text-sm">{sc.cost}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">RISK</span>
                        <span className={`font-bold ${sc.risk === '8%' || sc.risk === '4%' ? 'text-emerald-400' : 'text-rose-400'}`}>{sc.risk}</span>
                      </div>
                      <button
                        onClick={() => onOpenProcurement('COFFEE-001')}
                        className="btn-secondary text-[11px] py-1.5 px-3"
                      >
                        Simulate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SUPPLIER RELIABILITY */}
          {activeTab === 'suppliers' && (
            <div className="glass-card p-6 border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <h3 className="text-sm font-bold text-white">Partner Network Performance</h3>
                <span className="text-xs text-slate-400">10 Vetted Suppliers</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { name: 'Malnad Coffee Planters', score: '94%', orders: 18, lead: '3 Days', status: 'Optimal' },
                  { name: 'Metro Wholesale Hub', score: '92%', orders: 34, lead: '24 Hours', status: 'Rapid Buffer' },
                  { name: 'Kaveri Dairy Collective', score: '78%', orders: 22, lead: '1 Day', status: '1 Discrepancy Flagged' },
                  { name: 'GreenPack India', score: '96%', orders: 12, lead: '2 Days', status: 'Healthy' }
                ].map((sup, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-surface-2/60 border border-white/[0.04] space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-white">{sup.name}</h4>
                      <span className="badge-teal font-mono text-[10px] font-bold">{sup.score} SLA</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                      <span>{sup.orders} Completed Orders</span>
                      <span>Lead: {sup.lead}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 border-t border-white/[0.04] pt-1">
                      Status: <strong className="text-slate-200">{sup.status}</strong>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: 3-WAY INVOICE AUDIT */}
          {activeTab === 'invoices' && (
            <div className="glass-card p-6 border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">3-Way Match Discrepancy Detection</h3>
                  <p className="text-xs text-slate-400">PO vs Supplier Invoice vs Physical GRN Receipt</p>
                </div>
                <span className="badge-amber text-[10px] font-mono font-bold">1 VARIANCE FOUND</span>
              </div>

              <div className="p-4 rounded-xl bg-surface-2/60 border border-white/[0.04] space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white">Invoice #KD-8839 (Kaveri Dairy Collective)</h4>
                    <p className="text-[11px] text-slate-400">DAIRY-001 Barista Fresh Milk (3.5% Fat)</p>
                  </div>
                  <span className="badge-amber font-mono text-[10px] font-bold">8L SHORTAGE</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-[11px] font-mono text-center">
                  <div className="p-2 rounded bg-surface-1">
                    <span className="text-slate-500 block text-[9px]">ORDERED</span>
                    <span className="font-bold text-white">20 L</span>
                  </div>
                  <div className="p-2 rounded bg-surface-1">
                    <span className="text-slate-500 block text-[9px]">BILLED</span>
                    <span className="font-bold text-white">20 L</span>
                  </div>
                  <div className="p-2 rounded bg-surface-1 border border-amber-500/30">
                    <span className="text-amber-400 block text-[9px]">RECEIVED</span>
                    <span className="font-bold text-amber-300">12 L</span>
                  </div>
                  <div className="p-2 rounded bg-surface-1 border border-rose-500/30">
                    <span className="text-rose-400 block text-[9px]">SHORTFALL</span>
                    <span className="font-bold text-rose-400">8 L (₹486.40)</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-white/[0.04]">
                  <span className="text-[11px] text-slate-300 font-medium">Automatic Resolution: Generate debit note to recover shortage.</span>
                  <button
                    onClick={() => onNavigateTo('invoices')}
                    className="btn-primary text-xs py-1.5 px-3"
                  >
                    Generate ₹486.40 Debit Note
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
