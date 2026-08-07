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
const TrainingLayout = lazy(() => import('./training/components/TrainingLayout'));
const TrainingDashboard = lazy(() => import('./training/pages/Dashboard'));
const LearningPath = lazy(() => import('./training/pages/LearningPath'));
const ModuleViewer = lazy(() => import('./training/pages/ModuleViewer'));
const LessonViewer = lazy(() => import('./training/pages/LessonViewer'));
const Practice = lazy(() => import('./training/pages/Practice'));
const CodingWorkspace = lazy(() => import('./training/pages/CodingWorkspace'));
const Assessment = lazy(() => import('./training/pages/Assessment'));
const AssessmentResult = lazy(() => import('./training/pages/AssessmentResult'));
const Assignments = lazy(() => import('./training/pages/Assignments'));
const TrainingProgress = lazy(() => import('./training/pages/Progress'));
const TrainingMentor = lazy(() => import('./training/pages/Mentor'));
const Achievements = lazy(() => import('./training/pages/Achievements'));
const Resources = lazy(() => import('./training/pages/Resources'));
const Help = lazy(() => import('./training/pages/Help'));
const TrainingSettings = lazy(() => import('./training/pages/Settings'));
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

            {/* Training -- intern+ only. Config/mock-driven LMS skeleton
                (src/training/) -- a forte's real accepted opportunity picks
                which mock TrainingTrackConfig renders; no curriculum
                content or per-forte branching lives in these components.
                Owns its own chrome (TrainingLayout), not nested in the
                admin-style Layout/Sidebar, same reasoning as
                ApplicantExperience. The earlier real DB-backed
                training_tracks/training_modules system (019/039) and its
                AdminTracks admin UI are untouched and still live, just not
                reachable from these routes for now. */}
            <Route element={
              <ProtectedRoute roles={['intern', 'mentor', 'admin']}>
                <TrainingLayout />
              </ProtectedRoute>
            }>
              <Route path="/training" element={<TrainingDashboard />} />
              <Route path="/training/path" element={<LearningPath />} />
              <Route path="/training/module/:moduleId" element={<ModuleViewer />} />
              <Route path="/training/lesson/:lessonId" element={<LessonViewer />} />
              <Route path="/training/practice/:practiceId" element={<Practice />} />
              <Route path="/training/workspace/:practiceId" element={<CodingWorkspace />} />
              <Route path="/training/assessment/:assessmentId" element={<Assessment />} />
              <Route path="/training/assessment/:assessmentId/result" element={<AssessmentResult />} />
              <Route path="/training/assignment/:submissionId" element={<Assignments />} />
              <Route path="/training/progress" element={<TrainingProgress />} />
              <Route path="/training/mentor" element={<TrainingMentor />} />
              <Route path="/training/achievements" element={<Achievements />} />
              <Route path="/training/resources" element={<Resources />} />
              <Route path="/training/help" element={<Help />} />
              <Route path="/training/settings" element={<TrainingSettings />} />
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
