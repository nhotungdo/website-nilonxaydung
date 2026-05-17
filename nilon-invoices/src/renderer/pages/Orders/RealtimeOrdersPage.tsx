import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Eye, Volume2, VolumeX, HeartHandshake } from 'lucide-react';
import { GlassCard } from '../../components/GlassCard';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { useOrderStore } from '../../stores/orderStore';
import { useQueueStore } from '../../stores/queueStore';

export const RealtimeOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders, soundEnabled, toggleSound } = useOrderStore();
  const { jobs, reprintJob } = useQueueStore();

  const getOrderStatus = (orderId: string) => {
    const relatedJob = jobs.find((j) => j.order_id === orderId);
    return relatedJob ? relatedJob.status : 'PENDING';
  };

  const handlePrintNow = async (orderId: string) => {
    // Spawns/reprints a print job in the queue
    await reprintJob(orderId);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <PageHeader
        title="Real-time Socket Orders"
        subtitle="Monitor incoming invoices from NestJS API. Fully automated printing spools."
        actions={
          <div className="flex items-center gap-2">
            {/* Chime indicators */}
            <button
              onClick={toggleSound}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-blue-400" />
                  Alert Sound: ON
                </>
              ) : (
                <>
                  <VolumeX className="h-3.5 w-3.5 text-slate-500" />
                  Alert Sound: MUTED
                </>
              )}
            </button>
          </div>
        }
      />

      {/* Grid containing orders cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence initial={false}>
          {orders.map((order) => {
            const status = getOrderStatus(order.id);
            
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <GlassCard className="border-white/5 flex flex-col h-full justify-between relative overflow-hidden group">
                  {/* Neon border highlight for printing state */}
                  {status === 'PRINTING' && (
                    <div className="absolute inset-0 border border-amber-500/30 rounded-2xl pointer-events-none animate-pulse"></div>
                  )}

                  {/* Header info */}
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                      <div>
                        <span className="text-xs font-bold text-blue-400 font-mono tracking-wider">{order.orderCode}</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <StatusBadge status={status} />
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-bold text-white block truncate">{order.customerName}</span>
                      
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <HeartHandshake className="h-3.5 w-3.5 text-slate-500" />
                        <span>Phone: {order.customerPhone}</span>
                      </div>

                      {/* Items list preview */}
                      <div className="mt-3 p-2.5 rounded-xl bg-white/[0.01] border border-white/5 space-y-1.5">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs text-slate-400">
                            <span className="truncate max-w-[150px]">{item.name}</span>
                            <span>x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4">
                      <span className="text-xs text-slate-400">Total Bill Amount:</span>
                      <span className="text-lg font-black text-white">{formatCurrency(order.totalAmount)}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {/* Print Action */}
                      <button
                        onClick={() => handlePrintNow(order.id)}
                        disabled={status === 'PRINTING'}
                        className="col-span-2 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/30 text-white flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-blue-500/10"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        {status === 'PRINTING' ? 'Printing...' : 'Print Now'}
                      </button>

                      {/* Preview Action */}
                      <button
                        onClick={() => navigate('/preview')}
                        className="py-2 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center gap-1 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Preview
                      </button>
                    </div>
                  </div>

                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
};
