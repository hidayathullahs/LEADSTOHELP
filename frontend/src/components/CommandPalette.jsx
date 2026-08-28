import React, { useState, useEffect } from 'react';
import {
  Search,
  Package,
  Users,
  ShoppingCart,
  FileCheck,
  CheckSquare,
  Sparkles,
  Sliders,
  Radar,
  Activity,
  BarChart3,
  X,
  ArrowRight,
  Settings
} from 'lucide-react';

const SEARCH_ITEMS = [
  // Views
  { id: 'overview', title: 'Control Tower', category: 'Views', icon: ShoppingCart, desc: 'Executive supply chain overview & critical alerts' },
  { id: 'daily-ops', title: "Daily Operations Hub (Track 3)", category: 'Views', icon: Activity, desc: "Today's priorities, safe checks & briefings" },
  { id: 'inventory', title: 'Inventory Risk Ledger', category: 'Views', icon: Package, desc: '65 monitored raw material SKUs & run-rates' },
  { id: 'procurement', title: 'Procurement Decisions', category: 'Views', icon: ShoppingCart, desc: '6-scenario multi-supplier decision matrix' },
  { id: 'suppliers', title: 'Supplier Network Intelligence', category: 'Views', icon: Users, desc: '10 active vetted partners & SLA scores' },
  { id: 'invoices', title: 'Invoice Vision Audit', category: 'Views', icon: FileCheck, desc: 'Multimodal 3-way matching & shortage detection' },
  { id: 'approvals', title: 'Human Approval Queue', category: 'Views', icon: CheckSquare, desc: 'Cryptographic governance barrier & sign-offs' },
  { id: 'risk-radar', title: 'Supply Risk Radar', category: 'Views', icon: Radar, desc: '7-dimension operational risk index' },
  { id: 'agent-inspector', title: 'AI Decision Trace (Activity)', category: 'Views', icon: Activity, desc: '7-agent execution telemetry & logs' },
  { id: 'analytics', title: 'Impact & Analytics', category: 'Views', icon: BarChart3, desc: 'Verified financial ROI & savings metrics' },

  // SKUs
  { id: 'sku-coffee', title: 'COFFEE-001: Specialty Arabica Coffee Beans', category: 'Inventory SKUs', icon: Package, targetTab: 'inventory', targetSku: 'COFFEE-001', desc: 'Critical stockout risk (~2.8d supply remaining)' },
  { id: 'sku-dairy', title: 'DAIRY-001: Full Cream Barista Milk', category: 'Inventory SKUs', icon: Package, targetTab: 'inventory', targetSku: 'DAIRY-001', desc: 'High run-rate (45L/day), Kaveri Dairy supplier' },
  { id: 'sku-cups', title: 'PACK-001: 12oz Eco Kraft Cups', category: 'Inventory SKUs', icon: Package, targetTab: 'inventory', targetSku: 'PACK-001', desc: 'Stable supply (8.5 days coverage)' },

  // Suppliers
  { id: 'sup-malnad', title: 'Malnad Coffee Planters', category: 'Suppliers', icon: Users, targetTab: 'suppliers', desc: 'Chikmagalur bulk Arabica supplier • 94% reliability' },
  { id: 'sup-metro', title: 'Metro Wholesale Hub', category: 'Suppliers', icon: Users, targetTab: 'suppliers', desc: 'Bangalore regional hub • Rapid 24h fulfillment' },
  { id: 'sup-kaveri', title: 'Kaveri Organic Dairy Co-op', category: 'Suppliers', icon: Users, targetTab: 'suppliers', desc: 'Mandya dairy co-op • 8L shortage variance flagged' },

  // AI Actions
  { id: 'ai-arabica', title: 'AI: Why is Arabica at risk?', category: 'AI Copilot Actions', icon: Sparkles, isAI: true, prompt: 'Why is Arabica at risk?', desc: 'Launches Copilot with Arabica stockout triage' },
  { id: 'ai-demo', title: 'AI: Run the Arabica Crisis demo', category: 'AI Copilot Actions', icon: Sparkles, isAI: true, prompt: 'Run the Arabica Crisis demo', desc: 'Executes guided crisis scenario walkthrough' },
  { id: 'ai-audit', title: 'AI: Audit Kaveri Dairy invoice for shortages', category: 'AI Copilot Actions', icon: Sparkles, isAI: true, prompt: 'Why was Kaveri Dairy invoice INV-KAV-8842 flagged?', desc: 'Investigates 8L variance' }
];

export default function CommandPalette({
  isOpen,
  onClose,
  onNavigateTo,
  onOpenAskAI
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredItems = SEARCH_ITEMS.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return item.title.toLowerCase().includes(q) ||
           item.category.toLowerCase().includes(q) ||
           item.desc.toLowerCase().includes(q);
  });

  const handleSelectItem = (item) => {
    if (item.isAI) {
      onOpenAskAI(item.prompt);
    } else if (item.targetTab) {
      onNavigateTo(item.targetTab);
    } else if (item.id) {
      onNavigateTo(item.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-surface-1 border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/[0.06] flex items-center gap-3 bg-surface-2/60">
          <Search className="w-5 h-5 text-brand-accent shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search SKUs, suppliers, POs, or ask AI (e.g. 'Arabica', 'Kaveri', 'Approvals')..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-surface-3 text-slate-400 border border-white/[0.06]">
            ESC
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No matching resources or commands found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className="p-3 rounded-xl hover:bg-surface-2/80 cursor-pointer flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-2 border border-white/[0.06] flex items-center justify-center text-slate-300 group-hover:text-brand-accent group-hover:border-brand-accent/30 transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white group-hover:text-brand-accent transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 uppercase px-1.5 py-0.2 rounded bg-surface-3">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-brand-accent transition-colors shrink-0" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 border-t border-white/[0.06] bg-surface-2/40 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span><strong>↑↓</strong> Navigate</span>
            <span><strong>↵</strong> Select</span>
            <span><strong>ESC</strong> Close</span>
          </div>
          <span>LEADSTOHELP Universal Search</span>
        </div>
      </div>
    </div>
  );
}
