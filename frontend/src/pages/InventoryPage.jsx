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
  X
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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-400" />
            Inventory Intelligence & Run-Rate Monitor
          </h1>
          <p className="text-xs text-slate-400">
            Realtime deterministic safety stock, reorder thresholds (ROP), and run-rate predictive forecasting.
          </p>
        </div>

        <button
          onClick={() => onOpenAskAIWithSku(null)}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-bold text-xs rounded-xl shadow-glow-cyan flex items-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AI Inventory Agent</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by SKU or product name..."
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-cyan-500"
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
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {risk === 'All' ? 'All Risks' : risk}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-slate-800/60">
          <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Category:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-black font-bold shadow-glow-cyan'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3 px-4">SKU / Product</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">Current Stock</th>
                <th className="py-3 px-3 text-right">Safety Stock</th>
                <th className="py-3 px-3 text-right">Reorder Point</th>
                <th className="py-3 px-3 text-right">Run-Rate</th>
                <th className="py-3 px-3 text-center">Days Remaining</th>
                <th className="py-3 px-3 text-center">Risk Level</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-slate-400">
                    <RotateCcw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
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
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[11px] font-bold text-cyan-400">{item.sku}</div>
                      <div className="font-semibold text-white truncate max-w-xs">{item.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Cost: ₹{item.unit_cost}/{item.unit}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded text-[11px]">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold text-white">
                      {item.current_stock} <span className="text-slate-500 font-normal">{item.unit}</span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                      {item.safety_stock} <span className="text-slate-500">{item.unit}</span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold text-cyan-300">
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
                        <div className="w-16 bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
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
                          onClick={() => handleViewDetails(item.sku)}
                          title="View 90-day forecast & demand trends"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-all"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onOpenAskAIWithSku(item.sku)}
                          title="Ask AI about this SKU"
                          className="p-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border border-cyan-800/60 rounded transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onNavigateToProcurement(item.sku)}
                          title="Simulate Replenishment Procurement"
                          className="px-2 py-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-[11px] rounded transition-all flex items-center gap-1 shadow-glow-cyan"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>Simulate</span>
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

      {/* Item Details & Forecast Modal */}
      {activeItemDetails && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-2xl w-full p-6 space-y-4 bg-slate-900 border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-400">
                  {activeItemDetails.item.sku}
                </span>
                <h3 className="text-base font-bold text-white">{activeItemDetails.item.name}</h3>
              </div>
              <button
                onClick={() => setActiveItemDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Current Stock</span>
                <p className="text-lg font-bold font-mono text-white">
                  {activeItemDetails.item.current_stock} {activeItemDetails.item.unit}
                </p>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Safety Stock</span>
                <p className="text-lg font-bold font-mono text-cyan-400">
                  {activeItemDetails.item.safety_stock} {activeItemDetails.item.unit}
                </p>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Stockout In</span>
                <p className="text-lg font-bold font-mono text-rose-400">
                  {activeItemDetails.item.days_of_supply} days
                </p>
              </div>
            </div>

            {/* Statistical Forecast Summary */}
            <div className="p-4 bg-cyan-950/20 border border-cyan-800/40 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> 7-Day Statistical Demand Forecast
              </h4>
              <p className="text-xs text-slate-300">
                Projected total 7-day demand: <strong className="text-white font-mono">{activeItemDetails.forecast?.total_projected_demand} {activeItemDetails.item.unit}</strong>.
                Recommended replenishment order: <strong className="text-cyan-400 font-mono">{activeItemDetails.forecast?.recommended_order_quantity} {activeItemDetails.item.unit}</strong>.
              </p>
              {activeItemDetails.forecast?.projected_stockout_date && (
                <p className="text-[11px] text-rose-300 font-mono">
                  🚨 Projected stockout date: {activeItemDetails.forecast.projected_stockout_date}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  const sku = activeItemDetails.item.sku;
                  setActiveItemDetails(null);
                  setAdjustingSku(sku);
                  setAdjustStockVal(activeItemDetails.item.current_stock);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Manual Stock Adjustment
              </button>

              <button
                onClick={() => {
                  const sku = activeItemDetails.item.sku;
                  setActiveItemDetails(null);
                  onNavigateToProcurement(sku);
                }}
                className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg text-xs shadow-glow-cyan flex items-center gap-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Simulate Procurement</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {adjustingSku && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveStockAdjust} className="glass-card max-w-md w-full p-5 space-y-4 bg-slate-900 border-slate-700">
            <h3 className="text-sm font-bold text-white">Adjust Stock Count: {adjustingSku}</h3>
            <div>
              <label className="text-xs text-slate-400 block mb-1">New Physical Stock Count</label>
              <input
                type="number"
                step="0.1"
                required
                value={adjustStockVal}
                onChange={(e) => setAdjustStockVal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Reason for Adjustment</label>
              <input
                type="text"
                required
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAdjustingSku(null)}
                className="px-3 py-1.5 bg-slate-800 text-slate-400 rounded text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-cyan-500 text-black font-bold rounded text-xs"
              >
                Save & Update Ledger
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
