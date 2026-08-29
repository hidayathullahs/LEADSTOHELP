import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ContextualAskAIDrawer from './components/ContextualAskAIDrawer';
import CommandPalette from './components/CommandPalette';
import GuidedDemoTour from './components/GuidedDemoTour';
import OnboardingModal from './components/OnboardingModal';

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

export default function App() {
  // Authentication & Session State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lead_user_session');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Default authenticated demo user for seamless direct evaluation
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
    // If URL specifies ?app=1 or ?tab=, go directly to app; otherwise show landing page
    if (params.get('app') === '1' || params.get('tab')) return false;
    return true;
  });
  const [overviewData, setOverviewData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Contextual Ask AI State
  const [isAskAIOpen, setIsAskAIOpen] = useState(false);
  const [askAISku, setAskAISku] = useState(null);
  const [procurementInitialSku, setProcurementInitialSku] = useState('COFFEE-001');

  // Command Palette & Onboarding Modal & Guided Demo Tour
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [demoTourOpen, setDemoTourOpen] = useState(false);
  const [demoTourStep, setDemoTourStep] = useState(0);

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

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('lead_user_session', JSON.stringify(userData));
    setIsLandingMode(false);
    // Check if first-run onboarding seen
    const seen = localStorage.getItem('lead_onboarding_seen');
    if (!seen) {
      setOnboardingOpen(true);
      localStorage.setItem('lead_onboarding_seen', 'true');
    }
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('lead_user_session');
  };

  const handleOpenAskAI = (skuOrPrompt = null) => {
    if (typeof skuOrPrompt === 'string' && (skuOrPrompt.startsWith('COFFEE') || skuOrPrompt.startsWith('DAIRY') || skuOrPrompt.startsWith('PACK'))) {
      setAskAISku(skuOrPrompt);
    } else {
      setAskAISku(null);
    }
    setIsAskAIOpen(true);
  };

  const handleNavigateToProcurement = (sku = 'COFFEE-001') => {
    setProcurementInitialSku(sku);
    setIsLandingMode(false);
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

  const handleStartDemoTour = () => {
    setIsLandingMode(false);
    setDemoTourStep(0);
    setDemoTourOpen(true);
    setActiveTab('overview');
  };

  // If user requests landing page mode
  if (isLandingMode) {
    return (
      <LandingPage
        onEnterApp={() => setIsLandingMode(false)}
        onStartDemoTour={handleStartDemoTour}
        onOpenAskAI={(prompt) => {
          setIsLandingMode(false);
          handleOpenAskAI(prompt);
        }}
      />
    );
  }

  // If not authenticated, render LoginPage
  if (!user) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onExploreLanding={() => setIsLandingMode(true)}
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
        onOpenAskAI={() => handleOpenAskAI(null)}
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
            />
          )}

          {/* Track 3 / Daily Operations & Productivity Hub */}
          {activeTab === 'daily-ops' && (
            <DailyOperationsPage
              overviewData={overviewData}
              onNavigateTo={(tab) => setActiveTab(tab)}
              onOpenAskAI={(prompt) => handleOpenAskAI(prompt || null)}
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

      {/* Track 1 / Contextual Ask AI Copilot Drawer */}
      <ContextualAskAIDrawer
        isOpen={isAskAIOpen}
        onClose={() => setIsAskAIOpen(false)}
        selectedSku={askAISku}
        pageContext={activeTab}
        onNavigateTo={(tab) => {
          setIsLandingMode(false);
          setActiveTab(tab);
        }}
      />

      {/* Global ⌘K Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigateTo={(tab) => {
          setIsLandingMode(false);
          setActiveTab(tab);
        }}
        onOpenAskAI={(prompt) => handleOpenAskAI(prompt)}
      />

      {/* First-Run Onboarding Modal */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onStartDemo={handleStartDemoTour}
      />

      {/* Interactive 3-Minute Guided Demo Tour */}
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
        onOpenEvidence={() => handleOpenAskAI("Show evidence for COFFEE-001")}
        onOpenWhatIf={() => {
          setIsLandingMode(false);
          setActiveTab('overview');
        }}
      />
    </div>
  );
}
