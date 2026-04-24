/**
 * App.jsx - Main Application Component
 * Handles routing and authentication wrapping
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import JobsPage from './pages/JobsPage';
import InterviewPage from './pages/InterviewPage';
import InterviewSessionPage from './pages/InterviewSessionPage';
import ProfilePage from './pages/ProfilePage';
import RecruiterPage from './pages/RecruiterPage';
import FeedbackPage from './pages/FeedbackPage';
import ScreeningPage from './pages/ScreeningPage';
import SkillGapPage from './pages/SkillGapPage';

// Layout
import Layout from './components/common/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Protected Route wrapper
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <LoadingSpinner fullscreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public route (redirect if logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner fullscreen />;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Protected Routes - Wrapped in Layout */}
      <Route path="/dashboard" element={
        <ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>
      } />
      <Route path="/upload" element={
        <ProtectedRoute><Layout><UploadPage /></Layout></ProtectedRoute>
      } />
      <Route path="/analysis" element={
        <ProtectedRoute><Layout><AnalysisPage /></Layout></ProtectedRoute>
      } />
      <Route path="/analysis/:id" element={
        <ProtectedRoute><Layout><AnalysisPage /></Layout></ProtectedRoute>
      } />
      <Route path="/builder" element={
        <ProtectedRoute><Layout><ResumeBuilderPage /></Layout></ProtectedRoute>
      } />
      <Route path="/jobs" element={
        <ProtectedRoute><Layout><JobsPage /></Layout></ProtectedRoute>
      } />
      <Route path="/interview" element={
        <ProtectedRoute><Layout><InterviewPage /></Layout></ProtectedRoute>
      } />
      <Route path="/interview/:id" element={
        <ProtectedRoute><Layout><InterviewSessionPage /></Layout></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>
      } />
      <Route path="/feedback" element={
        <ProtectedRoute><Layout><FeedbackPage /></Layout></ProtectedRoute>
      } />
      <Route path="/screening" element={
        <ProtectedRoute><Layout><ScreeningPage /></Layout></ProtectedRoute>
      } />
      <Route path="/skill-gap" element={
        <ProtectedRoute><Layout><SkillGapPage /></Layout></ProtectedRoute>
      } />
      <Route path="/recruiter" element={
        <ProtectedRoute requiredRole="recruiter"><Layout><RecruiterPage /></Layout></ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500'
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#fff' }
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' }
            }
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
