import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AppProvider, useApp } from './context/AppContext';
import { isValidRole } from './services/rolePersonalization';
import { EthicalNoticeBanner } from './components/layout/EthicalNoticeBanner';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LessonModal } from './components/common/LessonModal';
import { MissionModal } from './components/common/MissionModal';
import { SyncRestoreLoadingOverlay } from './components/common/SyncRestoreLoadingOverlay';
import { AskAmanDrawer } from './components/common/AskAmanDrawer';
import { BetaTesterHud } from './components/common/BetaTesterHud';
import { PageLoadingFallback } from './components/common/PageLoadingFallback';
import { WelcomeSignInPage } from './pages/WelcomeSignInPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { AmanVoiceGuide } from './components/common/AmanVoiceGuide';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { lazyWithRetry } from './utils/lazyWithRetry';

// Dynamic Code Splitting for Performance with Automatic Chunk Recovery
const LandingPage = lazyWithRetry(() => import('./pages/LandingPage'), 'LandingPage');
const DashboardPage = lazyWithRetry(() => import('./pages/DashboardPage'), 'DashboardPage');
const CareerRolesPage = lazyWithRetry(() => import('./pages/CareerRolesPage'), 'CareerRolesPage');
const RoadmapPage = lazyWithRetry(() => import('./pages/RoadmapPage'), 'RoadmapPage');
const LearningPathPage = lazyWithRetry(() => import('./pages/LearningPathPage'), 'LearningPathPage');
const PracticeHubPage = lazyWithRetry(() => import('./pages/PracticeHubPage'), 'PracticeHubPage');
const SubnettingTrainerPage = lazyWithRetry(() => import('./pages/SubnettingTrainerPage'), 'SubnettingTrainerPage');
const SocSimulatorPage = lazyWithRetry(() => import('./pages/SocSimulatorPage'), 'SocSimulatorPage');
const ThreatHuntingPage = lazyWithRetry(() => import('./pages/ThreatHuntingPage'), 'ThreatHuntingPage');
const WebSecurityLabPage = lazyWithRetry(() => import('./pages/WebSecurityLabPage'), 'WebSecurityLabPage');
const SecurityToolsPage = lazyWithRetry(() => import('./pages/SecurityToolsPage'), 'SecurityToolsPage');
const RealCasesPage = lazyWithRetry(() => import('./pages/RealCasesPage'), 'RealCasesPage');
const RealWorldIncidentsPage = lazyWithRetry(() => import('./pages/RealWorldIncidentsPage'), 'RealWorldIncidentsPage');
const InvestigationBoardPage = lazyWithRetry(() => import('./pages/InvestigationBoardPage'), 'InvestigationBoardPage');
const MasterCyberRangePage = lazyWithRetry(() => import('./pages/MasterCyberRangePage'), 'MasterCyberRangePage');
const MissionsPage = lazyWithRetry(() => import('./pages/MissionsPage'), 'MissionsPage');
const NetworkLabPage = lazyWithRetry(() => import('./pages/NetworkLabPage'), 'NetworkLabPage');
const LinuxLabPage = lazyWithRetry(() => import('./pages/LinuxLabPage'), 'LinuxLabPage');
const CyberRangePage = lazyWithRetry(() => import('./pages/CyberRangePage'), 'CyberRangePage');
const CtfArenaPage = lazyWithRetry(() => import('./pages/CtfArenaPage'), 'CtfArenaPage');
const AiMentorPage = lazyWithRetry(() => import('./pages/AiMentorPage'), 'AiMentorPage');
const AiStudyPlanPage = lazyWithRetry(() => import('./pages/AiStudyPlanPage'), 'AiStudyPlanPage');
const SkillTreePage = lazyWithRetry(() => import('./pages/SkillTreePage'), 'SkillTreePage');
const AchievementsPage = lazyWithRetry(() => import('./pages/AchievementsPage'), 'AchievementsPage');
const NotebookPage = lazyWithRetry(() => import('./pages/NotebookPage'), 'NotebookPage');
const CertificatePage = lazyWithRetry(() => import('./pages/CertificatePage'), 'CertificatePage');
const VerifyCertificatePage = lazyWithRetry(() => import('./pages/VerifyCertificatePage'), 'VerifyCertificatePage');
const NetworkVisualizerPage = lazyWithRetry(() => import('./pages/NetworkVisualizerPage'), 'NetworkVisualizerPage');
const CareerPortfolioPage = lazyWithRetry(() => import('./pages/CareerPortfolioPage'), 'CareerPortfolioPage');
const SecurityReportPage = lazyWithRetry(() => import('./pages/SecurityReportPage'), 'SecurityReportPage');
const AuthorizedClientEngagementPage = lazyWithRetry(() => import('./pages/AuthorizedClientEngagementPage'), 'AuthorizedClientEngagementPage');
const CheatSheetsPage = lazyWithRetry(() => import('./pages/CheatSheetsPage'), 'CheatSheetsPage');
const InstructorDashboardPage = lazyWithRetry(() => import('./pages/InstructorDashboardPage'), 'InstructorDashboardPage');
const RewardsShopPage = lazyWithRetry(() => import('./pages/RewardsShopPage'), 'RewardsShopPage');
const MistakesJournalPage = lazyWithRetry(() => import('./pages/MistakesJournalPage'), 'MistakesJournalPage');
const MultiToolReasoningPage = lazyWithRetry(() => import('./pages/MultiToolReasoningPage'), 'MultiToolReasoningPage');
const LearningAnalyticsPage = lazyWithRetry(() => import('./pages/LearningAnalyticsPage'), 'LearningAnalyticsPage');
const ExamModePage = lazyWithRetry(() => import('./pages/ExamModePage'), 'ExamModePage');
const CyberLabModulesListPage = lazyWithRetry(() => import('./pages/CyberLabModulesListPage'), 'CyberLabModulesListPage');
const CyberLabModuleRunnerPage = lazyWithRetry(() => import('./pages/CyberLabModuleRunnerPage'), 'CyberLabModuleRunnerPage');
const LiveIncidentPage = lazyWithRetry(() => import('./pages/LiveIncidentPage'), 'LiveIncidentPage');
const EthicalHackerCommandCenterPage = lazyWithRetry(() => import('./pages/EthicalHackerCommandCenterPage'), 'EthicalHackerCommandCenterPage');
const TryHackMeRoomsPage = lazyWithRetry(() => import('./pages/TryHackMeRoomsPage'), 'TryHackMeRoomsPage');
const SettingsPage = lazyWithRetry(() => import('./pages/SettingsPage'), 'SettingsPage');
const RoleSelectionPage = lazyWithRetry(() => import('./pages/RoleSelectionPage'), 'RoleSelectionPage');
const InvestigationCenterPage = lazyWithRetry(() => import('./pages/InvestigationCenterPage'), 'InvestigationCenterPage');
const SkillLibraryPage = lazyWithRetry(() => import('./pages/SkillLibraryPage'), 'SkillLibraryPage');
const VideoLearningPage = lazyWithRetry(() => import('./pages/VideoLearningPage'), 'VideoLearningPage');
const CareerSimulationPage = lazyWithRetry(() => import('./pages/CareerSimulationPage'), 'CareerSimulationPage');
const AttackBoxPage = lazyWithRetry(() => import('./pages/AttackBoxPage'), 'AttackBoxPage');
const RealCaseStudyPage = lazyWithRetry(() => import('./pages/RealCaseStudyPage'), 'RealCaseStudyPage');
const TeamsPage = lazyWithRetry(() => import('./pages/TeamsPage'), 'TeamsPage');
const AcquisitionReadinessPage = lazyWithRetry(() => import('./pages/AcquisitionReadinessPage'), 'AcquisitionReadinessPage');
const AdminPage = lazyWithRetry(() => import('./pages/AdminPage'), 'AdminPage');
const DualLensSimulatorPage = lazyWithRetry(() => import('./pages/DualLensSimulatorPage'), 'DualLensSimulatorPage');
const AiWargameArenaPage = lazyWithRetry(() => import('./pages/AiWargameArenaPage'), 'AiWargameArenaPage');
const DemoPage = lazyWithRetry(() => import('./pages/DemoPage'), 'DemoPage');
const DebugPage = lazyWithRetry(() => import('./pages/DebugPage'), 'DebugPage');

const RoleGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useApp();
  const location = useLocation();

  const role = profile?.selectedRole || profile?.targetRole;
  const hasValidRole = isValidRole(role);

  const isRolePage = location.pathname === '/role-selection' || location.pathname === '/select-role';

  if (!hasValidRole && !isRolePage) {
    return <Navigate to="/role-selection" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {

  const { currentUser, isAuthLoading, profile } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <PageLoadingFallback />
      </div>
    );
  }

  // Determine if onboarding is complete
  const isProfileIncomplete = !profile || !profile.onboardingCompleted;

  // Render verified certificate as public bypass
  const isPublicRoute = window.location.pathname.startsWith('/verify-certificate');

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        
        {/* Ethical Notice Banner */}
        <EthicalNoticeBanner />

        {isPublicRoute ? (
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto">
              <Suspense fallback={<PageLoadingFallback />}>
                <Routes>
                  <Route path="/verify-certificate/:certId" element={<VerifyCertificatePage />} />
                  <Route path="/verify-certificate" element={<VerifyCertificatePage />} />
                  <Route path="*" element={<Navigate to="/verify-certificate" replace />} />
                </Routes>
              </Suspense>
            </div>
          </main>
        ) : !currentUser ? (
          /* Locked Out State: Sign In Required */
          <main className="flex-1 flex items-center justify-center p-4">
            <Suspense fallback={<PageLoadingFallback />}>
              <WelcomeSignInPage />
            </Suspense>
          </main>
        ) : isProfileIncomplete ? (
          /* Lock into Onboarding Wizard */
          <main className="flex-1 flex items-center justify-center p-4">
            <Suspense fallback={<PageLoadingFallback />}>
              <OnboardingPage />
            </Suspense>
            <AmanVoiceGuide />
          </main>
        ) : (
          /* Standard Academy Experience */
          <>
            <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
            <div className="flex-1 flex overflow-hidden">
              <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
              
              <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
                <div className="max-w-7xl mx-auto">
                  <ErrorBoundary fallbackTitle="TRAINING WORKSPACE RECOVERY" fallbackMessage="An error occurred while loading this view. Your session, progress, and certificates are safe.">
                    <Suspense fallback={<PageLoadingFallback />}>
                      <RoleGuard>
                        <Routes>
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                          <Route path="/dashboard" element={<DashboardPage />} />
                          <Route path="/select-role" element={<RoleSelectionPage />} />
                          <Route path="/role-selection" element={<RoleSelectionPage />} />
                          <Route path="/roles" element={<CareerRolesPage />} />
                          <Route path="/career-roles" element={<CareerRolesPage />} />
                          <Route path="/roadmap" element={<RoadmapPage />} />
                          <Route path="/modules" element={<CyberLabModulesListPage />} />
                          <Route path="/modules/:moduleId" element={<CyberLabModuleRunnerPage />} />
                          <Route path="/learn/modules" element={<CyberLabModulesListPage />} />
                          <Route path="/learn/module/:moduleId" element={<CyberLabModuleRunnerPage />} />
                          <Route path="/learning-path" element={<LearningPathPage />} />
                          <Route path="/video-learning" element={<VideoLearningPage />} />
                          <Route path="/academy" element={<VideoLearningPage />} />
                          <Route path="/academy/:videoId" element={<VideoLearningPage />} />
                          <Route path="/videos" element={<Navigate to="/academy" replace />} />
                          <Route path="/learn/videos" element={<Navigate to="/academy" replace />} />
                          <Route path="/practice" element={<PracticeHubPage />} />
                          <Route path="/rooms" element={<TryHackMeRoomsPage />} />
                          <Route path="/tryhackme" element={<TryHackMeRoomsPage />} />
                          <Route path="/practice/rooms" element={<TryHackMeRoomsPage />} />
                          <Route path="/practice/subnetting" element={<SubnettingTrainerPage />} />
                          <Route path="/subnetting-trainer" element={<Navigate to="/practice/subnetting" replace />} />
                          <Route path="/practice/soc-simulator" element={<SocSimulatorPage />} />
                          <Route path="/soc-simulator" element={<Navigate to="/practice/soc-simulator" replace />} />
                          <Route path="/practice/threat-hunting" element={<ThreatHuntingPage />} />
                          <Route path="/threat-hunting" element={<Navigate to="/practice/threat-hunting" replace />} />
                          <Route path="/practice/web-security" element={<WebSecurityLabPage />} />
                          <Route path="/web-security" element={<Navigate to="/practice/web-security" replace />} />
                          <Route path="/practice/security-tools" element={<SecurityToolsPage />} />
                          <Route path="/security-tools" element={<Navigate to="/practice/security-tools" replace />} />
                          <Route path="/ctf" element={<Navigate to="/ctf-arena" replace />} />
                          <Route path="/study-plan" element={<Navigate to="/ai-study-plan" replace />} />
                          <Route path="/career-portfolio" element={<Navigate to="/portfolio" replace />} />
                          <Route path="/ace-engagement" element={<Navigate to="/ace" replace />} />
                          <Route path="/practice/real-cases" element={<RealCasesPage />} />
                          <Route path="/real-cases" element={<RealCasesPage />} />
                          <Route path="/case-studies" element={<RealCaseStudyPage />} />
                          <Route path="/attackbox" element={<AttackBoxPage />} />
                          <Route path="/teams" element={<TeamsPage />} />
                          <Route path="/real-incidents" element={<RealWorldIncidentsPage />} />
                          <Route path="/live-incidents" element={<LiveIncidentPage />} />
                          <Route path="/command-center" element={<EthicalHackerCommandCenterPage />} />
                          <Route path="/ethical-hacker-command-center" element={<EthicalHackerCommandCenterPage />} />
                          <Route path="/investigation-board" element={<InvestigationBoardPage />} />
                          <Route path="/investigation-center" element={<InvestigationCenterPage />} />
                          <Route path="/skill-library" element={<SkillLibraryPage />} />
                          <Route path="/master-cyber-range" element={<MasterCyberRangePage />} />
                          <Route path="/missions" element={<MissionsPage />} />
                          <Route path="/network-lab" element={<NetworkLabPage />} />
                          <Route path="/linux-lab" element={<LinuxLabPage />} />
                          <Route path="/cyber-range" element={<CyberRangePage />} />
                          <Route path="/ctf-arena" element={<CtfArenaPage />} />
                          <Route path="/ai-mentor" element={<AiMentorPage />} />
                          <Route path="/aman" element={<Navigate to="/ai-mentor" replace />} />
                          <Route path="/ai-study-plan" element={<AiStudyPlanPage />} />
                          <Route path="/skill-tree" element={<SkillTreePage />} />
                          <Route path="/achievements" element={<AchievementsPage />} />
                          <Route path="/notebook" element={<NotebookPage />} />
                          <Route path="/certificate" element={<CertificatePage />} />
                          <Route path="/verify-certificate" element={<VerifyCertificatePage />} />
                          <Route path="/verify-certificate/:certId" element={<VerifyCertificatePage />} />
                          <Route path="/visualizer" element={<NetworkVisualizerPage />} />
                          <Route path="/portfolio" element={<CareerPortfolioPage />} />
                          <Route path="/career-simulation" element={<CareerSimulationPage />} />
                          <Route path="/job-readiness" element={<CareerSimulationPage />} />
                          <Route path="/simulation" element={<CareerSimulationPage />} />
                          <Route path="/security-report" element={<SecurityReportPage />} />
                          <Route path="/ace" element={<AuthorizedClientEngagementPage />} />
                          <Route path="/ace-simulator" element={<AuthorizedClientEngagementPage />} />
                          <Route path="/client-engagement" element={<AuthorizedClientEngagementPage />} />
                          <Route path="/evidence-locker" element={<AuthorizedClientEngagementPage />} />
                          <Route path="/cheat-sheets" element={<CheatSheetsPage />} />
                          <Route path="/instructor" element={<InstructorDashboardPage />} />
                          <Route path="/rewards" element={<RewardsShopPage />} />
                          <Route path="/mistakes" element={<MistakesJournalPage />} />
                          <Route path="/my-mistakes" element={<MistakesJournalPage />} />
                          <Route path="/multi-tool" element={<MultiToolReasoningPage />} />
                          <Route path="/analytics" element={<LearningAnalyticsPage />} />
                          <Route path="/learning-health" element={<LearningAnalyticsPage />} />
                          <Route path="/exam-mode" element={<ExamModePage />} />
                          <Route path="/acquisition" element={<AcquisitionReadinessPage />} />
                          <Route path="/buyer-readiness" element={<AcquisitionReadinessPage />} />
                          <Route path="/admin" element={<AdminPage />} />
                          <Route path="/owner" element={<AdminPage />} />
                          <Route path="/dual-lens" element={<DualLensSimulatorPage />} />
                          <Route path="/live-battle" element={<DualLensSimulatorPage />} />
                          <Route path="/wargame" element={<AiWargameArenaPage />} />
                          <Route path="/demo" element={<DemoPage />} />
                          <Route path="/settings" element={<SettingsPage />} />
                          <Route path="/debug" element={import.meta.env.DEV ? <DebugPage /> : <Navigate to="/dashboard" replace />} />
                          <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                      </RoleGuard>
                    </Suspense>
                  </ErrorBoundary>
                </div>
              </main>
            </div>

            {/* Global Interactive Modals & Assistant */}
            <OnboardingModal />
            <LessonModal />
            <MissionModal />
            <SyncRestoreLoadingOverlay />
            <BetaTesterHud />
            <AskAmanDrawer />
            <AmanVoiceGuide />
          </>
        )}

      </div>
    </Router>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <Analytics />
      <AppContent />
    </AppProvider>
  );
};

export default App;
