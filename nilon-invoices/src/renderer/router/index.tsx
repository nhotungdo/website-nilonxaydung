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
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />; // Both roles now have access to dashboard
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
        
        {/* Protected Application Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Admin Only Routes */}
          <Route path="printers" element={<RoleRoute allowedRoles={['admin']}><PrintersPage /></RoleRoute>} />
          <Route path="settings" element={<RoleRoute allowedRoles={['admin']}><SettingsPage /></RoleRoute>} />
          <Route path="support" element={<RoleRoute allowedRoles={['admin']}><SupportPage /></RoleRoute>} />
          
          {/* Shared Routes (Admin & Staff) */}
          <Route path="dashboard" element={<RoleRoute allowedRoles={['admin', 'staff']}><DashboardPage /></RoleRoute>} />
          <Route path="orders" element={<RoleRoute allowedRoles={['admin', 'staff']}><RealtimeOrdersPage /></RoleRoute>} />
          <Route path="queue" element={<RoleRoute allowedRoles={['admin', 'staff']}><PrintQueuePage /></RoleRoute>} />
          <Route path="preview" element={<RoleRoute allowedRoles={['admin', 'staff']}><InvoicePreviewPage /></RoleRoute>} />
          <Route path="history" element={<RoleRoute allowedRoles={['admin', 'staff']}><OrderHistoryPage /></RoleRoute>} />
        </Route>

        {/* Fallback Redirection */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};
