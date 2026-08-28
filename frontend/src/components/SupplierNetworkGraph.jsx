import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

/**
 * SupplierNetworkGraph — High-tech SVG supply chain network topology visualizer.
 */
export default function SupplierNetworkGraph({ suppliers = [], storeName = 'Deccan Roast' }) {
  const nodes = useMemo(() => {
    const storeNode = {
      id: 'store',
      label: storeName,
      x: 280,
      y: 160,
      type: 'store',
      color: '#00F0FF',
    };

    const supplierNodes = suppliers.map((s, i) => {
      const angle = (i / suppliers.length) * Math.PI * 2 - Math.PI / 2;
      const radius = 125;
      const reliability = s.performance?.reliability_score || 85;
      let color = '#10B981'; // green
      if (reliability < 80) color = '#F43F5E'; // red
      else if (reliability < 90) color = '#F59E0B'; // amber

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
    <div className="glass-card p-4 border-white/[0.08] bg-surface-1 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand-accent" />
          <h4 className="text-xs font-bold text-white tracking-tight">Supplier Network Topology</h4>
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
          concentrationRisk === 'LOW'
            ? 'badge-emerald'
            : concentrationRisk === 'MEDIUM'
            ? 'badge-amber'
            : 'badge-rose'
        }`}>
          Concentration: {concentrationRisk}
        </span>
      </div>

      {/* SVG Network Canvas */}
      <div className="bg-surface-0 rounded-xl border border-white/[0.04] overflow-hidden p-1">
        <svg viewBox="0 0 560 320" className="w-full h-auto" style={{ maxHeight: 280 }}>
          {/* Subtle Grid / Radar Rings */}
          <circle cx={storeNode.x} cy={storeNode.y} r="125" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <circle cx={storeNode.x} cy={storeNode.y} r="70" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />

          {/* Edges */}
          {supplierNodes.map((sn) => (
            <g key={`edge-${sn.id}`}>
              <line
                x1={storeNode.x}
                y1={storeNode.y}
                x2={sn.x}
                y2={sn.y}
                stroke={sn.color}
                strokeWidth={sn.hasIssue ? 1.2 : 1.8}
                strokeOpacity={0.4}
                strokeDasharray={sn.hasIssue ? '3,3' : 'none'}
              />
              {/* Animated pulse on connection lines */}
              <circle r="2.5" fill={sn.color} opacity="0.8">
                <animateMotion
                  dur={`${2.5 + Math.random() * 1.5}s`}
                  repeatCount="indefinite"
                  path={`M${storeNode.x},${storeNode.y} L${sn.x},${sn.y}`}
                />
              </circle>
            </g>
          ))}

          {/* Store Node */}
          <g>
            <circle cx={storeNode.x} cy={storeNode.y} r="26" fill="#0D111A" stroke={storeNode.color} strokeWidth="2" />
            <circle cx={storeNode.x} cy={storeNode.y} r="20" fill={storeNode.color} fillOpacity="0.12" />
            <text x={storeNode.x} y={storeNode.y - 3} textAnchor="middle" className="text-[8px] font-bold font-sans fill-brand-accent">
              {storeNode.label.split(' ')[0]}
            </text>
            <text x={storeNode.x} y={storeNode.y + 8} textAnchor="middle" className="text-[7px] font-mono fill-slate-400">
              HUB-01
            </text>
          </g>

          {/* Supplier Nodes */}
          {supplierNodes.map((sn) => (
            <g key={sn.id} className="cursor-pointer">
              <circle cx={sn.x} cy={sn.y} r="22" fill="#0D111A" stroke={sn.color} strokeWidth="1.5" />
              <circle cx={sn.x} cy={sn.y} r="16" fill={sn.color} fillOpacity="0.1" />
              <text x={sn.x} y={sn.y - 5} textAnchor="middle" className="text-[7px] font-bold font-sans" fill={sn.color}>
                {sn.label.split(' ').slice(0, 2).join(' ')}
              </text>
              <text x={sn.x} y={sn.y + 5} textAnchor="middle" className="text-[7px] font-mono fill-slate-300 font-semibold">
                {sn.reliability}%
              </text>
              <text x={sn.x} y={sn.y + 13} textAnchor="middle" className="text-[6px] font-mono fill-slate-500">
                {sn.skuCount} SKUs
              </text>

              {/* Issue indicator badge */}
              {sn.hasIssue && (
                <g transform={`translate(${sn.x + 15}, ${sn.y - 15})`}>
                  <circle r="5" fill="#F43F5E" />
                  <text x="0" y="2.5" textAnchor="middle" className="text-[6px] fill-black font-bold">!</text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400 pt-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>High Reliability (90%+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Moderate (80-90%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Risk SLA (&lt;80%)</span>
          </div>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">10 Active Partners</span>
      </div>
    </div>
  );
}
