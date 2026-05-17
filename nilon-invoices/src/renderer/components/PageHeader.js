import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const PageHeader = ({ title, subtitle, actions }) => {
    return (_jsxs("div", { className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between pb-6 border-b border-white/5 mb-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-white", children: title }), subtitle && _jsx("p", { className: "text-sm text-slate-400 mt-1", children: subtitle })] }), actions && (_jsx("div", { className: "flex items-center gap-3 mt-4 md:mt-0", children: actions }))] }));
};
