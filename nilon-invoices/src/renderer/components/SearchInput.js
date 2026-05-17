import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Search, X } from 'lucide-react';
export const SearchInput = ({ value, onChange, placeholder = 'Search invoices, orders...', className = '' }) => {
    return (_jsxs("div", { className: `relative flex items-center ${className}`, children: [_jsx(Search, { className: "absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" }), _jsx("input", { type: "text", value: value, onChange: (e) => onChange(e.target.value), placeholder: placeholder, className: "w-full pl-9 pr-8 py-2 text-sm bg-white/[0.02] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10 transition-all duration-200" }), value && (_jsx("button", { onClick: () => onChange(''), className: "absolute right-2.5 p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors", children: _jsx(X, { className: "h-3 w-3" }) }))] }));
};
