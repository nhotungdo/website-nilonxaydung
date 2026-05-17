import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
export const MainLayout = () => {
    return (_jsxs("div", { className: "flex h-screen w-screen overflow-hidden bg-[#0A0D1A] text-white", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col h-full overflow-hidden", children: [_jsx(Topbar, {}), _jsx("main", { className: "flex-1 overflow-y-auto p-6 bg-gradient-to-br from-[#0F172A] via-[#090D1F] to-[#050712]", children: _jsx("div", { className: "mx-auto max-w-7xl h-full flex flex-col", children: _jsx(Outlet, {}) }) })] })] }));
};
