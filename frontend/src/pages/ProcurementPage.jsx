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
  AlertTriangle,
  Eye,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import WhatIfSimulator from '../components/WhatIfSimulator';
import { useToast } from '../components/ToastContext';

export default function ProcurementPage({
  initialSku = 'COFFEE-001',
  onNavigateToApprovals,
  onOpenAskAI,
  onOpenStrategyDetail,
  onOpenEvidence
}) {
  const [sku, setSku] = useState(initialSku);
  const [quantity, setQuantity] = useState(100);
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('scenarios'); // 'scenarios' | 'whatif'
  const [selectedScenarioId, setSelectedScenarioId] = useState('SCENARIO-B');
  const { addToast } = useToast();

  const runSimulation = async (targetSku = sku, targetQty = quantity) => {
    setLoading(true);
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
    setSku(initialSku);
    runSimulation(initialSku, quantity);
  }, [initialSku]);

  const handleCreateProposal = async (scenarioId) => {
    setSubmitting(true);
    try {
      const prop = await api.createProposal(sku, scenarioId, quantity);
      addToast({
        title: 'Replenishment Proposal Created',
        message: 'Staged in Human Approval Queue awaiting operator authorization.',
        type: 'success',
        action: {
          label: 'View in Approvals',
          onClick: onNavigateToApprovals
        }
      });
    } catch (err) {
      addToast({
        title: 'Proposal Creation Error',
        message: err.message,
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedScenario = simulation?.scenarios?.find(s => s.scenario_id === selectedScenarioId) || simulation?.scenarios?.[0];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-teal text-[10px] uppercase font-bold font-mono">
              Deterministic Decision Engine
            </span>
            <span className="text-xs text-slate-400">Multi-Scenario Optimization Matrix</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            <ShoppingCart className="w-5 h-5 text-brand-accent shrink-0" />
            Procurement Decisions & What-If Digital Twin
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare 6 real-world replenishment scenarios to balance unit costs, transit lead times, and single-supplier concentration risk.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-1 border border-white/[0.06] text-xs">
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'scenarios'
                ? 'bg-surface-2 text-white shadow-sm border border-white/[0.08]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>6 Scenarios Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('whatif')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'whatif'
                ? 'bg-surface-2 text-brand-accent shadow-sm border border-white/[0.08]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-brand-accent" />
            <span>What-If Digital Twin</span>
          </button>
        </div>
      </div>

      {/* Target SKU Context Bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-2 border border-brand-accent/30 flex items-center justify-center text-brand-accent font-mono font-extrabold text-xs shrink-0">
            COF
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white text-sm">
                Specialty Arabica Coffee Beans (Estate Grade)
              </span>
              <span className="badge-rose text-[10px] font-mono font-bold">
                88% CRITICAL RISK
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              SKU: {sku} • 36kg On Hand • 13kg/day Run Rate • ~2.8d Stockout Runway
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenEvidence && (
            <button
              onClick={() => onOpenEvidence(sku)}
              className="text-xs text-slate-300 hover:text-brand-accent px-3 py-1.5 rounded-xl bg-surface-2 border border-white/[0.06] flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-brand-accent" />
              <span>Evidence Trace</span>
            </button>
          )}
          <button
            onClick={() => onOpenAskAI(`Why does LEADSTOHELP recommend the Split-Order scenario for ${sku}?`)}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            <span>Ask AI Why</span>
          </button>
        </div>
      </div>

      {/* Tab 1: 6-Scenario Matrix View */}
      {activeTab === 'scenarios' && (
        <div className="space-y-6">
          {/* AI Optimal Recommendation Banner */}
          <div className="glass-card p-5 border-emerald-500/30 bg-gradient-to-r from-surface-1 via-surface-1 to-surface-2 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="badge-emerald text-[9px] font-mono font-bold">
                    AI RECOMMENDED DECISION
                  </span>
                  <h3 className="text-sm font-bold text-white mt-0.5">
                    Split-Order Replenishment (Malnad 70% + Metro 30%)
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">Total Spend</span>
                <span className="text-lg font-extrabold text-brand-accent font-mono">₹86,328</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-surface-2/60 border border-white/[0.04] space-y-0.5">
                <span className="text-[10px] text-slate-500 font-mono">Risk Reduction</span>
                <p className="text-emerald-400 font-bold">88% → 8% Critical</p>
              </div>
              <div className="p-3 rounded-xl bg-surface-2/60 border border-white/[0.04] space-y-0.5">
                <span className="text-[10px] text-slate-500 font-mono">Cost Savings</span>
                <p className="text-emerald-400 font-bold">+₹8,672 vs Quote</p>
              </div>
              <div className="p-3 rounded-xl bg-surface-2/60 border border-white/[0.04] space-y-0.5">
                <span className="text-[10px] text-slate-500 font-mono">Concentration Risk</span>
                <p className="text-slate-200 font-bold">100% → 50% Dual Hub</p>
              </div>
              <div className="p-3 rounded-xl bg-surface-2/60 border border-white/[0.04] space-y-0.5">
                <span className="text-[10px] text-slate-500 font-mono">Buffer Delivery</span>
                <p className="text-slate-200 font-bold">24h Express (30 kg)</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => handleCreateProposal('SCENARIO-B')}
                disabled={submitting}
                className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5"
              >
                {submitting ? (
                  <span>Staging in Approval Queue...</span>
                ) : (
                  <>
                    <span>Submit for Human Approval</span>
                    <ArrowRight className="w-3.5 h-3.5 text-black" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 6 Scenarios Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Evaluated Replenishment Scenarios
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(simulation?.scenarios || [
                { scenario_id: 'SCENARIO-A', name: 'Scenario A: Single Primary Supplier (100% Malnad)', total_cost: 95000, risk_level: 'High Risk (65%)', delivery_days: 3, is_recommended: false },
                { scenario_id: 'SCENARIO-B', name: 'Scenario B: Split-Order (70% Malnad + 30% Metro)', total_cost: 86328, risk_level: 'Low Risk (8%)', delivery_days: '1-3', savings_vs_quote: 8672, is_recommended: true },
                { scenario_id: 'SCENARIO-C', name: 'Scenario C: 3-Day Supplier Delay Baseline', total_cost: 95000, risk_level: 'Critical (95%)', delivery_days: 6, is_recommended: false },
                { scenario_id: 'SCENARIO-D', name: 'Scenario D: 100% Local Distributor (Metro Hub)', total_cost: 89427, risk_level: 'Low (15%)', delivery_days: 1, is_recommended: false },
                { scenario_id: 'SCENARIO-E', name: 'Scenario E: Cost-Minimized Extended Lead Time', total_cost: 81000, risk_level: 'High (70%)', delivery_days: 5, is_recommended: false },
                { scenario_id: 'SCENARIO-F', name: 'Scenario F: Emergency Air Freight Dispatch', total_cost: 112000, risk_level: 'Zero (2%)', delivery_days: 1, is_recommended: false },
              ]).map((sc) => {
                const isRec = sc.is_recommended || sc.scenario_id === 'SCENARIO-B';
                return (
                  <div
                    key={sc.scenario_id}
                    onClick={() => onOpenStrategyDetail && onOpenStrategyDetail(sc)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                      isRec
                        ? 'bg-emerald-500/5 border-emerald-500/40 shadow-glow-emerald hover:bg-emerald-500/10'
                        : 'bg-surface-1 border-white/[0.08] hover:border-white/[0.18] hover:bg-surface-2'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isRec ? 'badge-emerald' : 'badge-neutral'
                      }`}>
                        {sc.scenario_id}
                      </span>
                      <span className="text-xs font-bold text-white font-mono">
                        ₹{(sc.total_cost || sc.cost || 86328).toLocaleString()}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white group-hover:text-brand-accent transition-colors line-clamp-2">
                      {sc.name || sc.title}
                    </h4>

                    <div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t border-white/[0.04] text-[11px]">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Lead Time</span>
                        <span className="text-slate-200 font-bold font-mono">{sc.delivery_days || 3}d transit</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Risk Score</span>
                        <span className={`font-bold font-mono ${
                          isRec ? 'text-emerald-400' : 'text-slate-300'
                        }`}>
                          {sc.risk_level || 'Evaluated'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: What-If Simulator View */}
      {activeTab === 'whatif' && (
        <WhatIfSimulator
          initialSku={sku}
          onOpenAskAI={onOpenAskAI}
          onApplyScenario={(scenario) => {
            handleCreateProposal('SCENARIO-B');
          }}
        />
      )}
    </div>
  );
}
