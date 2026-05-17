import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const LoadingSpinner = ({ size = 'md', fullPage = false, label = 'Loading...' }) => {
    const sizeClasses = {
        sm: 'h-6 w-6 border-2',
        md: 'h-10 w-10 border-2',
        lg: 'h-16 w-16 border-3'
    };
    const spinner = (_jsxs("div", { className: "flex flex-col items-center justify-center gap-3", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: `absolute inset-0 rounded-full bg-blue-500/20 blur-md ${size === 'lg' ? 'scale-125' : ''}` }), _jsx("div", { className: `animate-spin rounded-full border-current border-t-transparent text-blue-500 relative ${sizeClasses[size]}` })] }), label && _jsx("span", { className: "text-sm font-semibold tracking-wider text-slate-400 uppercase", children: label })] }));
    if (fullPage) {
        return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md", children: spinner }));
    }
    return (_jsx("div", { className: "flex items-center justify-center p-8", children: spinner }));
};
