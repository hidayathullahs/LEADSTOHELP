import React from 'react';
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
  Bot
} from 'lucide-react';

export default function LandingPage({
  onEnterApp,
  onStartDemoTour,
  onOpenAskAI
}) {
  return (
    <div className="min-h-screen w-full bg-surface-0 text-slate-100 font-sans selection:bg-brand-accent selection:text-black overflow-x-hidden">
      {/* 1. TOP NAVIGATION */}
      <header className="h-16 border-b border-white/[0.06] bg-surface-0/90 backdrop-blur-md sticky top-0 z-40 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center shadow-glow-teal">
            <Sparkles className="w-5 h-5 text-black fill-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-wider text-white">LEADSTOHELP</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-brand-accent/15 text-brand-accent border border-brand-accent/30">
                AI CONTROL TOWER
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Retail Operations Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onStartDemoTour}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-1 hover:bg-surface-2 border border-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white transition-all"
          >
            <Play className="w-3.5 h-3.5 text-brand-accent fill-brand-accent" />
            <span>3-Minute Demo</span>
          </button>

          <button
            onClick={onEnterApp}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <span>Enter Control Tower</span>
            <ArrowRight className="w-3.5 h-3.5 text-black" />
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative px-6 sm:px-12 pt-16 pb-20 max-w-6xl mx-auto text-center space-y-8">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-1 border border-white/[0.08] text-xs">
          <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
          <span className="text-slate-300 font-semibold tracking-wide uppercase text-[11px]">
            AI-Powered Retail Operations
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          From supply-chain signals <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-brand-accent via-cyan-200 to-teal-400 bg-clip-text text-transparent">
            to verified business action.
          </span>
        </h1>

        {/* Supporting Statement */}
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          LEADSTOHELP helps retail operations teams detect stockout and supplier risks early, simulate smarter procurement decisions, and turn AI recommendations into human-approved business action.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <button
            onClick={onEnterApp}
            className="btn-primary text-sm py-3 px-6 flex items-center gap-2 shadow-glow-teal"
          >
            <span>Enter Control Tower</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>

          <button
            onClick={onStartDemoTour}
            className="btn-secondary text-sm py-3 px-5 flex items-center gap-2"
          >
            <Play className="w-4 h-4 text-brand-accent fill-brand-accent" />
            <span>Run 3-Minute Demo</span>
          </button>

          <button
            onClick={() => onOpenAskAI("Why is Arabica coffee at risk and what should we buy?")}
            className="btn-secondary text-sm py-3 px-5 flex items-center gap-2 text-accent-violet hover:border-accent-violet/40"
          >
            <Sparkles className="w-4 h-4 text-accent-violet" />
            <span>Ask AI Copilot</span>
          </button>
        </div>

        {/* Supply Chain Intelligence Operational Map Visual */}
        <div className="pt-10 max-w-5xl mx-auto">
          <div className="glass-card p-6 sm:p-8 bg-surface-1 border-white/[0.08] relative overflow-hidden rounded-3xl text-left space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Live Operations Intelligence Map
                </span>
              </div>
              <span className="font-mono text-xs text-brand-accent font-semibold">
                Deccan Roast Specialty Hub #BLR-01
              </span>
            </div>

            {/* Connected Operational Topology */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 relative z-10 text-xs">
              {/* Node 1: Store Hub */}
              <div className="p-3.5 bg-surface-2 rounded-xl border border-white/[0.06] space-y-1.5">
                <Store className="w-4 h-4 text-brand-accent" />
                <span className="font-mono text-[10px] text-slate-400 block uppercase">1. Store Ledger</span>
                <strong className="text-white block">65 SKUs Monitored</strong>
                <p className="text-[10px] text-slate-400">13kg/day coffee run-rate</p>
              </div>

              {/* Node 2: Stockout Detection */}
              <div className="p-3.5 bg-rose-500/10 rounded-xl border border-rose-500/30 space-y-1.5">
                <Package className="w-4 h-4 text-rose-400" />
                <span className="font-mono text-[10px] text-rose-300 block uppercase">2. Risk Detected</span>
                <strong className="text-rose-300 block">COFFEE-001 (2.8d left)</strong>
                <p className="text-[10px] text-rose-400/80">48% menu exposure</p>
              </div>

              {/* Node 3: Simulation */}
              <div className="p-3.5 bg-surface-2 rounded-xl border border-white/[0.06] space-y-1.5">
                <Sliders className="w-4 h-4 text-accent-violet" />
                <span className="font-mono text-[10px] text-slate-400 block uppercase">3. What-If Twin</span>
                <strong className="text-white block">6 Strategies Modeled</strong>
                <p className="text-[10px] text-slate-400">Split-Order Optimal</p>
              </div>

              {/* Node 4: Governance */}
              <div className="p-3.5 bg-amber-500/10 rounded-xl border border-amber-500/30 space-y-1.5">
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-[10px] text-amber-300 block uppercase">4. Human Sign-Off</span>
                <strong className="text-amber-300 block">₹86,328 PO Staged</strong>
                <p className="text-[10px] text-amber-400/80">Zero spend bypass</p>
              </div>

              {/* Node 5: Outcome */}
              <div className="p-3.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30 space-y-1.5 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-[10px] text-emerald-300 block uppercase">5. Verified Impact</span>
                <strong className="text-emerald-300 block">+₹8,672 Net Savings</strong>
                <p className="text-[10px] text-emerald-400/80">88% → 8% Stockout Risk</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM → SOLUTION MICRO STORY */}
      <section className="px-6 sm:px-12 py-12 border-y border-white/[0.06] bg-surface-1/40">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-4 bg-surface-1 rounded-2xl border border-white/[0.04] space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block">
              The Retail Problem
            </span>
            <h3 className="text-sm font-bold text-white">Fragmented Operational Signals</h3>
            <p className="text-slate-300 leading-relaxed">
              Store managers discover inventory depletion, invoice overbilling, and supplier delays too late through scattered spreadsheets and manual checks.
            </p>
          </div>

          <div className="p-4 bg-surface-1 rounded-2xl border border-white/[0.04] space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-brand-accent tracking-wider block">
              The LEADSTOHELP Solution
            </span>
            <h3 className="text-sm font-bold text-white">Unified Intelligence & Simulation</h3>
            <p className="text-slate-300 leading-relaxed">
              AI continuously monitors run-rates, investigates grounded supplier records, and simulates multi-sourcing tradeoffs before committing capital.
            </p>
          </div>

          <div className="p-4 bg-surface-1 rounded-2xl border border-white/[0.04] space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
              The Verified Result
            </span>
            <h3 className="text-sm font-bold text-white">Governed Business Execution</h3>
            <p className="text-slate-300 leading-relaxed">
              Decisions are turned into human-approved purchase orders and audited delivery receipts with a 100% cryptographic audit trail.
            </p>
          </div>
        </div>
      </section>

      {/* 4. THREE CORE VALUE PILLARS (DETECT • DECIDE • ACT) */}
      <section className="px-6 sm:px-12 py-20 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Built for Real Operations Managers
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Three interconnected capabilities powering retail supply chain excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: DETECT */}
          <div className="glass-card p-6 bg-surface-1 space-y-3.5 border-white/[0.06] flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Detect Risk Early</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Find 2.8-day stockouts, supplier delivery variance, and invoice quantity discrepancies before they disrupt store beverage menus.
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.04] text-[11px] font-mono text-rose-300 font-semibold">
              • Run-Rate Forecasting • 7-Risk Radar
            </div>
          </div>

          {/* Pillar 2: DECIDE */}
          <div className="glass-card p-6 bg-surface-1 space-y-3.5 border-white/[0.06] flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Simulate Smarter Decisions</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Compare 6 supplier procurement strategies and stress-test demand spikes (+20%) using the deterministic What-If Digital Twin.
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.04] text-[11px] font-mono text-brand-accent font-semibold">
              • 6-Scenario Simulator • Digital Twin
            </div>
          </div>

          {/* Pillar 3: ACT */}
          <div className="glass-card p-6 bg-surface-1 space-y-3.5 border-white/[0.06] flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Execute with Human Control</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Turn AI recommendations into human-authorized purchase orders. High-impact spend never executes without explicit operator approval.
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.04] text-[11px] font-mono text-emerald-400 font-semibold">
              • Human Governance Queue • 3-Way OCR Audit
            </div>
          </div>
        </div>
      </section>

      {/* 5. CINEMATIC PRODUCT JOURNEY ("From Signal to Outcome") */}
      <section className="px-6 sm:px-12 py-20 border-t border-white/[0.06] bg-surface-1/30">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="badge-teal text-[10px] uppercase font-bold tracking-wider">
              End-to-End Decision Flow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              From signal to verified outcome.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-xs">
            {/* Stage 1 */}
            <div className="glass-card p-4 bg-surface-1 space-y-2 border-white/[0.06]">
              <span className="font-mono text-xs font-bold text-rose-400">01 DETECT</span>
              <h4 className="font-bold text-white">Risk Appears</h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                Arabica stock falls to 36kg (~2.8 days left) approaching safety stock buffer.
              </p>
            </div>

            {/* Stage 2 */}
            <div className="glass-card p-4 bg-surface-1 space-y-2 border-white/[0.06]">
              <span className="font-mono text-xs font-bold text-brand-accent">02 INVESTIGATE</span>
              <h4 className="font-bold text-white">AI Gathers Evidence</h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                8 grounded sources retrieved: run-rate, lead times, supplier SLA reliability.
              </p>
            </div>

            {/* Stage 3 */}
            <div className="glass-card p-4 bg-surface-1 space-y-2 border-white/[0.06]">
              <span className="font-mono text-xs font-bold text-accent-violet">03 SIMULATE</span>
              <h4 className="font-bold text-white">Digital Twin Evaluates</h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                6 strategies simulated across cost, delivery speed, and stockout risk.
              </p>
            </div>

            {/* Stage 4 */}
            <div className="glass-card p-4 bg-surface-1 space-y-2 border-white/[0.06]">
              <span className="font-mono text-xs font-bold text-emerald-400">04 DECIDE</span>
              <h4 className="font-bold text-white">AI Recommends</h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                Split-Order strategy: 40kg Metro (fast) + 60kg Malnad (discount), saving ₹8,672.
              </p>
            </div>

            {/* Stage 5 */}
            <div className="glass-card p-4 bg-surface-1 space-y-2 border-white/[0.06]">
              <span className="font-mono text-xs font-bold text-amber-400">05 VERIFY</span>
              <h4 className="font-bold text-white">Human Approves</h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                Operations Manager signs off in Approval Queue. POs dispatched and tracked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ARABICA CRISIS SHOWCASE */}
      <section className="px-6 sm:px-12 py-20 max-w-6xl mx-auto space-y-8">
        <div className="glass-card p-6 sm:p-10 bg-gradient-to-br from-surface-1 via-surface-1 to-surface-2 border-white/[0.08] rounded-3xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
            <div>
              <span className="badge-rose text-[10px] uppercase font-bold">
                Operational Case Study
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1.5">
                A problem detected before it became a disruption.
              </h2>
            </div>
            <button
              onClick={onEnterApp}
              className="btn-primary text-xs py-2 px-4 self-start sm:self-auto"
            >
              Investigate This Decision →
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Grounded Signals */}
            <div className="lg:col-span-6 space-y-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded border border-brand-accent/20">
                  COFFEE-001
                </span>
                <span className="font-bold text-white text-sm">Specialty Arabica Coffee Beans (Grade AAA)</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-surface-2 rounded-xl border border-white/[0.04]">
                  <span className="text-slate-400 block text-[10px]">Current Stock</span>
                  <strong className="text-white font-mono text-sm">36.0 kg</strong>
                </div>
                <div className="p-3 bg-surface-2 rounded-xl border border-white/[0.04]">
                  <span className="text-slate-400 block text-[10px]">Daily Usage</span>
                  <strong className="text-white font-mono text-sm">13.0 kg/day</strong>
                </div>
                <div className="p-3 bg-surface-2 rounded-xl border border-white/[0.04]">
                  <span className="text-slate-400 block text-[10px]">Depletion Time</span>
                  <strong className="text-rose-400 font-mono text-sm">~2.8 Days</strong>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed">
                48% of Deccan Roast retail beverage orders depend on this single SKU. Depletion before Friday night rush directly triggers customer churn and estimated revenue loss of <strong>₹32,400/day</strong>.
              </p>
            </div>

            {/* Right: AI Recommendation & Impact */}
            <div className="lg:col-span-6 bg-surface-2/60 p-5 rounded-2xl border border-white/[0.06] space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="badge-emerald font-mono text-[10px]">
                  AI RECOMMENDATION
                </span>
                <span className="text-[10px] text-slate-400 font-mono">SIMULATED IMPACT</span>
              </div>

              <h3 className="text-base font-bold text-white">Split-Order Replenishment Strategy</h3>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Allocate <strong>40kg to Metro Wholesale (24h turnaround)</strong> to eliminate the 2.8d stockout cliff, and <strong>60kg to Malnad Planters</strong> to secure volume tier pricing (₹840/kg).
              </p>

              <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
                <div className="p-2.5 bg-surface-1 rounded-xl border border-white/[0.04] text-center">
                  <span className="text-[10px] text-slate-400 block">Stockout Risk</span>
                  <span className="text-xs text-emerald-400 font-bold">88% → 8%</span>
                </div>
                <div className="p-2.5 bg-surface-1 rounded-xl border border-white/[0.04] text-center">
                  <span className="text-[10px] text-slate-400 block">Concentration</span>
                  <span className="text-xs text-brand-accent font-bold">100% → 50%</span>
                </div>
                <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-center">
                  <span className="text-[10px] text-emerald-400 block">Net Savings</span>
                  <span className="text-xs text-emerald-400 font-bold">+₹8,672</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TRUST & GOVERNANCE SECTION */}
      <section className="px-6 sm:px-12 py-16 border-t border-white/[0.06] bg-surface-1/40">
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

          <div className="p-4 bg-surface-1 rounded-2xl border border-white/[0.06] flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-slate-300 pt-3">
            <span>AI Detects</span>
            <span className="text-slate-600">→</span>
            <span>AI Analyzes</span>
            <span className="text-slate-600">→</span>
            <span>AI Recommends</span>
            <span className="text-slate-600">→</span>
            <strong className="text-amber-300 font-bold">Human Approves</strong>
            <span className="text-slate-600">→</span>
            <span>System Executes</span>
            <span className="text-slate-600">→</span>
            <strong className="text-emerald-400 font-bold">Result Verified</strong>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="px-6 sm:px-12 py-20 text-center space-y-6 max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Turn operational signals into confident decisions.
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          LEADSTOHELP brings inventory, suppliers, procurement, invoices, AI reasoning, and human governance into one unified operational workspace.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onEnterApp}
            className="btn-primary text-sm py-3 px-6 flex items-center gap-2 shadow-glow-teal"
          >
            <span>Enter Control Tower →</span>
          </button>

          <button
            onClick={onStartDemoTour}
            className="btn-secondary text-sm py-3 px-5 flex items-center gap-2"
          >
            <Play className="w-4 h-4 text-brand-accent fill-brand-accent" />
            <span>Run 3-Minute Demo</span>
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="h-14 border-t border-white/[0.06] px-6 sm:px-12 flex items-center justify-between text-xs text-slate-500 font-mono">
        <span>LEADSTOHELP AI • Autonomous Retail Operations Platform</span>
        <span>Store Hub: Deccan Roast #BLR-01</span>
      </footer>
    </div>
  );
}
