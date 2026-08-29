import React, { useState, useEffect } from 'react';
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
  Store,
  AlertCircle,
  Building2,
  User,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  FileCheck,
  Zap,
  Check,
  Shield,
  Activity
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import heroBgImg from '../assets/hero_bg.png';

const SHOWCASE_SLIDES = [
  {
    id: 'risk-radar',
    tag: 'Autonomous Risk Detection',
    title: 'Detect stockouts days before they disrupt your stores.',
    desc: 'Continuous real-time telemetry parses POS run-rates and supplier lead times, flagging the Arabica depletion cliff 2.8 days in advance.',
    metric: '2.8 Days',
    metricLabel: 'Early Warning Horizon',
    badge: 'Real-time AI Telemetry',
    visualType: 'risk-card',
    highlights: [
      'Identifies 13.0 kg/day run-rate surge',
      'Highlights ₹32,400/day revenue leakage risk',
      'Instant root-cause analysis with evidence links'
    ]
  },
  {
    id: 'what-if-sim',
    tag: 'Multi-Scenario Digital Twin',
    title: 'Simulate 6 procurement options before spending ₹1.',
    desc: 'Evaluates spot pricing, supplier SLAs, and lead-time risks to uncover the optimal Split-Order replenishment strategy.',
    metric: '₹8,672',
    metricLabel: 'Optimized Savings',
    badge: '6-Scenario Digital Twin',
    visualType: 'sim-card',
    highlights: [
      '40 kg Metro Wholesale (24h Buffer)',
      '60 kg Malnad Planters (Bulk Tiered Price)',
      'Guarantees 0% stockout risk on Friday rush'
    ]
  },
  {
    id: 'governance-ocr',
    tag: 'Strict Human Governance & OCR',
    title: 'Zero rogue AI spend. Every decision verified by humans.',
    desc: '3-way automated matching flags physical challan shortages and routes high-impact purchase orders directly to your approval center.',
    metric: '100%',
    metricLabel: 'Human-Approved Spend',
    badge: 'Cryptographic Audit Trail',
    visualType: 'ocr-card',
    highlights: [
      'Catches 10 kg shortfall from Kaveri Traders',
      'Automated Debit Note issuance with evidence',
      'Immutable cryptographic sign-off receipts'
    ]
  }
];

const ROLE_PRESETS = [
  {
    title: 'Operations Lead',
    email: 'arjun.rao@deccanroast.in',
    name: 'Arjun Rao',
    store: 'Deccan Roast Specialty Hub • #BLR-01',
    role: 'Operations Lead'
  },
  {
    title: 'Store Manager',
    email: 'priya.sharma@deccanroast.in',
    name: 'Priya Sharma',
    store: 'Whitefield Roastery • #BLR-04',
    role: 'Store Manager'
  },
  {
    title: 'VP Supply Chain',
    email: 'vikram.mehta@deccanroast.in',
    name: 'Vikram Mehta',
    store: 'National Network Operations',
    role: 'Supply Chain VP'
  }
];

export default function LoginPage({
  onLoginSuccess,
  onExploreLanding,
  initialMode = 'login'
}) {
  const [authMode, setAuthMode] = useState(initialMode); // 'login' | 'signup'
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('arjun.rao@deccanroast.in');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup Form States
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupStore, setSignupStore] = useState('Deccan Roast Specialty Hub (BLR-01)');
  const [signupRole, setSignupRole] = useState('Operations Lead');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupTerms, setSignupTerms] = useState(true);

  // UI States
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Auto-play slide timer
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  // Evaluate password strength for signup
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 3) return { score: 2, label: 'Medium', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-400' };
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginEmail || !loginEmail.includes('@')) {
      setErrorMsg('Please enter a valid operator email address.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Please enter your access key.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const matchedPreset = ROLE_PRESETS.find(p => p.email.toLowerCase() === loginEmail.toLowerCase());
      const userData = matchedPreset || {
        name: loginEmail.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
        email: loginEmail,
        role: 'Operations Lead',
        store: 'Deccan Roast Specialty Hub • #BLR-01',
        authMode: 'Strict RBAC / Dev JWT'
      };

      onLoginSuccess(userData);
      setLoading(false);
    }, 450);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!signupName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!signupEmail || !signupEmail.includes('@')) {
      setErrorMsg('Please enter a valid work email.');
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (!signupTerms) {
      setErrorMsg('You must agree to the operations governance protocol.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const userData = {
        name: signupName,
        email: signupEmail,
        role: signupRole,
        store: signupStore,
        authMode: 'Newly Registered Operator / RBAC'
      };
      onLoginSuccess(userData);
      setLoading(false);
    }, 500);
  };

  const handleEnterDemo = () => {
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess({
        name: 'Arjun Rao',
        email: 'arjun.rao@deccanroast.in',
        role: 'Operations Lead',
        store: 'Deccan Roast Specialty Hub • #BLR-01',
        authMode: '1-Click Demo Evaluation'
      });
      setLoading(false);
    }, 300);
  };

  const handleSelectPreset = (preset) => {
    setLoginEmail(preset.email);
    setLoginPassword('••••••••••••');
    setSuccessMsg(`Loaded credentials for ${preset.title} (${preset.name})`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const slide = SHOWCASE_SLIDES[currentSlide];
  const pwStrength = getPasswordStrength(signupPassword);

  return (
    <div className="min-h-screen w-screen bg-[#07090E] flex flex-col lg:flex-row text-slate-100 font-sans selection:bg-brand-accent selection:text-black select-none">
      {/* ========================================================= */}
      {/* LEFT COLUMN: INTERACTIVE FEATURE SHOWCASE SLIDER (58% desktop) */}
      {/* ========================================================= */}
      <div 
        className="lg:w-7/12 p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-[#090D16] relative overflow-hidden"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Layered Background Glow & Backdrop */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <img
            src={heroBgImg}
            alt="LEADSTOHELP AI Supply Chain Control Room Backdrop"
            className="w-full h-full object-cover object-center opacity-20 scale-105 filter saturate-150 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07090E]/90 via-[#090D16]/95 to-[#090D16]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Top Header with Brand and Explore Action */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="LEADSTOHELP AI Logo"
              className="w-9 h-9 object-contain drop-shadow-[0_0_15px_rgba(0,240,255,0.7)]"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-wider text-white">LEADSTOHELP</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  AI CONTROL TOWER
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Autonomous Retail Operations & Verified Action Platform</p>
            </div>
          </div>

          {onExploreLanding && (
            <button
              onClick={onExploreLanding}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-white/[0.1] transition-all hover:border-cyan-500/40 shadow-sm"
            >
              <span>Back to Overview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Center Interactive Slider / Feature Showcase */}
        <div className="my-8 lg:my-0 space-y-6 max-w-xl relative z-10">
          {/* Slide Tag & Navigation controls */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-xs shadow-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-300 font-bold text-[11px] uppercase tracking-wider">
                {slide.tag}
              </span>
            </div>

            {/* Slide Next / Prev Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + SHOWCASE_SLIDES.length) % SHOWCASE_SLIDES.length)}
                className="w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % SHOWCASE_SLIDES.length)}
                className="w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Slide Headline & Description */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              {slide.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {slide.desc}
            </p>
          </div>

          {/* Interactive Slide Graphic Mockup Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-white/[0.12] shadow-2xl backdrop-blur-md space-y-4">
            {/* Top Metric Header in Card */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">{slide.metricLabel}</span>
                <span className="text-2xl font-black text-white tracking-tight bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  {slide.metric}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {slide.badge}
              </span>
            </div>

            {/* Bullet point highlights */}
            <div className="space-y-2">
              {slide.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>

            {/* Live Interactive Telemetry Ticker inside Card */}
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Active Store: <strong className="text-slate-200">Deccan Roast #BLR-01</strong></span>
              </div>
              <span className="text-emerald-400 font-bold">100% Synced</span>
            </div>
          </div>

          {/* Interactive Slide Progress Indicators / Tabs */}
          <div className="flex items-center gap-2 pt-2">
            {SHOWCASE_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]' : 'bg-slate-800 hover:bg-slate-700'
                }`}
                title={`Slide ${idx + 1}: ${s.tag}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Proof Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/[0.06] relative z-10 text-left">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/[0.06]">
            <div className="text-[10px] uppercase font-mono text-slate-400">Managed Spend</div>
            <div className="text-sm font-bold text-white mt-0.5">₹1.4M+ / mo</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/[0.06]">
            <div className="text-[10px] uppercase font-mono text-slate-400">Stockout Loss</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">0.0% Protected</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/[0.06]">
            <div className="text-[10px] uppercase font-mono text-slate-400">AI Latency</div>
            <div className="text-sm font-bold text-cyan-400 mt-0.5">&lt; 100 ms</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/[0.06]">
            <div className="text-[10px] uppercase font-mono text-slate-400">Rogue Spend</div>
            <div className="text-sm font-bold text-white mt-0.5">Zero (Human Gate)</div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: AUTHENTICATION CONTAINER (42% desktop) */}
      {/* ========================================================= */}
      <div className="lg:w-5/12 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#07090E] relative overflow-y-auto custom-scrollbar">
        <div className="max-w-md w-full mx-auto space-y-5">
          {/* Header & Mode Switcher Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {authMode === 'login' ? 'Operator Sign In' : 'Create Operator Account'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {authMode === 'login'
                    ? 'Enter your credentials to access the AI Control Tower.'
                    : 'Provision a new verified workspace account.'}
                </p>
              </div>

              <div className="p-1 rounded-xl bg-slate-900 border border-white/[0.08] flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMsg('');
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    authMode === 'login'
                      ? 'bg-cyan-500 text-black shadow-glow-teal'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMsg('');
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    authMode === 'signup'
                      ? 'bg-cyan-500 text-black shadow-glow-teal'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Quick Role Switcher (For rapid login demo testing) */}
            {authMode === 'login' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Demo Persona Quick-Select:</span>
                  <span className="text-[10px] font-mono text-cyan-400">1-Click Fill</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {ROLE_PRESETS.map((preset) => (
                    <button
                      key={preset.email}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        loginEmail === preset.email
                          ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-sm'
                          : 'bg-slate-900/60 border-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold text-[11px] truncate leading-tight">{preset.title}</div>
                      <div className="text-[9px] text-slate-400 truncate mt-0.5">{preset.name.split(' ')[0]}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Validation Alert */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ======================= */}
          {/* TAB 1: SIGN IN FORM     */}
          {/* ======================= */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Operator Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-white/[0.08] text-xs text-white placeholder-slate-500 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-cyan-400 transition-colors"
                    placeholder="name@deccanroast.in"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-300">Access Key / Password</label>
                  <span className="text-slate-500 text-[10px] font-mono">Strict RBAC</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-white/[0.08] text-xs text-white placeholder-slate-500 rounded-xl pl-9 pr-10 py-2.5 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                    placeholder="••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Link */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-slate-900 border-white/[0.1] text-cyan-400 focus:ring-0 w-3.5 h-3.5"
                  />
                  <span>Remember session</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('arjun.rao@deccanroast.in');
                    setLoginPassword('••••••••••••');
                    setSuccessMsg('Restored default credentials for Arjun Rao (Operations Lead)');
                  }}
                  className="text-slate-400 hover:text-cyan-400 transition-colors text-[11px]"
                >
                  Forgot access key?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-xs py-3 flex items-center justify-center gap-2 font-bold shadow-glow-teal"
              >
                {loading ? (
                  <span>Authenticating Operator...</span>
                ) : (
                  <>
                    <span>Sign In to Control Tower</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ======================= */}
          {/* TAB 2: SIGN UP FORM    */}
          {/* ======================= */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Operator Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full bg-slate-900 border border-white/[0.08] text-xs text-white placeholder-slate-500 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors"
                    placeholder="e.g. Arjun Rao"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-white/[0.08] text-xs text-white placeholder-slate-500 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">Store / Hub</label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={signupStore}
                      onChange={(e) => setSignupStore(e.target.value)}
                      className="w-full bg-slate-900 border border-white/[0.08] text-[11px] text-white rounded-xl pl-8 pr-2 py-2 focus:outline-none focus:border-cyan-400 truncate"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">Role</label>
                  <select
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value)}
                    className="w-full bg-slate-900 border border-white/[0.08] text-[11px] text-white rounded-xl px-2.5 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Operations Lead">Operations Lead</option>
                    <option value="Store Manager">Store Manager</option>
                    <option value="Supply Chain VP">Supply Chain VP</option>
                    <option value="Financial Auditor">Financial Auditor</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Create Access Key / Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-white/[0.08] text-xs text-white placeholder-slate-500 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-cyan-400 font-mono"
                    placeholder="Min. 8 chars, 1 number, 1 symbol"
                    required
                  />
                </div>

                {/* Password strength indicators */}
                {signupPassword && (
                  <div className="flex items-center gap-1.5 pt-1">
                    <div className="flex-1 h-1 rounded-full bg-slate-800 overflow-hidden flex gap-1">
                      <div className={`h-full ${pwStrength.score >= 1 ? pwStrength.color : 'bg-transparent'} flex-1`} />
                      <div className={`h-full ${pwStrength.score >= 2 ? pwStrength.color : 'bg-transparent'} flex-1`} />
                      <div className={`h-full ${pwStrength.score >= 3 ? pwStrength.color : 'bg-transparent'} flex-1`} />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{pwStrength.label}</span>
                  </div>
                )}
              </div>

              {/* Agreement checkbox */}
              <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-400 pt-1">
                <input
                  type="checkbox"
                  checked={signupTerms}
                  onChange={(e) => setSignupTerms(e.target.checked)}
                  className="rounded bg-slate-900 border-white/[0.1] text-cyan-400 focus:ring-0 w-3.5 h-3.5 mt-0.5"
                />
                <span>I agree to enforce human-governed purchase approvals and audit protocol.</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-xs py-2.5 flex items-center justify-center gap-2 font-bold shadow-glow-teal mt-2"
              >
                {loading ? (
                  <span>Creating Workspace...</span>
                ) : (
                  <>
                    <span>Create Operator Account</span>
                    <ArrowRight className="w-3.5 h-3.5 text-black" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Access Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-white/[0.08]" />
            <span className="flex-shrink mx-3 text-[10px] uppercase font-mono font-bold text-slate-500 tracking-wider">
              Or Instant Demo Access
            </span>
            <div className="flex-grow border-t border-white/[0.08]" />
          </div>

          {/* 1-Click Instant Demo Launcher Button Card */}
          <button
            onClick={handleEnterDemo}
            disabled={loading}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-purple-950/30 hover:from-cyan-950/60 hover:to-purple-950/50 border border-cyan-500/40 hover:border-cyan-400 text-left transition-all group shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                1-Click Live Evaluation
              </span>
              <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
            </div>
            <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
              Enter Deccan Roast Demo Environment (#BLR-01)
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Pre-loaded with live Arabica crisis triage, 6-scenario digital twin, and Kaveri OCR discrepancy.
            </p>
          </button>

          {/* Truthful Demo Governance Status Footer */}
          <div className="p-3 bg-slate-900/60 rounded-2xl border border-white/[0.06] text-[11px] text-slate-400 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Governance Protocol</span>
              </span>
              <span className="badge-emerald text-[9px] font-mono font-bold">STRICT RBAC ACTIVE</span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 font-mono text-[10px] text-slate-500">
              <div>AI Mode: <span className="text-slate-300">Deterministic</span></div>
              <div>Audit: <span className="text-slate-300">256-bit AES</span></div>
              <div>Auth: <span className="text-slate-300">RBAC Token</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
