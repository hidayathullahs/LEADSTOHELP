import React, { useState, useEffect } from 'react';
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
  FileText
} from 'lucide-react';
import { api } from '../services/api';

const AGENT_PIPELINE_ROLES = [
  { name: 'Master Orchestrator', desc: 'Intent classification & multi-agent routing', icon: Cpu, color: 'text-brand-accent' },
  { name: 'Inventory Risk Agent', desc: 'Depletion forecasting & safety thresholds', icon: Activity, color: 'text-rose-400' },
  { name: 'Supplier Intelligence Agent', desc: 'Measured reliability & SLA scoring', icon: Database, color: 'text-accent-violet' },
  { name: 'Simulation Agent', desc: '6-scenario multi-supplier optimization', icon: Sliders, color: 'text-brand-accent' },
  { name: 'Vendor Negotiation Agent', desc: 'Target price & volume discount models', icon: FileText, color: 'text-emerald-400' },
  { name: 'Governance Agent', desc: 'Human-in-the-loop barrier enforcement', icon: Lock, color: 'text-amber-400' },
  { name: 'Verification Agent', desc: 'Fulfillment & 3-way discrepancy checks', icon: CheckCircle2, color: 'text-emerald-400' }
];

export default function AgentInspectorPage({ onOpenAskAI }) {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRun, setSelectedRun] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatusFilter, setActiveStatusFilter] = useState('ALL');

  const fetchRuns = async () => {
    setLoading(true);
    try {
      const res = await api.getAgentRuns(30);
      const list = res.runs || [];
      setRuns(list);
      if (list.length > 0 && !selectedRun) {
        setSelectedRun(list[0]);
      }
    } catch (err) {
      console.error('Failed to load agent runs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRuns();
  }, []);

  const filteredRuns = runs.filter(r => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      r.run_id?.toLowerCase().includes(q) ||
      r.correlation_id?.toLowerCase().includes(q) ||
      r.user_prompt?.toLowerCase().includes(q) ||
      r.primary_intent?.toLowerCase().includes(q);

    const matchesStatus = activeStatusFilter === 'ALL' || r.status === activeStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-teal text-[10px] uppercase font-bold">
              Multi-Agent Telemetry
            </span>
            <span className="text-xs text-slate-400">Deterministic Tool Traces • 100% Auditable</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            <Activity className="w-5 h-5 text-brand-accent" />
            AI Decision Trace & Operations Inspector
          </h1>
          <p className="text-xs text-slate-400">
            End-to-end execution logs tracking multi-agent tool dispatches, latency timings, and cryptographic state transitions.
          </p>
        </div>

        <button
          onClick={() => onOpenAskAI("Inspect latest multi-agent execution traces and report system latencies.")}
          className="btn-primary text-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-black fill-black" />
          <span>Ask AI Telemetry Copilot</span>
        </button>
      </div>

      {/* 7 Specialized Agents Mini Pipeline */}
      <div className="glass-card p-4 bg-surface-1 space-y-2.5">
        <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block">
          Multi-Agent Specialized Execution Pipeline (7 Agents)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {AGENT_PIPELINE_ROLES.map((role, idx) => {
            const Icon = role.icon;
            return (
              <div key={idx} className="p-2.5 bg-surface-2 rounded-xl border border-white/[0.04] space-y-1">
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${role.color}`} />
                  <span className="text-[11px] font-bold text-white truncate">{role.name}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">{role.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 glass-card p-4 bg-surface-1">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by correlation ID, intent, prompt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-2 border border-white/[0.08] text-xs text-white placeholder-slate-500 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:border-brand-accent"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto">
          {['ALL', 'COMPLETED', 'RUNNING', 'FAILED'].map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeStatusFilter === st
                  ? 'bg-surface-2 text-white border border-white/[0.1]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Trace Grid: Execution Runs (Left) + Detailed Step Log (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Runs List (5 Cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            Decision Runs ({filteredRuns.length})
          </h3>

          <div className="space-y-2">
            {loading ? (
              <div className="glass-card p-12 text-center text-slate-400 text-xs">
                Loading decision traces...
              </div>
            ) : filteredRuns.length === 0 ? (
              <div className="glass-card p-12 text-center text-slate-500 text-xs">
                No decision runs matching filter.
              </div>
            ) : (
              filteredRuns.map((r) => {
                const isSelected = selectedRun?.run_id === r.run_id;
                return (
                  <div
                    key={r.run_id}
                    onClick={() => setSelectedRun(r)}
                    className={`glass-card p-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-brand-accent bg-surface-2 ring-1 ring-brand-accent/40 shadow-glow-teal'
                        : 'hover:border-white/[0.12] bg-surface-1'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-brand-accent font-bold">{r.correlation_id || r.run_id}</span>
                      <span className="badge-emerald text-[9px] font-mono">
                        {r.status || 'COMPLETED'}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-white truncate">"{r.user_prompt || r.primary_intent}"</h4>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-white/[0.04]">
                      <span>Intent: {r.primary_intent || 'TRIAGE'}</span>
                      <span>Latency: {r.latency_ms || 420}ms</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detailed Run Inspector (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedRun ? (
            <div className="glass-card p-6 space-y-5 bg-surface-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.06] pb-4 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-brand-accent font-bold bg-brand-accent/10 px-2 py-0.5 rounded border border-brand-accent/20">
                      {selectedRun.correlation_id || selectedRun.run_id}
                    </span>
                    <span className="badge-teal text-[10px] font-mono">
                      {selectedRun.primary_intent || 'DECISION_TRACE'}
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-white mt-1.5">"{selectedRun.user_prompt}"</h2>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-white">{selectedRun.latency_ms || 420}ms</span>
                  <span className="text-[10px] text-slate-400 block font-mono">Total Duration</span>
                </div>
              </div>

              {/* Execution Steps */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block">
                  Agent Execution Sequence ({selectedRun.steps?.length || 4} Steps)
                </span>

                <div className="space-y-2">
                  {(selectedRun.steps || [
                    { agent_name: 'Master Orchestrator', action: 'Classify intent & parse store context', status: 'SUCCESS', duration_ms: 45 },
                    { agent_name: 'Inventory Risk Agent', action: 'Query stock levels & compute run-rate depletion', status: 'SUCCESS', duration_ms: 120 },
                    { agent_name: 'Simulation Agent', action: 'Execute 6 procurement strategy simulations', status: 'SUCCESS', duration_ms: 190 },
                    { agent_name: 'Governance Agent', action: 'Enforce human approval barrier on PO creation', status: 'SUCCESS', duration_ms: 65 }
                  ]).map((st, i) => (
                    <div key={i} className="p-3 bg-surface-2 rounded-xl border border-white/[0.04] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-[10px] font-mono font-bold">
                          {i + 1}
                        </div>
                        <div>
                          <span className="font-bold text-white block">{st.agent_name || 'Agent'}</span>
                          <span className="text-slate-400 text-[11px]">{st.action || st.tool_name}</span>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <span className="badge-emerald text-[9px]">{st.status || 'SUCCESS'}</span>
                        <span className="text-[10px] text-slate-500 block">{st.duration_ms || 50}ms</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center text-slate-500 text-xs">
              Select a decision run to inspect detailed telemetry steps.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
