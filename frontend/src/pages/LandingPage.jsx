import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Package,
  Sliders,
  CheckCircle2,
  Lock,
  Activity,
  DollarSign,
  TrendingDown,
  Clock,
  Layers,
  FileCheck,
  Users,
  Store,
  Play,
  ChevronRight,
  Radar,
  Radio,
  BarChart3,
  Bot,
  Zap,
  Check,
  AlertTriangle,
  Cpu,
  RefreshCw,
  Search,
  Eye,
  FileSpreadsheet,
  Scan,
  AlertCircle,
  TrendingUp,
  Brain,
  Crosshair,
  UserCheck
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import heroBgImg from '../assets/hero_bg.png';

const SCENARIOS = [
  {
    id: 'B',
    name: 'B. Split-Order Strategy (AI Recommended)',
    recommended: true,
    allocation: '40 kg Metro Wholesale (24h) + 60 kg Malnad Planters (Bulk)',
    cost: '₹86,328',
    delivery: '24 Hours (Metro) / 3 Days (Malnad)',
    risk: '8%',
    riskColor: 'text-emerald-400',
    savings: '+₹8,672',
    desc: 'Combines rapid 24h buffer delivery to prevent Friday stockout cliff with bulk tiered volume discount.'
  },
  {
    id: 'A',
    name: 'A. Single Supplier (Malnad Only)',
    recommended: false,
    allocation: '100 kg Malnad Coffee Planters',
    cost: '₹84,000',
    delivery: '3.5 Days Lead Time',
    risk: '72%',
    riskColor: 'text-rose-400',
    savings: '+₹11,000',
    desc: 'Cheapest unit price (₹840/kg) but high delivery risk. 3.5-day transit causes Friday evening stockout.'
  },
  {
    id: 'D',
    name: 'D. Cheapest Option (Aura Commodities)',
    recommended: false,
    allocation: '100 kg Aura Raw Commodities',
    cost: '₹79,500',
    delivery: '4.0 Days Lead Time',
    risk: '85%',
    riskColor: 'text-rose-400',
    savings: '+₹15,500',
    desc: 'Lowest upfront cost but 78% historical supplier reliability rating causes severe delivery delay risk.'
  },
  {
    id: 'E',
    name: 'E. Reliability-First (Metro Rapid Only)',
    recommended: false,
    allocation: '100 kg Metro Wholesale Hub',
    cost: '₹95,000',
    delivery: '24 Hours Same-Day',
    risk: '4%',
    riskColor: 'text-emerald-400',
    savings: '-₹0 (List Price)',
    desc: 'Guaranteed 24-hour fulfillment but pays highest spot list price without volume discount.'
  },
  {
    id: 'F',
    name: 'F. Emergency Expedited (Air Cargo Express)',
    recommended: false,
    allocation: '100 kg BlueDart Cold Express',
    cost: '₹108,000',
    delivery: '12 Hours Immediate',
    risk: '2%',
    riskColor: 'text-emerald-400',
    savings: '-₹13,000 (Expedited Premium)',
    desc: 'Immediate emergency courier. Reserved strictly for complete stockout scenarios.'
  }
];

const AGENT_PIPELINE = [
  { id: 'orch', name: 'Master Orchestrator', role: 'Intent Parsing & Multi-Agent Routing', latency: '42ms', desc: 'Analyzes operational triggers and coordinates parallel agent dispatch across inventory, suppliers, and procurement.' },
  { id: 'inv', name: 'Inventory Risk Agent', role: 'Run-rate & Stockout Prediction', latency: '88ms', desc: 'Queries POS logs and safety thresholds to forecast the 2.8-day Arabica depletion cliff.' },
  { id: 'sup', name: 'Supplier Intelligence Agent', role: 'SLA Scoring & Reliability Verification', latency: '115ms', desc: 'Evaluates 10 vetted partners, historical on-time delivery metrics, and lead-time volatility.' },
  { id: 'sim', name: 'Simulation Digital Twin', role: '6-Scenario Multi-Sourcing Optimization', latency: '190ms', desc: 'Simulates cost vs risk trade-offs to discover the optimal Split-Order replenishment strategy.' },
  { id: 'gov', name: 'Governance Barrier Agent', role: 'Cryptographic Human Sign-Off Enforcement', latency: '35ms', desc: 'Guarantees zero autonomous spend; stages the ₹86,328 PO directly in the Human Approval Queue.' },
  { id: 'ver', name: 'Verification Agent', role: 'OCR 3-Way Matching & Discrepancy Detection', latency: '140ms', desc: 'Audits physical delivery challans against purchase order line items to catch supplier shortfalls.' }
];

export default function LandingPage({
  onEnterApp,
  onStartDemoTour,
  onOpenAskAI,
  onNavigateToLogin
}) {
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [demandSurge, setDemandSurge] = useState(20);
  const [selectedAgent, setSelectedAgent] = useState(AGENT_PIPELINE[0]);
  const [selectedCircuitNode, setSelectedCircuitNode] = useState(2);
  const [showDebitNoteSuccess, setShowDebitNoteSuccess] = useState(false);

  // Dynamic calculations for What-If Playground
  const baseStock = 36; // kg
  const baseRate = 13; // kg/day
  const adjustedRate = baseRate * (1 + demandSurge / 100);
  const daysRemaining = (baseStock / adjustedRate).toFixed(1);
  const stockoutRisk = Math.min(99, Math.round(75 + demandSurge * 0.9));
  const suggestedOrder = Math.round(adjustedRate * 7); // 7-day buffer

  return (
    <div className="min-h-screen w-full bg-surface-0 text-slate-100 font-sans selection:bg-brand-accent selection:text-black overflow-x-hidden">
      {/* 1. TOP NAVIGATION HEADER */}
      <header className="h-16 border-b border-white/[0.08] bg-surface-0/80 backdrop-blur-xl sticky top-0 z-50 px-6 sm:px-12 flex items-center justify-between">
        {/* Brand Logo with 3D Hexagonal Icon */}
        <div className="flex items-center gap-3">
          <img
            src={logoImg}
            alt="LEADSTOHELP AI Logo"
            className="w-9 h-9 object-contain drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]"
          />
          <div>
            <div className="flex items-center gap-2 leading-none">
              <span className="font-extrabold tracking-wider text-base text-white">
                LEADSTOHELP
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold block mt-0.5">
              AI CONTROL TOWER
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <button onClick={onEnterApp} className="hover:text-cyan-400 transition-colors">DASHBOARD</button>
          <a href="#whatif-simulator" className="hover:text-cyan-400 transition-colors">SOLUTIONS</a>
          <a href="#matrix-compare" className="hover:text-cyan-400 transition-colors">INTEGRATIONS</a>
          <a href="#invoice-audit" className="hover:text-cyan-400 transition-colors">RESOURCES</a>
          <a href="#farm-flow" className="hover:text-cyan-400 transition-colors">COMPANY</a>
        </nav>

        {/* Right Action Group */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-1 border border-white/[0.08] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 text-[11px]">System Status: <strong className="text-emerald-400">Operational</strong></span>
          </div>

          <button
            onClick={onStartDemoTour}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-1 hover:bg-surface-2 border border-white/[0.08] text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-md"
          >
            <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            <span>3-Minute Demo</span>
          </button>

          <button
            onClick={() => onNavigateToLogin ? onNavigateToLogin('login') : onEnterApp()}
            className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-surface-1 transition-all"
          >
            <span>Sign In</span>
          </button>

          <button
            onClick={() => onNavigateToLogin ? onNavigateToLogin('signup') : onEnterApp()}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-glow-teal font-bold"
          >
            <span>Sign Up Free</span>
            <ArrowRight className="w-3.5 h-3.5 text-black" />
          </button>
        </div>
      </header>

      {/* 2. FULL-BLEED HERO BANNER (Directly matching user image) */}
      <section className="relative w-full min-h-[92vh] flex flex-col justify-between px-6 sm:px-12 pt-10 pb-8 overflow-hidden bg-surface-0">
        {/* Glowing Global Supply Chain Digital Twin Hero Visual */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src={heroBgImg}
            alt="LEADSTOHELP AI Global Supply Chain Digital Twin"
            className="w-full h-full object-cover object-right opacity-95 filter saturate-125 contrast-105"
          />
          {/* Soft gradient mask on left to ensure live typography has 100% legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-surface-0/95 via-surface-0/40 to-transparent lg:w-3/5"></div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface-0 to-transparent"></div>
        </div>

        {/* Hero Top Content Area */}
        <div className="max-w-3xl space-y-6 pt-4 text-left relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-xs shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-cyan-200 font-bold tracking-wider uppercase text-[11px]">
              ◆ AI-POWERED RETAIL OPERATIONS PLATFORM
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] drop-shadow-2xl">
            From supply-chain <br />
            signals to <span className="text-cyan-400 drop-shadow-[0_0_30px_rgba(0,240,255,0.8)]">verified</span> <br />
            <span className="text-cyan-400 drop-shadow-[0_0_30px_rgba(0,240,255,0.8)]">business action.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-xl leading-relaxed drop-shadow-md">
            LEADSTOHELP helps retail teams detect inventory stockouts and supplier risks early, simulate smarter procurement decisions, and turn AI recommendations into human-approved business action.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={() => onNavigateToLogin ? onNavigateToLogin('signup') : onEnterApp()}
              className="btn-primary text-sm py-3 px-6 flex items-center gap-2 shadow-glow-teal font-bold"
            >
              <span>Sign Up Free</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>

            <button
              onClick={() => onNavigateToLogin ? onNavigateToLogin('login') : onEnterApp()}
              className="btn-secondary text-sm py-3 px-5 flex items-center gap-2 font-semibold bg-surface-1/90"
            >
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>Sign In</span>
            </button>

            <button
              onClick={onStartDemoTour}
              className="btn-secondary text-sm py-3 px-5 flex items-center gap-2 backdrop-blur-md font-semibold bg-surface-1/90"
            >
              <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              <span>3-Min Demo</span>
            </button>

            <button
              onClick={() => onOpenAskAI("Why is Arabica coffee at risk and what should we buy?")}
              className="btn-secondary text-sm py-3 px-5 flex items-center gap-2 text-accent-violet hover:border-accent-violet/40 backdrop-blur-md font-semibold bg-surface-1/90"
            >
              <Sparkles className="w-4 h-4 text-accent-violet" />
              <span>Ask AI Copilot</span>
            </button>
          </div>
        </div>

        {/* 4 Feature Cards & Integrated Telemetry Bar (Anchored at the bottom of the hero) */}
        <div className="space-y-4 pt-12 relative z-10 max-w-7xl mx-auto w-full">
          {/* 4 Glowing Core Feature Cards with Luxe Frosted Glass */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
            <div className="p-4 rounded-3xl bg-slate-950/25 hover:bg-slate-900/40 backdrop-blur-2xl border border-white/[0.12] hover:border-cyan-400/60 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_8px_32px_0_rgba(0,240,255,0.2)] group relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="w-9 h-9 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 mb-2.5 shadow-glow-teal group-hover:scale-110 transition-transform">
                <Crosshair className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-1">
                REAL-TIME VISIBILITY
              </h3>
              <p className="text-[11px] text-slate-200/90 leading-relaxed drop-shadow-sm">
                Monitor every movement across your supply chain in real time.
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-slate-950/25 hover:bg-slate-900/40 backdrop-blur-2xl border border-white/[0.12] hover:border-emerald-400/60 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_8px_32px_0_rgba(16,185,129,0.2)] group relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-300 mb-2.5 shadow-glow-emerald group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-1">
                RISK PREDICTION
              </h3>
              <p className="text-[11px] text-slate-200/90 leading-relaxed drop-shadow-sm">
                AI models predict disruptions before they impact your business.
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-slate-950/25 hover:bg-slate-900/40 backdrop-blur-2xl border border-white/[0.12] hover:border-cyan-400/60 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_8px_32px_0_rgba(0,240,255,0.2)] group relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="w-9 h-9 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 mb-2.5 shadow-glow-teal group-hover:scale-110 transition-transform">
                <Brain className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-1">
                SMART RECOMMENDATIONS
              </h3>
              <p className="text-[11px] text-slate-200/90 leading-relaxed drop-shadow-sm">
                Get AI-powered recommendations with explainable insights you can trust.
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-slate-950/25 hover:bg-slate-900/40 backdrop-blur-2xl border border-white/[0.12] hover:border-cyan-400/60 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_8px_32px_0_rgba(0,240,255,0.2)] group relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="w-9 h-9 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 mb-2.5 shadow-glow-teal group-hover:scale-110 transition-transform">
                <UserCheck className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-1">
                HUMAN-IN-THE-LOOP
              </h3>
              <p className="text-[11px] text-slate-200/90 leading-relaxed drop-shadow-sm">
                Collaborate, review, and take action with confidence.
              </p>
            </div>
          </div>

          {/* Integrated Telemetry & Analytics Bar with Transparent Frosted Glass */}
          <div className="p-5 rounded-3xl bg-slate-950/30 border border-cyan-500/35 hover:border-cyan-400/60 shadow-[0_8px_32px_0_rgba(0,240,255,0.15)] ring-1 ring-white/10 backdrop-blur-2xl relative overflow-hidden transition-all duration-300">
            {/* Top Cyan Glowing Line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-500 opacity-80" />
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-left font-mono">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-slate-300 text-[10px] uppercase font-bold tracking-wider">
                  <Package className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ACTIVE SHIPMENTS</span>
                </div>
                <div className="text-xl font-black text-white drop-shadow-md">1,250</div>
                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>↑ 12.5% vs last 24h</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-slate-300 text-[10px] uppercase font-bold tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>AT-RISK ORDERS</span>
                </div>
                <div className="text-xl font-black text-amber-400 drop-shadow-md">87</div>
                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  <span>↓ 8.2% vs last 24h</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-slate-300 text-[10px] uppercase font-bold tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  <span>PREDICTED DELAYS</span>
                </div>
                <div className="text-xl font-black text-rose-400 drop-shadow-md">24</div>
                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  <span>↓ 15.1% vs last 24h</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-slate-300 text-[10px] uppercase font-bold tracking-wider">
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>FILL RATE</span>
                </div>
                <div className="text-xl font-black text-emerald-400 drop-shadow-md">98.7%</div>
                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>↑ 2.3% vs last 24h</span>
                </div>
              </div>

              {/* Sparkline Graph */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-300 font-bold uppercase text-[9px]">HEALTH</span>
                  <span className="badge-emerald text-[8px] font-bold py-0.5 px-2 bg-emerald-500/20">EXCELLENT</span>
                </div>
                <div className="h-6 w-full">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path
                      d="M 0,22 Q 15,10 30,18 T 60,8 T 85,15 T 100,5"
                      fill="none"
                      stroke="#00F0FF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 0,22 Q 15,10 30,18 T 60,8 T 85,15 T 100,5 L 100,30 L 0,30 Z"
                      fill="url(#cyanGlowGradHero)"
                      opacity="0.3"
                    />
                    <defs>
                      <linearGradient id="cyanGlowGradHero" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00F0FF" />
                        <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="flex justify-between text-[8px] text-slate-400">
                  <span>00:00</span>
                  <span>12:00</span>
                  <span>24:00</span>
                </div>
              </div>

              {/* Overview Mini Box with Glass Surface */}
              <div className="p-2.5 rounded-2xl bg-slate-900/40 border border-white/[0.1] text-[9px] space-y-0.5 backdrop-blur-md shadow-inner">
                <div className="flex items-center justify-between text-cyan-400 font-bold">
                  <span>OVERVIEW</span>
                  <Activity className="w-2.5 h-2.5" />
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>EFFICIENCY</span>
                  <span className="font-bold text-white">98.7%</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>DELIVERIES</span>
                  <span className="font-bold text-white">24,532</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LIVE OPERATIONS INTELLIGENCE TOPOLOGY CIRCUIT */}
      <section className="px-6 sm:px-12 py-16 max-w-6xl mx-auto space-y-6">
        <div className="glass-card p-6 sm:p-8 bg-surface-1 border-white/[0.1] rounded-3xl space-y-6 shadow-2xl backdrop-blur-xl relative">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Live Operations Intelligence Topology
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge-teal font-mono text-[10px]">REALTIME TELEMETRY</span>
              <span className="font-mono text-xs text-brand-accent font-semibold hidden sm:inline">
                Deccan Roast Hub #BLR-01
              </span>
            </div>
          </div>

          {/* 5 Interactive Connected Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative z-10 text-xs">
            <div
              onClick={() => setSelectedCircuitNode(1)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedCircuitNode === 1
                  ? 'bg-surface-2 border-brand-accent ring-1 ring-brand-accent/40 shadow-glow-teal'
                  : 'bg-surface-2/70 border-white/[0.06] hover:bg-surface-2'
              }`}
            >
              <Store className="w-4 h-4 text-brand-accent mb-1.5" />
              <span className="font-mono text-[10px] text-slate-400 block uppercase font-bold">1. Store Ledger</span>
              <strong className="text-white block text-sm">65 SKUs Monitored</strong>
              <p className="text-[11px] text-slate-400">13kg/day coffee run-rate</p>
            </div>

            <div
              onClick={() => setSelectedCircuitNode(2)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedCircuitNode === 2
                  ? 'bg-rose-500/20 border-rose-500 ring-1 ring-rose-500/40 glow-border-rose'
                  : 'bg-rose-500/10 border-rose-500/30 hover:bg-rose-500/15'
              }`}
            >
              <Package className="w-4 h-4 text-rose-400 mb-1.5" />
              <span className="font-mono text-[10px] text-rose-300 block uppercase font-bold">2. Risk Detected</span>
              <strong className="text-rose-300 block text-sm">COFFEE-001 (2.8d left)</strong>
              <p className="text-[11px] text-rose-400/80">48% menu exposure</p>
            </div>

            <div
              onClick={() => setSelectedCircuitNode(3)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedCircuitNode === 3
                  ? 'bg-surface-2 border-accent-violet ring-1 ring-accent-violet/40 shadow-glow-violet'
                  : 'bg-surface-2/70 border-white/[0.06] hover:bg-surface-2'
              }`}
            >
              <Sliders className="w-4 h-4 text-accent-violet mb-1.5" />
              <span className="font-mono text-[10px] text-slate-400 block uppercase font-bold">3. What-If Twin</span>
              <strong className="text-white block text-sm">6 Strategies Modeled</strong>
              <p className="text-[11px] text-slate-400">Split-Order Optimal</p>
            </div>

            <div
              onClick={() => setSelectedCircuitNode(4)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedCircuitNode === 4
                  ? 'bg-amber-500/20 border-amber-500 ring-1 ring-amber-500/40'
                  : 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/15'
              }`}
            >
              <Lock className="w-4 h-4 text-amber-400 mb-1.5" />
              <span className="font-mono text-[10px] text-amber-300 block uppercase font-bold">4. Human Sign-Off</span>
              <strong className="text-amber-300 block text-sm">₹86,328 PO Staged</strong>
              <p className="text-[11px] text-amber-400/80">Zero spend bypass</p>
            </div>

            <div
              onClick={() => setSelectedCircuitNode(5)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedCircuitNode === 5
                  ? 'bg-emerald-500/20 border-emerald-500 ring-1 ring-emerald-500/40 glow-border-emerald'
                  : 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/15'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mb-1.5" />
              <span className="font-mono text-[10px] text-emerald-300 block uppercase font-bold">5. Verified Impact</span>
              <strong className="text-emerald-300 block text-sm">+₹8,672 Net Savings</strong>
              <p className="text-[11px] text-emerald-400/80">88% → 8% Stockout Risk</p>
            </div>
          </div>

          <div className="p-4 bg-surface-2 rounded-2xl border border-white/[0.06] text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">
                {selectedCircuitNode === 1 && "Step 1: Continuous Store Inventory Monitoring"}
                {selectedCircuitNode === 2 && "Step 2: Imminent Stockout Cliff Identified"}
                {selectedCircuitNode === 3 && "Step 3: Multi-Scenario Procurement Simulation"}
                {selectedCircuitNode === 4 && "Step 4: Cryptographic Human Governance Gate"}
                {selectedCircuitNode === 5 && "Step 5: Verified Financial ROI & Risk Mitigation"}
              </span>
              <span className="text-[10px] font-mono text-brand-accent">Click any step to inspect</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {selectedCircuitNode === 1 && "The Deccan Roast #BLR-01 store ledger continuously monitors run-rates across 65 perishable raw materials, milk supplies, cups, and specialty coffee beans."}
              {selectedCircuitNode === 2 && "Arabica coffee beans (COFFEE-001) are depleted to 36.0 kg. With a 13.0 kg/day consumption rate, safety stock runs out in ~2.8 days before the weekend rush."}
              {selectedCircuitNode === 3 && "The What-If Digital Twin executes 6 strategy simulations across 10 vetted suppliers, balancing rapid turnaround vs tiered bulk volume discounts."}
              {selectedCircuitNode === 4 && "Zero autonomous spend is permitted. High-impact purchase orders are staged with cryptographic verification, requiring explicit human sign-off."}
              {selectedCircuitNode === 5 && "The recommended Split-Order delivers +₹8,672 in direct savings, reduces stockout probability from 88% down to 8%, and protects ₹32,400/day beverage revenue."}
            </p>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE "WHAT-IF" DIGITAL TWIN PLAYGROUND */}
      <section id="whatif-simulator" className="px-6 sm:px-12 py-16 border-t border-white/[0.08] bg-surface-1/40">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-teal text-[10px] uppercase font-bold">
                  Interactive Simulator
                </span>
                <span className="text-xs text-slate-400">Deterministic Mathematical Digital Twin</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Try the What-If Digital Twin Live
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Drag the demand slider to test how unexpected store rushes affect your stockout window in real-time.
              </p>
            </div>

            <button
              onClick={onEnterApp}
              className="btn-primary text-xs py-2 px-4 self-start sm:self-auto font-bold"
            >
              Open Full Simulator →
            </button>
          </div>

          <div className="glass-card p-6 sm:p-8 bg-surface-1 border-white/[0.08] rounded-3xl space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5 text-xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-white uppercase tracking-wider text-[11px]">
                      Weekend Demand Surge:
                    </label>
                    <span className="font-mono text-sm font-bold text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded border border-brand-accent/20">
                      +{demandSurge}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={demandSurge}
                    onChange={(e) => setDemandSurge(Number(e.target.value))}
                    className="w-full h-2.5 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Baseline (+0%)</span>
                    <span>Moderate (+25%)</span>
                    <span>Peak Rush (+50%)</span>
                  </div>
                </div>

                <div className="p-4 bg-surface-2 rounded-2xl border border-white/[0.04] space-y-2">
                  <span className="font-bold text-slate-300 block text-xs">Simulated Run-Rate:</span>
                  <div className="flex items-baseline gap-2 font-mono">
                    <span className="text-xl font-black text-white">{adjustedRate.toFixed(1)}</span>
                    <span className="text-slate-400">kg / day (vs 13.0 baseline)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    At this consumption rate, current 36kg coffee inventory will run dry in <strong className="text-rose-400">{daysRemaining} days</strong>.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-4 bg-surface-2 rounded-2xl border border-white/[0.06] space-y-1 text-center">
                  <Clock className="w-5 h-5 text-rose-400 mx-auto" />
                  <span className="text-[10px] text-slate-400 block">Stockout Window</span>
                  <strong className="text-2xl font-black text-rose-400 block">{daysRemaining}d</strong>
                  <span className="text-[10px] text-rose-400/80 block">Critical Threshold</span>
                </div>

                <div className="p-4 bg-surface-2 rounded-2xl border border-white/[0.06] space-y-1 text-center">
                  <Radar className="w-5 h-5 text-amber-400 mx-auto" />
                  <span className="text-[10px] text-slate-400 block">Stockout Risk</span>
                  <strong className="text-2xl font-black text-amber-400 block">{stockoutRisk}%</strong>
                  <span className="text-[10px] text-amber-400/80 block">High Probability</span>
                </div>

                <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 space-y-1 text-center">
                  <Package className="w-5 h-5 text-emerald-400 mx-auto" />
                  <span className="text-[10px] text-emerald-400 block">Recommended Order</span>
                  <strong className="text-2xl font-black text-emerald-400 block">{suggestedOrder} kg</strong>
                  <span className="text-[10px] text-emerald-400/80 block">Split-Order Buffer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE 6-SCENARIO PROCUREMENT COMPARISON */}
      <section id="matrix-compare" className="px-6 sm:px-12 py-16 max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-teal text-[10px] uppercase font-bold">
                Decision Matrix
              </span>
              <span className="text-xs text-slate-400">Multi-Supplier Procurement Optimization</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Compare 6 Procurement Strategies
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              AI mathematically models every supplier permutation so you pick the best balance of cost, speed, and safety.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
          {SCENARIOS.map((sc) => {
            const isSelected = selectedScenario.id === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => setSelectedScenario(sc)}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'bg-surface-2 border-brand-accent ring-1 ring-brand-accent/40 shadow-glow-teal'
                    : 'bg-surface-1 border-white/[0.06] hover:bg-surface-2'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] font-bold text-slate-400">Scenario {sc.id}</span>
                  {sc.recommended && <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>}
                </div>
                <h4 className="font-bold text-white text-xs truncate">{sc.name.split('(')[0]}</h4>
                <div className="font-mono text-[11px] text-emerald-400 font-bold mt-1">{sc.savings}</div>
              </button>
            );
          })}
        </div>

        <div className="glass-card p-6 sm:p-8 bg-surface-1 border-white/[0.08] rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="badge-teal font-mono text-[10px]">
                  SCENARIO {selectedScenario.id}
                </span>
                {selectedScenario.recommended && (
                  <span className="badge-emerald font-mono text-[10px] font-bold">
                    ★ AI MATHEMATICALLY OPTIMAL
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white mt-1">{selectedScenario.name}</h3>
            </div>

            <button
              onClick={onEnterApp}
              className="btn-primary text-xs py-2 px-4 self-start sm:self-auto font-bold"
            >
              Execute in Control Tower →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 bg-surface-2 rounded-2xl border border-white/[0.04]">
              <span className="text-[10px] text-slate-400 block">Total Purchase Cost</span>
              <strong className="text-lg font-bold text-white">{selectedScenario.cost}</strong>
            </div>

            <div className="p-4 bg-surface-2 rounded-2xl border border-white/[0.04]">
              <span className="text-[10px] text-slate-400 block">Delivery Time</span>
              <strong className="text-lg font-bold text-white">{selectedScenario.delivery}</strong>
            </div>

            <div className="p-4 bg-surface-2 rounded-2xl border border-white/[0.04]">
              <span className="text-[10px] text-slate-400 block">Stockout Risk</span>
              <strong className={`text-lg font-bold ${selectedScenario.riskColor}`}>{selectedScenario.risk}</strong>
            </div>

            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <span className="text-[10px] text-emerald-400 block">Estimated Savings</span>
              <strong className="text-lg font-bold text-emerald-400">{selectedScenario.savings}</strong>
            </div>
          </div>

          <div className="p-4 bg-surface-2 rounded-2xl border border-white/[0.04] text-xs text-slate-300 space-y-1">
            <span className="font-bold text-white uppercase text-[11px] block">Order Allocation:</span>
            <p className="font-mono text-brand-accent">{selectedScenario.allocation}</p>
            <p className="text-slate-400 text-[11px] pt-1">{selectedScenario.desc}</p>
          </div>
        </div>
      </section>

      {/* 6. MULTIMODAL INVOICE OCR VISION AUDIT SHOWCASE */}
      <section id="invoice-audit" className="px-6 sm:px-12 py-16 border-t border-white/[0.08] bg-surface-1/40">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-teal text-[10px] uppercase font-bold">
                  Multimodal Gemini Vision
                </span>
                <span className="text-xs text-slate-400">Automated 3-Way Reconciler</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Does What We Paid For Match What We Received?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                OCR extracts line items from physical paper delivery challans and catches quantity shortages before invoices get paid.
              </p>
            </div>

            <button
              onClick={onEnterApp}
              className="btn-secondary text-xs py-2 px-4 self-start sm:self-auto flex items-center gap-1.5 font-semibold"
            >
              <FileCheck className="w-3.5 h-3.5 text-brand-accent" />
              <span>Inspect Invoice Auditor →</span>
            </button>
          </div>

          <div className="glass-card p-6 sm:p-8 bg-surface-1 border-white/[0.08] rounded-3xl space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-white/[0.1] shadow-xl group">
                  <img
                    src="/assets/invoice_ocr.jpg"
                    alt="Multimodal OCR Vision Invoice Scan"
                    className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 badge-teal font-mono text-[10px] bg-black/75 backdrop-blur-md">
                    <Scan className="w-3 h-3 mr-1" />
                    GEMINI OCR LIVE SCAN: INV-KAV-8842
                  </div>
                  <div className="absolute bottom-3 right-3 badge-amber font-mono text-[10px] bg-black/75 backdrop-blur-md">
                    ⚠️ 8L SHORTAGE DETECTED
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
                  <span>Vendor: <strong>Kaveri Organic Dairy</strong></span>
                  <span>Confidence: <strong className="text-emerald-400">98.7%</strong></span>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-4 text-xs">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="badge-amber font-mono text-[10px]">
                      3-WAY MATCH VARIANCE FLAGGED
                    </span>
                    <span className="font-mono text-rose-400 font-bold">₹486.40 Leakage</span>
                  </div>
                  <h3 className="text-base font-bold text-white">INV-KAV-8842 • Full Cream Barista Milk</h3>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    The supplier billed <strong>100 Liters</strong> on their invoice, but physical bay scanning verified only <strong>92 Liters</strong> received.
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center font-mono">
                  <div className="p-3 bg-surface-2 rounded-xl border border-white/[0.04]">
                    <span className="text-[10px] text-slate-400 block">ORDERED</span>
                    <strong className="text-white text-xs">100 L</strong>
                  </div>
                  <div className="p-3 bg-surface-2 rounded-xl border border-white/[0.04]">
                    <span className="text-[10px] text-slate-400 block">INVOICED</span>
                    <strong className="text-white text-xs">100 L</strong>
                  </div>
                  <div className="p-3 bg-surface-2 rounded-xl border border-white/[0.04]">
                    <span className="text-[10px] text-slate-400 block">RECEIVED</span>
                    <strong className="text-white text-xs">92 L</strong>
                  </div>
                  <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/30">
                    <span className="text-[10px] text-rose-300 block">SHORTAGE</span>
                    <strong className="text-rose-400 text-xs">-8 L</strong>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setShowDebitNoteSuccess(true);
                      setTimeout(() => setShowDebitNoteSuccess(false), 3000);
                    }}
                    className="btn-primary text-xs py-2 px-4 w-full flex items-center justify-center gap-1.5 font-bold"
                  >
                    {showDebitNoteSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-black" />
                        <span>Debit Note #DBN-8842 Generated!</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-black" />
                        <span>Generate ₹486.40 Debit Note</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. VISUAL "FARM-TO-CUP" REAL PHYSICAL SUPPLY CHAIN SHOWCASE */}
      <section id="farm-flow" className="px-6 sm:px-12 py-16 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="badge-teal text-[10px] uppercase font-bold tracking-wider">
            Physical Supply Chain Flow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            From Chikmagalur Estates to Bangalore Cafés
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Deccan Roast Specialty Coffee physical operations and verified supplier partners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card overflow-hidden rounded-3xl border-white/[0.08] bg-surface-1 group flex flex-col justify-between hover:border-white/[0.18] transition-all">
            <div>
              <div className="h-48 overflow-hidden relative">
                <img
                  src="/assets/coffee_estate.jpg"
                  alt="Malnad Coffee Estate harvest"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 badge-teal font-mono text-[10px] bg-black/60 backdrop-blur-md">
                  1. FARM ORIGIN
                </div>
              </div>
              <div className="p-5 space-y-2 text-xs">
                <h3 className="text-sm font-bold text-white">Malnad Coffee Planters</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Chikmagalur high-altitude shade-grown Arabica estate. Long-standing tier-1 bulk supplier with 94.0% reliability rating.
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-white/[0.04] bg-surface-2 flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span>Lead Time: <strong>3.5 Days</strong></span>
              <span className="text-emerald-400">₹840/kg Tier</span>
            </div>
          </div>

          <div className="glass-card overflow-hidden rounded-3xl border-white/[0.08] bg-surface-1 group flex flex-col justify-between hover:border-white/[0.18] transition-all">
            <div>
              <div className="h-48 overflow-hidden relative">
                <img
                  src="/assets/supply_logistics.jpg"
                  alt="Metro Wholesale supply logistics"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 badge-emerald font-mono text-[10px] bg-black/60 backdrop-blur-md">
                  2. RAPID LOGISTICS
                </div>
              </div>
              <div className="p-5 space-y-2 text-xs">
                <h3 className="text-sm font-bold text-white">Metro Wholesale Distribution</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Bangalore regional distribution hub. Dedicated rapid-dispatch fleet provides 24-hour buffer delivery for stockout emergencies.
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-white/[0.04] bg-surface-2 flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span>Turnaround: <strong>24 Hours</strong></span>
              <span className="text-brand-accent">98.5% On-Time</span>
            </div>
          </div>

          <div className="glass-card overflow-hidden rounded-3xl border-white/[0.08] bg-surface-1 group flex flex-col justify-between hover:border-white/[0.18] transition-all">
            <div>
              <div className="h-48 overflow-hidden relative">
                <img
                  src="/assets/retail_cafe.jpg"
                  alt="Deccan Roast flagship retail store"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 badge-violet font-mono text-[10px] bg-black/60 backdrop-blur-md">
                  3. STORE OPERATIONS
                </div>
              </div>
              <div className="p-5 space-y-2 text-xs">
                <h3 className="text-sm font-bold text-white">Deccan Roast #BLR-01</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Flagship roastery & cafe in Indiranagar. Consumes 13kg/day of Arabica across flat whites, pour-overs, and espresso specialties.
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-white/[0.04] bg-surface-2 flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span>Run-rate: <strong>13.0 kg/day</strong></span>
              <span className="text-rose-400">48% Menu Share</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. 7-AGENT MULTI-AGENT ARCHITECTURE */}
      <section className="px-6 sm:px-12 py-16 border-t border-white/[0.08] max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-violet text-[10px] uppercase font-bold">
                System Architecture
              </span>
              <span className="text-xs text-slate-400">Deterministic Multi-Agent Coordination</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              7 Specialized Agents Working in Harmony
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Click any agent below to inspect its execution responsibility and latency performance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          {AGENT_PIPELINE.map((ag) => {
            const isSelected = selectedAgent.id === ag.id;
            return (
              <button
                key={ag.id}
                onClick={() => setSelectedAgent(ag)}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'bg-surface-2 border-accent-violet ring-1 ring-accent-violet/40 shadow-glow-violet'
                    : 'bg-surface-1 border-white/[0.06] hover:bg-surface-2'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Bot className="w-4 h-4 text-accent-violet" />
                  <span className="font-mono text-[9px] text-slate-500">{ag.latency}</span>
                </div>
                <h4 className="font-bold text-white text-xs truncate">{ag.name}</h4>
              </button>
            );
          })}
        </div>

        <div className="glass-card p-6 bg-surface-1 border-white/[0.08] rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div>
              <span className="badge-violet font-mono text-[10px]">{selectedAgent.role}</span>
              <h3 className="text-base font-bold text-white mt-1">{selectedAgent.name}</h3>
            </div>
            <span className="font-mono text-xs text-brand-accent bg-surface-2 px-3 py-1 rounded-xl border border-white/[0.06]">
              Execution Latency: {selectedAgent.latency}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{selectedAgent.desc}</p>
        </div>
      </section>

      {/* 9. TRUST & ZERO-TRUST HUMAN GOVERNANCE */}
      <section className="px-6 sm:px-12 py-16 border-t border-white/[0.08] bg-surface-1/40">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero-Trust Human Governance</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI that recommends. Humans remain in control.
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            High-impact financial commitments never execute autonomously. The system prepares evidence, evaluates scenarios, and drafts purchase orders—but only authorized operations leads can sign off.
          </p>

          <div className="p-4 bg-surface-1 rounded-2xl border border-white/[0.06] flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-slate-300 pt-3 shadow-lg">
            <span>AI Detects</span>
            <span className="text-slate-600">→</span>
            <span>AI Analyzes</span>
            <span className="text-slate-600">→</span>
            <span>AI Recommends</span>
            <span className="text-slate-600">→</span>
            <strong className="text-amber-300 font-bold px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/20">
              Human Approves
            </strong>
            <span className="text-slate-600">→</span>
            <span>System Executes</span>
            <span className="text-slate-600">→</span>
            <strong className="text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
              Result Verified
            </strong>
          </div>
        </div>
      </section>

      {/* 10. FINAL CALL TO ACTION */}
      <section className="px-6 sm:px-12 py-20 text-center space-y-6 max-w-4xl mx-auto">
        <div className="flex justify-center">
          <img
            src={logoImg}
            alt="LEADSTOHELP AI Logo"
            className="w-16 h-16 object-contain drop-shadow-[0_0_20px_rgba(0,240,255,0.8)]"
          />
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Turn operational signals <br />
          <span className="bg-gradient-to-r from-brand-accent to-emerald-400 bg-clip-text text-transparent">
            into confident decisions.
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          LEADSTOHELP brings inventory, suppliers, procurement, invoices, AI reasoning, and human governance into one unified operational workspace.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigateToLogin ? onNavigateToLogin('signup') : onEnterApp()}
            className="btn-primary text-sm py-3 px-6 flex items-center gap-2 shadow-glow-teal font-bold"
          >
            <span>Sign Up Free</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>

          <button
            onClick={() => onNavigateToLogin ? onNavigateToLogin('login') : onEnterApp()}
            className="btn-secondary text-sm py-3 px-5 flex items-center gap-2 font-semibold"
          >
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>Sign In to Control Tower</span>
          </button>

          <button
            onClick={onStartDemoTour}
            className="btn-secondary text-sm py-3 px-5 flex items-center gap-2 font-semibold"
          >
            <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            <span>Run 3-Minute Demo</span>
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="h-16 border-t border-white/[0.06] px-6 sm:px-12 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="LEADSTOHELP AI" className="w-5 h-5 object-contain" />
          <span>LEADSTOHELP AI • Autonomous Retail Operations Platform</span>
        </div>
        <span>Store Hub: Deccan Roast #BLR-01</span>
      </footer>
    </div>
  );
}
