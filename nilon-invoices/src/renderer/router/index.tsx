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

// Main authentication guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Role-based route guard
const RoleRoute: React.FC<{ children: React.ReactNode; allowedRoles: ('admin' | 'staff')[] }> = ({ children, allowedRoles }) => {
  const user = useAuthStore((s) => s.user);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
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
        
        {/* Application Routes - Shared for Admin & Staff */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<RoleRoute allowedRoles={['admin', 'staff']}><DashboardPage /></RoleRoute>} />
          <Route path="orders" element={<RoleRoute allowedRoles={['admin', 'staff']}><RealtimeOrdersPage /></RoleRoute>} />
          <Route path="queue" element={<RoleRoute allowedRoles={['admin', 'staff']}><PrintQueuePage /></RoleRoute>} />
          <Route path="printers" element={<RoleRoute allowedRoles={['admin', 'staff']}><PrintersPage /></RoleRoute>} />
          <Route path="history" element={<RoleRoute allowedRoles={['admin', 'staff']}><OrderHistoryPage /></RoleRoute>} />
          <Route path="preview" element={<RoleRoute allowedRoles={['admin', 'staff']}><InvoicePreviewPage /></RoleRoute>} />
          <Route path="settings" element={<RoleRoute allowedRoles={['admin', 'staff']}><SettingsPage /></RoleRoute>} />
          <Route path="support" element={<RoleRoute allowedRoles={['admin', 'staff']}><SupportPage /></RoleRoute>} />
        </Route>

        {/* Fallback Redirection */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};
