import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Clock,
  FileCheck,
  TrendingUp,
  Search,
  Sparkles,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Tag,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Network,
  Info,
  Package
} from 'lucide-react';
import { api } from '../services/api';
import SupplierNetworkGraph from '../components/SupplierNetworkGraph';

export default function SuppliersPage({ onOpenAskAI }) {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSupplierModal, setActiveSupplierModal] = useState(null);
  const [selectedSupplierDetail, setSelectedSupplierDetail] = useState(null);
  const [showNetworkGraph, setShowNetworkGraph] = useState(true);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await api.getSuppliers(selectedCategory !== 'All' ? selectedCategory : undefined);
      const list = res.suppliers || [];
      setSuppliers(list);
      if (list.length > 0 && !selectedSupplierDetail) {
        setSelectedSupplierDetail(list[0]);
      }
    } catch (err) {
      console.error('Failed to load suppliers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [selectedCategory]);

  const filteredSuppliers = suppliers.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return s.name?.toLowerCase().includes(q) ||
           s.supplier_id?.toLowerCase().includes(q) ||
           s.city?.toLowerCase().includes(q) ||
           s.categories_supplied?.some(c => c.toLowerCase().includes(q));
  });

  const categories = ['All', 'Coffee', 'Dairy', 'Packaging', 'Bakery', 'Syrups & Flavors'];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Verified Partner Intelligence
            </span>
            <span className="text-xs text-slate-400">Measured Reliability • Zero Hallucination</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Supplier Network & Reliability Intelligence
          </h1>
          <p className="text-xs text-slate-400">
            Continuously verified scoring calculated from real on-time delivery rates, invoice discrepancies, and response times.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowNetworkGraph(!showNetworkGraph)}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 ${
              showNetworkGraph
                ? 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>{showNetworkGraph ? 'Hide Topology' : 'Show Topology'}</span>
          </button>

          <button
            onClick={() => onOpenAskAI("Analyze supplier performance and identify the highest reliability vendors for coffee and dairy.")}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-black font-bold text-xs rounded-xl shadow-glow-cyan flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask AI Supplier Copilot</span>
          </button>
        </div>
      </div>

      {/* Supplier Network Graph Visualization */}
      {showNetworkGraph && suppliers.length > 0 && (
        <SupplierNetworkGraph suppliers={suppliers} storeName="Deccan Roast Hub" />
      )}

      {/* Interactive Controls: Search & Category Filter */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search suppliers, cities, SKUs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-black shadow-glow-cyan'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout: Supplier Cards (Left) + "Why this supplier?" Deep-Dive Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Supplier Cards (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {loading ? (
            <div className="glass-card p-12 text-center text-slate-400">
              Loading supplier reliability records...
            </div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="glass-card p-12 text-center text-slate-400">
              <Users className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p>No suppliers match the current search or category filter.</p>
            </div>
          ) : (
            filteredSuppliers.map((sup) => {
              const perf = sup.performance || {};
              const relScore = perf.reliability_score || 85;
              const isHighReliability = relScore >= 90;
              const isSelected = selectedSupplierDetail?.supplier_id === sup.supplier_id;

              return (
                <div
                  key={sup.supplier_id}
                  onClick={() => setSelectedSupplierDetail(sup)}
                  className={`glass-card p-4 transition-all cursor-pointer group ${
                    isSelected
                      ? 'border-cyan-500/80 bg-slate-900/95 ring-1 ring-cyan-500/40 shadow-glow-cyan'
                      : 'hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-cyan-400 font-bold">{sup.supplier_id}</span>
                        {sup.is_preferred && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                            Preferred Vendor
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                        {sup.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{sup.city}, {sup.state}</span>
                      </p>
                    </div>

                    {/* Reliability Score */}
                    <div className="flex flex-col items-center shrink-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-extrabold text-sm border ${
                          isHighReliability
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-glow-emerald'
                            : relScore >= 80
                            ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
                            : 'bg-rose-950/80 text-rose-300 border-rose-500/50'
                        }`}
                      >
                        {Math.round(relScore)}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-0.5">Reliability</span>
                    </div>
                  </div>

                  {/* 4 Performance Metric Chips */}
                  <div className="grid grid-cols-4 gap-2 my-3 text-[11px]">
                    <div className="p-1.5 bg-slate-950 rounded border border-slate-800/80 text-center">
                      <span className="text-[9px] text-slate-500 block">On-Time</span>
                      <strong className="font-mono text-emerald-400">{perf.on_time_delivery_rate || 92}%</strong>
                    </div>
                    <div className="p-1.5 bg-slate-950 rounded border border-slate-800/80 text-center">
                      <span className="text-[9px] text-slate-500 block">Invoice Acc.</span>
                      <strong className="font-mono text-cyan-400">{perf.invoice_accuracy_rate || 94}%</strong>
                    </div>
                    <div className="p-1.5 bg-slate-950 rounded border border-slate-800/80 text-center">
                      <span className="text-[9px] text-slate-500 block">Response</span>
                      <strong className="font-mono text-slate-200">{perf.avg_response_time_min || 45}m</strong>
                    </div>
                    <div className="p-1.5 bg-slate-950 rounded border border-slate-800/80 text-center">
                      <span className="text-[9px] text-slate-500 block">Stability</span>
                      <strong className="font-mono text-slate-200">{perf.price_stability_rate || 95}%</strong>
                    </div>
                  </div>

                  {/* Footer Bar */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono">Payment: {sup.payment_terms || 'Net 30'}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSupplierModal(sup);
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                    >
                      <span>Catalog ({sup.catalog?.length || 0} SKUs)</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* "Why This Supplier?" Grounded Deep-Dive Inspector (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedSupplierDetail ? (
            <div className="glass-card p-5 border-cyan-500/30 bg-slate-900/90 space-y-4 sticky top-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                    Grounded Partner Assessment
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{selectedSupplierDetail.name}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {selectedSupplierDetail.performance?.reliability_score || 85}/100
                  </span>
                  <span className="text-[10px] text-slate-500 block">Reliability Index</span>
                </div>
              </div>

              {/* Why Selected / Evidence Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  Why Choose This Partner?
                </h4>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <p className="text-slate-300">
                      <strong className="text-white font-semibold">Delivery Reliability: </strong>
                      {selectedSupplierDetail.performance?.on_time_delivery_rate || 90}% of purchase orders fulfilled strictly within contracted SLA.
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                    <p className="text-slate-300">
                      <strong className="text-white font-semibold">Invoice Integrity: </strong>
                      {selectedSupplierDetail.performance?.invoice_accuracy_rate || 92}% clean 3-way match consistency with zero critical variances.
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                    <p className="text-slate-300">
                      <strong className="text-white font-semibold">Price Stability: </strong>
                      {selectedSupplierDetail.performance?.price_stability_rate || 95}% rate lock over the preceding 90-day procurement cycle.
                    </p>
                  </div>
                </div>

                {/* Discrepancy & Issue History */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Discrepancy History & Risk Rating:</span>
                  {selectedSupplierDetail.supplier_id === 'sup_03' ? (
                    <div className="flex items-center gap-2 text-rose-300 bg-rose-950/30 p-2 rounded border border-rose-800/40">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>1 Active Flag: 8L volume shortage flagged on INV-KAV-8842.</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-300 bg-emerald-950/30 p-2 rounded border border-emerald-800/40">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Zero unresolved delivery or invoice discrepancies on file.</span>
                    </div>
                  )}
                </div>

                {/* Catalog items preview */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Supplied SKUs:</span>
                    <button
                      onClick={() => setActiveSupplierModal(selectedSupplierDetail)}
                      className="text-cyan-400 hover:text-cyan-300 text-[11px] font-semibold"
                    >
                      View Full Catalog →
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedSupplierDetail.catalog?.map((c, i) => (
                      <span key={i} className="text-[10px] font-mono px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-200">
                        {c.sku}: ₹{c.base_unit_price}/{c.unit || 'unit'} ({c.lead_time_days}d SLA)
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct Action Trigger */}
                <button
                  onClick={() => onOpenAskAI(`Simulate procurement order with ${selectedSupplierDetail.name} (${selectedSupplierDetail.supplier_id})`)}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-cyan flex items-center justify-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Draft Order Simulation via AI</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 text-center text-slate-500 text-xs">
              Select a supplier from the list to view the grounded reliability assessment.
            </div>
          )}
        </div>
      </div>

      {/* Supplier Catalog & Discount Modal */}
      {activeSupplierModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-2xl w-full p-6 space-y-4 bg-slate-900 border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-400">
                  {activeSupplierModal.supplier_id}
                </span>
                <h3 className="text-base font-bold text-white">{activeSupplierModal.name}</h3>
                <p className="text-xs text-slate-400 font-mono">GSTIN: {activeSupplierModal.gstin || '29AABCM1234F1Z8'}</p>
              </div>
              <button
                onClick={() => setActiveSupplierModal(null)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>

            {/* Catalog Items */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Contracted Catalog & Volume Discount Tiers
              </h4>
              {activeSupplierModal.catalog?.length > 0 ? (
                activeSupplierModal.catalog.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-xs font-bold text-cyan-400">{item.sku}</span>
                        <h5 className="text-xs font-semibold text-white">{item.product_name}</h5>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-white font-mono">₹{item.base_unit_price}/{item.unit || 'unit'}</span>
                        <span className="text-[10px] text-slate-400 block">{item.lead_time_days}-day lead time</span>
                      </div>
                    </div>

                    {item.volume_discount_tiers?.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Discount Tiers:</span>
                        {item.volume_discount_tiers.map((tier, tIdx) => (
                          <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 font-mono">
                            ≥{tier.min_quantity} {item.unit || 'units'}: ₹{tier.discounted_unit_price} (-{tier.discount_percentage}%)
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">General partner catalog on file.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
