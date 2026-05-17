import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
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
import { FailedJobsPage } from '../pages/Failed/FailedJobsPage';
import { DiagnosticsPage } from '../pages/Diagnostics/DiagnosticsPage';
import { useAuthStore } from '../stores/authStore';
// Route Guard to verify connection authorization
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
export const AppRouter = () => {
    return (_jsx(HashRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(SplashScreen, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsxs(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(MainLayout, {}) }), children: [_jsx(Route, { path: "dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "orders", element: _jsx(RealtimeOrdersPage, {}) }), _jsx(Route, { path: "queue", element: _jsx(PrintQueuePage, {}) }), _jsx(Route, { path: "printers", element: _jsx(PrintersPage, {}) }), _jsx(Route, { path: "preview", element: _jsx(InvoicePreviewPage, {}) }), _jsx(Route, { path: "history", element: _jsx(OrderHistoryPage, {}) }), _jsx(Route, { path: "failed", element: _jsx(FailedJobsPage, {}) }), _jsx(Route, { path: "diagnostics", element: _jsx(DiagnosticsPage, {}) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }));
};
