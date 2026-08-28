import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

/**
 * SupplierNetworkGraph — SVG-based supply chain network visualization.
 * Shows store node connected to supplier nodes, with edge styling
 * based on reliability score and active issues.
 */
export default function SupplierNetworkGraph({ suppliers = [], storeName = 'Deccan Roast' }) {
  const nodes = useMemo(() => {
    const storeNode = {
      id: 'store',
      label: storeName,
      x: 280,
      y: 160,
      type: 'store',
      color: '#06b6d4', // cyan
    };

    const supplierNodes = suppliers.map((s, i) => {
      const angle = (i / suppliers.length) * Math.PI * 2 - Math.PI / 2;
      const radius = 120;
      const reliability = s.performance?.reliability_score || 85;
      let color = '#22c55e'; // green
      if (reliability < 80) color = '#ef4444'; // red
      else if (reliability < 90) color = '#f59e0b'; // amber

      return {
        id: s.supplier_id,
        label: s.name || s.supplier_id,
        x: 280 + Math.cos(angle) * radius,
        y: 160 + Math.sin(angle) * radius,
        type: 'supplier',
        reliability,
        color,
        skuCount: s.catalog?.length || 0,
        hasIssue: reliability < 88,
      };
    });

    return { storeNode, supplierNodes };
  }, [suppliers, storeName]);

  const { storeNode, supplierNodes } = nodes;

  if (suppliers.length === 0) {
    return (
      <div className="glass-card p-6 text-center text-slate-400 text-sm">
        No supplier data available for network visualization.
      </div>
    );
  }

  // Concentration risk: HHI-based
  const n = suppliers.length;
  const share = 100 / n;
  const hhi = n > 0 ? (share * share * n) / 100 : 100;
  const concentrationRisk = hhi > 50 ? 'HIGH' : hhi > 33 ? 'MEDIUM' : 'LOW';

  return (
    <div className="glass-card p-4 border-indigo-500/15 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-white">Supplier Network Topology</h4>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
          concentrationRisk === 'LOW'
            ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50'
            : concentrationRisk === 'MEDIUM'
            ? 'text-amber-400 bg-amber-950/40 border-amber-800/50'
            : 'text-rose-400 bg-rose-950/40 border-rose-800/50'
        }`}>
          Concentration: {concentrationRisk}
        </span>
      </div>

      {/* SVG Network */}
      <div className="bg-slate-900/40 rounded-xl border border-slate-800/40 overflow-hidden">
        <svg viewBox="0 0 560 320" className="w-full h-auto" style={{ maxHeight: 280 }}>
          {/* Edges */}
          {supplierNodes.map((sn) => (
            <g key={`edge-${sn.id}`}>
              <line
                x1={storeNode.x}
                y1={storeNode.y}
                x2={sn.x}
                y2={sn.y}
                stroke={sn.color}
                strokeWidth={sn.hasIssue ? 1.5 : 2}
                strokeOpacity={0.5}
                strokeDasharray={sn.hasIssue ? '4,4' : 'none'}
              />
              {/* Animated pulse on connections */}
              <circle r="3" fill={sn.color} opacity="0.7">
                <animateMotion
                  dur={`${2 + Math.random() * 2}s`}
                  repeatCount="indefinite"
                  path={`M${storeNode.x},${storeNode.y} L${sn.x},${sn.y}`}
                />
              </circle>
            </g>
          ))}

          {/* Store Node */}
          <g>
            <circle cx={storeNode.x} cy={storeNode.y} r="28" fill="#0e1726" stroke={storeNode.color} strokeWidth="2" />
            <circle cx={storeNode.x} cy={storeNode.y} r="22" fill={storeNode.color} fillOpacity="0.15" />
            <text x={storeNode.x} y={storeNode.y - 4} textAnchor="middle" className="text-[8px] font-bold fill-cyan-300">
              {storeNode.label.split(' ')[0]}
            </text>
            <text x={storeNode.x} y={storeNode.y + 8} textAnchor="middle" className="text-[7px] fill-slate-400">
              Store Hub
            </text>
          </g>

          {/* Supplier Nodes */}
          {supplierNodes.map((sn) => (
            <g key={sn.id}>
              <circle cx={sn.x} cy={sn.y} r="24" fill="#0e1726" stroke={sn.color} strokeWidth="1.5" />
              <circle cx={sn.x} cy={sn.y} r="18" fill={sn.color} fillOpacity="0.12" />
              <text x={sn.x} y={sn.y - 6} textAnchor="middle" className="text-[7px] font-bold" fill={sn.color}>
                {sn.label.split(' ').slice(0, 2).join(' ')}
              </text>
              <text x={sn.x} y={sn.y + 5} textAnchor="middle" className="text-[7px] fill-slate-400">
                {sn.reliability}%
              </text>
              <text x={sn.x} y={sn.y + 14} textAnchor="middle" className="text-[6px] fill-slate-500">
                {sn.skuCount} SKUs
              </text>

              {/* Issue indicator */}
              {sn.hasIssue && (
                <g transform={`translate(${sn.x + 16}, ${sn.y - 18})`}>
                  <circle r="6" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1" />
                  <text x="0" y="3" textAnchor="middle" className="text-[7px] fill-rose-400 font-bold">!</text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-slate-400">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Reliable (90%+)
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Warning (80-90%)
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Critical (&lt;80%)
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0 border-t border-dashed border-slate-400" /> Issue Flagged
        </div>
      </div>
    </div>
  );
}
