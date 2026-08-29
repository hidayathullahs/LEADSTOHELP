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
  ChevronRight,
  Eye,
  Plus
} from 'lucide-react';
import { api } from '../services/api';

const CATEGORIES = ['All', 'Coffee', 'Dairy', 'Bakery Ingredients', 'Syrups', 'Tea', 'Packaging', 'Cleaning', 'Spices'];

export default function InventoryPage({
  onOpenAskAIWithSku,
  onNavigateToProcurement,
  onOpenInventoryDetail
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');

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

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-teal text-[10px] uppercase font-bold font-mono">
              Real-time Ledger
            </span>
            <span className="text-xs text-slate-400">65 Monitored Raw Material SKUs • Deccan Roast #BLR-01</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            <Package className="w-5 h-5 text-brand-accent shrink-0" />
            Inventory Risk Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Continuous depletion velocity tracking, safety stock runway, and automated replenishment triggers.
          </p>
        </div>

        {/* Top Summary Badges */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-surface-1 border border-rose-500/20 text-rose-300 font-bold">
            1 Critical Stockout
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-surface-1 border border-white/[0.06] text-slate-300">
            65 Monitored Items
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by SKU, item name, or supplier (e.g. 'Arabica', 'DAIRY')..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-2 border border-white/[0.08] text-xs text-white placeholder-slate-500 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-brand-accent transition-colors"
            />
          </form>

          {/* Risk Level Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {['All', 'CRITICAL', 'LOW', 'HEALTHY'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setRiskFilter(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  riskFilter === lvl
                    ? 'bg-surface-3 text-white border border-white/[0.1] shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-surface-2'
                }`}
              >
                {lvl.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-white/[0.04] text-xs">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-500 mr-1 shrink-0">
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-accent/20 text-brand-accent font-bold border border-brand-accent/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-surface-2'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Data Table */}
      <div className="glass-card overflow-hidden border-white/[0.08]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-surface-2/80 text-[10px] uppercase font-mono font-bold text-slate-400">
                <th className="py-3 px-4">SKU & Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Current Stock</th>
                <th className="py-3 px-4 text-right">Reorder Point</th>
                <th className="py-3 px-4 text-right">Run Rate</th>
                <th className="py-3 px-4 text-center">Runway</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-medium">
                    Loading real-time stock balances...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-medium">
                    No matching SKUs found in ledger.
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const isCrit = item.status === 'CRITICAL' || item.days_left < 3;
                  const isLow = item.status === 'LOW' || (item.days_left >= 3 && item.days_left < 6);

                  return (
                    <tr
                      key={item.sku}
                      onClick={() => onOpenInventoryDetail && onOpenInventoryDetail(item)}
                      className="hover:bg-surface-2/60 transition-colors cursor-pointer group"
                    >
                      {/* SKU & Name */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-white group-hover:text-brand-accent transition-colors flex items-center gap-1.5">
                          <span>{item.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{item.sku}</span>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-slate-300">
                        {item.category || 'Raw Material'}
                      </td>

                      {/* Current Stock */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-100">
                        {item.current_stock} <span className="text-[10px] font-normal text-slate-400">{item.unit || 'kg'}</span>
                      </td>

                      {/* Reorder Point */}
                      <td className="py-3 px-4 text-right font-mono text-slate-400">
                        {item.reorder_point} {item.unit || 'kg'}
                      </td>

                      {/* Daily Run Rate */}
                      <td className="py-3 px-4 text-right font-mono text-amber-300">
                        {item.daily_run_rate || 13.0} {item.unit || 'kg'}/d
                      </td>

                      {/* Runway (Days) */}
                      <td className="py-3 px-4 text-center font-mono font-extrabold">
                        <span className={isCrit ? 'text-rose-400' : isLow ? 'text-amber-300' : 'text-emerald-400'}>
                          ~{item.days_left || (item.current_stock / (item.daily_run_rate || 1)).toFixed(1)}d
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4 text-center">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                          isCrit
                            ? 'badge-rose'
                            : isLow
                            ? 'badge-amber'
                            : 'badge-emerald'
                        }`}>
                          {item.status || (isCrit ? 'CRITICAL' : isLow ? 'LOW' : 'HEALTHY')}
                        </span>
                      </td>

                      {/* Quick Action Buttons */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenAskAIWithSku(item.sku)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-accent hover:bg-surface-2 transition-colors"
                            title="Ask AI Copilot about this SKU"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onNavigateToProcurement(item.sku)}
                            className="btn-primary text-[10px] py-1 px-2.5 flex items-center gap-1"
                            title="Open 6-Scenario Procurement Decision Matrix"
                          >
                            <ShoppingCart className="w-3 h-3 text-black" />
                            <span>Procure</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
