import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ContextualAskAIDrawer from './components/ContextualAskAIDrawer';
import CommandPalette from './components/CommandPalette';
import GuidedDemoTour from './components/GuidedDemoTour';
import OnboardingModal from './components/OnboardingModal';
import ShortcutsModal from './components/ShortcutsModal';
import NotificationCenterDrawer from './components/NotificationCenterDrawer';
import EvidenceDrawer from './components/EvidenceDrawer';
import RiskDetailDrawer from './components/RiskDetailDrawer';
import InventoryDetailDrawer from './components/InventoryDetailDrawer';
import ProcurementStrategyDrawer from './components/ProcurementStrategyDrawer';
import SupplierDetailDrawer from './components/SupplierDetailDrawer';
import ApprovalConfirmModal from './components/ApprovalConfirmModal';
import { ToastProvider, useToast } from './components/ToastContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/OverviewPage';
import DailyOperationsPage from './pages/DailyOperationsPage';
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

function MainApp() {
  // Authentication & Session State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lead_user_session');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Default authenticated demo user
    return {
      name: 'Arjun Rao',
      email: 'arjun.rao@deccanroast.in',
      role: 'Operations Lead',
      store: 'Deccan Roast Specialty Hub • #BLR-01',
      authMode: 'Development JWT / Strict RBAC'
    };
  });

  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'overview';
  });

  const [isLandingMode, setIsLandingMode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('app') === '1' || params.get('tab')) return false;
    return true;
  });
  const [isLoginPage, setIsLoginPage] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState('login');

  const [overviewData, setOverviewData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Drawers & Modals State
  const [isAskAIOpen, setIsAskAIOpen] = useState(false);
  const [askAISku, setAskAISku] = useState(null);
  const [procurementInitialSku, setProcurementInitialSku] = useState('COFFEE-001');

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [demoTourOpen, setDemoTourOpen] = useState(false);
  const [demoTourStep, setDemoTourStep] = useState(0);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  // Detail Drawer States
  const [evidenceDrawerOpen, setEvidenceDrawerOpen] = useState(false);
  const [evidenceSku, setEvidenceSku] = useState('COFFEE-001');
  const [riskDrawerOpen, setRiskDrawerOpen] = useState(false);
  const [riskDrawerData, setRiskDrawerData] = useState(null);
  const [inventoryDrawerOpen, setInventoryDrawerOpen] = useState(false);
  const [inventoryDrawerItem, setInventoryDrawerItem] = useState(null);
  const [strategyDrawerOpen, setStrategyDrawerOpen] = useState(false);
  const [strategyDrawerItem, setStrategyDrawerItem] = useState(null);
  const [supplierDrawerOpen, setSupplierDrawerOpen] = useState(false);
  const [supplierDrawerItem, setSupplierDrawerItem] = useState(null);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvalModalItem, setApprovalModalItem] = useState(null);

  const { addToast } = useToast();

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

  // Global Keyboard Shortcuts Listener (⌘K, ⌘J, ?, Esc)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ⌘K / Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      // ⌘J / Ctrl+J
      else if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        setIsAskAIOpen((prev) => !prev);
      }
      // ? (Shift + /)
      else if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        setShortcutsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('lead_user_session', JSON.stringify(userData));
    setIsLoginPage(false);
    setIsLandingMode(false);
    addToast({
      title: `Welcome, ${userData.name}!`,
      message: 'Authenticated to Deccan Roast Hub BLR-01 under Strict RBAC governance.',
      type: 'success'
    });
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('lead_user_session');
    setAuthInitialMode('login');
    setIsLoginPage(true);
    setIsLandingMode(false);
    addToast({
      title: 'Signed Out',
      message: 'Operator session terminated safely.',
      type: 'info'
    });
  };

  const handleQuickApprove = async (proposalId, notes) => {
    try {
      await api.approveProposal(proposalId, notes || 'Approved by Operations Lead');
      addToast({
        title: 'Purchase Order Approved & Sealed',
        message: 'Cryptographic authorization receipt stored in ledger.',
        type: 'success',
        action: {
          label: 'View Trace',
          onClick: () => setActiveTab('agent-inspector')
        }
      });
      loadOverview();
    } catch (err) {
      addToast({
        title: 'Approval Failed',
        message: err.message,
        type: 'error'
      });
    }
  };

  const handleOpenAskAI = (promptOrSku) => {
    if (typeof promptOrSku === 'string' && promptOrSku.startsWith('COFFEE-')) {
      setAskAISku(promptOrSku);
    } else {
      setAskAISku('COFFEE-001');
    }
    setIsAskAIOpen(true);
  };

  const handleNavigateToProcurement = (sku) => {
    setProcurementInitialSku(sku || 'COFFEE-001');
    setIsLandingMode(false);
    setActiveTab('procurement');
  };

  const handleStartDemoTour = () => {
    setIsLandingMode(false);
    setIsLoginPage(false);
    setDemoTourStep(0);
    setDemoTourOpen(true);
    setActiveTab('overview');
  };

  // If user requests login page mode
  if (isLoginPage) {
    return (
      <LoginPage
        initialMode={authInitialMode}
        onLoginSuccess={handleLoginSuccess}
        onExploreLanding={() => {
          setIsLoginPage(false);
          setIsLandingMode(true);
        }}
      />
    );
  }

  // If user requests landing page mode
  if (isLandingMode) {
    return (
      <LandingPage
        onEnterApp={() => {
          setIsLandingMode(false);
          setIsLoginPage(false);
        }}
        onStartDemoTour={handleStartDemoTour}
        onOpenAskAI={(prompt) => {
          setIsLandingMode(false);
          handleOpenAskAI(prompt);
        }}
        onNavigateToLogin={(mode = 'login') => {
          setAuthInitialMode(mode);
          setIsLandingMode(false);
          setIsLoginPage(true);
        }}
      />
    );
  }

  // If not authenticated, render LoginPage
  if (!user) {
    return (
      <LoginPage
        initialMode={authInitialMode}
        onLoginSuccess={handleLoginSuccess}
        onExploreLanding={() => {
          setIsLoginPage(false);
          setIsLandingMode(true);
        }}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen bg-surface-0 text-slate-100 overflow-hidden font-sans selection:bg-brand-accent selection:text-black">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setIsLandingMode(false);
          setActiveTab(tab);
        }}
        metrics={overviewData?.metrics}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenAskAI={() => handleOpenAskAI(null)}
        onOpenProcurement={handleNavigateToProcurement}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <Topbar
          onOpenAskAI={() => handleOpenAskAI(null)}
          onRefreshData={loadOverview}
          isRefreshing={isRefreshing}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onStartDemoTour={handleStartDemoTour}
          activeTab={activeTab}
          onNavigateTo={(tab) => {
            setIsLandingMode(false);
            setActiveTab(tab);
          }}
          user={user}
          onSignOut={handleSignOut}
          onOpenNotifications={() => setNotificationDrawerOpen(true)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          activeSku={procurementInitialSku}
        />

        {/* Scrollable Page Views */}
        <main className="flex-1 overflow-y-auto bg-surface-0">
          {/* Track 2 / Core Control Tower */}
          {activeTab === 'overview' && (
            <OverviewPage
              overviewData={overviewData}
              onNavigateTo={(tab) => setActiveTab(tab)}
              onOpenAskAI={(prompt) => handleOpenAskAI(prompt || null)}
              onQuickApprove={handleQuickApprove}
              onOpenEvidence={(sku) => {
                setEvidenceSku(sku || 'COFFEE-001');
                setEvidenceDrawerOpen(true);
              }}
              onOpenRiskDetail={(data) => {
                setRiskDrawerData(data);
                setRiskDrawerOpen(true);
              }}
              onOpenProcurement={handleNavigateToProcurement}
            />
          )}

          {/* Track 3 / Daily Operations & Productivity Hub */}
          {activeTab === 'daily-ops' && (
            <DailyOperationsPage
              overviewData={overviewData}
              onNavigateTo={(tab) => setActiveTab(tab)}
              onOpenAskAI={(prompt) => handleOpenAskAI(prompt || null)}
              onOpenProcurement={handleNavigateToProcurement}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryPage
              onOpenAskAIWithSku={(sku) => handleOpenAskAI(sku)}
              onNavigateToProcurement={handleNavigateToProcurement}
              onOpenInventoryDetail={(item) => {
                setInventoryDrawerItem(item);
                setInventoryDrawerOpen(true);
              }}
            />
          )}

          {activeTab === 'procurement' && (
            <ProcurementPage
              initialSku={procurementInitialSku}
              onNavigateToApprovals={() => setActiveTab('approvals')}
              onOpenAskAI={(prompt) => handleOpenAskAI(prompt)}
              onOpenStrategyDetail={(strategy) => {
                setStrategyDrawerItem(strategy);
                setStrategyDrawerOpen(true);
              }}
              onOpenEvidence={(sku) => {
                setEvidenceSku(sku || 'COFFEE-001');
                setEvidenceDrawerOpen(true);
              }}
            />
          )}

          {activeTab === 'suppliers' && (
            <SuppliersPage
              onOpenAskAI={(prompt) => handleOpenAskAI(prompt)}
              onOpenSupplierDetail={(supplier) => {
                setSupplierDrawerItem(supplier);
                setSupplierDrawerOpen(true);
              }}
              onOpenProcurement={handleNavigateToProcurement}
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
              onRequestApprovalModal={(item) => {
                setApprovalModalItem(item);
                setApprovalModalOpen(true);
              }}
            />
          )}

          {activeTab === 'risk-radar' && (
            <RiskRadarPage
              onNavigateTo={(tab) => setActiveTab(tab)}
              onOpenAskAI={(prompt) => handleOpenAskAI(prompt)}
              onOpenProcurement={handleNavigateToProcurement}
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
            <SettingsPage user={user} />
          )}
        </main>
      </div>

      {/* Global Drawers & Modals */}
      <ContextualAskAIDrawer
        isOpen={isAskAIOpen}
        onClose={() => setIsAskAIOpen(false)}
        selectedSku={askAISku}
        pageContext={activeTab}
        onNavigateTo={(tab) => {
          setIsLandingMode(false);
          setActiveTab(tab);
        }}
        onOpenProcurement={handleNavigateToProcurement}
      />

      <NotificationCenterDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        onNavigateTo={(tab) => {
          setIsLandingMode(false);
          setActiveTab(tab);
        }}
        onOpenProcurement={handleNavigateToProcurement}
      />

      <EvidenceDrawer
        isOpen={evidenceDrawerOpen}
        onClose={() => setEvidenceDrawerOpen(false)}
        sku={evidenceSku}
        onOpenProcurement={handleNavigateToProcurement}
      />

      <RiskDetailDrawer
        isOpen={riskDrawerOpen}
        onClose={() => setRiskDrawerOpen(false)}
        riskData={riskDrawerData}
        onOpenProcurement={handleNavigateToProcurement}
        onOpenWhatIf={(sku) => handleNavigateToProcurement(sku)}
      />

      <InventoryDetailDrawer
        isOpen={inventoryDrawerOpen}
        onClose={() => setInventoryDrawerOpen(false)}
        item={inventoryDrawerItem}
        onOpenProcurement={handleNavigateToProcurement}
        onOpenAskAI={(prompt) => handleOpenAskAI(prompt)}
      />

      <ProcurementStrategyDrawer
        isOpen={strategyDrawerOpen}
        onClose={() => setStrategyDrawerOpen(false)}
        strategy={strategyDrawerItem}
        sku={procurementInitialSku}
        onSubmitProposal={async (strat) => {
          try {
            await api.createProposal(procurementInitialSku, strat.id, 100);
            addToast({
              title: 'Replenishment Proposal Created',
              message: `${strat.name || strat.title} submitted to Human Approval Queue.`,
              type: 'success',
              action: {
                label: 'View in Approvals',
                onClick: () => setActiveTab('approvals')
              }
            });
          } catch (err) {
            addToast({
              title: 'Proposal Submission Error',
              message: err.message,
              type: 'error'
            });
          }
        }}
      />

      <SupplierDetailDrawer
        isOpen={supplierDrawerOpen}
        onClose={() => setSupplierDrawerOpen(false)}
        supplier={supplierDrawerItem}
        onOpenProcurement={handleNavigateToProcurement}
        onOpenAskAI={(prompt) => handleOpenAskAI(prompt)}
      />

      <ApprovalConfirmModal
        isOpen={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        approvalItem={approvalModalItem}
        onConfirm={handleQuickApprove}
      />

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigateTo={(tab) => {
          setIsLandingMode(false);
          setActiveTab(tab);
        }}
        onOpenAskAI={(prompt) => handleOpenAskAI(prompt)}
      />

      <ShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />

      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onStartDemo={handleStartDemoTour}
      />

      <GuidedDemoTour
        isOpen={demoTourOpen}
        onClose={() => setDemoTourOpen(false)}
        currentStepIndex={demoTourStep}
        setCurrentStepIndex={setDemoTourStep}
        onNavigateTo={(tab) => {
          setIsLandingMode(false);
          setActiveTab(tab);
        }}
        onOpenAskAI={(prompt) => handleOpenAskAI(prompt)}
        onOpenEvidence={() => {
          setEvidenceSku('COFFEE-001');
          setEvidenceDrawerOpen(true);
        }}
        onOpenWhatIf={() => {
          setIsLandingMode(false);
          setActiveTab('overview');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
