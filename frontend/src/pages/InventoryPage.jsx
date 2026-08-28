import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Filter,
  AlertTriangle,
  TrendingDown,
  Sparkles,
  ArrowUpDown,
  ShoppingCart,
  Clock,
  RotateCcw,
  Sliders,
  CheckCircle2,
  X,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';

const CATEGORIES = ['All', 'Coffee', 'Dairy', 'Bakery Ingredients', 'Syrups', 'Tea', 'Packaging', 'Cleaning', 'Spices'];

export default function InventoryPage({ onOpenAskAIWithSku, onNavigateToProcurement }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  
  // Selected SKU details modal
  const [activeItemDetails, setActiveItemDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Manual stock adjust modal
  const [adjustingSku, setAdjustingSku] = useState(null);
  const [adjustStockVal, setAdjustStockVal] = useState('');
  const [adjustReason, setAdjustReason] = useState('Weekly Cycle Count');

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await api.getInventory({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        risk_level: riskFilter !== 'All' ? riskFilter : undefined,
        search: search || undefined
      });
      setItems(res.items || []);
    } catch (err) {
      console.error('Failed to load inventory', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [selectedCategory, riskFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInventory();
  };

  const handleViewDetails = async (sku) => {
    setDetailsLoading(true);
    try {
      const res = await api.getInventoryItem(sku);
      setActiveItemDetails(res);
    } catch (err) {
      console.error('Failed to load item details', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleSaveStockAdjust = async (e) => {
    e.preventDefault();
    if (!adjustingSku || adjustStockVal === '') return;
    try {
      await api.adjustStock(adjustingSku, parseFloat(adjustStockVal), adjustReason);
      setAdjustingSku(null);
      fetchInventory();
    } catch (err) {
      alert(`Error adjusting stock: ${err.message}`);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-teal text-[10px] uppercase font-bold">
              Real-time Ledger
            </span>
            <span className="text-xs text-slate-400">65 Monitored Raw Material SKUs</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            <Package className="w-5 h-5 text-brand-accent" />
            Inventory Intelligence & Run-Rate Monitor
          </h1>
          <p className="text-xs text-slate-400">
            Real-time deterministic safety stock, reorder thresholds (ROP), and run-rate predictive forecasting.
          </p>
        </div>

        <button
          onClick={() => onOpenAskAIWithSku(null)}
          className="btn-primary text-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-black fill-black" />
          <span>Ask AI Inventory Agent</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card p-4 space-y-3 bg-surface-1">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by SKU or product name..."
              className="w-full bg-surface-2 border border-white/[0.08] text-xs text-slate-200 placeholder-slate-500 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:border-brand-accent"
            />
          </form>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-slate-400 font-medium">Risk Filter:</span>
            {['All', 'HIGH', 'MEDIUM', 'LOW'].map((risk) => (
              <button
                key={risk}
                onClick={() => setRiskFilter(risk)}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  riskFilter === risk
                    ? 'bg-brand-accent/20 text-brand-accent border border-brand-accent/40 font-bold'
                    : 'bg-surface-2 text-slate-400 hover:text-slate-200 border border-white/[0.06]'
                }`}
              >
                {risk === 'All' ? 'All Risks' : risk}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-white/[0.04]">
          <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Category:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1 rounded-lg whitespace-nowrap font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-accent text-black font-bold shadow-glow-teal'
                  : 'bg-surface-2 text-slate-400 hover:text-slate-200 border border-white/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="glass-card overflow-hidden bg-surface-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] bg-surface-2 text-slate-400 uppercase text-[10px] font-mono font-bold tracking-wider">
                <th className="py-3 px-4">SKU / Product</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">Current Stock</th>
                <th className="py-3 px-3 text-right">Safety Stock</th>
                <th className="py-3 px-3 text-right">Reorder Point</th>
                <th className="py-3 px-3 text-right">Run-Rate</th>
                <th className="py-3 px-3 text-center">Days Left</th>
                <th className="py-3 px-3 text-center">Risk Level</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-slate-400">
                    <RotateCcw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-accent" />
                    <span>Loading real-time inventory telemetry...</span>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-slate-500">
                    No matching inventory items found for applied filters.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.sku}
                    className="hover:bg-surface-2/60 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[11px] font-bold text-brand-accent">{item.sku}</div>
                      <div className="font-semibold text-white truncate max-w-xs">{item.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Cost: ₹{item.unit_cost}/{item.unit}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="text-slate-300 bg-surface-2 px-2 py-0.5 rounded text-[11px] border border-white/[0.04]">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold text-white">
                      {item.current_stock} <span className="text-slate-500 font-normal">{item.unit}</span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                      {item.safety_stock} <span className="text-slate-500">{item.unit}</span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold text-brand-accent">
                      {item.reorder_point} <span className="text-slate-500 font-normal">{item.unit}</span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                      {item.daily_usage_avg} <span className="text-slate-500">{item.unit}/day</span>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={`font-mono font-bold ${
                          item.days_of_supply <= item.lead_time_days * 1.5 ? 'text-rose-400' : 'text-slate-200'
                        }`}>
                          {item.days_of_supply} days
                        </span>
                        <div className="w-16 bg-surface-3 rounded-full h-1 mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.days_of_supply <= item.lead_time_days * 1.5 ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, (item.days_of_supply / 15) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={
                          item.stockout_risk === 'HIGH'
                            ? 'badge-rose'
                            : item.stockout_risk === 'MEDIUM'
                            ? 'badge-amber'
                            : 'badge-emerald'
                        }
                      >
                        {item.stockout_risk}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onNavigateToProcurement(item.sku)}
                          className="btn-primary text-xs px-2.5 py-1"
                          title="Simulate Procurement"
                        >
                          <ShoppingCart className="w-3 h-3 text-black" />
                          <span>Simulate</span>
                        </button>

                        <button
                          onClick={() => handleViewDetails(item.sku)}
                          className="btn-secondary text-xs px-2 py-1"
                          title="View Details"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SKU Details Modal */}
      {activeItemDetails && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl bg-surface-1 border border-white/[0.1] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div>
                <span className="font-mono text-xs text-brand-accent font-bold">{activeItemDetails.sku}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{activeItemDetails.name}</h3>
              </div>
              <button
                onClick={() => setActiveItemDetails(null)}
                className="btn-secondary text-xs"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-surface-2 rounded-xl border border-white/[0.04]">
                <span className="text-slate-400 block text-[10px]">Current Stock</span>
                <strong className="text-white text-sm font-mono font-bold">{activeItemDetails.current_stock} {activeItemDetails.unit}</strong>
              </div>
              <div className="p-3 bg-surface-2 rounded-xl border border-white/[0.04]">
                <span className="text-slate-400 block text-[10px]">Daily Usage Run-Rate</span>
                <strong className="text-white text-sm font-mono font-bold">{activeItemDetails.daily_usage_avg} {activeItemDetails.unit}/day</strong>
              </div>
              <div className="p-3 bg-surface-2 rounded-xl border border-white/[0.04]">
                <span className="text-slate-400 block text-[10px]">Reorder Point (ROP)</span>
                <strong className="text-brand-accent text-sm font-mono font-bold">{activeItemDetails.reorder_point} {activeItemDetails.unit}</strong>
              </div>
              <div className="p-3 bg-surface-2 rounded-xl border border-white/[0.04]">
                <span className="text-slate-400 block text-[10px]">Safety Stock Target</span>
                <strong className="text-emerald-400 text-sm font-mono font-bold">{activeItemDetails.safety_stock} {activeItemDetails.unit}</strong>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  setActiveItemDetails(null);
                  onNavigateToProcurement(activeItemDetails.sku);
                }}
                className="btn-primary text-xs px-4 py-2"
              >
                Launch Procurement Simulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
