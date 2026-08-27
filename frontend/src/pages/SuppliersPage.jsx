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
  DollarSign
} from 'lucide-react';
import { api } from '../services/api';

export default function SuppliersPage({ onOpenAskAI }) {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeSupplierModal, setActiveSupplierModal] = useState(null);

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

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Differentiator 2
            </span>
            <span className="text-xs text-slate-400">Measured Reliability Intelligence</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Supplier Network & Reliability Scores
          </h1>
          <p className="text-xs text-slate-400">
            Continuously measured scores based on actual on-time delivery rates, invoice discrepancies, and response times.
          </p>
        </div>

        <button
          onClick={() => onOpenAskAI("Analyze supplier performance and identify the highest reliability vendors for coffee and dairy.")}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-black font-bold text-xs rounded-xl shadow-glow-cyan flex items-center gap-1.5 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AI Supplier Copilot</span>
        </button>
      </div>

      {/* Supplier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 text-center py-16 text-slate-400">
            Loading supplier reliability metrics...
          </div>
        ) : (
          suppliers.map((sup) => {
            const perf = sup.performance || {};
            const relScore = perf.reliability_score || 85;
            const isHighReliability = relScore >= 90;

            return (
              <div
                key={sup.supplier_id}
                className="glass-card p-5 flex flex-col justify-between hover:border-cyan-500/40 transition-all group"
              >
                <div>
                  {/* Top Bar: Name & Reliability Ring */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-cyan-400 font-bold">{sup.supplier_id}</span>
                        {sup.is_preferred && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                            Preferred
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-white mt-0.5 group-hover:text-cyan-300 transition-colors">
                        {sup.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{sup.city}, {sup.state}</span>
                      </p>
                    </div>

                    {/* Reliability Badge */}
                    <div className="flex flex-col items-center shrink-0">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-mono font-extrabold text-sm border ${
                          isHighReliability
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-glow-emerald'
                            : relScore >= 80
                            ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
                            : 'bg-rose-950/80 text-rose-300 border-rose-500/50'
                        }`}
                      >
                        {Math.round(relScore)}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-0.5">Score</span>
                    </div>
                  </div>

                  {/* 4 Key Performance Metric Tiles */}
                  <div className="grid grid-cols-2 gap-2 my-3">
                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block">On-Time Rate</span>
                      <strong className="text-xs font-mono text-emerald-400">{perf.on_time_delivery_rate}%</strong>
                    </div>

                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block">Invoice Accuracy</span>
                      <strong className="text-xs font-mono text-cyan-400">{perf.invoice_accuracy_rate}%</strong>
                    </div>

                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block">Avg Response</span>
                      <strong className="text-xs font-mono text-slate-200">{perf.avg_response_time_min} min</strong>
                    </div>

                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block">Price Stability</span>
                      <strong className="text-xs font-mono text-slate-200">{perf.price_stability_rate}%</strong>
                    </div>
                  </div>

                  {/* Category tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {sup.categories_supplied?.map((c, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Terms: {sup.payment_terms}
                  </span>
                  <button
                    onClick={() => setActiveSupplierModal(sup)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    <span>View Catalog ({sup.catalog?.length || 0})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Supplier Catalog & Terms Modal */}
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
                className="px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            {/* Catalog Items */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Product Catalog & Volume Discount Tiers
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
                        <span className="text-xs font-bold text-white font-mono">₹{item.base_unit_price}/{item.unit}</span>
                        <span className="text-[10px] text-slate-400 block">{item.lead_time_days}-day lead time</span>
                      </div>
                    </div>

                    {item.volume_discount_tiers?.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Discount Tiers:</span>
                        {item.volume_discount_tiers.map((tier, tIdx) => (
                          <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 font-mono">
                            ≥{tier.min_quantity} {item.unit}: ₹{tier.discounted_unit_price} (-{tier.discount_percentage}%)
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">General catalog on file.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
