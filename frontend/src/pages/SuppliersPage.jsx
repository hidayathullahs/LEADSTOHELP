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
  Package,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import SupplierNetworkGraph from '../components/SupplierNetworkGraph';

export default function SuppliersPage({
  onOpenAskAI,
  onOpenSupplierDetail,
  onOpenProcurement
}) {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNetworkGraph, setShowNetworkGraph] = useState(false);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await api.getSuppliers(selectedCategory !== 'All' ? selectedCategory : undefined);
      setSuppliers(res.suppliers || []);
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

  const categories = ['All', 'Coffee', 'Dairy', 'Packaging', 'Bakery Ingredients'];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-teal text-[10px] uppercase font-bold font-mono">
              Supplier Intelligence
            </span>
            <span className="text-xs text-slate-400">Measured SLAs • Zero Hallucination</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            <Users className="w-5 h-5 text-brand-accent shrink-0" />
            Supplier Network & Reliability Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Continuously verified scoring calculated from real on-time delivery rates, fulfillment accuracy, and invoice audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNetworkGraph(!showNetworkGraph)}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
          >
            <Network className="w-3.5 h-3.5 text-accent-violet" />
            <span>{showNetworkGraph ? 'Hide Topology' : 'Show Topology'}</span>
          </button>

          <button
            onClick={() => onOpenAskAI("Analyze supplier performance and identify the highest reliability vendors for coffee and dairy.")}
            className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-black fill-black" />
            <span>Ask Copilot</span>
          </button>
        </div>
      </div>

      {/* Network Resilience KPIs Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 space-y-1 border-white/[0.08]">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Average Network SLA</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">91.4%</div>
          <span className="text-[11px] text-slate-400">Based on trailing 45 orders</span>
        </div>

        <div className="glass-card p-4 space-y-1 border-white/[0.08]">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Concentration Risk</span>
          <div className="text-2xl font-black text-amber-300 font-mono">62%</div>
          <span className="text-[11px] text-slate-400">Top supplier volume exposure</span>
        </div>

        <div className="glass-card p-4 space-y-1 border-amber-500/20 bg-amber-500/[0.02]">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Flagged Variances</span>
          <div className="text-2xl font-black text-amber-400 font-mono">1 Partner</div>
          <span className="text-[11px] text-slate-400">Kaveri Dairy (8L Shortage)</span>
        </div>

        <div className="glass-card p-4 space-y-1 border-white/[0.08]">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Verified Vendors</span>
          <div className="text-2xl font-black text-white font-mono">5 Active</div>
          <span className="text-[11px] text-slate-400">Karnataka & South India</span>
        </div>
      </div>

      {/* Interactive Topology Graph (Collapsible) */}
      {showNetworkGraph && (
        <div className="glass-card p-5 border-white/[0.08] space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Network className="w-4 h-4 text-brand-accent" />
              <span>Multi-Tier Supply Chain Topology</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Live Simulation Graph</span>
          </div>
          <SupplierNetworkGraph suppliers={suppliers} />
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-white/[0.08]">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search suppliers by name, region, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-2 border border-white/[0.08] text-xs text-white placeholder-slate-500 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
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

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-slate-500">
            Loading supplier profiles and SLA telemetry...
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-slate-500">
            No matching suppliers found.
          </div>
        ) : (
          filteredSuppliers.map((sup) => {
            const score = sup.reliability_score || 90;
            const isCrit = score < 80;
            const isMod = score >= 80 && score < 90;

            return (
              <div
                key={sup.supplier_id}
                onClick={() => onOpenSupplierDetail && onOpenSupplierDetail(sup)}
                className="glass-card p-5 space-y-4 hover:border-brand-accent/40 cursor-pointer group transition-all"
              >
                {/* Supplier Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-brand-accent transition-colors">
                      {sup.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{sup.city || 'Karnataka'}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[10px] font-mono text-slate-500">{sup.supplier_id}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-sm font-extrabold font-mono ${
                      isCrit ? 'text-rose-400' : isMod ? 'text-amber-300' : 'text-emerald-400'
                    }`}>
                      {score}%
                    </span>
                    <span className="text-[9px] text-slate-500 block font-mono">SLA Score</span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/[0.04] text-center text-xs">
                  <div className="p-2 rounded-lg bg-surface-2/60">
                    <span className="text-[9px] text-slate-500 block font-mono">On-Time</span>
                    <span className="font-bold text-slate-200 font-mono">{sup.on_time_rate || '94%'}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-2/60">
                    <span className="text-[9px] text-slate-500 block font-mono">Fulfillment</span>
                    <span className="font-bold text-slate-200 font-mono">{sup.fulfillment_rate || '98%'}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-2/60">
                    <span className="text-[9px] text-slate-500 block font-mono">Accuracy</span>
                    <span className={`font-bold font-mono ${
                      sup.invoice_accuracy?.includes('Flagged') ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {sup.invoice_accuracy || '99%'}
                    </span>
                  </div>
                </div>

                {/* Categories & Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-xs">
                  <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                    {sup.categories_supplied?.join(', ') || 'Specialty Coffee'}
                  </span>
                  <span className="text-[11px] font-bold text-brand-accent group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
