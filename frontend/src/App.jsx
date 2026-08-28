import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ContextualAskAIDrawer from './components/ContextualAskAIDrawer';

import OverviewPage from './pages/OverviewPage';
import InventoryPage from './pages/InventoryPage';
import ProcurementPage from './pages/ProcurementPage';
import SuppliersPage from './pages/SuppliersPage';
import InvoiceAuditorPage from './pages/InvoiceAuditorPage';
import NegotiationsPage from './pages/NegotiationsPage';
import ApprovalCenterPage from './pages/ApprovalCenterPage';
import RiskRadarPage from './pages/RiskRadarPage';
import AgentInspectorPage from './pages/AgentInspectorPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [overviewData, setOverviewData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Contextual Ask AI State
  const [isAskAIOpen, setIsAskAIOpen] = useState(false);
  const [askAISku, setAskAISku] = useState(null);
  const [procurementInitialSku, setProcurementInitialSku] = useState('COFFEE-001');

  const loadOverview = async () => {
    setIsRefreshing(true);
    try {
      const data = await api.getOverview();
      setOverviewData(data);
    } catch (err) {
      console.error('Error fetching overview data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const handleOpenAskAI = (skuOrPrompt = null) => {
    if (typeof skuOrPrompt === 'string' && skuOrPrompt.startsWith('COFFEE') || skuOrPrompt?.startsWith('DAIRY') || skuOrPrompt?.startsWith('PACK')) {
      setAskAISku(skuOrPrompt);
    } else {
      setAskAISku(null);
    }
    setIsAskAIOpen(true);
  };

  const handleNavigateToProcurement = (sku = 'COFFEE-001') => {
    setProcurementInitialSku(sku);
    setActiveTab('procurement');
  };

  const handleQuickApprove = async (approvalId, decision = 'APPROVED') => {
    try {
      await api.submitApprovalDecision(approvalId, decision, 'Quick approved from Control Tower Overview.');
      loadOverview();
    } catch (err) {
      alert(`Approval failed: ${err.message}`);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#0B0F19] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        metrics={overviewData?.metrics}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <Topbar
          onOpenAskAI={() => handleOpenAskAI(null)}
          onRefreshData={loadOverview}
          isRefreshing={isRefreshing}
        />

        {/* Scrollable Page Views */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0B0F19] via-[#0D121F] to-[#0B0F19]">
          {activeTab === 'overview' && (
            <OverviewPage
              overviewData={overviewData}
              onNavigateTo={(tab) => setActiveTab(tab)}
              onOpenAskAI={() => handleOpenAskAI(null)}
              onQuickApprove={handleQuickApprove}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryPage
              onOpenAskAIWithSku={(sku) => handleOpenAskAI(sku)}
              onNavigateToProcurement={handleNavigateToProcurement}
            />
          )}

          {activeTab === 'procurement' && (
            <ProcurementPage
              initialSku={procurementInitialSku}
              onNavigateToApprovals={() => setActiveTab('approvals')}
              onOpenAskAI={(prompt) => handleOpenAskAI(prompt)}
            />
          )}

          {activeTab === 'suppliers' && (
            <SuppliersPage
              onOpenAskAI={(prompt) => handleOpenAskAI(prompt)}
            />
          )}

          {activeTab === 'invoices' && (
            <InvoiceAuditorPage
              onOpenAskAI={(prompt) => handleOpenAskAI(prompt)}
            />
          )}

          {activeTab === 'negotiations' && (
            <NegotiationsPage
              onNavigateToApprovals={() => setActiveTab('approvals')}
              onOpenAskAI={(prompt) => handleOpenAskAI(prompt)}
            />
          )}

          {activeTab === 'approvals' && (
            <ApprovalCenterPage
              onOpenAskAI={(prompt) => handleOpenAskAI(prompt)}
            />
          )}

          {activeTab === 'risk-radar' && (
            <RiskRadarPage
              onNavigateTo={(tab) => setActiveTab(tab)}
              onOpenAskAI={(prompt) => handleOpenAskAI(prompt)}
            />
          )}

          {activeTab === 'agent-inspector' && (
            <AgentInspectorPage
              onOpenAskAI={(prompt) => handleOpenAskAI(prompt)}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsPage
              onOpenAskAI={(prompt) => handleOpenAskAI(prompt)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>

      {/* Contextual Ask AI Drawer */}
      <ContextualAskAIDrawer
        isOpen={isAskAIOpen}
        onClose={() => setIsAskAIOpen(false)}
        selectedSku={askAISku}
        pageContext={activeTab}
        onNavigateTo={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}

