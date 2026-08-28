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
  FileCheck,
  ShieldCheck
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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-rose text-[10px] uppercase font-bold">
              Multi-Variate Risk Engine
            </span>
            <span className="text-xs text-slate-400">7 Operational Dimensions • Zero Hallucination</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            <Radar className="w-5 h-5 text-rose-400" />
            Supply Risk Radar & Explainability Console
          </h1>
          <p className="text-xs text-slate-400">
            Composite 0–100 operational risk index grounded in real inventory run-rates, vendor SLAs, and billing accuracy.
          </p>
        </div>

        <button
          onClick={() => onOpenAskAI("Explain the top supply chain risks currently facing Deccan Roast and propose mitigations.")}
          className="btn-primary text-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-black fill-black" />
          <span>Ask AI Risk Copilot</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400">
          <RotateCcw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-accent" />
          <span className="text-xs">Calculating multi-variate supply risk index...</span>
        </div>
      ) : radar ? (
        <div className="space-y-6">
          {/* Top Composite Score Banner */}
          <div className="glass-card p-6 border-rose-500/20 bg-surface-1 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-rose-500/10 border-2 border-rose-500/30 flex flex-col items-center justify-center font-mono text-center shadow-glow-rose shrink-0">
                <span className="text-3xl font-extrabold text-rose-400 leading-none">
                  {Math.round(radar.overall_score)}
                </span>
                <span className="text-[9px] text-slate-400 uppercase mt-1">out of 100</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="badge-rose text-xs">
                    {radar.risk_level} OVERALL RISK
                  </span>
                  <span className="text-xs text-slate-400">Store Hub: Deccan Roast #BLR-01</span>
                </div>
                <h3 className="text-base font-bold text-white">Actionable Operational Risk Status</h3>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  Overall store risk is elevated due to the imminent depletion of <strong>COFFEE-001 (Arabica Beans)</strong> and a supplier delivery discrepancy on <strong>DAIRY-001</strong>.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full md:w-auto">
              <button
                onClick={() => onNavigateTo('procurement')}
                className="btn-primary text-xs px-4 py-2"
              >
                Mitigate via Procurement
              </button>
            </div>
          </div>

          {/* 7 Risk Dimensions Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                7 Operational Risk Dimensions
              </h2>
              <span className="text-[10px] text-slate-500 font-mono">Real-time Telemetry Calculations</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {radar.dimensions?.map((dim) => (
                <div
                  key={dim.dimension_name}
                  className="glass-card p-4 bg-surface-1 space-y-2.5 border-white/[0.06]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{dim.dimension_name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-400">{dim.score.toFixed(0)}/100</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded-full ${
                          dim.score >= 50
                            ? 'badge-rose'
                            : dim.score >= 25
                            ? 'badge-amber'
                            : 'badge-emerald'
                        }`}
                      >
                        {dim.level}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-surface-3 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        dim.score >= 50 ? 'bg-rose-500' : dim.score >= 25 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(6, dim.score))}%` }}
                    ></div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug">{dim.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 text-center text-slate-500 text-xs">
          No risk radar telemetry currently available.
        </div>
      )}
    </div>
  );
}
