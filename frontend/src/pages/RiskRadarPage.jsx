import React, { useState, useEffect } from 'react';
import {
  Radar,
  AlertTriangle,
  ShieldAlert,
  TrendingDown,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Sliders,
  DollarSign,
  Package,
  FileCheck
} from 'lucide-react';
import { api } from '../services/api';

export default function RiskRadarPage({ onNavigateTo, onOpenAskAI }) {
  const [radar, setRadar] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRadar = async () => {
    setLoading(true);
    try {
      const res = await api.getRiskRadar();
      setRadar(res);
    } catch (err) {
      console.error('Failed to load risk radar', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRadar();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
              Differentiator 1
            </span>
            <span className="text-xs text-slate-400">7-Pillar Operational Engine</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Radar className="w-5 h-5 text-rose-400" />
            Supply Risk Radar & Explainability Console
          </h1>
          <p className="text-xs text-slate-400">
            Composite 0–100 operational risk index grounded in real inventory run-rates, vendor SLAs, and billing accuracy.
          </p>
        </div>

        <button
          onClick={() => onOpenAskAI("Explain the top supply chain risks currently facing Deccan Roast and propose mitigations.")}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-black font-bold text-xs rounded-xl shadow-glow-cyan flex items-center gap-1.5 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AI Risk Copilot</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400">
          <RotateCcw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
          <span>Calculating multi-variate supply risk index...</span>
        </div>
      ) : radar ? (
        <div className="space-y-6">
          {/* Top Composite Score Banner */}
          <div className="glass-card p-6 border-rose-500/30 bg-gradient-to-r from-rose-950/20 via-slate-900 to-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-rose-950/80 border-2 border-rose-500/60 flex flex-col items-center justify-center font-mono text-center shadow-glow-rose shrink-0">
                <span className="text-2xl font-black text-rose-300 leading-none">
                  {Math.round(radar.overall_score)}
                </span>
                <span className="text-[10px] uppercase font-bold text-rose-400 mt-1">/ 100 Risk</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">
                  Composite Operational Risk Index: {radar.overall_score >= 60 ? 'HIGH' : 'MEDIUM'}
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  {radar.overall_summary}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center min-w-[90px]">
                <span className="text-[10px] text-rose-400 uppercase font-bold block">Critical</span>
                <strong className="text-lg font-mono text-rose-400">{radar.critical_risks_count}</strong>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center min-w-[90px]">
                <span className="text-[10px] text-amber-400 uppercase font-bold block">Warnings</span>
                <strong className="text-lg font-mono text-amber-400">{radar.warnings_count}</strong>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center min-w-[90px]">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">Stable</span>
                <strong className="text-lg font-mono text-emerald-400">{radar.stable_count}</strong>
              </div>
            </div>
          </div>

          {/* 7 Dimensions Detail Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {radar.dimensions?.map((dim, i) => (
              <div
                key={i}
                className="glass-card p-5 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="font-mono text-cyan-400">0{i + 1}.</span> {dim.dimension_name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-200">
                        {Math.round(dim.score)}/100
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          dim.score >= 50
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : dim.score >= 25
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {dim.level}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full ${
                        dim.score >= 50 ? 'bg-rose-500' : dim.score >= 25 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, dim.score))}%` }}
                    ></div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{dim.explanation}</p>

                  {dim.top_affected_skus_or_suppliers?.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Affected:</span>
                      {dim.top_affected_skus_or_suppliers.map((item, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 1-Click Mitigation Action Button */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[240px]">
                    {dim.action_available}
                  </span>
                  <button
                    onClick={() => {
                      if (dim.dimension_name.includes('Stockout')) onNavigateTo('procurement');
                      else if (dim.dimension_name.includes('Invoice')) onNavigateTo('invoices');
                      else if (dim.dimension_name.includes('Supplier')) onNavigateTo('suppliers');
                      else onNavigateTo('inventory');
                    }}
                    className="px-3 py-1 bg-slate-800 hover:bg-cyan-500 hover:text-black text-slate-200 text-xs font-bold rounded-lg transition-all flex items-center gap-1"
                  >
                    <span>Mitigate</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
