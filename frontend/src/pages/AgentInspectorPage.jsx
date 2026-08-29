import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  Terminal,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  ChevronRight,
  Code,
  ShieldCheck,
  Search,
  Filter,
  ArrowDown,
  Database,
  Sliders,
  FileCheck,
  Lock,
  Zap,
  RefreshCw,
  AlertTriangle,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { useToast } from '../components/ToastContext';

const DECISION_TIMELINE_STEPS = [
  {
    step: 1,
    title: '1. Stockout Risk Signal Detected',
    time: 'T+0.00s',
    agent: 'Inventory Risk Agent',
    description: 'COFFEE-001 breached 50 kg safety threshold with 36.0 kg on-hand stock remaining.',
    status: 'COMPLETED',
    icon: Activity,
    color: 'text-rose-400',
    badge: 'Risk Trigger'
  },
  {
    step: 2,
    title: '2. Depletion Velocity Verified',
    time: 'T+0.12s',
    agent: 'Inventory Risk Agent',
    description: 'POS register stream verified 13.0 kg/day 7-day velocity (~2.77 days until total stockout).',
    status: 'COMPLETED',
    icon: Database,
    color: 'text-amber-400',
    badge: 'Verified Data'
  },
  {
    step: 3,
    title: '3. Menu Revenue Exposure Calculated',
    time: 'T+0.25s',
    agent: 'Business Impact Engine',
    description: 'Recipe graph determined COFFEE-001 exposure: 48% of all store beverage sales (₹14,500 daily revenue risk).',
    status: 'COMPLETED',
    icon: FileText,
    color: 'text-brand-accent',
    badge: 'Impact Analysis'
  },
  {
    step: 4,
    title: '4. Supplier SLAs & Lead Times Queried',
    time: 'T+0.42s',
    agent: 'Supplier Intelligence Agent',
    description: 'Malnad Coffee Planters (94% on-time, 3-day lead time) and Metro Hub (92% SLA, 1-day turnaround) evaluated.',
    status: 'COMPLETED',
    icon: Database,
    color: 'text-accent-violet',
    badge: 'Supplier Audit'
  },
  {
    step: 5,
    title: '5. Six Multi-Supplier Scenarios Simulated',
    time: 'T+0.65s',
    agent: 'Deterministic Simulation Engine',
    description: 'Evaluated 6 permutations for cost, lead time, and single-supplier concentration risk.',
    status: 'COMPLETED',
    icon: Sliders,
    color: 'text-brand-accent',
    badge: 'Optimization'
  },
  {
    step: 6,
    title: '6. Split-Order Strategy Selected',
    time: 'T+0.81s',
    agent: 'Procurement Optimizer',
    description: 'Optimal allocation: 70kg Malnad (₹850/kg) + 30kg Metro (₹894.27/kg). Total cost ₹86,328 (+₹8,672 savings).',
    status: 'COMPLETED',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    badge: 'Optimal Math'
  },
  {
    step: 7,
    title: '7. Human Governance Gate Enforced',
    time: 'T+0.95s',
    agent: 'Governance Security Agent',
    description: 'Purchase order staged in Human Approval Queue. Financial commitment locked pending operator sign-off.',
    status: 'ACTIVE',
    icon: Lock,
    color: 'text-amber-400',
    badge: 'Strict RBAC'
  },
  {
    step: 8,
    title: '8. Cryptographic Decision Receipt Stored',
    time: 'T+1.10s',
    agent: 'Master Ledger Agent',
    description: 'Trace bundle and deterministic hash saved to audit log for post-resolution validation.',
    status: 'COMPLETED',
    icon: ShieldCheck,
    color: 'text-emerald-400',
    badge: 'Ledger Synced'
  }
];

export default function AgentInspectorPage({ onOpenAskAI }) {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const handleCopyTrace = () => {
    navigator.clipboard.writeText(JSON.stringify(DECISION_TIMELINE_STEPS, null, 2));
    setCopied(true);
    addToast({
      title: 'Trace Copied',
      message: 'Decision timeline copied to clipboard.',
      type: 'info'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-teal text-[10px] uppercase font-bold font-mono">
              Deterministic Decision Trace
            </span>
            <span className="text-xs text-slate-400">How the Decision Was Made • 100% Auditable</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            <Activity className="w-5 h-5 text-brand-accent shrink-0" />
            AI Decision Trace & Chronological Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent, step-by-step audit trail showing how LEADSTOHELP moved from raw telemetry signal to verified action.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyTrace}
            className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Trace' : 'Copy Trace JSON'}</span>
          </button>
          <button
            onClick={() => onOpenAskAI("Explain the 8-step decision trace for the Arabica Crisis replenishment.")}
            className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-black fill-black" />
            <span>Ask Copilot about Trace</span>
          </button>
        </div>
      </div>

      {/* 8-Step Chronological Timeline */}
      <div className="glass-card p-6 border-white/[0.08] space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-accent" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Chronological 8-Step Decision Sequence (Arabica Crisis)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">1.10s Total Execution Time</span>
        </div>

        <div className="space-y-4 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-white/[0.08] before:-z-0">
          {DECISION_TIMELINE_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative z-10 flex items-start gap-4 group">
                <div className="w-8 h-8 rounded-xl bg-surface-1 border border-white/[0.12] flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                  <Icon className={`w-4 h-4 ${step.color}`} />
                </div>

                <div className="flex-1 p-4 rounded-2xl bg-surface-2/60 border border-white/[0.04] group-hover:bg-surface-2 transition-colors space-y-1">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-white">
                        {step.title}
                      </h4>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-surface-3 text-slate-400 border border-white/[0.04]">
                        {step.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                      <span>{step.agent}</span>
                      <span>•</span>
                      <span className="text-brand-accent">{step.time}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
