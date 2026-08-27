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
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';

export default function AgentInspectorPage({ onOpenAskAI }) {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRun, setSelectedRun] = useState(null);

  const fetchRuns = async () => {
    setLoading(true);
    try {
      const res = await api.getAgentRuns();
      setRuns(res.runs || []);
      if (res.runs && res.runs.length > 0) {
        setSelectedRun(res.runs[0]);
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

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Feature 19
            </span>
            <span className="text-xs text-slate-400">Agentic Transparency & Telemetry</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Agent Run Inspector & Execution Telemetry
          </h1>
          <p className="text-xs text-slate-400">
            Inspect exact tool calls, inputs, outputs, execution latencies, and human-in-the-loop state transitions.
          </p>
        </div>

        <button
          onClick={() => onOpenAskAI("Run diagnostic trace across all 5 specialist agents.")}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-black font-bold text-xs rounded-xl shadow-glow-cyan flex items-center gap-1.5 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Trigger New Agent Trace</span>
        </button>
      </div>

      {/* Main Grid: Runs List (Left) + Execution Deep Dive (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Runs List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-400">Execution Runs ({runs.length})</h3>

          {loading ? (
            <div className="text-xs text-slate-400 py-8 text-center">Loading telemetry logs...</div>
          ) : (
            runs.map((r) => (
              <div
                key={r.run_id}
                onClick={() => setSelectedRun(r)}
                className={`glass-card p-4 cursor-pointer transition-all ${
                  selectedRun?.run_id === r.run_id
                    ? 'border-cyan-500 bg-cyan-950/20 shadow-glow-cyan'
                    : 'hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10px] text-cyan-400 font-bold">{r.run_id}</span>
                  <span className="badge-emerald">{r.status}</span>
                </div>

                <h4 className="text-xs font-bold text-white line-clamp-1">"{r.user_prompt}"</h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-2">
                  <span>Latency: {Math.round(r.total_duration_ms || 420)}ms</span>
                  <span>•</span>
                  <span>Tokens: {r.tokens_used || 680}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Execution Step-by-Step Inspector (8 Cols) */}
        {selectedRun ? (
          <div className="lg:col-span-8 glass-card p-6 space-y-6">
            {/* Top Run Metadata */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="font-mono text-xs text-cyan-400 font-bold">{selectedRun.run_id}</span>
                <h2 className="text-base font-bold text-white mt-0.5">"{selectedRun.user_prompt}"</h2>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedRun.agents_involved?.map((ag, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                      {ag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">Status</span>
                <span className="text-sm font-bold text-white font-mono">{selectedRun.status}</span>
                <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                  Duration: {Math.round(selectedRun.total_duration_ms || 380)}ms
                </span>
              </div>
            </div>

            {/* Step-by-step Trace */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase text-slate-400">
                Execution Steps ({selectedRun.steps?.length || 0})
              </h3>

              {selectedRun.steps?.map((step, idx) => (
                <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-mono text-[10px] font-bold">
                        {step.step_number}
                      </span>
                      <span className="text-xs font-bold text-white">{step.agent_name}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                      {step.action_type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">{step.content}</p>

                  {/* Tool Call Logs */}
                  {step.tool_calls?.map((tc, tcIdx) => (
                    <div key={tcIdx} className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1.5">
                      <div className="flex items-center justify-between text-cyan-400 font-bold">
                        <span className="flex items-center gap-1.5">
                          <Code className="w-3.5 h-3.5" />
                          Tool: {tc.tool_name}()
                        </span>
                        <span className="text-slate-500 font-normal">{Math.round(tc.duration_ms || 12)}ms</span>
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

            {/* Synthesized Response */}
            <div className="p-4 bg-cyan-950/20 border border-cyan-800/40 rounded-xl space-y-2">
              <span className="text-[10px] uppercase font-bold text-cyan-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Synthesized Agent Output
              </span>
              <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
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
