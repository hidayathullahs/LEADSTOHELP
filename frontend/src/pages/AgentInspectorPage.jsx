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
  { name: 'Master Orchestrator', desc: 'Intent classification & multi-agent routing', icon: Cpu, color: 'text-cyan-400', border: 'border-cyan-500/40' },
  { name: 'Inventory Risk Agent', desc: 'Depletion forecasting & safety thresholds', icon: Activity, color: 'text-rose-400', border: 'border-rose-500/40' },
  { name: 'Supplier Intelligence Agent', desc: 'Measured reliability & SLA scoring', icon: Database, color: 'text-indigo-400', border: 'border-indigo-500/40' },
  { name: 'Simulation Agent', desc: '6-scenario multi-supplier optimization', icon: Sliders, color: 'text-purple-400', border: 'border-purple-500/40' },
  { name: 'Vendor Negotiation Agent', desc: 'Target price & volume discount models', icon: FileText, color: 'text-emerald-400', border: 'border-emerald-500/40' },
  { name: 'Governance Agent', desc: 'Human-in-the-loop barrier enforcement', icon: Lock, color: 'text-amber-400', border: 'border-amber-500/40' },
  { name: 'Verification Agent', desc: 'Fulfillment & 3-way discrepancy checks', icon: CheckCircle2, color: 'text-green-400', border: 'border-green-500/40' }
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
      case 'RUNNING':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-800 animate-pulse';
      case 'BLOCKED':
      case 'AWAITING_APPROVAL':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'FAILED':
        return 'bg-rose-950/80 text-rose-300 border-rose-800';
      default:
        return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Agentic Observability
            </span>
            <span className="text-xs text-slate-400">Step-by-Step Multi-Agent Execution Telemetry</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Operations Inspector & Agent Execution Traces
          </h1>
          <p className="text-xs text-slate-400">
            Inspect exact tool calls, inputs, outputs, execution latencies, and correlation-tracked human-in-the-loop state transitions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchRuns}
            disabled={loading}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition-all"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => onOpenAskAI("Run diagnostic trace across all specialist agents for Arabica coffee.")}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-black font-bold text-xs rounded-xl shadow-glow-cyan flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Trigger New Agent Trace</span>
          </button>
        </div>
      </div>

      {/* Multi-Agent Architecture Pipeline Reference */}
      <div className="glass-card p-4 border-indigo-500/20 bg-slate-900/60">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
          Specialist Agent Pipeline Orchestration Flow:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {AGENT_PIPELINE_ROLES.map((agent, i) => {
            const Icon = agent.icon;
            return (
              <React.Fragment key={agent.name}>
                <div className={`p-2 rounded-xl bg-slate-950 border ${agent.border} flex items-center gap-2 shrink-0`}>
                  <Icon className={`w-3.5 h-3.5 ${agent.color}`} />
                  <div>
                    <span className="text-[11px] font-bold text-white block">{agent.name}</span>
                    <span className="text-[9px] text-slate-400 block">{agent.desc}</span>
                  </div>
                </div>
                {i < AGENT_PIPELINE_ROLES.length - 1 && (
                  <span className="text-slate-600 font-bold text-xs shrink-0">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Runs List (Left) + Execution Deep Dive (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Runs List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase text-slate-400">Execution Runs ({filteredRuns.length})</h3>
            <span className="text-[10px] text-cyan-400 font-mono">Live Telemetry</span>
          </div>

          {/* Search & Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search run ID, correlation ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-xs text-slate-400 py-8 text-center glass-card">
              Loading telemetry execution traces...
            </div>
          ) : filteredRuns.length === 0 ? (
            <div className="glass-card p-8 text-center text-slate-400 text-xs">
              No runs match search criteria.
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredRuns.map((r) => {
                const isSelected = selectedRun?.run_id === r.run_id;
                const corrId = r.correlation_id || r.run_id;

                return (
                  <div
                    key={r.run_id}
                    onClick={() => setSelectedRun(r)}
                    className={`glass-card p-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/25 ring-1 ring-cyan-500/40 shadow-glow-cyan'
                        : 'hover:border-slate-700 bg-slate-900/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-cyan-400 font-bold">{corrId}</span>
                      <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded border ${getStatusBadgeClass(r.status)}`}>
                        {r.status || 'COMPLETED'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white line-clamp-1">"{r.user_prompt}"</h4>
                    
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-800/80">
                      <span>{r.agents_involved?.length || 1} Agents</span>
                      <span>Latency: {Math.round(r.total_duration_ms || 320)}ms</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Execution Step-by-Step Inspector (8 Cols) */}
        {selectedRun ? (
          <div className="lg:col-span-8 glass-card p-6 space-y-6">
            {/* Top Run Metadata Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-4 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                    Correlation ID: {selectedRun.correlation_id || selectedRun.run_id}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getStatusBadgeClass(selectedRun.status)}`}>
                    {selectedRun.status || 'COMPLETED'}
                  </span>
                </div>
                <h2 className="text-base font-bold text-white mt-1.5">"{selectedRun.user_prompt}"</h2>
                
                {/* Agent chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedRun.agents_involved?.map((ag, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-cyan-400" />
                      <span>{ag}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-bold text-white font-mono">
                  {Math.round(selectedRun.total_duration_ms || 380)}ms
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Total Latency
                </span>
                {selectedRun.generated_approval_id && (
                  <span className="text-[10px] text-amber-400 font-mono block mt-1">
                    Approval ID: {selectedRun.generated_approval_id}
                  </span>
                )}
              </div>
            </div>

            {/* Step-by-Step Vertical Execution Trace */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  Step-by-Step Multi-Agent Execution Pipeline ({selectedRun.steps?.length || 0} steps)
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">Deterministic Grounded Output</span>
              </div>

              <div className="space-y-3">
                {selectedRun.steps?.map((step, idx) => (
                  <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5 relative">
                    {/* Step Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-mono text-[10px] font-bold">
                          {step.step_number || idx + 1}
                        </span>
                        <span className="text-xs font-bold text-white">{step.agent_name}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                        {step.action_type || 'EXECUTION'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{step.content}</p>

                    {/* Tool Execution Logs */}
                    {step.tool_calls?.map((tc, tcIdx) => (
                      <div key={tcIdx} className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1.5">
                        <div className="flex items-center justify-between text-cyan-400 font-bold">
                          <span className="flex items-center gap-1.5">
                            <Code className="w-3.5 h-3.5" />
                            Tool: {tc.tool_name}()
                          </span>
                          <span className="text-slate-500 font-normal">{Math.round(tc.duration_ms || 15)}ms</span>
                        </div>

                        <div className="text-slate-400">
                          <span className="text-slate-500">Input: </span>
                          <span className="text-slate-300">{JSON.stringify(tc.tool_input)}</span>
                        </div>

                        <div className="text-slate-400 truncate">
                          <span className="text-slate-500">Output: </span>
                          <span className="text-emerald-400">{JSON.stringify(tc.tool_output)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Synthesized Response Box */}
            <div className="p-4 bg-cyan-950/20 border border-cyan-800/40 rounded-xl space-y-2">
              <span className="text-[10px] uppercase font-bold text-cyan-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Synthesized Agent Output
              </span>
              <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                {selectedRun.final_response}
              </p>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 glass-card p-12 text-center text-slate-500">
            Select an execution run to inspect multi-agent tool traces.
          </div>
        )}
      </div>
    </div>
  );
}
