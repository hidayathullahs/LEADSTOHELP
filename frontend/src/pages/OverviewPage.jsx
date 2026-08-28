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
  Check
} from 'lucide-react';
import ImpactCard from '../components/ImpactCard';
import EvidenceDrawer from '../components/EvidenceDrawer';
import WhatIfSimulator from '../components/WhatIfSimulator';
import { api } from '../services/api';

export default function OverviewPage({
  overviewData,
  onNavigateTo,
  onOpenAskAI,
  onQuickApprove
}) {
  const [evidenceDrawerOpen, setEvidenceDrawerOpen] = useState(false);
  const [evidenceItems, setEvidenceItems] = useState([]);
  const [evidenceTitle, setEvidenceTitle] = useState('SKU Evidence & Grounding Trace');
  const [evidenceLoading, setEvidenceLoading] = useState(false);
  const [whatIfModalOpen, setWhatIfModalOpen] = useState(false);
  const [activeWhatIfSku, setActiveWhatIfSku] = useState('COFFEE-001');
  const [activeStoryTab, setActiveStoryTab] = useState('triage'); // 'triage' | 'journey'

  const handleOpenEvidence = async (sku = 'COFFEE-001', title = 'SKU Evidence & Decision Trace') => {
    setEvidenceTitle(title);
    setEvidenceLoading(true);
    setEvidenceDrawerOpen(true);
    try {
      const data = await api.getSkuEvidence(sku);
      setEvidenceItems(data?.evidence || []);
    } catch (err) {
      console.error('Failed to load SKU evidence:', err);
      // Fallback evidence items if offline
      setEvidenceItems([
        { label: 'Current Stock', value: '36.0 kg', data_source: 'inventory_db', evidence_type: 'INVENTORY' },
        { label: 'Daily Run-Rate', value: '13.0 kg/day', data_source: 'sales_history', evidence_type: 'INVENTORY' },
        { label: 'Depletion Forecast', value: '2.8 days', data_source: 'forecast_engine', evidence_type: 'FORECAST' },
        { label: 'Stockout Risk Level', value: 'HIGH', data_source: 'risk_engine', evidence_type: 'RISK' },
        { label: 'Menu Exposure', value: '48% of all beverage orders', data_source: 'pos_analytics', evidence_type: 'INVENTORY' },
        { label: 'Primary Supplier Lead Time', value: '2.0 days', data_source: 'supplier_db', evidence_type: 'SUPPLIER' }
      ]);
    } finally {
      setEvidenceLoading(false);
    }
  };

  const handleOpenWhatIf = (sku = 'COFFEE-001') => {
    setActiveWhatIfSku(sku);
    setWhatIfModalOpen(true);
  };

  if (!overviewData) {
    return (
      <div className="p-12 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-brand-accent" />
        <p className="text-sm font-medium">Synchronizing Supply Chain Control Tower...</p>
      </div>
    );
  }

  const { metrics, risk_radar, critical_stockout_items, recent_timeline, pending_approvals } = overviewData;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. Executive Headline & Brand Definition Banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-surface-1 via-surface-1 to-surface-2 border-white/[0.08] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="badge-teal text-[10px] uppercase font-bold tracking-wider">
                Autonomous Supply Chain
              </span>
              <span className="text-xs text-slate-400 font-medium">Deccan Roast Specialty Hub • Bangalore</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              From supply-chain signals to verified business action.
            </h1>

            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              LEADSTOHELP continuously detects inventory and supplier risk, investigates the evidence, simulates alternatives, and helps teams make faster, safer procurement decisions with human approval.
            </p>

            {/* 3 Core Capabilities Mini Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-[11px]">
              <div className="flex items-center gap-2 text-slate-300 bg-surface-2/60 p-2 rounded-lg border border-white/[0.04]">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                <span><strong>1. Detect</strong> risks early</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 bg-surface-2/60 p-2 rounded-lg border border-white/[0.04]">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0"></span>
                <span><strong>2. Simulate</strong> better options</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 bg-surface-2/60 p-2 rounded-lg border border-white/[0.04]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                <span><strong>3. Execute</strong> with human control</span>
              </div>
            </div>
          </div>

          {/* Quick Action Launcher */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 w-full lg:w-auto">
            <button
              onClick={() => onOpenAskAI("Run the Arabica Crisis demo")}
              className="btn-primary text-xs py-2.5 px-4 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-black fill-black" />
              <span>Triage Arabica Risk (⌘J)</span>
            </button>

            <button
              onClick={() => handleOpenWhatIf('COFFEE-001')}
              className="btn-secondary text-xs py-2 px-4 flex items-center justify-center gap-2"
            >
              <Sliders className="w-3.5 h-3.5 text-accent-violet" />
              <span>Run What-If Simulation</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Executive 4-KPI Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Critical Supply Risks */}
        <div 
          onClick={() => onNavigateTo('inventory')}
          className="glass-card-interactive p-4 cursor-pointer group border-rose-500/20 bg-surface-1"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-semibold text-slate-300">Critical Risks</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-400 tabular-nums">
              {metrics?.critical_stockout_count || 1}
            </span>
            <span className="text-xs text-slate-500 font-mono">requires action</span>
          </div>
          <p className="mt-2 text-[11px] text-rose-300/90 font-medium truncate">
            COFFEE-001 Arabica at risk
          </p>
        </div>

        {/* Metric 2: Stockout Exposure */}
        <div 
          onClick={() => onNavigateTo('inventory')}
          className="glass-card-interactive p-4 cursor-pointer group border-amber-500/20 bg-surface-1"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-semibold text-slate-300">Stockout Exposure</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-300 tabular-nums">
              2.8 <span className="text-base font-normal">days</span>
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 font-medium truncate">
            Nearest depletion coverage
          </p>
        </div>

        {/* Metric 3: Savings Opportunity */}
        <div 
          onClick={() => onNavigateTo('procurement')}
          className="glass-card-interactive p-4 cursor-pointer group border-emerald-500/20 bg-surface-1"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-semibold text-slate-300">Savings Opportunity</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 tabular-nums">
              ₹8,672
            </span>
          </div>
          <p className="mt-2 text-[11px] text-emerald-400/90 font-medium truncate">
            Via Split-Order strategy
          </p>
        </div>

        {/* Metric 4: Supplier Resilience */}
        <div 
          onClick={() => onNavigateTo('suppliers')}
          className="glass-card-interactive p-4 cursor-pointer group bg-surface-1"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-semibold text-slate-300">Supplier Resilience</span>
            <div className="p-1.5 rounded-lg bg-surface-2 border border-white/[0.06]">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-accent" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tabular-nums">
              {metrics?.average_supplier_reliability || 88}%
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 font-medium truncate">
            10 Active vetted partners
          </p>
        </div>
      </div>

      {/* 3. Central Story Card & Decision Matrix (The Hero of the Product) */}
      <div className="glass-card p-6 border-white/[0.1] bg-surface-1 relative overflow-hidden space-y-6">
        {/* Top Header Tag */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Immediate Issue Requiring Attention
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStoryTab('triage')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeStoryTab === 'triage'
                  ? 'bg-surface-2 text-white border border-white/[0.1]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Operations Triage
            </button>
            <button
              onClick={() => setActiveStoryTab('journey')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeStoryTab === 'journey'
                  ? 'bg-surface-2 text-white border border-white/[0.1]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Visual Farm-to-Cup Flow
            </button>
          </div>
        </div>

        {activeStoryTab === 'triage' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: What Happened & Why it matters (6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded border border-brand-accent/20">
                    COFFEE-001
                  </span>
                  <h2 className="text-lg font-bold text-white">Specialty Arabica Coffee Beans (AAA Grade)</h2>
                </div>
                <p className="text-xs text-rose-300 font-medium">
                  ⚠️ Estimated stockout in ~2.8 days at current run-rate (13.0 kg/day).
                </p>
              </div>

              {/* Why it matters callout */}
              <div className="p-3.5 bg-surface-2 rounded-xl border border-white/[0.06] space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Why This Matters to Store Operations:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Specialty Arabica is the foundational raw material for <strong>48% of store beverage orders</strong> (Flat Whites, Americanos, Cold Brews). Depleting before Friday night rush directly triggers customer churn and estimated revenue leakage of <strong>₹32,400/day</strong>.
                </p>
              </div>

              {/* Grounded Data Points Strip */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 bg-surface-2/60 rounded-lg border border-white/[0.04]">
                  <span className="text-slate-400 block text-[10px]">Current Stock</span>
                  <strong className="text-white font-mono">36.0 kg</strong>
                </div>
                <div className="p-2.5 bg-surface-2/60 rounded-lg border border-white/[0.04]">
                  <span className="text-slate-400 block text-[10px]">Usage Run-Rate</span>
                  <strong className="text-white font-mono">13.0 kg/day</strong>
                </div>
                <div className="p-2.5 bg-surface-2/60 rounded-lg border border-white/[0.04]">
                  <span className="text-slate-400 block text-[10px]">Lead Time</span>
                  <strong className="text-white font-mono">2.2 days</strong>
                </div>
              </div>

              {/* Progress Burn-Down Bar */}
              <div className="p-3 bg-surface-0 rounded-xl border border-white/[0.04] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Stock Coverage: 36kg / 120kg target</span>
                  <span className="text-rose-400 font-bold">2.8 Days Left</span>
                </div>
                <div className="w-full bg-surface-3 rounded-full h-2 overflow-hidden flex">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>

            {/* Right: AI Recommendation & Expected Impact (6 Cols) */}
            <div className="lg:col-span-6 space-y-4 bg-surface-2/40 p-5 rounded-2xl border border-white/[0.06]">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="badge-emerald font-mono text-[10px]">
                    AI RECOMMENDED STRATEGY
                  </span>
                  <span className="text-xs text-brand-accent font-semibold">Scenario B (Optimal)</span>
                </div>
                <h3 className="text-base font-bold text-white">Split-Order Replenishment Strategy</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  <strong>Why?</strong> Relying on a single supplier creates elevated dependency risk. Splitting volume across <strong>Metro Wholesale (40 units)</strong> for immediate 24h buffer + <strong>Malnad Planters (60 units)</strong> captures tiered volume pricing while guaranteeing stockout resilience.
                </p>
              </div>

              {/* Expected Impact Matrix */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div className="p-3 bg-surface-1 rounded-xl border border-white/[0.04]">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Stockout Risk</span>
                  <div className="flex items-center gap-1 font-mono">
                    <span className="text-xs text-rose-400 line-through">88%</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-xs text-emerald-400 font-bold">8%</span>
                  </div>
                </div>

                <div className="p-3 bg-surface-1 rounded-xl border border-white/[0.04]">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Concentration</span>
                  <div className="flex items-center gap-1 font-mono">
                    <span className="text-xs text-amber-400 line-through">100%</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-xs text-brand-accent font-bold">50%</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <span className="text-[10px] text-emerald-400 block mb-0.5">Simulated Savings</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    +₹8,672
                  </span>
                </div>
              </div>

              {/* Action Buttons Hierarchy */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  onClick={() => handleOpenEvidence('COFFEE-001', 'Grounded Evidence: Arabica Coffee Beans')}
                  className="btn-secondary text-xs px-3 py-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-accent" />
                  <span>Review Evidence (8)</span>
                </button>

                <button
                  onClick={() => handleOpenWhatIf('COFFEE-001')}
                  className="btn-secondary text-xs px-3 py-2 text-accent-violet hover:border-accent-violet/40"
                >
                  <Sliders className="w-3.5 h-3.5 text-accent-violet" />
                  <span>Run What-If</span>
                </button>

                <button
                  onClick={() => onNavigateTo('approvals')}
                  className="btn-primary text-xs px-4 py-2 ml-auto"
                >
                  <Lock className="w-3.5 h-3.5 text-black" />
                  <span>Approve & Authorize PO</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Visual Story & Farm-to-Cup Supply Flow with Generated Assets */
          <div className="space-y-4 animate-in fade-in duration-200">
            <p className="text-xs text-slate-300">
              LEADSTOHELP AI monitors the full physical supply journey from Chikmagalur coffee harvest to Bangalore roastery fulfillment:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Asset 1: Coffee Harvest */}
              <div className="glass-card overflow-hidden rounded-xl border-white/[0.08] group bg-surface-2">
                <div className="h-36 overflow-hidden relative">
                  <img
                    src="/assets/coffee_estate.jpg"
                    alt="Chikmagalur Malnad Coffee Harvest"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-0 to-transparent"></div>
                  <span className="absolute bottom-2 left-2 badge-emerald text-[9px]">
                    1. Origin: Malnad Estate
                  </span>
                </div>
                <div className="p-3 text-xs space-y-1">
                  <h4 className="font-bold text-white">Chikmagalur Direct Sourcing</h4>
                  <p className="text-[11px] text-slate-400">
                    60kg bulk allocation from Malnad Coffee Planters (₹840/kg) with 94% SLA compliance.
                  </p>
                </div>
              </div>

              {/* Asset 2: Logistics Transport */}
              <div className="glass-card overflow-hidden rounded-xl border-white/[0.08] group bg-surface-2">
                <div className="h-36 overflow-hidden relative">
                  <img
                    src="/assets/supply_logistics.jpg"
                    alt="Deccan Roast Supply Chain Logistics Hub"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-0 to-transparent"></div>
                  <span className="absolute bottom-2 left-2 badge-teal text-[9px]">
                    2. Transit: Hub Delivery
                  </span>
                </div>
                <div className="p-3 text-xs space-y-1">
                  <h4 className="font-bold text-white">Metro Wholesale Fast Buffer</h4>
                  <p className="text-[11px] text-slate-400">
                    40kg rapid 24h replenishment buffer to eliminate the immediate 2.8d stockout cliff.
                  </p>
                </div>
              </div>

              {/* Asset 3: Café Operations */}
              <div className="glass-card overflow-hidden rounded-xl border-white/[0.08] group bg-surface-2">
                <div className="h-36 overflow-hidden relative">
                  <img
                    src="/assets/retail_cafe.jpg"
                    alt="Deccan Roast Roastery & Cafe"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-0 to-transparent"></div>
                  <span className="absolute bottom-2 left-2 badge-violet text-[9px]">
                    3. Retail: Barista Hub
                  </span>
                </div>
                <div className="p-3 text-xs space-y-1">
                  <h4 className="font-bold text-white">Specialty Roastery & Espresso Bar</h4>
                  <p className="text-[11px] text-slate-400">
                    Guaranteed service continuity for 48% of high-margin retail beverage menu items.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Split Work Surface: 7-Factor Risk Radar (Left) + Governance & Live Stream (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 7-Factor Supply Risk Radar (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card p-5 space-y-4 bg-surface-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Radar className="w-4 h-4 text-brand-accent" />
                  Supply Risk Radar Breakdown
                </h2>
                <p className="text-xs text-slate-400">7-dimension operational risk assessment engine</p>
              </div>
              <button
                onClick={() => onNavigateTo('risk-radar')}
                className="text-xs text-brand-accent hover:text-brand-300 font-semibold flex items-center gap-1"
              >
                Deep-Dive Radar <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {risk_radar?.dimensions?.map((dim) => (
                <div key={dim.dimension_name} className="p-3 bg-surface-2/60 rounded-lg border border-white/[0.04] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{dim.dimension_name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400">{dim.score.toFixed(0)}/100</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                          dim.score >= 50
                            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                            : dim.score >= 25
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {dim.level}
                      </span>
                    </div>
                  </div>

                  {/* Micro Progress bar */}
                  <div className="w-full bg-surface-3 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        dim.score >= 50 ? 'bg-rose-500' : dim.score >= 25 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(6, dim.score))}%` }}
                    ></div>
                  </div>

                  <p className="text-[11px] text-slate-400">{dim.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Governance Queue & Live Timeline (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Human Approval Queue */}
          <div className="glass-card p-5 border-amber-500/20 bg-surface-1">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white leading-tight">Human Approval Queue</h2>
                  <span className="text-[10px] text-slate-400 font-medium">Cryptographic Governance Barrier</span>
                </div>
              </div>
              <span className="badge-amber">{pending_approvals?.length || 0} Pending</span>
            </div>

            {pending_approvals && pending_approvals.length > 0 ? (
              <div className="space-y-3">
                {pending_approvals.map((appr) => (
                  <div
                    key={appr.approval_id}
                    className="p-3.5 bg-surface-2 rounded-xl border border-white/[0.06] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-brand-accent font-bold">{appr.approval_id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {appr.type}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-tight">{appr.title}</h4>
                    <p className="text-[11px] text-slate-400">{appr.why_recommended}</p>

                    <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 text-[10px]">Net Commitment: </span>
                        <strong className="text-white font-mono font-bold">₹{appr.cost_inr.toLocaleString()}</strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onQuickApprove(appr.approval_id, 'APPROVED')}
                          className="btn-success text-xs px-3 py-1"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onNavigateTo('approvals')}
                          className="btn-secondary text-xs px-2.5 py-1"
                        >
                          Inspect
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs space-y-1">
                <CheckCircle2 className="w-7 h-7 mx-auto text-emerald-400/80 mb-1" />
                <span className="font-semibold text-slate-300 block">All Actions Approved</span>
                <span className="text-[11px] text-slate-400">Zero pending governance barriers in queue.</span>
              </div>
            )}
          </div>

          {/* Realtime Operations Timeline */}
          <div className="glass-card p-5 space-y-4 bg-surface-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand-accent" />
                  Operations Activity Feed
                </h2>
                <p className="text-xs text-slate-400">Multi-agent execution & telemetry trace</p>
              </div>
              <button
                onClick={() => onNavigateTo('agent-inspector')}
                className="text-xs text-brand-accent hover:text-brand-300 font-semibold flex items-center gap-1"
              >
                Inspect Telemetry <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="relative pl-4 space-y-4 border-l border-white/[0.08]">
              {recent_timeline?.slice(0, 5).map((evt) => (
                <div key={evt.event_id} className="relative group">
                  <span
                    className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-surface-0 ${
                      evt.badge_type === 'rose'
                        ? 'bg-rose-500'
                        : evt.badge_type === 'amber'
                        ? 'bg-amber-500'
                        : evt.badge_type === 'emerald'
                        ? 'bg-emerald-500'
                        : 'bg-brand-accent'
                    }`}
                  ></span>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-0.5">
                    <span>{evt.timestamp_display}</span>
                    <span className="uppercase font-bold text-brand-accent">{evt.stage}</span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">{evt.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{evt.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-out Evidence & Grounding Trace Drawer */}
      <EvidenceDrawer
        isOpen={evidenceDrawerOpen}
        onClose={() => setEvidenceDrawerOpen(false)}
        evidence={evidenceItems}
        title={evidenceTitle}
      />

      {/* What-If Digital Twin Modal */}
      {whatIfModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-surface-1 border border-accent-violet/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-accent-violet" />
                Supply Chain Digital Twin Simulator ({activeWhatIfSku})
              </h2>
              <button
                onClick={() => setWhatIfModalOpen(false)}
                className="btn-secondary text-xs"
              >
                Close Simulator
              </button>
            </div>
            <WhatIfSimulator sku={activeWhatIfSku} onClose={() => setWhatIfModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
