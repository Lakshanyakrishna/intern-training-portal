import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Apply from './pages/public/Apply';
import Login from './pages/public/Login';
import SignUp from './pages/public/SignUp';
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
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter basename="/intern-training-portal">
          <Routes>

            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Onboarding (authenticated) */}
            <Route path="/onboarding" element={
              <ProtectedRoute><Onboarding /></ProtectedRoute>
            } />

            {/* Main app (authenticated, with sidebar) */}
            <Route element={
              <ProtectedRoute>
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
              <Route path="/profile" element={<Profile />} />
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
            </Route>

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
