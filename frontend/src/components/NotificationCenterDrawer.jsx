import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  FileCheck,
  CheckSquare,
  Sparkles,
  Info,
  Clock,
  ArrowRight,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import Drawer from './Drawer';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    category: 'critical',
    title: 'Arabica Coffee Risk Detected',
    message: 'COFFEE-001 has ~2.8 days of safety stock remaining at 13kg/day run rate. 6 scenarios computed.',
    time: '2m ago',
    read: false,
    action: { label: 'Review Recommendation', tab: 'procurement', sku: 'COFFEE-001' }
  },
  {
    id: 'notif-2',
    category: 'action',
    title: 'Pending High-Impact Approval',
    message: 'PO-2026-0884 for ₹86,328 requires Operations Lead sign-off.',
    time: '12m ago',
    read: false,
    action: { label: 'Open Approval Queue', tab: 'approvals' }
  },
  {
    id: 'notif-3',
    category: 'audit',
    title: 'Invoice Discrepancy Flagged',
    message: 'Kaveri Milk invoice INV-2026-0841 flagged 8L shortage (₹486.40 overcharge).',
    time: '35m ago',
    read: false,
    action: { label: 'View Vision Audit', tab: 'invoices' }
  },
  {
    id: 'notif-4',
    category: 'info',
    title: 'System Telemetry Synced',
    message: '65 SKUs and 5 suppliers refreshed against local JSON ledger.',
    time: '1h ago',
    read: true,
    action: null
  }
];

export default function NotificationCenterDrawer({
  isOpen,
  onClose,
  onNavigateTo,
  onOpenProcurement
}) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const filteredNotifs = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    return n.category === activeFilter;
  });

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Notification Center"
      subtitle="Operational alerts, risk signals, and approval triggers"
      badge={unreadCount > 0 ? `${unreadCount} Unread` : 'All Caught Up'}
      badgeType={unreadCount > 0 ? 'amber' : 'emerald'}
      width="max-w-md"
      footer={
        <div className="flex items-center justify-between text-xs">
          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="text-slate-400 hover:text-white flex items-center gap-1 disabled:opacity-40 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
          <button
            onClick={handleClearAll}
            disabled={notifications.length === 0}
            className="text-rose-400/80 hover:text-rose-300 flex items-center gap-1 disabled:opacity-40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear all</span>
          </button>
        </div>
      }
    >
      {/* Category Filter Pills */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-2/60 border border-white/[0.04] text-xs">
        {['all', 'critical', 'action', 'audit', 'info'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`flex-1 py-1 px-2 rounded-lg font-medium text-[11px] capitalize transition-all ${
              activeFilter === tab
                ? 'bg-surface-3 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifs.length === 0 ? (
        <div className="p-8 text-center space-y-2">
          <Bell className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400 font-medium">No notifications in this category.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredNotifs.map((item) => {
            let Icon = Info;
            let iconColor = 'text-brand-accent';
            let borderClass = 'border-white/[0.06]';

            if (item.category === 'critical') {
              Icon = AlertTriangle;
              iconColor = 'text-rose-400';
              borderClass = 'border-rose-500/20 bg-rose-500/[0.03]';
            } else if (item.category === 'action') {
              Icon = CheckSquare;
              iconColor = 'text-amber-400';
              borderClass = 'border-amber-500/20 bg-amber-500/[0.03]';
            } else if (item.category === 'audit') {
              Icon = FileCheck;
              iconColor = 'text-brand-accent';
              borderClass = 'border-brand-accent/20 bg-brand-accent/[0.03]';
            }

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl bg-surface-2/70 border ${borderClass} space-y-2 transition-all hover:bg-surface-2 ${
                  !item.read ? 'ring-1 ring-white/[0.08]' : 'opacity-85'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {item.title}
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-snug">
                  {item.message}
                </p>

                {item.action && (
                  <div className="pt-1.5 border-t border-white/[0.04] flex justify-end">
                    <button
                      onClick={() => {
                        onClose();
                        if (item.action.tab === 'procurement' && onOpenProcurement) {
                          onOpenProcurement(item.action.sku || 'COFFEE-001');
                        } else {
                          onNavigateTo(item.action.tab);
                        }
                      }}
                      className="text-[11px] font-bold text-brand-accent hover:underline flex items-center gap-1 transition-colors"
                    >
                      <span>{item.action.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Drawer>
  );
}
