import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Filter, 
  Printer, 
  Eye, 
  ArrowLeft, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { GlassCard } from '../../components/GlassCard';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { SearchInput } from '../../components/SearchInput';
import { useOrderStore } from '../../stores/orderStore';
import { usePrinterStore } from '../../stores/printerStore';
import { useQueueStore } from '../../stores/queueStore';

export const OrderHistoryPage: React.FC = () => {
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

  const getOrderStatus = (orderId: string) => {
    const relatedJob = jobs.find((j) => j.order_id === orderId);
    return relatedJob ? relatedJob.status : 'PENDING';
  };

  const getPrinterName = (orderId: string) => {
    const relatedJob = jobs.find((j) => j.order_id === orderId);
    if (!relatedJob) return 'Unrouted';
    const printer = printers.find((p) => p.id === relatedJob.printer_id);
    return printer ? printer.name : 'Thermal Spooler';
  };

  const getPrintedAt = (orderId: string) => {
    const relatedJob = jobs.find((j) => j.order_id === orderId);
    if (!relatedJob || !relatedJob.printed_at) return 'N/A';
    return new Date(relatedJob.printed_at).toLocaleTimeString();
  };

  // Filtering
  const filteredOrders = orders.filter((order) => {
    const status = getOrderStatus(order.id);
    const printerId = jobs.find((j) => j.order_id === order.id)?.printer_id || '';
    
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <PageHeader
        title="Spooler Order History"
        subtitle="Search and reprint historical invoice telemetry records in SQLite logs."
      />

      {/* Filter and search bar controls */}
      <GlassCard className="border-white/5 p-4 flex flex-col md:flex-row md:items-center gap-4">
        
        {/* Search */}
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by customer, order code, or ID..."
          className="flex-1"
        />

        {/* Filter by Status */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/40"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Spools</option>
            <option value="PRINTING">Printing</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        {/* Filter by Printer */}
        <div className="flex items-center gap-2">
          <Printer className="h-4 w-4 text-slate-500" />
          <select
            value={printerFilter}
            onChange={(e) => {
              setPrinterFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 text-xs bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/40"
          >
            <option value="ALL">All Printers</option>
            {printers.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

      </GlassCard>

      {/* Grid containing historical orders */}
      <GlassCard className="border-white/5 p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse text-slate-300">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Total Amount</th>
                <th className="py-4 px-6">Printer</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Printed At</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentOrders.map((order) => {
                const status = getOrderStatus(order.id);
                return (
                  <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-blue-400 font-semibold">{order.orderCode}</td>
                    <td className="py-4 px-6 font-bold text-white">{order.customerName}</td>
                    <td className="py-4 px-6 font-semibold text-slate-300">{formatCurrency(order.totalAmount)}</td>
                    <td className="py-4 px-6 text-xs text-slate-400">{getPrinterName(order.id)}</td>
                    <td className="py-4 px-6">
                      <StatusBadge status={status} />
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-500">{getPrintedAt(order.id)}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {/* View */}
                      <button
                        onClick={() => navigate('/preview')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        title="View Receipt Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* Reprint */}
                      <button
                        onClick={() => reprintJob(order.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        title="Reprint Spool"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-white/[0.005]">
          <span className="text-xs text-slate-400">
            Showing <span className="font-bold text-white">{startIndex + 1}</span> to{' '}
            <span className="font-bold text-white">
              {Math.min(startIndex + itemsPerPage, filteredOrders.length)}
            </span>{' '}
            of <span className="font-bold text-white">{filteredOrders.length}</span> invoices
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-bold text-white font-mono">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-white/5 transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </GlassCard>

    </div>
  );
};
