import React from 'react';
import { HumanProvider, useHuman } from './context/HumanContext';
import { MobileShell } from './components/common/MobileShell';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { HomeScreen } from './components/home/HomeScreen';
import { ExploreScreen } from './components/explore/ExploreScreen';
import { CreateWizard } from './components/create/CreateWizard';
import { PlansScreen } from './components/messaging/PlansScreen';
import { YouScreen } from './components/profile/YouScreen';
import { ActivityDetailModal } from './components/activity/ActivityDetailModal';
import { CommunityDetailModal } from './components/communities/CommunityDetailModal';
import { CoordinationSpace } from './components/activity/CoordinationSpace';
import { ProofOfPresenceModal } from './components/memories/ProofOfPresenceModal';
import { SafetyCenter } from './components/safety/SafetyCenter';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    isOnboarded, 
    activeTab, 
    isAdminMode, 
    activeCoordinationActivity,
    setActiveCoordinationActivity,
    selectedActivityDetail,
    setSelectedActivityDetail,
    selectedCommunityDetail,
    setSelectedCommunityDetail,
    proofOfPresenceModal,
    setProofOfPresenceModal,
    toast 
  } = useHuman();

  // If user hasn't completed onboarding yet, present the Jaipur-first onboarding
  if (!isOnboarded) {
    return (
      <MobileShell>
        <OnboardingFlow />
      </MobileShell>
    );
  }

  // Render the active view
  const renderActiveTab = () => {
    // If in Admin Mode, show Admin Portal
    if (isAdminMode) {
      return <AdminDashboard />;
    }

    // If viewing an active coordination space, show full coordination view
    if (activeCoordinationActivity) {
      return (
        <CoordinationSpace
          activity={activeCoordinationActivity}
          onBack={() => setActiveCoordinationActivity(null)}
        />
      );
    }

    // Otherwise render regular tabs
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'explore':
        return <ExploreScreen />;
      case 'create':
        return <CreateWizard />;
      case 'plans':
        return <PlansScreen />;
      case 'you':
        return <YouScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <MobileShell>
      {/* Top Header */}
      {!activeCoordinationActivity && <Header />}

      {/* Main Tab Content */}
      <main className="flex-1 w-full flex flex-col">
        {renderActiveTab()}
      </main>

      {/* Bottom 5-Tab Navigation */}
      {!activeCoordinationActivity && !isAdminMode && <Navigation />}

      {/* Modals & Overlays */}
      {selectedActivityDetail && (
        <ActivityDetailModal
          activity={selectedActivityDetail}
          onClose={() => setSelectedActivityDetail(null)}
        />
      )}

      {selectedCommunityDetail && (
        <CommunityDetailModal
          community={selectedCommunityDetail}
          onClose={() => setSelectedCommunityDetail(null)}
        />
      )}

      {proofOfPresenceModal.isOpen && proofOfPresenceModal.activity && (
        <ProofOfPresenceModal
          activity={proofOfPresenceModal.activity}
          onClose={() => setProofOfPresenceModal({ isOpen: false, activity: null })}
        />
      )}

      <SafetyCenter />

      {/* Floating In-App Toast Notification */}
      {toast && (
        <div className="fixed top-16 left-4 right-4 z-50 max-w-sm mx-auto animate-slide-up pointer-events-none">
          <div className="bg-charcoal-900/95 text-white px-4 py-3 rounded-2xl shadow-elevated border border-charcoal-800 flex items-center justify-between gap-3 pointer-events-auto backdrop-blur-md">
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Sparkles className="w-4 h-4 text-terracotta-400 shrink-0" />
              )}
              <div className="min-w-0">
                <h5 className="text-xs font-bold leading-tight truncate">
                  {toast.title}
                </h5>
                <p className="text-[11px] text-sand-200 leading-tight truncate mt-0.5">
                  {toast.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </MobileShell>
  );
};

// Lazy/direct import of AdminDashboard
import { AdminDashboard } from './components/admin/AdminDashboard';

export function App() {
  return (
    <HumanProvider>
      <AppContent />
    </HumanProvider>
  );
}

export default App;
