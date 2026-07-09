import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { EmergencyProvider } from './contexts/EmergencyContext';
import { ThreatProvider } from './contexts/ThreatContext';
import { SettingsProvider } from './contexts/SettingsContext';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OfflinePage } from './pages/OfflinePage';

// Private Dashboard Pages
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { ContactsPage } from './pages/ContactsPage';
import { GpsTrackingPage } from './pages/GpsTrackingPage';
import { UnsafeZonesPage } from './pages/UnsafeZonesPage';
import { VoiceAssistantPage } from './pages/VoiceAssistantPage';
import { SosPage } from './pages/SosPage';
import { AlertHistoryPage } from './pages/AlertHistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Private Route Guard Component
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
};

// Public Route Guard (Redirects to dashboard if logged in)
const PublicOnlyRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/dashboard" replace /> : children;
};

function AppContent() {
  return (
    <Router>
      <Routes>
        
        {/* Public Marketing/Info Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/offline" element={<OfflinePage />} />
          
          {/* Public Auth Routes */}
          <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
          <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>} />
          
          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Private Shield/Safety Routes */}
        <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/tracking" element={<GpsTrackingPage />} />
          <Route path="/unsafezones" element={<UnsafeZonesPage />} />
          <Route path="/voice" element={<VoiceAssistantPage />} />
          <Route path="/sos" element={<SosPage />} />
          <Route path="/alerts" element={<AlertHistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>

      </Routes>
    </Router>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <EmergencyProvider>
          <ThreatProvider>
            <AppContent />
          </ThreatProvider>
        </EmergencyProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
