import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Package,
  Layers,
  ArrowRight,
  Lock,
  Mail,
  Sliders,
  CheckCircle2,
  Radio,
  Cpu
} from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('arjun.rao@deccanroast.in');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess({
        name: 'Arjun Rao',
        email: email || 'arjun.rao@deccanroast.in',
        role: 'Operations Lead',
        store: 'Deccan Roast Specialty Hub • #BLR-01',
        authMode: 'Development JWT / Strict RBAC'
      });
      setLoading(false);
    }, 400);
  };

  const handleEnterDemo = () => {
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess({
        name: 'Arjun Rao',
        email: 'arjun.rao@deccanroast.in',
        role: 'Operations Lead',
        store: 'Deccan Roast Specialty Hub • #BLR-01',
        authMode: 'Demo Environment'
      });
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen w-screen bg-surface-0 flex flex-col lg:flex-row text-slate-100 font-sans selection:bg-brand-accent selection:text-black">
      {/* Left Brand & Product Value Story (60% width on Desktop) */}
      <div className="lg:w-7/12 p-8 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.06] bg-gradient-to-br from-surface-0 via-surface-1 to-surface-0 relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent-violet/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Brand Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center shadow-glow-teal">
              <Sparkles className="w-5 h-5 text-black fill-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-wider text-white">LEADSTOHELP</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-brand-accent/15 text-brand-accent border border-brand-accent/30">
                  AI CONTROL TOWER
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Retail Operations & Verified Action Platform</p>
            </div>
          </div>
        </div>

        {/* Center Hero Story */}
        <div className="my-12 lg:my-0 space-y-6 max-w-xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 border border-white/[0.08] text-xs">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
            <span className="text-slate-300 font-medium">Track 1 • Track 2 • Track 3 Unified Platform</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            From supply-chain signals to verified business action.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            LEADSTOHELP continuously monitors retail inventory depletion run-rates, investigates supplier reliability evidence, simulates multi-sourcing alternatives, and empowers teams to execute safe procurement actions with human approval.
          </p>

          {/* 3 Core Capability Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* 1. Detect */}
            <div className="p-4 bg-surface-2/60 rounded-xl border border-white/[0.06] space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Package className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">1. Detect</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Spot 2.8-day stockouts and invoice shortages before they hit customer menus.
              </p>
            </div>

            {/* 2. Decide */}
            <div className="p-4 bg-surface-2/60 rounded-xl border border-white/[0.06] space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                <Sliders className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">2. Decide</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Simulate 6 procurement scenarios with the What-If Digital Twin.
              </p>
            </div>

            {/* 3. Act */}
            <div className="p-4 bg-surface-2/60 rounded-xl border border-white/[0.06] space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">3. Act</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Execute human-approved purchase orders with full cryptographic audit trace.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Store Hub Telemetry Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 pt-6 border-t border-white/[0.04] relative z-10">
          <div className="flex items-center gap-2 font-mono">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Store Hub: <strong>Deccan Roast Specialty Hub (BLR-01)</strong></span>
          </div>
          <span className="font-mono text-slate-500 text-[11px]">65 Monitored Raw Material SKUs</span>
        </div>
      </div>

      {/* Right Login Panel (50% / 5 Cols on Desktop) */}
      <div className="lg:w-5/12 p-8 lg:p-16 flex flex-col justify-center bg-surface-1/50 relative">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white tracking-tight">Sign In to Control Tower</h2>
            <p className="text-xs text-slate-400">
              Access real-time store telemetry, AI copilot, and governance queues.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">Operator Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-2 border border-white/[0.08] text-xs text-white placeholder-slate-500 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-brand-accent transition-colors"
                  placeholder="name@deccanroast.in"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-300">Access Key / Password</label>
                <span className="text-slate-500 text-[10px]">Managed by RBAC</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-2 border border-white/[0.08] text-xs text-white placeholder-slate-500 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-brand-accent transition-colors"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-xs py-2.5 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Authenticating with RBAC...</span>
              ) : (
                <>
                  <span>Sign In as Operations Lead</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-white/[0.06]"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-mono font-bold text-slate-500 tracking-wider">
              Or Instant Demo Access
            </span>
            <div className="flex-grow border-t border-white/[0.06]"></div>
          </div>

          {/* Instant Demo Environment Launcher */}
          <button
            onClick={handleEnterDemo}
            disabled={loading}
            className="w-full p-4 rounded-xl bg-surface-2 hover:bg-surface-3 border border-brand-accent/30 hover:border-brand-accent text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="badge-teal text-[10px] font-mono">
                1-Click Competition Demo
              </span>
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            </div>
            <h4 className="text-xs font-bold text-white group-hover:text-brand-accent transition-colors">
              Enter Deccan Roast Demo Environment
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Instant access pre-loaded with the Arabica Crisis inventory risk and 6 procurement scenarios.
            </p>
          </button>

          {/* Security & Truthful Environment Notice */}
          <div className="p-3 bg-surface-2/40 rounded-xl border border-white/[0.04] text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-accent" />
              <span>Zero-Trust Enterprise Governance</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Deterministic engines enforce strict human authorization for all financial commitments. No hallucinated actions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
