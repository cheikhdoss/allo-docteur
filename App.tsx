
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import { AIChatWidget } from './components/AIChatWidget';
import { UserRole } from './types';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode, allowedRole?: UserRole }> = ({ children, allowedRole }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Redirect to correct dashboard if trying to access wrong one
    return <Navigate to={user.role === UserRole.DOCTOR ? '/doctor-dashboard' : '/patient-dashboard'} replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          <Route path="/patient-dashboard" element={
            <ProtectedRoute allowedRole={UserRole.PATIENT}>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/doctor-dashboard" element={
            <ProtectedRoute allowedRole={UserRole.DOCTOR}>
              <DoctorDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <AIChatWidget />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppRoutes />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}
