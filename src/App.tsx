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

// Dynamic Code Splitting for Performance
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const CareerRolesPage = lazy(() => import('./pages/CareerRolesPage').then(m => ({ default: m.CareerRolesPage })));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage').then(m => ({ default: m.RoadmapPage })));
const LearningPathPage = lazy(() => import('./pages/LearningPathPage').then(m => ({ default: m.LearningPathPage })));
const PracticeHubPage = lazy(() => import('./pages/PracticeHubPage').then(m => ({ default: m.PracticeHubPage })));
const SubnettingTrainerPage = lazy(() => import('./pages/SubnettingTrainerPage').then(m => ({ default: m.SubnettingTrainerPage })));
const SocSimulatorPage = lazy(() => import('./pages/SocSimulatorPage').then(m => ({ default: m.SocSimulatorPage })));
const ThreatHuntingPage = lazy(() => import('./pages/ThreatHuntingPage').then(m => ({ default: m.ThreatHuntingPage })));
const WebSecurityLabPage = lazy(() => import('./pages/WebSecurityLabPage').then(m => ({ default: m.WebSecurityLabPage })));
const SecurityToolsPage = lazy(() => import('./pages/SecurityToolsPage').then(m => ({ default: m.SecurityToolsPage })));
const RealCasesPage = lazy(() => import('./pages/RealCasesPage').then(m => ({ default: m.RealCasesPage })));
const RealWorldIncidentsPage = lazy(() => import('./pages/RealWorldIncidentsPage').then(m => ({ default: m.RealWorldIncidentsPage })));
const InvestigationBoardPage = lazy(() => import('./pages/InvestigationBoardPage').then(m => ({ default: m.InvestigationBoardPage })));
const MasterCyberRangePage = lazy(() => import('./pages/MasterCyberRangePage').then(m => ({ default: m.MasterCyberRangePage })));
const MissionsPage = lazy(() => import('./pages/MissionsPage').then(m => ({ default: m.MissionsPage })));
const NetworkLabPage = lazy(() => import('./pages/NetworkLabPage').then(m => ({ default: m.NetworkLabPage })));
const LinuxLabPage = lazy(() => import('./pages/LinuxLabPage').then(m => ({ default: m.LinuxLabPage })));
const CyberRangePage = lazy(() => import('./pages/CyberRangePage').then(m => ({ default: m.CyberRangePage })));
const CtfArenaPage = lazy(() => import('./pages/CtfArenaPage').then(m => ({ default: m.CtfArenaPage })));
const AiMentorPage = lazy(() => import('./pages/AiMentorPage').then(m => ({ default: m.AiMentorPage })));
const AiStudyPlanPage = lazy(() => import('./pages/AiStudyPlanPage').then(m => ({ default: m.AiStudyPlanPage })));
const SkillTreePage = lazy(() => import('./pages/SkillTreePage').then(m => ({ default: m.SkillTreePage })));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage').then(m => ({ default: m.AchievementsPage })));
const NotebookPage = lazy(() => import('./pages/NotebookPage').then(m => ({ default: m.NotebookPage })));
const CertificatePage = lazy(() => import('./pages/CertificatePage').then(m => ({ default: m.CertificatePage })));
const VerifyCertificatePage = lazy(() => import('./pages/VerifyCertificatePage').then(m => ({ default: m.VerifyCertificatePage })));
const NetworkVisualizerPage = lazy(() => import('./pages/NetworkVisualizerPage').then(m => ({ default: m.NetworkVisualizerPage })));
const CareerPortfolioPage = lazy(() => import('./pages/CareerPortfolioPage').then(m => ({ default: m.CareerPortfolioPage })));
const SecurityReportPage = lazy(() => import('./pages/SecurityReportPage').then(m => ({ default: m.SecurityReportPage })));
const AuthorizedClientEngagementPage = lazy(() => import('./pages/AuthorizedClientEngagementPage').then(m => ({ default: m.AuthorizedClientEngagementPage })));
const CheatSheetsPage = lazy(() => import('./pages/CheatSheetsPage').then(m => ({ default: m.CheatSheetsPage })));
const InstructorDashboardPage = lazy(() => import('./pages/InstructorDashboardPage').then(m => ({ default: m.InstructorDashboardPage })));
const RewardsShopPage = lazy(() => import('./pages/RewardsShopPage').then(m => ({ default: m.RewardsShopPage })));
const MistakesJournalPage = lazy(() => import('./pages/MistakesJournalPage').then(m => ({ default: m.MistakesJournalPage })));
const MultiToolReasoningPage = lazy(() => import('./pages/MultiToolReasoningPage').then(m => ({ default: m.MultiToolReasoningPage })));
const LearningAnalyticsPage = lazy(() => import('./pages/LearningAnalyticsPage').then(m => ({ default: m.LearningAnalyticsPage })));
const ExamModePage = lazy(() => import('./pages/ExamModePage').then(m => ({ default: m.ExamModePage })));
const CyberLabModulesListPage = lazy(() => import('./pages/CyberLabModulesListPage').then(m => ({ default: m.CyberLabModulesListPage })));
const CyberLabModuleRunnerPage = lazy(() => import('./pages/CyberLabModuleRunnerPage').then(m => ({ default: m.CyberLabModuleRunnerPage })));
const LiveIncidentPage = lazy(() => import('./pages/LiveIncidentPage').then(m => ({ default: m.LiveIncidentPage })));
const EthicalHackerCommandCenterPage = lazy(() => import('./pages/EthicalHackerCommandCenterPage').then(m => ({ default: m.EthicalHackerCommandCenterPage })));
const TryHackMeRoomsPage = lazy(() => import('./pages/TryHackMeRoomsPage').then(m => ({ default: m.TryHackMeRoomsPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const RoleSelectionPage = lazy(() => import('./pages/RoleSelectionPage').then(m => ({ default: m.RoleSelectionPage })));
const InvestigationCenterPage = lazy(() => import('./pages/InvestigationCenterPage').then(m => ({ default: m.InvestigationCenterPage })));
const SkillLibraryPage = lazy(() => import('./pages/SkillLibraryPage').then(m => ({ default: m.SkillLibraryPage })));
const VideoLearningPage = lazy(() => import('./pages/VideoLearningPage').then(m => ({ default: m.VideoLearningPage })));
const CareerSimulationPage = lazy(() => import('./pages/CareerSimulationPage').then(m => ({ default: m.CareerSimulationPage })));
const AttackBoxPage = lazy(() => import('./pages/AttackBoxPage').then(m => ({ default: m.AttackBoxPage })));
const RealCaseStudyPage = lazy(() => import('./pages/RealCaseStudyPage').then(m => ({ default: m.RealCaseStudyPage })));
const TeamsPage = lazy(() => import('./pages/TeamsPage').then(m => ({ default: m.TeamsPage })));
const AcquisitionReadinessPage = lazy(() => import('./pages/AcquisitionReadinessPage').then(m => ({ default: m.AcquisitionReadinessPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const DualLensSimulatorPage = lazy(() => import('./pages/DualLensSimulatorPage').then(m => ({ default: m.DualLensSimulatorPage })));
const AiWargameArenaPage = lazy(() => import('./pages/AiWargameArenaPage').then(m => ({ default: m.AiWargameArenaPage })));
const DemoPage = lazy(() => import('./pages/DemoPage').then(m => ({ default: m.DemoPage })));
const DebugPage = lazy(() => import('./pages/DebugPage').then(m => ({ default: m.DebugPage })));

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
