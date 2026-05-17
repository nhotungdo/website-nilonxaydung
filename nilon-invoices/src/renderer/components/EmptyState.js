import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HelpCircle } from 'lucide-react';
export const EmptyState = ({ icon, title, description, action }) => {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.005] min-h-[300px]", children: [_jsx("div", { className: "flex items-center justify-center h-12 w-12 rounded-full bg-white/5 border border-white/10 text-slate-400 mb-4", children: icon || _jsx(HelpCircle, { className: "h-6 w-6" }) }), _jsx("h3", { className: "text-lg font-bold text-white mb-2", children: title }), _jsx("p", { className: "text-sm text-slate-400 max-w-sm mb-6", children: description }), action && (_jsx("div", { className: "flex justify-center", children: action }))] }));
};
