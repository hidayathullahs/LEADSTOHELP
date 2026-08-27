import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  TrendingDown,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  RotateCcw,
  Check,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';

export default function ProcurementPage({ initialSku, onNavigateToApprovals, onOpenAskAI }) {
  const [sku, setSku] = useState(initialSku || 'COFFEE-001');
  const [quantity, setQuantity] = useState(100);
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createdProposal, setCreatedProposal] = useState(null);

  const runSimulation = async (targetSku = sku, targetQty = quantity) => {
    setLoading(true);
    setCreatedProposal(null);
    try {
      const res = await api.simulateProcurement(targetSku, targetQty);
      setSimulation(res);
    } catch (err) {
      console.error('Simulation failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation(initialSku || 'COFFEE-001', 100);
  }, [initialSku]);

  const handleCreateProposal = async (scenarioId) => {
    setSubmitting(true);
    try {
      const prop = await api.createProposal(sku, scenarioId, quantity);
      setCreatedProposal(prop);
    } catch (err) {
      alert(`Failed to create proposal: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Differentiator 3
            </span>
            <span className="text-xs text-slate-400">Multi-Supplier Strategic Optimizer</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-cyan-400" />
            Procurement Scenario Simulator
          </h1>
          <p className="text-xs text-slate-400">
            Compare Single Supplier vs. Split-Order vs. Just-In-Time Delay with blended price and risk curves.
          </p>
        </div>

        <button
          onClick={() => onOpenAskAI(`Simulate best procurement strategy for SKU ${sku}`)}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-black font-bold text-xs rounded-xl shadow-glow-cyan flex items-center gap-1.5 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AI Strategy</span>
        </button>
      </div>

      {/* Input Configuration Panel */}
      <div className="glass-card p-5 bg-slate-900/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSimulation();
          }}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
        >
          <div className="md:col-span-5">
            <label className="text-xs text-slate-300 font-semibold block mb-1.5">
              Select Target SKU for Replenishment
            </label>
            <select
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-cyan-500"
            >
              <option value="COFFEE-001">COFFEE-001 - Specialty Arabica Coffee Beans (AAA Grade)</option>
              <option value="DAIRY-001">DAIRY-001 - Pasteurized Full Cream Barista Milk</option>
              <option value="PACK-001">PACK-001 - 12oz Double Wall Kraft Coffee Cups (50pk)</option>
              <option value="FLOUR-001">FLOUR-001 - Organic Unbleached Bread Flour (T55)</option>
              <option value="SYRUP-001">SYRUP-001 - Madagascar Vanilla Syrup 750ml</option>
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="text-xs text-slate-300 font-semibold block mb-1.5">
              Target Order Quantity (units / kg)
            </label>
            <input
              type="number"
              min="10"
              step="5"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 10)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white font-mono focus:border-cyan-500"
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-lg shadow-glow-cyan flex items-center justify-center gap-1.5 transition-all"
            >
              {loading ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Simulating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run Scenario Model</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Banner if Proposal Created */}
      {createdProposal && (
        <div className="glass-card p-4 border-emerald-500/40 bg-emerald-950/20 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">
                Negotiation Proposal {createdProposal.proposal_id} Generated!
              </h4>
              <p className="text-[11px] text-slate-300">
                Routed to the Human-in-the-Loop Approval Queue. Expected Savings: <strong className="text-emerald-400 font-mono">₹{createdProposal.expected_savings.toLocaleString()}</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToApprovals()}
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-lg flex items-center gap-1 shadow-glow-emerald"
          >
            <span>Review in Approval Center</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Scenarios 3-Column Display */}
      {simulation && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Strategic Scenario Comparison ({simulation.target_quantity} units of {simulation.sku})
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Ground Truth Price Baseline: ₹{(simulation.scenarios[0].unit_price * 1.08).toFixed(2)}/unit
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {simulation.scenarios.map((sc) => {
              const isRecommended = sc.is_recommended;
              return (
                <div
                  key={sc.scenario_id}
                  className={`glass-card p-5 flex flex-col justify-between transition-all relative ${
                    isRecommended
                      ? 'border-cyan-500/60 bg-gradient-to-b from-cyan-950/20 via-slate-900/90 to-slate-900/90 shadow-glow-cyan'
                      : 'border-slate-800'
                  }`}
                >
                  {isRecommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-500 text-black font-extrabold text-[10px] uppercase shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>AI Recommended Strategy</span>
                    </div>
                  )}

                  <div>
                    {/* Scenario Title */}
                    <div className="mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                        {sc.scenario_id}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-0.5">{sc.name}</h3>
                      <p className="text-[11px] text-slate-400 mt-1">{sc.strategy}</p>
                    </div>

                    {/* Financial Metrics */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Total Investment:</span>
                        <span className="font-mono font-bold text-white text-sm">
                          ₹{sc.total_cost.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Blended Unit Rate:</span>
                        <span className="font-mono font-semibold text-cyan-300">
                          ₹{sc.unit_price.toFixed(2)}/unit
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Lead Time:</span>
                        <span className="font-mono font-semibold text-slate-200">
                          {sc.lead_time_days} business days
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-800/80">
                        <span className="text-emerald-400 font-semibold">Simulated Savings:</span>
                        <span className="font-mono font-bold text-emerald-400">
                          +₹{sc.savings_vs_quote.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Supplier Allocations */}
                    <div className="space-y-1.5 mb-4">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Allocation Split:</span>
                      {sc.supplier_allocations.map((alloc, i) => (
                        <div key={i} className="p-2 bg-slate-900/60 rounded border border-slate-800 text-[11px] flex justify-between">
                          <span className="text-slate-300 truncate max-w-[140px]">{alloc.supplier_name}</span>
                          <span className="font-mono font-semibold text-cyan-400">
                            {alloc.quantity} units (₹{alloc.cost.toLocaleString()})
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Pros & Cons */}
                    <div className="space-y-2 mb-4 text-[11px]">
                      <div>
                        <span className="font-bold text-emerald-400 text-[10px] uppercase">Advantages:</span>
                        <ul className="list-disc list-inside text-slate-300 space-y-0.5 mt-0.5">
                          {sc.pros.map((p, idx) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="font-bold text-amber-400 text-[10px] uppercase">Trade-offs:</span>
                        <ul className="list-disc list-inside text-slate-400 space-y-0.5 mt-0.5">
                          {sc.cons.map((c, idx) => (
                            <li key={idx}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleCreateProposal(sc.scenario_id)}
                    disabled={submitting}
                    className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      isRecommended
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-glow-cyan'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <span>{isRecommended ? 'Select Recommended Plan' : 'Select This Strategy'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
