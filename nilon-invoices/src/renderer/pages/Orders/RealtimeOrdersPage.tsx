import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Eye, HeartHandshake } from 'lucide-react';
import { GlassCard } from '../../components/GlassCard';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { useOrderStore } from '../../stores/orderStore';
import { useQueueStore } from '../../stores/queueStore';
import { useTranslation } from '../../locales';

export const RealtimeOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { orders, fetchOrders } = useOrderStore();
  const { jobs, reprintJob, fetchJobs } = useQueueStore();

  React.useEffect(() => {
    fetchOrders();
    fetchJobs();
  }, []);

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
        title={t('orders.title')}
        subtitle={t('orders.subtitle')}
      />

      {/* Grid containing orders cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence initial={false}>
          {orders.length > 0 ? (
            orders.map((order) => {
              const status = getOrderStatus(order.id);
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <GlassCard className="flex flex-col h-full justify-between relative overflow-hidden group">
                    {/* Neon border highlight for printing state */}
                    {status === 'PRINTING' && (
                      <div className="absolute inset-0 border border-amber-500/50 rounded-2xl pointer-events-none animate-pulse"></div>
                    )}

                    {/* Header info */}
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                        <div>
                          <span className="text-xs font-bold text-[#005B52] font-mono tracking-wider">{order.orderCode}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <StatusBadge status={status} />
                      </div>

                      <div className="space-y-2">
                        <span className="text-sm font-bold text-slate-800 block truncate">{order.customerName}</span>
                        
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <HeartHandshake className="h-3.5 w-3.5 text-slate-400" />
                          <span>{t('orders.phone')}: {order.customerPhone}</span>
                        </div>

                        {/* Items list preview */}
                        <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs text-slate-600">
                              <span className="truncate max-w-[150px]">{item.name}</span>
                              <span className="font-semibold text-slate-700">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer & Actions */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                        <span className="text-xs text-slate-500">{t('orders.totalBillAmount')}:</span>
                        <span className="text-lg font-black text-slate-900">{formatCurrency(order.totalAmount)}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {/* Print Action */}
                        <button
                          onClick={() => handlePrintNow(order.id)}
                          disabled={status === 'PRINTING'}
                          className="col-span-2 py-2 rounded-lg text-xs font-bold bg-[#005B52] hover:bg-[#00473F] disabled:bg-[#005B52]/40 text-white flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-[#005B52]/10"
                        >
                          <Printer className="h-3.5 w-3.5" />
                          {status === 'PRINTING' ? t('orders.printing') : t('orders.printNow')}
                        </button>

                        {/* Preview Action */}
                        <button
                          onClick={() => navigate('/preview')}
                          className="py-2 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm flex items-center justify-center gap-1 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          {t('orders.preview')}
                        </button>
                      </div>
                    </div>

                  </GlassCard>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full">
              <EmptyState
                title={t('empty.waitingOrders')}
                description={t('empty.waitingOrders')}
              />
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
