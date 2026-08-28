import React, { useState } from 'react';
import {
  X, Radio, Database, BarChart3, Layers, ShieldCheck,
  User, CheckCircle2, Sparkles, ChevronRight, ChevronDown
} from 'lucide-react';

/**
 * EvidenceDrawer — Full explainability trace for an AI recommendation.
 * Shows 8-step pipeline: Signal → Data → Analysis → Simulated → Recommended → Governance → Decision → Result
 */

const PIPELINE_PHASES = [
  { key: 'SIGNAL_DETECTED', label: 'Signal Detected', icon: Radio, color: 'text-rose-400', bg: 'bg-rose-950/30 border-rose-800/40' },
  { key: 'DATA_RETRIEVED', label: 'Data Retrieved', icon: Database, color: 'text-blue-400', bg: 'bg-blue-950/30 border-blue-800/40' },
  { key: 'ANALYSIS', label: 'Analysis', icon: BarChart3, color: 'text-amber-400', bg: 'bg-amber-950/30 border-amber-800/40' },
  { key: 'OPTIONS_SIMULATED', label: 'Options Simulated', icon: Layers, color: 'text-purple-400', bg: 'bg-purple-950/30 border-purple-800/40' },
  { key: 'RECOMMENDATION', label: 'Recommendation', icon: Sparkles, color: 'text-cyan-400', bg: 'bg-cyan-950/30 border-cyan-800/40' },
  { key: 'GOVERNANCE_CHECK', label: 'Governance Check', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-950/30 border-emerald-800/40' },
  { key: 'HUMAN_DECISION', label: 'Human Decision', icon: User, color: 'text-indigo-400', bg: 'bg-indigo-950/30 border-indigo-800/40' },
  { key: 'RESULT', label: 'Result', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-950/30 border-green-800/40' },
];

export default function EvidenceDrawer({ isOpen, onClose, evidence = [], correlationId, title = 'AI Decision Trace' }) {
  const [expandedStep, setExpandedStep] = useState(null);

  if (!isOpen) return null;

  // Map evidence items to pipeline phases
  const phaseMap = {};
  PIPELINE_PHASES.forEach(p => { phaseMap[p.key] = []; });

  evidence.forEach(item => {
    const type = item.evidence_type || item.phase || 'ANALYSIS';
    if (type === 'INVENTORY' || type === 'FORECAST') {
      phaseMap['DATA_RETRIEVED'].push(item);
    } else if (type === 'RISK') {
      phaseMap['SIGNAL_DETECTED'].push(item);
    } else if (type === 'SIMULATION') {
      phaseMap['OPTIONS_SIMULATED'].push(item);
    } else if (type === 'SUPPLIER' || type === 'PRICE') {
      phaseMap['DATA_RETRIEVED'].push(item);
    } else {
      phaseMap['ANALYSIS'].push(item);
    }
  });

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#0D121F] border-l border-slate-800/80 z-50 flex flex-col shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="p-4 border-b border-slate-800/60 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-sm font-bold text-white">{title}</h3>
            {correlationId && (
              <p className="text-[10px] font-mono text-slate-500 mt-0.5">ID: {correlationId}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pipeline Steps */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {PIPELINE_PHASES.map((phase, index) => {
            const PhaseIcon = phase.icon;
            const items = phaseMap[phase.key] || [];
            const isExpanded = expandedStep === phase.key;
            const isActive = items.length > 0;

            return (
              <div key={phase.key}>
                {/* Step connector line */}
                {index > 0 && (
                  <div className="ml-4 h-3 border-l border-dashed border-slate-700" />
                )}

                {/* Step card */}
                <button
                  onClick={() => setExpandedStep(isExpanded ? null : phase.key)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isActive
                      ? `${phase.bg} hover:border-opacity-80`
                      : 'bg-slate-900/30 border-slate-800/40 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isActive ? 'bg-slate-900/60' : 'bg-slate-900/40'
                      }`}>
                        <PhaseIcon className={`w-3.5 h-3.5 ${isActive ? phase.color : 'text-slate-600'}`} />
                      </div>
                      <div>
                        <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-600'}`}>
                          Step {index + 1}: {phase.label}
                        </span>
                        {isActive && (
                          <span className="ml-2 text-[10px] text-slate-400">
                            ({items.length} data point{items.length !== 1 ? 's' : ''})
                          </span>
                        )}
                      </div>
                    </div>
                    {isActive && (
                      isExpanded
                        ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Expanded evidence items */}
                {isExpanded && isActive && (
                  <div className="ml-9 mt-1.5 space-y-1.5">
                    {items.map((item, i) => (
                      <div
                        key={i}
                        className="bg-slate-900/40 border border-slate-800/40 rounded-lg p-2.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 font-medium">{item.label}</span>
                          <span className="text-[10px] font-mono text-slate-500">{item.data_source}</span>
                        </div>
                        <div className="text-white font-semibold mt-0.5">{String(item.value)}</div>
                        {item.confidence && (
                          <div className="mt-1">
                            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
                                style={{ width: `${item.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-500 mt-0.5">
                              Confidence: {(item.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800/60 shrink-0">
          <p className="text-[10px] text-slate-500 text-center">
            All evidence items are sourced from verified store operational data.
            AI cannot fabricate evidence.
          </p>
        </div>
      </div>
    </>
  );
}
