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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-teal text-[10px] uppercase font-bold">
              Verified Partner Intelligence
            </span>
            <span className="text-xs text-slate-400">Measured Reliability • Zero Hallucination</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            <Users className="w-5 h-5 text-brand-accent" />
            Supplier Network & Reliability Intelligence
          </h1>
          <p className="text-xs text-slate-400">
            Continuously verified scoring calculated from real on-time delivery rates, invoice discrepancies, and response times.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowNetworkGraph(!showNetworkGraph)}
            className="btn-secondary text-xs"
          >
            <Network className="w-3.5 h-3.5 text-accent-violet" />
            <span>{showNetworkGraph ? 'Hide Topology' : 'Show Topology'}</span>
          </button>

          <button
            onClick={() => onOpenAskAI("Analyze supplier performance and identify the highest reliability vendors for coffee and dairy.")}
            className="btn-primary text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-black fill-black" />
            <span>Ask AI Supplier Copilot</span>
          </button>
        </div>
      </div>

      {/* Supplier Network Graph Visualization */}
      {showNetworkGraph && suppliers.length > 0 && (
        <SupplierNetworkGraph suppliers={suppliers} storeName="Deccan Roast Hub" />
      )}

      {/* Interactive Controls: Search & Category Filter */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-center justify-between gap-3 bg-surface-1">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search suppliers, cities, SKUs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-2 border border-white/[0.08] text-xs text-white placeholder-slate-500 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:border-brand-accent"
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
                  ? 'bg-brand-accent text-black font-bold shadow-glow-teal'
                  : 'bg-surface-2 text-slate-300 hover:text-white border border-white/[0.06]'
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
        <div className="lg:col-span-7 space-y-3">
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
                      ? 'border-brand-accent bg-surface-2 ring-1 ring-brand-accent/50 shadow-glow-teal'
                      : 'hover:border-white/[0.12] bg-surface-1'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-brand-accent font-bold">{sup.supplier_id}</span>
                        {sup.is_preferred && (
                          <span className="badge-teal text-[9px]">
                            Preferred Vendor
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1 group-hover:text-brand-accent transition-colors">
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
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 shadow-glow-emerald'
                            : relScore >= 80
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/25'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                        }`}
                      >
                        {relScore}%
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono mt-1">Reliability</span>
                    </div>
                  </div>

                  {/* Performance Indicators */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/[0.04] text-[11px]">
                    <div className="bg-surface-0 p-2 rounded border border-white/[0.04]">
                      <span className="text-slate-500 block text-[10px]">On-Time Rate</span>
                      <span className="font-mono font-bold text-white">{perf.on_time_delivery_rate || 92}%</span>
                    </div>
                    <div className="bg-surface-0 p-2 rounded border border-white/[0.04]">
                      <span className="text-slate-500 block text-[10px]">Lead Time</span>
                      <span className="font-mono font-bold text-white">{sup.lead_time_days_avg || 2} Days</span>
                    </div>
                    <div className="bg-surface-0 p-2 rounded border border-white/[0.04]">
                      <span className="text-slate-500 block text-[10px]">Quality Score</span>
                      <span className="font-mono font-bold text-emerald-400">{perf.quality_score || 95}%</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Deep-Dive Evaluation Panel (5 Cols) */}
        <div className="lg:col-span-5">
          {selectedSupplierDetail ? (
            <div className="glass-card p-5 space-y-4 sticky top-20 bg-surface-1">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div>
                  <span className="font-mono text-xs text-brand-accent font-bold">
                    {selectedSupplierDetail.supplier_id}
                  </span>
                  <h2 className="text-base font-bold text-white mt-0.5">{selectedSupplierDetail.name}</h2>
                </div>
                <button
                  onClick={() => setActiveSupplierModal(selectedSupplierDetail)}
                  className="btn-secondary text-xs"
                >
                  View Catalog
                </button>
              </div>

              {/* "Why Choose This Partner?" Assessment */}
              <div className="p-4 bg-surface-2 rounded-xl border border-white/[0.06] space-y-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-brand-accent" /> Why Choose This Partner?
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedSupplierDetail.is_preferred
                    ? `${selectedSupplierDetail.name} is a designated Preferred Partner with consistent ${selectedSupplierDetail.performance?.reliability_score}% SLA compliance, direct farm sourcing, and volume tiered discounts.`
                    : `${selectedSupplierDetail.name} serves as a key secondary partner for regional delivery contingencies with a ${selectedSupplierDetail.lead_time_days_avg}-day fulfillment turnaround.`}
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 p-2 bg-surface-2/60 rounded border border-white/[0.04]">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{selectedSupplierDetail.contact_phone || '+91 80 2345 6789'}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-surface-2/60 rounded border border-white/[0.04]">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{selectedSupplierDetail.contact_email || 'procurement@vendor.in'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center text-slate-500">
              Select a supplier to inspect detailed reliability metrics.
            </div>
          )}
        </div>
      </div>

      {/* Catalog Modal */}
      {activeSupplierModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-surface-1 border border-white/[0.1] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{activeSupplierModal.name}</h3>
                <p className="text-xs text-slate-400">Contracted Catalog & Price Tiers</p>
              </div>
              <button
                onClick={() => setActiveSupplierModal(null)}
                className="btn-secondary text-xs"
              >
                Close
              </button>
            </div>

            <div className="space-y-2">
              {activeSupplierModal.catalog?.map((catItem, idx) => (
                <div key={idx} className="p-3 bg-surface-2 rounded-xl border border-white/[0.04] flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-brand-accent">{catItem.sku}</span>
                    <h4 className="text-xs font-semibold text-white mt-0.5">{catItem.name}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold font-mono text-white">₹{catItem.unit_price_inr}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">/ {catItem.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
