import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Apply from './pages/public/Apply';
import Login from './pages/public/Login';
import SignUp from './pages/public/SignUp';
import Opportunities from './pages/public/Opportunities';
import OpportunityDetail from './pages/public/OpportunityDetail';
import Team from './pages/public/Team';
import Contact from './pages/public/Contact';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import ModulePage from './pages/ModulePage';
import Capstone from './pages/Capstone';
import TrackPage from './pages/TrackPage';
import TicketsBoard from './pages/TicketsBoard';
import Leaderboard from './pages/Leaderboard';
import ProgressCenter from './pages/ProgressCenter';
import ReadinessReviews from './pages/ReadinessReviews';
import Feedback from './pages/Feedback';
import Profile from './pages/Profile';
import MentorDashboard from './pages/MentorDashboard';
import InternManagement from './pages/InternManagement';
import MentorReviews from './pages/MentorReviews';
import ProjectReadiness from './pages/ProjectReadiness';
import ApplicantDashboard from './pages/ApplicantDashboard';
import AdminApplications from './pages/AdminApplications';
import AdminInterviews from './pages/AdminInterviews';
import AdminConversion from './pages/AdminConversion';
import AdminMentors from './pages/AdminMentors';
import AdminProjects from './pages/AdminProjects';
import AdminOpportunities from './pages/AdminOpportunities';
import ReadinessEvaluation from './pages/ReadinessEvaluation';
import NotificationCenter from './pages/NotificationCenter';
import NotificationSettings from './pages/NotificationSettings';
import AdminNotificationsDashboard from './pages/AdminNotificationsDashboard';
import AdminScreeningReport from './pages/AdminScreeningReport';
import AdminCompletionReport from './pages/AdminCompletionReport';
import InternPortfolio from './pages/InternPortfolio';
import MentorCompletionReview from './pages/MentorCompletionReview';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/opportunities/:opportunityId" element={<OpportunityDetail />} />
            <Route path="/apply/:opportunityId" element={<Apply />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Onboarding (intern+ only -- training-specific, not relevant pre-acceptance) */}
            <Route path="/onboarding" element={
              <ProtectedRoute roles={['intern', 'mentor', 'admin']}><Onboarding /></ProtectedRoute>
            } />

            {/* Any authenticated user, regardless of lifecycle stage */}
            <Route element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/profile" element={<Profile />} />
              <Route path="/applicant/dashboard" element={<ApplicantDashboard />} />
              <Route path="/notifications" element={<NotificationCenter />} />
              <Route path="/notifications/settings" element={<NotificationSettings />} />
            </Route>

            {/* Training/project app -- intern+ only. An applicant who hasn't
                been accepted yet has no training track assigned and is
                redirected away rather than reaching these screens. */}
            <Route element={
              <ProtectedRoute roles={['intern', 'mentor', 'admin']}>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/module/:moduleId" element={<ModulePage />} />
              <Route path="/capstone" element={<Capstone />} />
              <Route path="/track/:trackId" element={<TrackPage />} />
              <Route path="/tickets" element={<TicketsBoard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/progress-center" element={<ProgressCenter />} />
              <Route path="/readiness-reviews" element={<ReadinessReviews />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/portfolio" element={<InternPortfolio />} />
            </Route>

            {/* Admin routes (authenticated + admin role) */}
            <Route element={
              <ProtectedRoute roles={['admin']}>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/admin/applications" element={<AdminApplications />} />
              <Route path="/admin/interviews" element={<AdminInterviews />} />
              <Route path="/admin/conversion" element={<AdminConversion />} />
              <Route path="/admin/mentors" element={<AdminMentors />} />
              <Route path="/admin/projects" element={<AdminProjects />} />
              <Route path="/admin/opportunities" element={<AdminOpportunities />} />
              <Route path="/admin/notifications" element={<AdminNotificationsDashboard />} />
              <Route path="/admin/screening-report" element={<AdminScreeningReport />} />
              <Route path="/admin/completion-report" element={<AdminCompletionReport />} />
            </Route>

            {/* Mentor routes (authenticated + mentor/admin role) */}
            <Route element={
              <ProtectedRoute roles={['mentor', 'admin']}>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/mentor" element={<MentorDashboard />} />
              <Route path="/mentor/interns" element={<InternManagement />} />
              <Route path="/mentor/reviews" element={<MentorReviews />} />
              <Route path="/mentor/readiness" element={<ProjectReadiness />} />
              <Route path="/mentor/evaluate" element={<ReadinessEvaluation />} />
              <Route path="/mentor/completion-review" element={<MentorCompletionReview />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
