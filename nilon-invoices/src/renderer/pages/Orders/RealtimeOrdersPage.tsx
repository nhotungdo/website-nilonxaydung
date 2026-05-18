import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Eye, HeartHandshake, FileText, Bell, CheckCircle, AlertTriangle } from 'lucide-react';
import { GlassCard } from '../../components/GlassCard';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { useOrderStore } from '../../stores/orderStore';
import { useQueueStore } from '../../stores/queueStore';
import { useTranslation } from '../../locales';

const playNotificationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // First high note (chime)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    gain1.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
    osc1.start(audioCtx.currentTime);
    osc1.stop(audioCtx.currentTime + 0.4);
    
    // Second higher harmony note shortly after
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.12); // A5
    gain2.gain.setValueAtTime(0.15, audioCtx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.7);
    osc2.start(audioCtx.currentTime + 0.12);
    osc2.stop(audioCtx.currentTime + 0.7);
  } catch (err) {
    console.warn('AudioContext failed:', err);
  }
};

export const RealtimeOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { orders, fetchOrders } = useOrderStore();
  const { jobs, reprintJob, fetchJobs } = useQueueStore();
  
  const [activeTab, setActiveTab] = React.useState<'waiting' | 'printed' | 'cancelled'>('waiting');
  
  const isFirstLoad = React.useRef(true);
  const knownOrderIdsRef = React.useRef<Set<string>>(new Set());

  // 1. Setup real-time updates: 3-second database polling
  React.useEffect(() => {
    fetchOrders();
    fetchJobs();

    const interval = setInterval(() => {
      fetchOrders();
      fetchJobs();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 2. Play programmatic audio chime when a new waiting order is added
  React.useEffect(() => {
    if (orders.length === 0) return;

    let hasNewOrder = false;
    orders.forEach((o) => {
      if (o.printStatus === 'waiting' && o.orderStatus !== 'cancelled' && !knownOrderIdsRef.current.has(o.id)) {
        knownOrderIdsRef.current.add(o.id);
        if (!isFirstLoad.current) {
          hasNewOrder = true;
        }
      }
    });

    if (hasNewOrder) {
      playNotificationSound();
    }

    if (isFirstLoad.current && orders.length > 0) {
      isFirstLoad.current = false;
    }
  }, [orders]);

  const getOrderStatus = (orderId: string) => {
    const relatedJob = jobs.find((j) => j.order_id === orderId);
    return relatedJob ? relatedJob.status : 'PENDING';
  };

  const handlePrintNow = async (orderCode: string) => {
    try {
      // Trigger invoice printing through queue
      await reprintJob(orderCode);
    } catch (err) {
      console.error('Failed to trigger printing:', err);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const isRecentOrder = (createdAt: string) => {
    const orderTime = new Date(createdAt).getTime();
    const now = new Date().getTime();
    return (now - orderTime) < 3 * 60 * 1000; // 3 minutes
  };

  // Filter lists & tab counts
  const countWaiting = orders.filter(o => o.printStatus === 'waiting' && o.orderStatus !== 'cancelled').length;
  const countPrinted = orders.filter(o => o.printStatus === 'printed' && o.orderStatus !== 'cancelled').length;
  const countCancelled = orders.filter(o => o.orderStatus === 'cancelled').length;

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'waiting') {
      return order.printStatus === 'waiting' && order.orderStatus !== 'cancelled';
    } else if (activeTab === 'printed') {
      return order.printStatus === 'printed' && order.orderStatus !== 'cancelled';
    } else {
      return order.orderStatus === 'cancelled';
    }
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <PageHeader
        title={t('orders.title')}
        subtitle={t('orders.subtitle')}
      />

      {/* Modern Tabs Bar */}
      <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl max-w-md border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
        <button
          onClick={() => setActiveTab('waiting')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'waiting'
              ? 'bg-[#005B52] text-white shadow-md shadow-[#005B52]/20 scale-102'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Bell className={`h-3.5 w-3.5 ${activeTab === 'waiting' ? 'animate-bounce' : ''}`} />
          Chờ in
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
            activeTab === 'waiting' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}>
            {countWaiting}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('printed')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'printed'
              ? 'bg-[#005B52] text-white shadow-md shadow-[#005B52]/20 scale-102'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <CheckCircle className="h-3.5 w-3.5" />
          Đã in
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
            activeTab === 'printed' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}>
            {countPrinted}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('cancelled')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'cancelled'
              ? 'bg-[#005B52] text-white shadow-md shadow-[#005B52]/20 scale-102'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          Đã hủy
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
            activeTab === 'cancelled' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}>
            {countCancelled}
          </span>
        </button>
      </div>

      {/* Grid containing orders cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const status = getOrderStatus(order.id);
              const recent = isRecentOrder(order.createdAt);
              
              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <GlassCard className={`flex flex-col h-full justify-between relative overflow-hidden group border transition-all duration-300 ${
                    recent && order.printStatus === 'waiting'
                      ? 'border-amber-400/50 shadow-lg shadow-amber-400/5 dark:shadow-amber-400/2 bg-amber-50/10 dark:bg-amber-400/5'
                      : 'border-slate-100 dark:border-slate-700'
                  }`}>
                    {/* Glowing highlight for orders actively printing */}
                    {status === 'PRINTING' && (
                      <div className="absolute inset-0 border-2 border-emerald-500/50 rounded-2xl pointer-events-none animate-pulse"></div>
                    )}

                    {/* New Order Ribbon Badge */}
                    {recent && order.printStatus === 'waiting' && (
                      <span className="absolute top-0 right-0 bg-amber-500 text-white font-bold text-[9px] px-2.5 py-1 rounded-bl-xl uppercase tracking-wider animate-pulse flex items-center gap-1 shadow-sm">
                        <span className="w-1 h-1 rounded-full bg-white animate-ping"></span>
                        Mới
                      </span>
                    )}

                    {/* Header info */}
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 mb-3">
                        <div>
                          <span className="text-xs font-bold text-[#005B52] dark:text-[#00BFA6] font-mono tracking-wider">{order.orderCode}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {new Date(order.createdAt).toLocaleString('vi-VN')}
                          </span>
                        </div>
                        <StatusBadge status={order.printStatus === 'printed' ? 'SUCCESS' : status} />
                      </div>

                      <div className="space-y-2">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block truncate">{order.customerName}</span>
                        
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <HeartHandshake className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                          <span>{t('orders.phone')}: {order.customerPhone}</span>
                        </div>

                        {order.customerAddress && order.customerAddress !== 'N/A' && (
                          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 line-clamp-1">
                            📍 {order.customerAddress}
                          </div>
                        )}

                        {order.note && (
                          <div className="text-[11px] text-orange-600 dark:text-orange-400 mt-1.5 bg-orange-50 dark:bg-orange-950/20 px-2 py-1.5 rounded-lg border border-orange-100/50 dark:border-orange-900/30">
                            <strong>Ghi chú:</strong> {order.note}
                          </div>
                        )}

                        {/* Items list from PostgreSQL */}
                        <div className="mt-3 p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-1.5">
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-start text-xs text-slate-600 dark:text-slate-300">
                                <span className="truncate max-w-[180px] text-slate-700 dark:text-slate-200 flex items-center gap-1">
                                  <FileText className="h-3 w-3 text-slate-400" />
                                  {item.name}
                                </span>
                                <span className="font-semibold text-slate-800 dark:text-slate-100 shrink-0">x{item.quantity}</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-[10px] text-slate-400 italic">Không tìm thấy chi tiết sản phẩm.</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer & Actions */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700 mb-4">
                        <span className="text-xs text-slate-500 dark:text-slate-400">{t('orders.totalBillAmount')}:</span>
                        <span className="text-lg font-black text-slate-900 dark:text-white">{formatCurrency(order.totalAmount)}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {/* Print Action */}
                        <button
                          onClick={() => handlePrintNow(order.orderCode)}
                          disabled={status === 'PRINTING' || order.orderStatus === 'cancelled'}
                          className="col-span-2 py-2.5 rounded-lg text-xs font-bold bg-[#005B52] hover:bg-[#00473F] disabled:bg-[#005B52]/40 text-white flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-[#005B52]/10"
                        >
                          <Printer className="h-3.5 w-3.5 animate-pulse" />
                          {status === 'PRINTING' ? t('orders.printing') : (order.printStatus === 'printed' ? 'In lại' : t('orders.printNow'))}
                        </button>

                        {/* Preview Action */}
                        <button
                          onClick={() => navigate('/preview')}
                          className="py-2.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 shadow-sm flex items-center justify-center gap-1 transition-colors"
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
                title={
                  activeTab === 'waiting'
                    ? 'Không có đơn chờ in nào'
                    : activeTab === 'printed'
                    ? 'Chưa có đơn hàng nào được in'
                    : 'Không có đơn hàng nào bị hủy'
                }
                description={
                  activeTab === 'waiting'
                    ? 'Các đơn đặt hàng mới từ website sẽ tự động xuất hiện ở đây để in ấn.'
                    : activeTab === 'printed'
                    ? 'Sau khi in thành công, hóa đơn sẽ tự động chuyển sang danh sách này.'
                    : 'Các đơn hàng bị hủy bỏ hoặc từ chối sẽ được lọc tại đây.'
                }
              />
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
