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
  TrendingUp,
  FileCheck,
  Zap,
  Check,
  Shield,
  Activity,
  Radar,
  Calendar,
  DollarSign,
  Briefcase,
  KeyRound,
  FileSpreadsheet,
  BadgeCheck,
  Scan,
  CornerDownRight,
  Terminal,
  Clock,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import loginBgImg from '../assets/login_bg.png';

const SHOWCASE_SLIDES = [
  {
    id: 'risk-radar',
    tag: 'Autonomous Risk Detection',
    tabLabel: '01. Live Risk Radar',
    title: 'Autonomous early warning for critical raw material depletion.',
    desc: 'Continuously monitors live POS transactions against safety buffer thresholds to prevent high-margin beverage stockout cliffs.',
    badge: 'Real-Time Telemetry',
    visualType: 'radar'
  },
  {
    id: 'what-if-sim',
    tag: 'Multi-Scenario Digital Twin',
    tabLabel: '02. Digital Twin Twin',
    title: 'Simulate multi-sourcing alternatives before spending ₹1.',
    desc: 'Evaluates supplier reliability SLAs, freight lead times, and tiered volume discounts across 6 parallel sourcing scenarios.',
    badge: '6-Scenario Digital Twin',
    visualType: 'split-order'
  },
  {
    id: 'governance-ocr',
    tag: 'Strict Human Governance & OCR',
    tabLabel: '03. Vision OCR & Governance',
    title: 'Zero rogue autonomous spend. 100% human-verified ledger.',
    desc: '3-way automated matching flags physical challan shortages and routes high-impact purchase orders directly to your approval center.',
    badge: 'Cryptographic Ledger',
    visualType: 'ocr'
  }
];

const ROLE_PRESETS = [
  {
    title: 'Operations Lead',
    name: 'Arjun Rao',
    initials: 'AR',
    email: 'arjun.rao@deccanroast.in',
    store: 'Deccan Roast Hub • #BLR-01',
    role: 'Operations Lead',
    gradient: 'from-cyan-500 to-blue-600',
    borderColor: 'hover:border-cyan-400',
    tag: 'Triage & Approval'
  },
  {
    title: 'Store Manager',
    name: 'Priya Sharma',
    initials: 'PS',
    email: 'priya.sharma@deccanroast.in',
    store: 'Whitefield Roastery • #BLR-04',
    role: 'Store Manager',
    gradient: 'from-emerald-500 to-teal-600',
    borderColor: 'hover:border-emerald-400',
    tag: 'Inventory & POS'
  },
  {
    title: 'VP Supply Chain',
    name: 'Vikram Mehta',
    initials: 'VM',
    email: 'vikram.mehta@deccanroast.in',
    store: 'National Network Operations',
    role: 'Supply Chain VP',
    gradient: 'from-purple-500 to-indigo-600',
    borderColor: 'hover:border-purple-400',
    tag: 'Multi-Hub Governance'
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

  // Interactive Playground States (Interactive Digital Twin on Left)
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [demandMultiplier, setDemandMultiplier] = useState(20); // +20% demand surge
  const [scanStep, setScanStep] = useState(1); // 0, 1, 2 for OCR visual

  // UI Feedback States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  // Live countdown timer for stockout cliff
  const [countdown, setCountdown] = useState({ days: 2, hours: 18, minutes: 42, seconds: 15 });
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Password strength logic
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-800', width: '0%' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak (8+ chars required)', color: 'bg-rose-500', width: '33%', text: 'text-rose-400' };
    if (score <= 3) return { score: 2, label: 'Good (Add special symbols)', color: 'bg-amber-400', width: '66%', text: 'text-amber-400' };
    return { score: 3, label: 'Strong (Cryptographic grade)', color: 'bg-emerald-400', width: '100%', text: 'text-emerald-400' };
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
    setSuccessMsg(`Switched persona to ${preset.title} (${preset.name})`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const slide = SHOWCASE_SLIDES[currentSlide];
  const pwStrength = getPasswordStrength(signupPassword);

  // Digital twin calculations based on surge slider
  const calculatedRate = (13.0 * (1 + demandMultiplier / 100)).toFixed(1);
  const calculatedStockoutDays = (36.0 / calculatedRate).toFixed(1);
  const calculatedSavings = 8672 + demandMultiplier * 45;

  return (
    <div className="min-h-screen w-screen bg-[#05070E] flex flex-col lg:flex-row text-slate-100 font-sans selection:bg-cyan-400 selection:text-black select-none relative overflow-hidden">
      
      {/* Background Animated Cyber Ambient Lights */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-25" />
        
        {/* Radial ambient gradient orbs */}
        <div className="absolute -top-32 -left-32 w-[650px] h-[650px] bg-gradient-to-br from-cyan-500/20 via-blue-600/10 to-transparent rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/2 left-1/3 w-[550px] h-[550px] bg-gradient-to-tr from-purple-600/15 via-indigo-600/10 to-transparent rounded-full blur-[150px]" />
        <div className="absolute -bottom-32 right-1/4 w-[700px] h-[700px] bg-gradient-to-tl from-cyan-600/15 via-teal-600/10 to-transparent rounded-full blur-[160px]" />
      </div>

      {/* ========================================================================= */}
      {/* LEFT COLUMN: INTERACTIVE VISUAL COMMAND CONSOLE (58% Desktop Width)       */}
      {/* ========================================================================= */}
      <div 
        className="lg:w-7/12 p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-[#070A14]/70 backdrop-blur-2xl relative z-10 overflow-hidden"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Layered Cinematic Background from user asset */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <img
            src={loginBgImg}
            alt="LEADSTOHELP AI Operations Backdrop"
            className="w-full h-full object-cover object-center opacity-35 scale-105 filter saturate-150 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070A14]/85 via-[#070A14]/95 to-[#070A14]" />
        </div>
        {/* Top Header Row with High-End Glowing Brand Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative w-11 h-11 rounded-xl bg-slate-950 border border-white/20 flex items-center justify-center p-1.5 shadow-2xl">
                <img
                  src={logoImg}
                  alt="LEADSTOHELP AI Logo"
                  className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,240,255,0.9)]"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-wider text-white">LEADSTOHELP</span>
                <span className="text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-cyan-400/15 text-cyan-300 border border-cyan-400/40 shadow-glow-teal">
                  AI CONTROL TOWER
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                Autonomous Retail Operations & Verified Action Platform
              </p>
            </div>
          </div>

          {onExploreLanding && (
            <button
              onClick={onExploreLanding}
              className="text-xs text-cyan-300 hover:text-white font-bold flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 px-4 py-2 rounded-2xl border border-white/[0.12] hover:border-cyan-400/60 transition-all shadow-lg group backdrop-blur-md"
            >
              <span>Back to Overview</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Center Interactive Console / Storyboard Area */}
        <div className="my-6 lg:my-0 space-y-5 max-w-xl">
          
          {/* Interactive Slide Category Selector Tabs */}
          <div className="p-1 rounded-2xl bg-slate-950/80 border border-white/[0.08] inline-flex items-center gap-1.5 shadow-inner backdrop-blur-md">
            {SHOWCASE_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentSlide(idx);
                  setIsAutoPlaying(false);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 ${
                  currentSlide === idx
                    ? 'bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 text-black shadow-glow-teal scale-100 font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <span>{s.tabLabel}</span>
              </button>
            ))}
          </div>

          {/* Headline & Description */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-[11px] text-cyan-300 font-bold uppercase tracking-wider font-mono shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>{slide.tag}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-[1.15] drop-shadow-lg">
              {slide.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
              {slide.desc}
            </p>
          </div>

          {/* ============================================================== */}
          {/* HIGH-TECH INTERACTIVE VISUAL CARD PER SLIDE                    */}
          {/* ============================================================== */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-[#060812] border border-white/[0.14] shadow-[0_0_50px_-10px_rgba(0,240,255,0.15)] backdrop-blur-xl space-y-4 relative overflow-hidden">
            
            {/* Top Multi-Color Neon Accent Bar */}
            <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400" />
            
            {/* Corner Decorative Tech Brackets */}
            <div className="absolute top-2 right-2 text-[10px] font-mono text-cyan-400/40 select-none">SYS_TRC::LIVE</div>

            {/* ------------------------------------------------------------- */}
            {/* SLIDE 1: INTERACTIVE STOCKOUT RADAR & COUNTDOWN TIMER         */}
            {/* ------------------------------------------------------------- */}
            {slide.visualType === 'radar' && (
              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                      <Radar className="w-5 h-5 animate-spin text-rose-400" style={{ animationDuration: '6s' }} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white font-mono flex items-center gap-2">
                        <span>COFFEE-001 • Specialty Arabica (AAA)</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Single Source: Malnad Planters • 48% Beverage Orders</div>
                    </div>
                  </div>
                  <span className="badge-rose text-[10px] font-mono font-bold animate-pulse px-2.5 py-1">
                    CRITICAL RISK
                  </span>
                </div>

                {/* Stockout Countdown Clock Box */}
                <div className="p-3 rounded-2xl bg-slate-950/90 border border-rose-500/30 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-rose-300 uppercase tracking-wider block font-bold">
                      Estimated Depletion Countdown
                    </span>
                    <span className="text-[11px] text-slate-400">Current Velocity: <strong>{calculatedRate} kg/day</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-black text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20 shadow-inner">
                    <span>{String(countdown.days).padStart(2, '0')}d</span> :
                    <span>{String(countdown.hours).padStart(2, '0')}h</span> :
                    <span>{String(countdown.minutes).padStart(2, '0')}m</span> :
                    <span className="text-white">{String(countdown.seconds).padStart(2, '0')}s</span>
                  </div>
                </div>

                {/* Depletion Runway Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-300">Remaining Inventory: <strong className="text-white">36.0 kg (2.77 Days)</strong></span>
                    <span className="text-rose-400 font-bold">Safety Buffer: 50.0 kg</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden flex shadow-inner">
                    <div className="bg-gradient-to-r from-rose-500 to-rose-400 h-full w-[36%] rounded-l-full shadow-[0_0_12px_rgba(244,63,94,0.9)]" />
                    <div className="bg-amber-500/30 h-full w-[24%]" />
                    <div className="bg-slate-700/50 h-full w-[40%] rounded-r-full" />
                  </div>
                </div>

                {/* 2 Key Micro Stat Cards */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/[0.08] flex items-center justify-between">
                    <div>
                      <div className="text-[9px] uppercase font-mono text-slate-400">Weekend Surge</div>
                      <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5">+20% POS Depletion</div>
                    </div>
                    <Activity className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/[0.08] flex items-center justify-between">
                    <div>
                      <div className="text-[9px] uppercase font-mono text-slate-400">Daily Revenue at Risk</div>
                      <div className="text-sm font-bold text-rose-400 font-mono mt-0.5">₹32,400 / day</div>
                    </div>
                    <DollarSign className="w-4 h-4 text-rose-400" />
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* SLIDE 2: INTERACTIVE DIGITAL TWIN SCENARIO MULTIPLIER         */}
            {/* ------------------------------------------------------------- */}
            {slide.visualType === 'split-order' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      <Sliders className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white font-mono">Scenario B: Split-Order Replenishment</div>
                      <div className="text-[10px] text-emerald-400 font-medium font-mono">AI Recommended • Dual-Source Optimization</div>
                    </div>
                  </div>
                  <span className="badge-emerald text-[10px] font-mono font-bold px-2.5 py-1">
                    +₹{calculatedSavings.toLocaleString('en-IN')} SAVINGS
                  </span>
                </div>

                {/* Interactive Surge Multiplier Slider */}
                <div className="p-3 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-300">Simulated Weekend Surge: <strong className="text-cyan-300">+{demandMultiplier}%</strong></span>
                    <span className="text-cyan-400 font-bold">Runway: {calculatedStockoutDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={demandMultiplier}
                    onChange={(e) => setDemandMultiplier(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>Base (13 kg/d)</span>
                    <span>+25% Surge</span>
                    <span>+50% Extreme Peak</span>
                  </div>
                </div>

                {/* Sourcing Allocation Visual */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-cyan-300 font-bold">40 kg Metro Wholesale (24h Delivery)</span>
                    <span className="text-purple-300 font-bold">60 kg Malnad Planters (Bulk Tier)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex gap-1 p-0.5">
                    <div className="bg-gradient-to-r from-cyan-400 to-cyan-500 h-full w-[40%] rounded-l-full shadow-glow-teal flex items-center justify-center text-[8px] font-black text-black">40%</div>
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full w-[60%] rounded-r-full flex items-center justify-center text-[8px] font-black text-white">60%</div>
                  </div>
                </div>

                {/* 2 Key Metric Cards */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/[0.08]">
                    <div className="text-[9px] uppercase font-mono text-slate-400">Total Purchase Cost</div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">₹86,328</div>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/[0.08]">
                    <div className="text-[9px] uppercase font-mono text-slate-400">Composite Risk Score</div>
                    <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">8% (Protected)</div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* SLIDE 3: OCR INVOICE 3-WAY RECONCILIATION & GOVERNANCE SEAL   */}
            {/* ------------------------------------------------------------- */}
            {slide.visualType === 'ocr' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                      <Scan className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white font-mono">Invoice #KD-8839 • Kaveri Dairy</div>
                      <div className="text-[10px] text-slate-400">Vision OCR 3-Way Reconciliation System</div>
                    </div>
                  </div>
                  <span className="badge-amber text-[10px] font-mono font-bold px-2.5 py-1">
                    SHORTFALL DETECTED
                  </span>
                </div>

                {/* 3-Way Comparison Table */}
                <div className="p-3 rounded-2xl bg-slate-950/90 border border-white/[0.08] text-[11px] font-mono space-y-2">
                  <div className="flex justify-between items-center text-slate-400 pb-1 border-b border-white/[0.06]">
                    <span>1. Approved PO #PO-8821:</span>
                    <span className="text-white font-bold">100 Litres Milk (₹6,080.00)</span>
                  </div>
                  <div className="flex justify-between items-center text-rose-300 pb-1 border-b border-white/[0.06]">
                    <span>2. Physical Delivery Challan:</span>
                    <span className="font-bold bg-rose-500/20 px-2 py-0.5 rounded text-rose-300">90 Litres (-10L Shortfall)</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-300 font-bold">
                    <span>3. Auto-Generated Debit Note:</span>
                    <span className="bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">₹486.40 Credit Sealed</span>
                  </div>
                </div>

                {/* Cryptographic Ledger Seal */}
                <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-purple-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <div>
                      <div className="text-[10px] font-mono font-bold text-white">Cryptographic Audit Seal</div>
                      <div className="text-[9px] font-mono text-slate-400 truncate">Hash: 0x7f8a92...e41c9 (Immutable)</div>
                    </div>
                  </div>
                  <span className="badge-teal text-[9px] font-mono">100% AUDITED</span>
                </div>
              </div>
            )}

            {/* Bottom 3 Bullet Highlights */}
            <div className="space-y-1.5 pt-2 border-t border-white/[0.08]">
              {slide.highlights ? slide.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-200">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                  <span className="truncate">{h}</span>
                </div>
              )) : (
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Real-time supply chain signals converted into verified human action.</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar & Next/Prev Controls */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 flex-1 max-w-xs">
              {SHOWCASE_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentSlide(idx);
                    setIsAutoPlaying(false);
                  }}
                  className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                    currentSlide === idx
                      ? 'bg-cyan-400 shadow-[0_0_12px_rgba(0,240,255,1)] scale-y-125'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCurrentSlide((prev) => (prev - 1 + SHOWCASE_SLIDES.length) % SHOWCASE_SLIDES.length);
                  setIsAutoPlaying(false);
                }}
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/[0.1] hover:border-cyan-400/50 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setCurrentSlide((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
                  setIsAutoPlaying(false);
                }}
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/[0.1] hover:border-cyan-400/50 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Proof Metric Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/[0.08] text-left">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/[0.06] backdrop-blur-sm">
            <div className="text-[10px] uppercase font-mono text-slate-400">Monthly Managed</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">₹1.4M+ Spend</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/[0.06] backdrop-blur-sm">
            <div className="text-[10px] uppercase font-mono text-slate-400">Stockout Loss</div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">0.0% Loss</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/[0.06] backdrop-blur-sm">
            <div className="text-[10px] uppercase font-mono text-slate-400">Decision Speed</div>
            <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5">&lt; 100 ms</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/[0.06] backdrop-blur-sm">
            <div className="text-[10px] uppercase font-mono text-slate-400">Human Governance</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">Zero Rogue Spend</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: HIGH-CONVERTING GLASSMORPHIC AUTH CONTAINER (42% Desktop)   */}
      {/* ========================================================================= */}
      <div className="lg:w-5/12 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#05070E] relative z-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-md w-full mx-auto space-y-5">
          
          {/* Mode Switcher Segmented Control */}
          <div className="space-y-4">
            <div className="p-1 rounded-2xl bg-slate-900/90 border border-white/[0.12] flex items-center relative shadow-2xl backdrop-blur-xl">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  authMode === 'login'
                    ? 'bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 text-black shadow-glow-teal font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Operator Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  authMode === 'signup'
                    ? 'bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 text-black shadow-glow-teal font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
            </div>

            {/* Persona Quick-Switch Chips (For Sign In) */}
            {authMode === 'login' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-semibold">Demo Persona Quick-Select:</span>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">1-Click Auto Fill</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {ROLE_PRESETS.map((p) => (
                    <button
                      key={p.email}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      className={`p-2.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                        loginEmail === p.email
                          ? 'bg-cyan-950/90 border-cyan-400 shadow-glow-teal ring-1 ring-cyan-400/50'
                          : 'bg-slate-900/60 border-white/[0.08] hover:border-white/[0.2] hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${p.gradient} flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-md`}>
                          {p.initials}
                        </div>
                        <div className="truncate">
                          <div className="text-[11px] font-bold text-white truncate">{p.title}</div>
                          <div className="text-[9px] text-slate-400 truncate">{p.name.split(' ')[0]}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Validation & Feedback Alerts */}
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 1: OPERATOR SIGN IN FORM                                    */}
          {/* ============================================================== */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Operator Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-900/90 border border-white/[0.1] text-xs text-white placeholder-slate-500 rounded-2xl pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all font-medium"
                    placeholder="arjun.rao@deccanroast.in"
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
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-900/90 border border-white/[0.1] text-xs text-white placeholder-slate-500 rounded-2xl pl-10 pr-10 py-3 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all font-mono"
                    placeholder="••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
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
                    className="rounded-lg bg-slate-900 border-white/[0.15] text-cyan-400 focus:ring-0 w-4 h-4"
                  />
                  <span>Remember session</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('arjun.rao@deccanroast.in');
                    setLoginPassword('••••••••••••');
                    setSuccessMsg('Reset to default credentials for Arjun Rao (Operations Lead)');
                  }}
                  className="text-slate-400 hover:text-cyan-400 transition-colors text-[11px]"
                >
                  Forgot access key?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 hover:from-cyan-300 hover:to-cyan-400 text-black font-extrabold text-xs shadow-glow-teal flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                {loading ? (
                  <span>Authenticating Operator with RBAC...</span>
                ) : (
                  <>
                    <span>Sign In to Control Tower</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ============================================================== */}
          {/* TAB 2: CREATE OPERATOR ACCOUNT FORM                             */}
          {/* ============================================================== */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Operator Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full bg-slate-900/90 border border-white/[0.1] text-xs text-white placeholder-slate-500 rounded-2xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-cyan-400 transition-colors"
                    placeholder="e.g. Arjun Rao"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full bg-slate-900/90 border border-white/[0.1] text-xs text-white placeholder-slate-500 rounded-2xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-cyan-400 transition-colors"
                    placeholder="arjun@company.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">Store / Hub</label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={signupStore}
                      onChange={(e) => setSignupStore(e.target.value)}
                      className="w-full bg-slate-900/90 border border-white/[0.1] text-[11px] text-white rounded-2xl pl-9 pr-2 py-2.5 focus:outline-none focus:border-cyan-400 truncate"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">Role</label>
                  <select
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value)}
                    className="w-full bg-slate-900/90 border border-white/[0.1] text-[11px] text-white rounded-2xl px-3 py-2.5 focus:outline-none focus:border-cyan-400"
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
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full bg-slate-900/90 border border-white/[0.1] text-xs text-white placeholder-slate-500 rounded-2xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-cyan-400 font-mono"
                    placeholder="Min. 8 chars, 1 number, 1 symbol"
                    required
                  />
                </div>

                {signupPassword && (
                  <div className="space-y-1 pt-1">
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className={`h-full ${pwStrength.color} transition-all duration-300`} 
                        style={{ width: pwStrength.width }}
                      />
                    </div>
                    <span className={`text-[10px] font-mono font-bold ${pwStrength.text}`}>{pwStrength.label}</span>
                  </div>
                )}
              </div>

              <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-400 pt-1">
                <input
                  type="checkbox"
                  checked={signupTerms}
                  onChange={(e) => setSignupTerms(e.target.checked)}
                  className="rounded-lg bg-slate-900 border-white/[0.15] text-cyan-400 focus:ring-0 w-4 h-4 mt-0.5"
                />
                <span>I agree to enforce human-governed purchase approvals and immutable audit trail.</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 hover:from-cyan-300 hover:to-cyan-400 text-black font-extrabold text-xs shadow-glow-teal flex items-center justify-center gap-2 transition-all active:scale-[0.99] mt-2"
              >
                {loading ? (
                  <span>Creating Operator Account...</span>
                ) : (
                  <>
                    <span>Create Operator Account</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-white/[0.08]" />
            <span className="flex-shrink mx-3 text-[10px] uppercase font-mono font-bold text-slate-500 tracking-wider">
              Or Fast-Track Live Demo
            </span>
            <div className="flex-grow border-t border-white/[0.08]" />
          </div>

          {/* 1-Click Instant Demo Launcher Card */}
          <button
            onClick={handleEnterDemo}
            disabled={loading}
            className="w-full p-4 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-purple-950/40 hover:from-cyan-950/70 hover:to-purple-950/60 border border-cyan-400/40 hover:border-cyan-300 text-left transition-all group shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 shadow-glow-teal">
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

          {/* Truthful Security Seals */}
          <div className="p-3 bg-slate-900/60 rounded-2xl border border-white/[0.06] text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Strict RBAC Active</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <BadgeCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>256-Bit Cryptographic Ledger</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
