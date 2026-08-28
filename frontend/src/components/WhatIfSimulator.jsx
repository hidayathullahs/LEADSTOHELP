import React, { useState, useEffect, useCallback } from 'react';
import {
  Sliders, TrendingUp, TrendingDown, AlertTriangle, Package,
  Clock, DollarSign, ArrowRight, RefreshCw, Zap, UserX
} from 'lucide-react';
import { api } from '../services/api';

/**
 * WhatIfSimulator — Interactive Supply Chain Digital Twin.
 * Adjusts demand, delays, prices, stock, supplier availability
 * and displays real-time baseline vs. scenario comparison.
 */
export default function WhatIfSimulator({ sku = 'COFFEE-001', onClose }) {
  const [params, setParams] = useState({
    sku,
    demand_change_pct: 0,
    supplier_delay_days: 0,
    price_change_pct: 0,
    stock_reduction_units: 0,
    supplier_unavailable: null,
    emergency_delivery_enabled: false,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runSimulation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.whatifSimulate(params);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Simulation failed');
    } finally {
      setLoading(false);
    }
  }, [params]);

  // Run initial baseline simulation
  useEffect(() => {
    runSimulation();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateParam = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const sliders = [
    {
      key: 'demand_change_pct', label: 'Demand Change',
      icon: TrendingUp, min: -50, max: 100, step: 5,
      unit: '%', color: 'cyan',
      description: 'Simulate demand surge or drop'
    },
    {
      key: 'supplier_delay_days', label: 'Supplier Delay',
      icon: Clock, min: 0, max: 10, step: 1,
      unit: ' days', color: 'amber',
      description: 'Additional lead time delays'
    },
    {
      key: 'price_change_pct', label: 'Price Change',
      icon: DollarSign, min: -20, max: 50, step: 2,
      unit: '%', color: 'rose',
      description: 'Raw material price volatility'
    },
    {
      key: 'stock_reduction_units', label: 'Stock Reduction',
      icon: Package, min: 0, max: 50, step: 5,
      unit: ' units', color: 'purple',
      description: 'Damaged or spoiled inventory'
    },
  ];

  const colorMap = {
    cyan: { slider: 'accent-cyan-500', text: 'text-cyan-400', bg: 'bg-cyan-950/30' },
    amber: { slider: 'accent-amber-500', text: 'text-amber-400', bg: 'bg-amber-950/30' },
    rose: { slider: 'accent-rose-500', text: 'text-rose-400', bg: 'bg-rose-950/30' },
    purple: { slider: 'accent-purple-500', text: 'text-purple-400', bg: 'bg-purple-950/30' },
  };

  return (
    <div className="glass-card p-5 space-y-4 border-indigo-500/20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center">
            <Sliders className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">What-If Digital Twin</h3>
            <p className="text-[10px] text-slate-400">SKU: {sku} — Adjust parameters to simulate scenarios</p>
          </div>
        </div>
        <button
          onClick={runSimulation}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Running...' : 'Run Simulation'}
        </button>
      </div>

      {/* Parameter Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sliders.map(s => {
          const colors = colorMap[s.color];
          const Icon = s.icon;
          const val = params[s.key];
          return (
            <div key={s.key} className={`${colors.bg} rounded-xl p-3 border border-slate-800/40`}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${colors.text}`} />
                  <span className="text-[11px] font-semibold text-slate-300">{s.label}</span>
                </div>
                <span className={`text-xs font-mono font-bold ${colors.text}`}>
                  {val > 0 ? '+' : ''}{val}{s.unit}
                </span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={val}
                onChange={(e) => updateParam(s.key, parseFloat(e.target.value))}
                className={`w-full h-1.5 rounded-full appearance-none cursor-pointer ${colors.slider}`}
                style={{ background: 'rgba(30,41,59,0.8)' }}
              />
              <p className="text-[9px] text-slate-500 mt-1">{s.description}</p>
            </div>
          );
        })}
      </div>

      {/* Toggle switches */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={params.emergency_delivery_enabled}
            onChange={(e) => updateParam('emergency_delivery_enabled', e.target.checked)}
            className="w-3.5 h-3.5 rounded accent-cyan-500"
          />
          <span className="text-[11px] text-slate-300 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> Emergency Delivery
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!params.supplier_unavailable}
            onChange={(e) => updateParam('supplier_unavailable', e.target.checked ? 'sup_01' : null)}
            className="w-3.5 h-3.5 rounded accent-rose-500"
          />
          <span className="text-[11px] text-slate-300 flex items-center gap-1">
            <UserX className="w-3 h-3 text-rose-400" /> Primary Supplier Down
          </span>
        </label>
      </div>

      {/* Results: Baseline vs Modified */}
      {error && (
        <div className="bg-rose-950/30 border border-rose-800/40 rounded-xl p-3 text-xs text-rose-300">
          <AlertTriangle className="w-4 h-4 inline mr-1" /> {error}
        </div>
      )}

      {result && !error && (
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Baseline vs. Scenario Comparison
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {/* Baseline */}
            <div className="bg-slate-900/40 border border-slate-800/40 rounded-xl p-3 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Baseline</span>
              <MetricRow label="Days of Supply" value={result.baseline.days_of_supply} suffix=" days" />
              <MetricRow label="Risk Score" value={result.baseline.risk_score} suffix="/100" />
              <MetricRow label="Est. Cost" value={`₹${result.baseline.estimated_cost_inr?.toLocaleString()}`} />
              <MetricRow label="Order Qty" value={result.baseline.recommended_order_qty} suffix=" units" />
              <MetricRow label="Lead Time" value={result.baseline.lead_time_days} suffix=" days" />
            </div>

            {/* Modified */}
            <div className={`border rounded-xl p-3 space-y-2 ${
              result.risk_delta > 15 ? 'bg-rose-950/20 border-rose-800/40' :
              result.risk_delta > 0 ? 'bg-amber-950/20 border-amber-800/40' :
              'bg-emerald-950/20 border-emerald-800/40'
            }`}>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Modified Scenario</span>
              <MetricRow label="Days of Supply" value={result.modified.days_of_supply} suffix=" days"
                delta={result.modified.days_of_supply - result.baseline.days_of_supply} invertDelta />
              <MetricRow label="Risk Score" value={result.modified.risk_score} suffix="/100"
                delta={result.risk_delta} />
              <MetricRow label="Est. Cost" value={`₹${result.modified.estimated_cost_inr?.toLocaleString()}`}
                delta={result.cost_delta} prefix="₹" />
              <MetricRow label="Order Qty" value={result.modified.recommended_order_qty} suffix=" units" />
              <MetricRow label="Lead Time" value={result.modified.lead_time_days} suffix=" days" />
            </div>
          </div>

          {/* AI Recommendation */}
          {result.recommendation && (
            <div className="bg-slate-900/40 border border-cyan-800/30 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300 leading-relaxed">{result.recommendation}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MetricRow({ label, value, suffix = '', delta, invertDelta = false, prefix = '' }) {
  const showDelta = delta !== undefined && delta !== 0;
  const isPositiveDelta = invertDelta ? delta > 0 : delta < 0;

  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-slate-400">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-semibold text-white">{value}{suffix}</span>
        {showDelta && (
          <span className={`text-[10px] font-mono ${isPositiveDelta ? 'text-emerald-400' : 'text-rose-400'}`}>
            ({delta > 0 ? '+' : ''}{typeof delta === 'number' ? (prefix + delta.toFixed(1)) : delta})
          </span>
        )}
      </div>
    </div>
  );
}
