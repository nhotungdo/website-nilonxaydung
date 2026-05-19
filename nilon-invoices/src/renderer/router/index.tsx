import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { SplashScreen } from '../pages/Splash/SplashScreen';
import { LoginPage } from '../pages/Login/LoginPage';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { RealtimeOrdersPage } from '../pages/Orders/RealtimeOrdersPage';
import { PrintQueuePage } from '../pages/Queue/PrintQueuePage';
import { PrintersPage } from '../pages/Printers/PrintersPage';
import { InvoicePreviewPage } from '../pages/Preview/InvoicePreviewPage';
import { OrderHistoryPage } from '../pages/History/OrderHistoryPage';
import { SettingsPage } from '../pages/Settings/SettingsPage';
import { SupportPage } from '../pages/Support/SupportPage';
import { useAuthStore } from '../stores/authStore';

// Route Guard to verify connection authorization
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AppRouter: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Splash Landing Screen */}
        <Route path="/" element={<SplashScreen />} />
        
        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Dashboard Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="orders" element={<RealtimeOrdersPage />} />
          <Route path="queue" element={<PrintQueuePage />} />
          <Route path="printers" element={<PrintersPage />} />
          <Route path="preview" element={<InvoicePreviewPage />} />
          <Route path="history" element={<OrderHistoryPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="support" element={<SupportPage />} />
        </Route>

        {/* Fallback Redirection */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};
