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
  BadgeCheck
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import heroBgImg from '../assets/hero_bg.png';

const SHOWCASE_SLIDES = [
  {
    id: 'risk-radar',
    tag: 'Autonomous Risk Detection',
    tabLabel: '01. Risk Radar',
    title: 'Detect stockouts days before they disrupt store revenue.',
    desc: 'Continuous real-time telemetry parses POS run-rates and supplier lead times, flagging the Arabica depletion cliff 2.8 days in advance.',
    metric: '2.8 Days',
    metricLabel: 'Early Warning Runway',
    badge: 'Real-time AI Telemetry',
    visualType: 'radar',
    stat1: '13.0 kg/day',
    stat1Label: 'Run-Rate Surge',
    stat2: '₹32,400',
    stat2Label: 'Daily Revenue at Risk',
    highlights: [
      'Identifies 13.0 kg/day run-rate surge from weekend rush',
      'Flags ₹32,400/day revenue loss before Friday night',
      'Instant root-cause analysis with real-time evidence links'
    ]
  },
  {
    id: 'what-if-sim',
    tag: 'Multi-Scenario Digital Twin',
    tabLabel: '02. Digital Twin',
    title: 'Simulate 6 procurement options before committing ₹1.',
    desc: 'Evaluates spot pricing, supplier SLAs, and lead-time risks to discover the optimal Split-Order replenishment strategy.',
    metric: '₹8,672',
    metricLabel: 'Cost Optimization',
    badge: '6-Scenario Digital Twin',
    visualType: 'split-order',
    stat1: '40 kg (24h)',
    stat1Label: 'Metro Wholesale Buffer',
    stat2: '60 kg (Bulk)',
    stat2Label: 'Malnad Tiered Volume',
    highlights: [
      '40 kg Metro Wholesale for immediate 24h stockout shield',
      '60 kg Malnad Coffee Planters for bulk tiered volume savings',
      'Guarantees 0% stockout risk with 8% composite risk score'
    ]
  },
  {
    id: 'governance-ocr',
    tag: 'Strict Human Governance & OCR',
    tabLabel: '03. Governance & OCR',
    title: 'Zero rogue AI spend. Every decision verified by humans.',
    desc: '3-way automated matching flags physical challan shortages and routes high-impact purchase orders directly to your approval center.',
    metric: '100%',
    metricLabel: 'Human Governance Gate',
    badge: 'Cryptographic Audit Trail',
    visualType: 'ocr',
    stat1: '-10 kg Shortfall',
    stat1Label: 'Kaveri Challan Variance',
    stat2: '₹486.40',
    stat2Label: 'Auto Debit Note Sealed',
    highlights: [
      'Catches 10 kg shortfall on Kaveri Dairy delivery challan',
      'Automated Debit Note issuance with OCR evidence trace',
      'Immutable cryptographic sign-off receipts in audit ledger'
    ]
  }
];

const ROLE_PRESETS = [
  {
    title: 'Operations Lead',
    email: 'arjun.rao@deccanroast.in',
    name: 'Arjun Rao',
    initials: 'AR',
    store: 'Deccan Roast Specialty Hub • #BLR-01',
    role: 'Operations Lead',
    color: 'from-cyan-500 to-blue-600',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
  },
  {
    title: 'Store Manager',
    email: 'priya.sharma@deccanroast.in',
    name: 'Priya Sharma',
    initials: 'PS',
    store: 'Whitefield Roastery • #BLR-04',
    role: 'Store Manager',
    color: 'from-emerald-500 to-teal-600',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
  },
  {
    title: 'VP Supply Chain',
    email: 'vikram.mehta@deccanroast.in',
    name: 'Vikram Mehta',
    initials: 'VM',
    store: 'National Network Operations',
    role: 'Supply Chain VP',
    color: 'from-purple-500 to-indigo-600',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
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
    }, 7000);
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

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
    if (score <= 3) return { score: 2, label: 'Moderate', color: 'bg-amber-500', text: 'text-amber-400' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-400', text: 'text-emerald-400' };
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

  return (
    <div className="min-h-screen w-screen bg-[#06080F] flex flex-col lg:flex-row text-slate-100 font-sans selection:bg-cyan-400 selection:text-black select-none relative overflow-hidden">
      
      {/* Background Animated Gradient Mesh / Auroras */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[130px]" />
        <div className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px]" />
      </div>

      {/* ========================================================================= */}
      {/* LEFT COLUMN: INTERACTIVE VISUAL SHOWCASE SLIDER (58% Width on Desktop)    */}
      {/* ========================================================================= */}
      <div 
        className="lg:w-7/12 p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-[#070B14]/80 backdrop-blur-xl relative z-10 overflow-hidden"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Top Header Row with Brand and Back Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-75 animate-pulse" />
              <img
                src={logoImg}
                alt="LEADSTOHELP AI Logo"
                className="w-10 h-10 object-contain relative rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-wider text-white">LEADSTOHELP</span>
                <span className="text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-glow-teal">
                  AI CONTROL TOWER
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Autonomous Retail Operations & Verified Action Platform</p>
            </div>
          </div>

          {onExploreLanding && (
            <button
              onClick={onExploreLanding}
              className="text-xs text-cyan-300 hover:text-cyan-200 font-bold flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 px-3.5 py-2 rounded-xl border border-white/[0.1] transition-all hover:border-cyan-400/50 shadow-lg group"
            >
              <span>Back to Overview</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* Center Interactive Slider / Storyboard Area */}
        <div className="my-6 lg:my-0 space-y-5 max-w-xl">
          
          {/* Interactive Slide Category Tab Switchers */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {SHOWCASE_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentSlide(idx);
                  setIsAutoPlaying(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                  currentSlide === idx
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-glow-teal scale-105'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/[0.06]'
                }`}
              >
                <span>{s.tabLabel}</span>
              </button>
            ))}
          </div>

          {/* Slide Headline & Description */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-[11px] text-cyan-300 font-bold uppercase tracking-wider font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>{slide.tag}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              {slide.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {slide.desc}
            </p>
          </div>

          {/* ============================================================== */}
          {/* DYNAMIC VISUAL CARD PER SLIDE TYPE                              */}
          {/* ============================================================== */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-950 border border-white/[0.12] shadow-2xl backdrop-blur-md space-y-4 relative overflow-hidden group">
            
            {/* Top ambient glow line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

            {/* Slide 1 Visual: Radar & Depletion Horizon */}
            {slide.visualType === 'radar' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                      <Radar className="w-4 h-4 animate-spin text-rose-400" style={{ animationDuration: '8s' }} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white font-mono">COFFEE-001 • Specialty Arabica (AAA)</div>
                      <div className="text-[10px] text-slate-400">Primary Raw Material • 48% Beverage Orders</div>
                    </div>
                  </div>
                  <span className="badge-rose text-[10px] font-mono font-bold animate-pulse">
                    CRITICAL 2.8d
                  </span>
                </div>

                {/* Live Stockout Timeline Gauge */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Current Stock: <strong className="text-white">36.0 kg</strong></span>
                    <span className="text-rose-400 font-bold">Depletion Cliff: Friday Night</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                    <div className="bg-rose-500 h-full w-[35%] rounded-l-full shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                    <div className="bg-amber-500/40 h-full w-[25%]" />
                    <div className="bg-slate-700 h-full w-[40%] rounded-r-full" />
                  </div>
                </div>

                {/* 2 Key Micro Stats */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-white/[0.06]">
                    <div className="text-[9px] uppercase font-mono text-slate-400">{slide.stat1Label}</div>
                    <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5">{slide.stat1}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-white/[0.06]">
                    <div className="text-[9px] uppercase font-mono text-slate-400">{slide.stat2Label}</div>
                    <div className="text-sm font-bold text-rose-400 font-mono mt-0.5">{slide.stat2}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Slide 2 Visual: Multi-Scenario Split-Order Allocation */}
            {slide.visualType === 'split-order' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white font-mono">Scenario B: Split-Order Strategy</div>
                      <div className="text-[10px] text-emerald-400 font-medium font-mono">AI Recommended • Optimal Sourcing</div>
                    </div>
                  </div>
                  <span className="badge-emerald text-[10px] font-mono font-bold">
                    +₹8,672 SAVINGS
                  </span>
                </div>

                {/* Split Order Visual Distribution */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-cyan-300">40 kg Metro Wholesale (24h Buffer)</span>
                    <span className="text-purple-300">60 kg Malnad Planters (Bulk Tier)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex gap-1 p-0.5">
                    <div className="bg-cyan-500 h-full w-[40%] rounded-l-full shadow-glow-teal flex items-center justify-center text-[8px] font-black text-black">40%</div>
                    <div className="bg-purple-500 h-full w-[60%] rounded-r-full flex items-center justify-center text-[8px] font-black text-white">60%</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-white/[0.06]">
                    <div className="text-[9px] uppercase font-mono text-slate-400">Total Purchase Cost</div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">₹86,328</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-white/[0.06]">
                    <div className="text-[9px] uppercase font-mono text-slate-400">Composite Risk Score</div>
                    <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">8% (Protected)</div>
                  </div>
                </div>
              </div>
            )}

            {/* Slide 3 Visual: OCR Invoice Shortfall & Governance Seal */}
            {slide.visualType === 'ocr' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white font-mono">Invoice #KD-8839 • Kaveri Dairy</div>
                      <div className="text-[10px] text-slate-400">Vision OCR 3-Way Reconciliation</div>
                    </div>
                  </div>
                  <span className="badge-amber text-[10px] font-mono font-bold">
                    SHORTFALL CAUGHT
                  </span>
                </div>

                {/* Line Comparison Table */}
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/[0.06] text-[11px] font-mono space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>PO #PO-8821 Line 1:</span>
                    <span className="text-white">100 Litres Farm Milk</span>
                  </div>
                  <div className="flex justify-between text-rose-300 font-bold">
                    <span>Physical Challan Delivered:</span>
                    <span>90 Litres (-10L Shortfall)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-white/[0.06]">
                    <div className="text-[9px] uppercase font-mono text-slate-400">Debit Note Generated</div>
                    <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">₹486.40 Credit</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-white/[0.06]">
                    <div className="text-[9px] uppercase font-mono text-slate-400">Human Approval Gate</div>
                    <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5">100% Enforced</div>
                  </div>
                </div>
              </div>
            )}

            {/* Slide Bullet Highlights */}
            <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
              {slide.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                    <Check className="w-2 h-2 text-emerald-400" />
                  </div>
                  <span className="truncate">{h}</span>
                </div>
              ))}
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
                      ? 'bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.9)] scale-y-125'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setCurrentSlide((prev) => (prev - 1 + SHOWCASE_SLIDES.length) % SHOWCASE_SLIDES.length);
                  setIsAutoPlaying(false);
                }}
                className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/[0.08] hover:border-cyan-500/40 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setCurrentSlide((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
                  setIsAutoPlaying(false);
                }}
                className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/[0.08] hover:border-cyan-500/40 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Proof Metric Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/[0.08] text-left">
          <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/[0.06] backdrop-blur-sm">
            <div className="text-[10px] uppercase font-mono text-slate-400">Monthly Managed</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">₹1.4M+ Spend</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/[0.06] backdrop-blur-sm">
            <div className="text-[10px] uppercase font-mono text-slate-400">Stockout Rate</div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">0.0% Loss</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/[0.06] backdrop-blur-sm">
            <div className="text-[10px] uppercase font-mono text-slate-400">Decision Speed</div>
            <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5">&lt; 100 ms</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/[0.06] backdrop-blur-sm">
            <div className="text-[10px] uppercase font-mono text-slate-400">Human Governance</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">Zero Rogue Spend</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: HIGH-CONVERTING GLASSMORPHIC AUTH CONTAINER (42% Width)     */}
      {/* ========================================================================= */}
      <div className="lg:w-5/12 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#06080F] relative z-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-md w-full mx-auto space-y-5">
          
          {/* Card Header & Mode Switcher */}
          <div className="space-y-4">
            
            {/* Tabbed Segmented Switcher */}
            <div className="p-1 rounded-2xl bg-slate-900/90 border border-white/[0.1] flex items-center relative shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'login'
                    ? 'bg-gradient-to-r from-cyan-400 to-teal-300 text-black shadow-glow-teal'
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
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'signup'
                    ? 'bg-gradient-to-r from-cyan-400 to-teal-300 text-black shadow-glow-teal'
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
                          ? 'bg-cyan-950/80 border-cyan-400 shadow-glow-teal ring-1 ring-cyan-400/50'
                          : 'bg-slate-900/60 border-white/[0.08] hover:border-white/[0.2] hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center text-[10px] font-black text-white shrink-0`}>
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
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden flex gap-1">
                      <div className={`h-full ${pwStrength.score >= 1 ? pwStrength.color : 'bg-transparent'} flex-1 rounded-full`} />
                      <div className={`h-full ${pwStrength.score >= 2 ? pwStrength.color : 'bg-transparent'} flex-1 rounded-full`} />
                      <div className={`h-full ${pwStrength.score >= 3 ? pwStrength.color : 'bg-transparent'} flex-1 rounded-full`} />
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
