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
  Eye,
  EyeOff,
  Cpu,
  Store
} from 'lucide-react';

export default function LoginPage({ onLoginSuccess, onExploreLanding }) {
  const [email, setEmail] = useState('arjun.rao@deccanroast.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="lg:w-7/12 p-8 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-surface-0 relative overflow-hidden">
        {/* Layered Cinematic Backdrop Visual */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <img
            src="/assets/home_hero_banner.png"
            alt="Supply Chain Control Room"
            className="w-full h-full object-cover object-center opacity-30 scale-105 filter saturate-150 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-0/70 via-surface-0/90 to-surface-0"></div>
          <div className="absolute inset-0 bg-radial-ambient"></div>
        </div>

        {/* Top Brand Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo.png"
              alt="LEADSTOHELP Logo"
              className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(0,240,255,0.6)]"
            />
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

          {onExploreLanding && (
            <button
              onClick={onExploreLanding}
              className="text-xs text-brand-accent hover:underline font-semibold flex items-center gap-1 bg-surface-2/80 px-3 py-1.5 rounded-xl border border-white/[0.08]"
            >
              <span>Explore Overview</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Center Hero Story */}
        <div className="my-12 lg:my-0 space-y-6 max-w-xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2/90 border border-white/[0.1] text-xs shadow-md">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
            <span className="text-slate-200 font-medium text-[11px] uppercase tracking-wide">
              Autonomous Supply Chain Intelligence
            </span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
            From supply-chain signals to verified business action.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed drop-shadow">
            LEADSTOHELP unifies retail inventory run-rates, supplier reliability, and invoice verification to help teams detect operational risks early and execute human-governed actions.
          </p>

          {/* 3 Core Capability Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* 1. Detect */}
            <div className="p-4 bg-surface-1/90 rounded-2xl border border-white/[0.08] space-y-1.5 shadow-lg backdrop-blur-md">
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Package className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Detect</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Find risks before they become disruptions (~2.8d stockouts).
              </p>
            </div>

            {/* 2. Decide */}
            <div className="p-4 bg-surface-1/90 rounded-2xl border border-white/[0.08] space-y-1.5 shadow-lg backdrop-blur-md">
              <div className="w-7 h-7 rounded-lg bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                <Sliders className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Decide</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Compare 6 strategies before committing capital spend.
              </p>
            </div>

            {/* 3. Act */}
            <div className="p-4 bg-surface-1/90 rounded-2xl border border-white/[0.08] space-y-1.5 shadow-lg backdrop-blur-md">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Act</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Turn recommendations into human-governed purchase orders.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Store Hub Telemetry Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 pt-6 border-t border-white/[0.06] relative z-10">
          <div className="flex items-center gap-2 font-mono">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Store Hub: <strong>Deccan Roast Specialty Hub (BLR-01)</strong></span>
          </div>
          <span className="font-mono text-slate-500 text-[11px]">65 Monitored Raw Material SKUs</span>
        </div>
      </div>

      {/* Right Login Panel (50% / 5 Cols on Desktop) */}
      <div className="lg:w-5/12 p-8 lg:p-16 flex flex-col justify-center bg-surface-1/60 relative">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p className="text-xs text-slate-400">
              Sign in to your operations control tower.
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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-2 border border-white/[0.08] text-xs text-white placeholder-slate-500 rounded-xl pl-9 pr-10 py-2.5 focus:outline-none focus:border-brand-accent transition-colors"
                  placeholder="••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
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
                  <span>Sign In to Control Tower</span>
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
            className="w-full p-4 rounded-2xl bg-surface-2 hover:bg-surface-3 border border-brand-accent/30 hover:border-brand-accent text-left transition-all group shadow-lg"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="badge-teal text-[10px] font-mono">
                1-Click Competition Demo
              </span>
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            </div>
            <h4 className="text-xs font-bold text-white group-hover:text-brand-accent transition-colors">
              Enter Demo Environment (Deccan Roast)
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Pre-loaded with the Arabica Crisis inventory risk and 6 procurement scenarios.
            </p>
          </button>

          {/* Truthful Demo Environment Telemetry Status */}
          <div className="p-3 bg-surface-2/40 rounded-2xl border border-white/[0.04] text-[11px] text-slate-400 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Governance State</span>
              </span>
              <span className="badge-emerald text-[9px] font-mono font-bold">DEMO ENVIRONMENT</span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 font-mono text-[10px] text-slate-500">
              <div>Gemini: <span className="text-slate-300">Offline Demo</span></div>
              <div>Data: <span className="text-slate-300">Local JSON</span></div>
              <div>Auth: <span className="text-slate-300">Dev JWT</span></div>
            </div>
            <p className="text-[10px] text-slate-500 pt-1 border-t border-white/[0.04]">
              High-impact actions remain strictly under human approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
