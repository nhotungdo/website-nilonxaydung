import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Printer, Eye, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { GlassCard } from '../../components/GlassCard';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { SearchInput } from '../../components/SearchInput';
import { useOrderStore } from '../../stores/orderStore';
import { usePrinterStore } from '../../stores/printerStore';
import { useQueueStore } from '../../stores/queueStore';
export const OrderHistoryPage = () => {
    const navigate = useNavigate();
    const { orders } = useOrderStore();
    const printers = usePrinterStore((s) => s.printers);
    const { jobs, reprintJob } = useQueueStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [printerFilter, setPrinterFilter] = useState('ALL');
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const getOrderStatus = (orderId) => {
        const relatedJob = jobs.find((j) => j.order_id === orderId);
        return relatedJob ? relatedJob.status : 'PENDING';
    };
    const getPrinterName = (orderId) => {
        const relatedJob = jobs.find((j) => j.order_id === orderId);
        if (!relatedJob)
            return 'Unrouted';
        const printer = printers.find((p) => p.id === relatedJob.printer_id);
        return printer ? printer.name : 'Thermal Spooler';
    };
    const getPrintedAt = (orderId) => {
        const relatedJob = jobs.find((j) => j.order_id === orderId);
        if (!relatedJob || !relatedJob.printed_at)
            return 'N/A';
        return new Date(relatedJob.printed_at).toLocaleTimeString();
    };
    // Filtering
    const filteredOrders = orders.filter((order) => {
        const status = getOrderStatus(order.id);
        const printerId = jobs.find((j) => j.order_id === order.id)?.printer_id || '';
        const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || status === statusFilter;
        const matchesPrinter = printerFilter === 'ALL' || printerId === printerFilter;
        return matchesSearch && matchesStatus && matchesPrinter;
    });
    // Pagination bounds
    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageHeader, { title: "Spooler Order History", subtitle: "Search and reprint historical invoice telemetry records in SQLite logs." }), _jsxs(GlassCard, { className: "border-white/5 p-4 flex flex-col md:flex-row md:items-center gap-4", children: [_jsx(SearchInput, { value: searchTerm, onChange: setSearchTerm, placeholder: "Search by customer, order code, or ID...", className: "flex-1" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Filter, { className: "h-4 w-4 text-slate-500" }), _jsxs("select", { value: statusFilter, onChange: (e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }, className: "px-3 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/40", children: [_jsx("option", { value: "ALL", children: "All Statuses" }), _jsx("option", { value: "PENDING", children: "Pending Spools" }), _jsx("option", { value: "PRINTING", children: "Printing" }), _jsx("option", { value: "SUCCESS", children: "Success" }), _jsx("option", { value: "FAILED", children: "Failed" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Printer, { className: "h-4 w-4 text-slate-500" }), _jsxs("select", { value: printerFilter, onChange: (e) => {
                                    setPrinterFilter(e.target.value);
                                    setCurrentPage(1);
                                }, className: "px-3 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/40", children: [_jsx("option", { value: "ALL", children: "All Printers" }), printers.map((p) => (_jsx("option", { value: p.id, children: p.name }, p.id)))] })] })] }), _jsxs(GlassCard, { className: "border-white/5 p-0 overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left text-sm border-collapse text-slate-300", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-white/5 bg-white/[0.02] text-slate-400 text-xs font-bold uppercase tracking-wider", children: [_jsx("th", { className: "py-4 px-6", children: "Order ID" }), _jsx("th", { className: "py-4 px-6", children: "Customer" }), _jsx("th", { className: "py-4 px-6", children: "Total Amount" }), _jsx("th", { className: "py-4 px-6", children: "Printer" }), _jsx("th", { className: "py-4 px-6", children: "Status" }), _jsx("th", { className: "py-4 px-6", children: "Printed At" }), _jsx("th", { className: "py-4 px-6 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-white/5", children: currentOrders.map((order) => {
                                        const status = getOrderStatus(order.id);
                                        return (_jsxs("tr", { className: "hover:bg-white/[0.01] transition-colors", children: [_jsx("td", { className: "py-4 px-6 font-mono text-xs text-blue-400 font-semibold", children: order.orderCode }), _jsx("td", { className: "py-4 px-6 font-bold text-white", children: order.customerName }), _jsx("td", { className: "py-4 px-6 font-semibold text-slate-300", children: formatCurrency(order.totalAmount) }), _jsx("td", { className: "py-4 px-6 text-xs text-slate-400", children: getPrinterName(order.id) }), _jsx("td", { className: "py-4 px-6", children: _jsx(StatusBadge, { status: status }) }), _jsx("td", { className: "py-4 px-6 font-mono text-xs text-slate-500", children: getPrintedAt(order.id) }), _jsxs("td", { className: "py-4 px-6 text-right space-x-2", children: [_jsx("button", { onClick: () => navigate('/preview'), className: "p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors", title: "View Receipt Preview", children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => reprintJob(order.id), className: "p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors", title: "Reprint Spool", children: _jsx(RotateCcw, { className: "h-4 w-4" }) })] })] }, order.id));
                                    }) })] }) }), _jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-t border-white/5 bg-white/[0.005]", children: [_jsxs("span", { className: "text-xs text-slate-400", children: ["Showing ", _jsx("span", { className: "font-bold text-white", children: startIndex + 1 }), " to", ' ', _jsx("span", { className: "font-bold text-white", children: Math.min(startIndex + itemsPerPage, filteredOrders.length) }), ' ', "of ", _jsx("span", { className: "font-bold text-white", children: filteredOrders.length }), " invoices"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => setCurrentPage(Math.max(1, currentPage - 1)), disabled: currentPage === 1, className: "p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-white/5 transition-colors", children: _jsx(ArrowLeft, { className: "h-4 w-4" }) }), _jsxs("span", { className: "text-xs font-bold text-white font-mono", children: [currentPage, " / ", totalPages] }), _jsx("button", { onClick: () => setCurrentPage(Math.min(totalPages, currentPage + 1)), disabled: currentPage === totalPages, className: "p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-white/5 transition-colors", children: _jsx(ArrowRight, { className: "h-4 w-4" }) })] })] })] })] }));
};
