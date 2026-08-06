import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';

const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const Apply = lazy(() => import('./pages/public/Apply'));
const CreateAccount = lazy(() => import('./pages/public/CreateAccount'));
const Login = lazy(() => import('./pages/public/Login'));
const SignUp = lazy(() => import('./pages/public/SignUp'));
const Opportunities = lazy(() => import('./pages/public/Opportunities'));
const OpportunityDetail = lazy(() => import('./pages/public/OpportunityDetail'));
const Team = lazy(() => import('./pages/public/Team'));
const Contact = lazy(() => import('./pages/public/Contact'));
const ProjectsInfo = lazy(() => import('./pages/public/ProjectsInfo'));
const OpportunitiesInfo = lazy(() => import('./pages/public/OpportunitiesInfo'));
const MentorshipInfo = lazy(() => import('./pages/public/MentorshipInfo'));
const PortfolioInfo = lazy(() => import('./pages/public/PortfolioInfo'));
const CareersInfo = lazy(() => import('./pages/public/CareersInfo'));
const CommunityInfo = lazy(() => import('./pages/public/CommunityInfo'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ModulePage = lazy(() => import('./pages/ModulePage'));
const Capstone = lazy(() => import('./pages/Capstone'));
const TrackPage = lazy(() => import('./pages/TrackPage'));
const TicketsBoard = lazy(() => import('./pages/TicketsBoard'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const ProgressCenter = lazy(() => import('./pages/ProgressCenter'));
const ReadinessReviews = lazy(() => import('./pages/ReadinessReviews'));
const Feedback = lazy(() => import('./pages/Feedback'));
const Profile = lazy(() => import('./pages/Profile'));
const MentorDashboard = lazy(() => import('./pages/MentorDashboard'));
const InternManagement = lazy(() => import('./pages/InternManagement'));
const MentorReviews = lazy(() => import('./pages/MentorReviews'));
const ProjectReadiness = lazy(() => import('./pages/ProjectReadiness'));
const ApplicantExperience = lazy(() => import('./applicant/ApplicantExperience'));
const BrowseOpportunities = lazy(() => import('./applicant/pages/BrowseOpportunities'));
const AdminApplications = lazy(() => import('./pages/AdminApplications'));
const AdminInterviews = lazy(() => import('./pages/AdminInterviews'));
const AdminConversion = lazy(() => import('./pages/AdminConversion'));
const AdminMentors = lazy(() => import('./pages/AdminMentors'));
const AdminTracks = lazy(() => import('./pages/AdminTracks'));
const AdminProjects = lazy(() => import('./pages/AdminProjects'));
const AdminOpportunities = lazy(() => import('./pages/AdminOpportunities'));
const ReadinessEvaluation = lazy(() => import('./pages/ReadinessEvaluation'));
const NotificationCenter = lazy(() => import('./pages/NotificationCenter'));
const NotificationSettings = lazy(() => import('./pages/NotificationSettings'));
const AdminNotificationsDashboard = lazy(() => import('./pages/AdminNotificationsDashboard'));
const AdminScreeningReport = lazy(() => import('./pages/AdminScreeningReport'));
const AdminCompletionReport = lazy(() => import('./pages/AdminCompletionReport'));
const InternPortfolio = lazy(() => import('./pages/InternPortfolio'));
const MentorCompletionReview = lazy(() => import('./pages/MentorCompletionReview'));

// Each route now ships its own chunk instead of one 1.2MB bundle for every
// page -- without this, the login screen had to download and parse every
// admin/mentor/intern/applicant page (plus GSAP) before it could render.
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-6 h-6 border-2 border-line border-t-primary rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
          <Routes>

            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/opportunities/:opportunityId" element={<OpportunityDetail />} />
            <Route path="/apply/:opportunityId/create-account" element={<CreateAccount />} />
            <Route path="/apply/:opportunityId" element={<Apply />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/projects-info" element={<ProjectsInfo />} />
            <Route path="/opportunities-info" element={<OpportunitiesInfo />} />
            <Route path="/mentorship-info" element={<MentorshipInfo />} />
            <Route path="/portfolio-info" element={<PortfolioInfo />} />
            <Route path="/careers" element={<CareersInfo />} />
            <Route path="/community-info" element={<CommunityInfo />} />

            {/* Onboarding (intern+ only -- training-specific, not relevant pre-acceptance) */}
            <Route path="/onboarding" element={
              <ProtectedRoute roles={['intern', 'mentor', 'admin']}><Onboarding /></ProtectedRoute>
            } />

            {/* Applicant Experience -- deliberately outside <Layout>: no
                sidebar, no admin-portal chrome. A single stage-driven page
                that owns its own minimal header. */}
            <Route path="/applicant" element={
              <ProtectedRoute><ApplicantExperience /></ProtectedRoute>
            } />
            <Route path="/applicant/opportunities" element={
              <ProtectedRoute><BrowseOpportunities /></ProtectedRoute>
            } />

            {/* Any authenticated user, regardless of lifecycle stage */}
            <Route element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/profile" element={<Profile />} />
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
              <Route path="/admin/tracks" element={<AdminTracks />} />
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
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
