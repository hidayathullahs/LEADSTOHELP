import React, { useState, useEffect } from 'react';
import {
  MessageSquareDiff,
  TrendingDown,
  DollarSign,
  Send,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Copy,
  Clock,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { api } from '../services/api';

export default function NegotiationsPage({ onNavigateToApprovals, onOpenAskAI }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const res = await api.getProposals();
      setProposals(res.proposals || []);
      if (res.proposals && res.proposals.length > 0) {
        setSelectedProposal(res.proposals[0]);
      }
    } catch (err) {
      console.error('Failed to load proposals', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleCopyMessage = () => {
    if (selectedProposal?.draft_negotiation_message) {
      navigator.clipboard.writeText(selectedProposal.draft_negotiation_message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-teal text-[10px] uppercase font-bold">
              Autonomous Vendor Outreach
            </span>
            <span className="text-xs text-slate-400">Grounded Target Pricing • Volume Tiering</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            <MessageSquareDiff className="w-5 h-5 text-brand-accent" />
            Vendor Negotiation & Outreach Studio
          </h1>
          <p className="text-xs text-slate-400">
            AI calculates mathematically achievable discount targets and drafts professional supplier outreach letters.
          </p>
        </div>

        <button
          onClick={() => onOpenAskAI("Draft a supplier negotiation for our next bulk coffee bean order.")}
          className="btn-primary text-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-black fill-black" />
          <span>Ask AI Negotiation Agent</span>
        </button>
      </div>

      {/* Main Grid: Proposals List (Left) + Detailed Draft & Target Matrix (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Proposals List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            Active Negotiation Opportunities ({proposals.length})
          </h3>

          <div className="space-y-2.5">
            {loading ? (
              <div className="glass-card p-12 text-center text-slate-400 text-xs">
                Loading negotiation opportunities...
              </div>
            ) : proposals.length === 0 ? (
              <div className="glass-card p-12 text-center text-slate-500 text-xs">
                No active proposals pending supplier negotiation.
              </div>
            ) : (
              proposals.map((p) => {
                const isSelected = selectedProposal?.proposal_id === p.proposal_id;
                return (
                  <div
                    key={p.proposal_id}
                    onClick={() => setSelectedProposal(p)}
                    className={`glass-card p-4 cursor-pointer transition-all group ${
                      isSelected
                        ? 'border-brand-accent bg-surface-2 ring-1 ring-brand-accent/40 shadow-glow-teal'
                        : 'hover:border-white/[0.12] bg-surface-1'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-brand-accent font-bold">{p.proposal_id}</span>
                      <span className="badge-emerald text-[9px] font-mono">
                        {p.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white group-hover:text-brand-accent transition-colors">
                      {p.sku} Replenishment
                    </h4>
                    
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-2 pt-2 border-t border-white/[0.04]">
                      <span>Est. Savings:</span>
                      <strong className="text-emerald-400 font-bold">₹{p.estimated_savings_inr?.toLocaleString() || '8,672'}</strong>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Draft & Target Matrix (8 Cols) */}
        <div className="lg:col-span-8">
          {selectedProposal ? (
            <div className="glass-card p-6 space-y-5 bg-surface-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.06] pb-4 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-brand-accent font-bold bg-brand-accent/10 px-2 py-0.5 rounded border border-brand-accent/20">
                      {selectedProposal.proposal_id}
                    </span>
                    <span className="badge-teal text-[10px]">
                      {selectedProposal.recommended_scenario}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white mt-1.5">{selectedProposal.sku} Negotiation Package</h2>
                </div>

                <button
                  onClick={handleCopyMessage}
                  className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5 self-start sm:self-auto"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Draft Letter'}</span>
                </button>
              </div>

              {/* Achievable Targets Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-surface-2 rounded-xl border border-white/[0.04]">
                  <span className="text-slate-400 block text-[10px]">Target Unit Price</span>
                  <strong className="text-brand-accent font-mono font-bold text-sm">₹840.00 / kg</strong>
                  <span className="text-[10px] text-slate-500 block">vs ₹920 current list</span>
                </div>

                <div className="p-3 bg-surface-2 rounded-xl border border-white/[0.04]">
                  <span className="text-slate-400 block text-[10px]">Volume Allocation</span>
                  <strong className="text-white font-mono font-bold text-sm">60 kg (Malnad) + 40 kg</strong>
                  <span className="text-[10px] text-slate-500 block">Split-order buffer</span>
                </div>

                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <span className="text-emerald-400 block text-[10px]">Simulated Net Savings</span>
                  <strong className="text-emerald-400 font-mono font-bold text-sm">₹8,672.00</strong>
                  <span className="text-[10px] text-emerald-400/80 block">Direct cost reduction</span>
                </div>
              </div>

              {/* Draft Message Container */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block">
                  AI-Generated Supplier Outreach Letter:
                </span>
                <div className="p-4 bg-surface-0 rounded-xl border border-white/[0.06] font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedProposal.draft_negotiation_message ||
                    `Dear Malnad Coffee Planters Team,\n\nWe are preparing our Q3 procurement cycle for Deccan Roast Specialty Hub (#BLR-01) in Bangalore.\n\nBased on our consistent order history and volume projection of 60kg for Grade AAA Arabica, we would like to confirm tiered pricing at ₹840/kg for delivery by Thursday 10:00 AM.\n\nPlease confirm availability and dispatch schedule.\n\nWarm regards,\nArjun Rao\nLead Operations Manager, Deccan Roast`}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={onNavigateToApprovals}
                  className="btn-primary text-xs px-4 py-2"
                >
                  Stage in Human Approval Queue
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center text-slate-500 text-xs">
              Select a proposal to view negotiation draft.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
