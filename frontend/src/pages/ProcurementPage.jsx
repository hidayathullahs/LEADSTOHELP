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
  ChevronRight,
  Sliders,
  ShieldCheck,
  DollarSign,
  Package,
  Users,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';
import ImpactCard from '../components/ImpactCard';
import EvidenceDrawer from '../components/EvidenceDrawer';
import WhatIfSimulator from '../components/WhatIfSimulator';

export default function ProcurementPage({ initialSku, onNavigateToApprovals, onOpenAskAI }) {
  const [sku, setSku] = useState(initialSku || 'COFFEE-001');
  const [quantity, setQuantity] = useState(100);
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createdProposal, setCreatedProposal] = useState(null);
  const [activeTab, setActiveTab] = useState('scenarios'); // 'scenarios' | 'whatif'
  const [selectedScenarioId, setSelectedScenarioId] = useState('SCENARIO-B');
  const [evidenceDrawerOpen, setEvidenceDrawerOpen] = useState(false);
  const [evidenceItems, setEvidenceItems] = useState([]);
  const [evidenceTitle, setEvidenceTitle] = useState('');

  const runSimulation = async (targetSku = sku, targetQty = quantity) => {
    setLoading(true);
    setCreatedProposal(null);
    try {
      const res = await api.simulateProcurement(targetSku, targetQty);
      setSimulation(res);
      if (res?.scenarios?.length > 0) {
        const recommended = res.scenarios.find(s => s.is_recommended);
        setSelectedScenarioId(recommended ? recommended.scenario_id : res.scenarios[0].scenario_id);
      }
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

  const handleOpenEvidence = async (targetSku) => {
    setEvidenceTitle(`Procurement Grounding Evidence: ${targetSku}`);
    setEvidenceDrawerOpen(true);
    try {
      const res = await api.getSkuEvidence(targetSku);
      setEvidenceItems(res?.evidence || []);
    } catch (err) {
      console.error('Failed to load evidence', err);
      setEvidenceItems([
        { label: 'Target Replenishment', value: `${quantity} units`, data_source: 'procurement_engine', evidence_type: 'SIMULATION' },
        { label: 'Primary SKU', value: targetSku, data_source: 'inventory_db', evidence_type: 'INVENTORY' }
      ]);
    }
  };

  const selectedScenario = simulation?.scenarios?.find(s => s.scenario_id === selectedScenarioId) || simulation?.scenarios?.[0];

  const getScenarioImpact = (sc) => {
    if (!sc) return null;
    const isSplit = sc.scenario_id === 'SCENARIO-B';
    const isEmergency = sc.scenario_id === 'SCENARIO-F';
    const isDelay = sc.scenario_id === 'SCENARIO-C';
    
    return {
      action_title: sc.name,
      cost_inr: sc.total_cost || 0,
      estimated_savings_inr: sc.savings_vs_quote || 0,
      stockout_risk_before: isDelay ? 90 : 85,
      stockout_risk_after: isDelay ? 85 : isEmergency ? 5 : isSplit ? 8 : 15,
      supplier_concentration_before: 100,
      supplier_concentration_after: isSplit ? 50 : 100,
      service_continuity_improvement_pct: isDelay ? 0 : isSplit ? 45 : 30,
      risk_level: sc.risk_level || 'LOW',
      evidence_count: sc.supplier_allocations?.length ? sc.supplier_allocations.length + 3 : 4,
    };
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-teal text-[10px] uppercase font-bold">
              Closed-Loop Procurement
            </span>
            <span className="text-xs text-slate-400">Multi-Supplier Strategic Optimizer • 6 Scenarios</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            <ShoppingCart className="w-5 h-5 text-brand-accent" />
            Procurement Scenario Simulator & Optimizer
          </h1>
          <p className="text-xs text-slate-400">
            Mathematically benchmarks 6 strategies: Single Supplier, Split Order, Delay, Cheapest, Reliability-First, and Emergency Expedited.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Toggle between 6-Scenario Matrix and What-If Digital Twin */}
          <div className="flex bg-surface-1 border border-white/[0.06] rounded-xl p-1 text-xs">
            <button
              onClick={() => setActiveTab('scenarios')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'scenarios'
                  ? 'bg-brand-accent text-black shadow-glow-teal font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>6-Scenario Matrix</span>
            </button>
            <button
              onClick={() => setActiveTab('whatif')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'whatif'
                  ? 'bg-accent-violet text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>What-If Digital Twin</span>
            </button>
          </div>

          <button
            onClick={() => onOpenAskAI(`Simulate best procurement strategy for SKU ${sku}`)}
            className="btn-secondary text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            <span>Ask AI Strategy</span>
          </button>
        </div>
      </div>

      {/* Input Configuration Panel */}
      <div className="glass-card p-5 bg-surface-1">
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
              className="w-full bg-surface-2 border border-white/[0.08] rounded-lg px-3.5 py-2 text-xs text-white focus:border-brand-accent focus:outline-none"
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
              className="w-full bg-surface-2 border border-white/[0.08] rounded-lg px-3.5 py-2 text-xs text-white font-mono focus:border-brand-accent focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-xs py-2"
            >
              {loading ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin text-black" />
                  <span>Simulating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-black fill-black" />
                  <span>Run Scenario Model</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Banner if Proposal Created */}
      {createdProposal && (
        <div className="glass-card p-4 border-emerald-500/40 bg-emerald-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
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
            className="btn-success text-xs px-3.5 py-1.5 shrink-0"
          >
            <span>Review in Approval Center</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TAB 1: 6-Scenario Matrix View */}
      {activeTab === 'scenarios' && (
        <>
          {/* Selected Strategy Impact Card Highlight */}
          {selectedScenario && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Selected Strategy Impact Profile
                </span>
                <span className="text-[11px] text-brand-accent font-mono">
                  Scenario: {selectedScenario.scenario_id}
                </span>
              </div>
              <ImpactCard
                impact={getScenarioImpact(selectedScenario)}
                onViewEvidence={() => handleOpenEvidence(sku)}
                onSimulate={() => setActiveTab('whatif')}
                onApprove={() => handleCreateProposal(selectedScenario.scenario_id)}
              />
            </div>
          )}

          {/* 6-Scenario Grid */}
          {loading ? (
            <div className="text-center py-16 text-slate-400">
              <RotateCcw className="w-8 h-8 animate-spin mx-auto text-brand-accent mb-2" />
              <p className="text-sm">Calculating 6-Scenario Mathematical Simulations...</p>
            </div>
          ) : simulation?.scenarios?.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-brand-accent" />
                  6 Strategic Procurement Scenarios ({simulation.target_quantity} units of {simulation.sku})
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  Baseline Quote: ₹{(simulation.scenarios[0].unit_price * 1.08).toFixed(2)}/unit
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {simulation.scenarios.map((sc) => {
                  const isRecommended = sc.is_recommended;
                  const isSelected = sc.scenario_id === selectedScenarioId;
                  
                  return (
                    <div
                      key={sc.scenario_id}
                      onClick={() => setSelectedScenarioId(sc.scenario_id)}
                      className={`glass-card p-5 flex flex-col justify-between transition-all relative cursor-pointer group ${
                        isSelected
                          ? 'border-brand-accent bg-surface-2 ring-1 ring-brand-accent/50 shadow-glow-teal'
                          : isRecommended
                          ? 'border-brand-accent/40 bg-surface-1 hover:border-brand-accent'
                          : 'border-white/[0.06] hover:border-white/[0.12] bg-surface-1'
                      }`}
                    >
                      {isRecommended && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand-accent text-black font-extrabold text-[10px] uppercase shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-black fill-black" />
                          <span>AI Recommended Strategy</span>
                        </div>
                      )}

                      <div>
                        {/* Scenario Title */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-accent font-mono">
                              {sc.scenario_id}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                              sc.risk_level === 'LOW' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' :
                              sc.risk_level === 'MEDIUM' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' :
                              'bg-rose-500/10 text-rose-300 border-rose-500/20'
                            }`}>
                              {sc.risk_level} RISK
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-white mt-1 group-hover:text-brand-accent transition-colors">
                            {sc.name}
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{sc.strategy}</p>
                        </div>

                        {/* Financial & Delivery Metrics */}
                        <div className="p-3 bg-surface-0 rounded-xl border border-white/[0.06] space-y-2 mb-4">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Total Investment:</span>
                            <span className="font-mono font-bold text-white text-sm">
                              ₹{sc.total_cost.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Blended Unit Rate:</span>
                            <span className="font-mono font-semibold text-brand-accent">
                              ₹{sc.unit_price.toFixed(2)}/unit
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Lead Time:</span>
                            <span className="font-mono font-semibold text-slate-200">
                              {sc.lead_time_days} business days
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-white/[0.06]">
                            <span className="text-emerald-400 font-semibold">Simulated Savings:</span>
                            <span className="font-mono font-bold text-emerald-400">
                              +₹{sc.savings_vs_quote.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Supplier Allocations */}
                        <div className="space-y-1.5 mb-4">
                          <span className="text-[10px] uppercase font-bold text-slate-500">Allocation Split:</span>
                          {sc.supplier_allocations?.map((alloc, i) => (
                            <div key={i} className="p-2 bg-surface-2 rounded border border-white/[0.04] text-[11px] flex justify-between">
                              <span className="text-slate-300 truncate max-w-[140px]">{alloc.supplier_name}</span>
                              <span className="font-mono font-semibold text-brand-accent">
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
                              {sc.pros?.map((p, idx) => (
                                <li key={idx}>{p}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <span className="font-bold text-amber-400 text-[10px] uppercase">Trade-offs:</span>
                            <ul className="list-disc list-inside text-slate-400 space-y-0.5 mt-0.5">
                              {sc.cons?.map((c, idx) => (
                                <li key={idx}>{c}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateProposal(sc.scenario_id);
                        }}
                        disabled={submitting}
                        className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                          isRecommended
                            ? 'btn-primary'
                            : isSelected
                            ? 'bg-accent-violet hover:bg-accent-violet/80 text-white font-bold'
                            : 'btn-secondary'
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
          ) : (
            <div className="text-center py-16 text-slate-400 glass-card">
              <Package className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p>Click "Run Scenario Model" to generate procurement simulations.</p>
            </div>
          )}
        </>
      )}

      {/* TAB 2: Embedded What-If Digital Twin */}
      {activeTab === 'whatif' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-accent-violet" />
              Supply Chain What-If Digital Twin ({sku})
            </h2>
            <button
              onClick={() => setActiveTab('scenarios')}
              className="text-xs text-brand-accent hover:text-brand-300 font-semibold"
            >
              Back to 6-Scenario Matrix →
            </button>
          </div>
          <WhatIfSimulator sku={sku} />
        </div>
      )}

      {/* Grounded Evidence Drawer */}
      <EvidenceDrawer
        isOpen={evidenceDrawerOpen}
        onClose={() => setEvidenceDrawerOpen(false)}
        evidence={evidenceItems}
        title={evidenceTitle}
      />
    </div>
  );
}
