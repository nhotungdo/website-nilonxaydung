import { jsx as _jsx } from "react/jsx-runtime";
export const GlassCard = ({ children, className = '', glowColor = 'none', onClick }) => {
    const glowClasses = {
        brand: 'neon-glow-brand border-blue-500/20',
        success: 'neon-glow-success border-emerald-500/20',
        warning: 'neon-glow-warning border-amber-500/20',
        error: 'neon-glow-error border-red-500/20',
        none: 'border-white/5'
    };
    const interactiveClasses = onClick
        ? 'cursor-pointer hover:border-white/10 hover:bg-white/[0.03] active:scale-[0.99]'
        : '';
    return (_jsx("div", { onClick: onClick, className: `relative rounded-2xl border bg-gradient-to-br from-white/[0.04] to-transparent p-5 backdrop-blur-md transition-all duration-300 ${glowClasses[glowColor]} ${interactiveClasses} ${className}`, children: children }));
};
