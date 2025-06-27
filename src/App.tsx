import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { EventProvider } from './context/EventContext';
import { NotificationProvider } from './context/NotificationContext';
import { AlertManagerProvider } from './components/AlertManager';
import { PromptManager } from './components/PromptManager';
import { useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import CursorEffect from './components/CursorEffect';
import LoadingSpinner from './components/LoadingSpinner';
import AccountsPopup from './components/AccountsPopup';
import Layout from './components/layout/Layout';
import Hero from './pages/Hero';
import Login from './pages/Login';
import Register from './pages/Register';
import PendingApproval from './pages/PendingApproval';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import EventForm from './pages/EventForm';
import EventDetails from './pages/EventDetails';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import './styles/globals.css';
import { discordLogger } from './services/DiscordLogger';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'teacher' | 'student';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // DISABLED: Approval checks disabled for testing
  // Check approval status - only teachers need approval
  // if (user.role === 'teacher' && user.approvalStatus === 'pending') {
  //   return <Navigate to="/pending-approval" replace />;
  // }

  // if (user.approvalStatus === 'denied') {
  //   return <Navigate to="/" replace />;
  // }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// App Content Component
const AppContent: React.FC = () => {
  const { getAllAccounts } = useAuth();
  const [showAccountsPopup, setShowAccountsPopup] = useState(false);

  // Log website visit on first load
  useEffect(() => {
    discordLogger.logWebsiteVisit({
      ip: 'N/A', // Can't get real IP from client-side JS
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+H to show accounts popup
      if (event.ctrlKey && event.key === 'h') {
        event.preventDefault();
        setShowAccountsPopup(true);
      }
      
      // Escape to close popup
      if (event.key === 'Escape') {
        setShowAccountsPopup(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Router>
      <CursorEffect />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        
        {/* Protected Routes with Layout */}
        <Route path="/dashboard" element={<Layout />}>
          <Route 
            path="teacher" 
            element={
              <ProtectedRoute requiredRole="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="student" 
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="event/new" 
            element={
              <ProtectedRoute requiredRole="teacher">
                <EventForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="event/edit/:id" 
            element={
              <ProtectedRoute requiredRole="teacher">
                <EventForm />
              </ProtectedRoute>
            } 
          />
          <Route path="event/:id" element={<EventDetails />} />
        </Route>
        
        {/* Public Event Details */}
        <Route path="/event/:id" element={<EventDetails />} />
        
        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Accounts Popup */}
      <AccountsPopup
        isOpen={showAccountsPopup}
        onClose={() => setShowAccountsPopup(false)}
        accounts={getAllAccounts()}
      />
    </Router>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <NotificationProvider>
              <EventProvider>
                <AlertManagerProvider>
                  <PromptManager>
                    <Suspense fallback={<LoadingSpinner fullScreen text="Loading AtlasMeet..." />}>
                      <AppContent />
                    </Suspense>
                  </PromptManager>
                </AlertManagerProvider>
              </EventProvider>
            </NotificationProvider>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
