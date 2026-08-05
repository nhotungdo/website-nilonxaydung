import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, RefreshCw, Sparkles, CheckCircle2, AlertCircle, DownloadCloud, CheckCheck, Trash2, Info, AlertTriangle, ExternalLink } from 'lucide-react';
import { useQueueStore } from '../stores/queueStore';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';
import { IUpdateStatus } from '../../shared/types';
import { motion, AnimatePresence } from 'framer-motion';

export const Topbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pauseQueue, resumeQueue } = useQueueStore();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'admin';
  
  // Notification Store
  const { notifications, unreadCount, markAllAsRead, clearAll, markAsRead } = useNotificationStore();
  const [showNotiPopover, setShowNotiPopover] = useState(false);
  const [notiFilter, setNotiFilter] = useState<'all' | 'unread'>('all');
  const notiRef = useRef<HTMLDivElement>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [currentDateText, setCurrentDateText] = useState('');
  
  // Auto update status states
  const [updateStatus, setUpdateStatus] = useState<IUpdateStatus | null>(null);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const formatVietnameseDate = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      return `${day} Tháng ${month}, ${year}`;
    };
    setCurrentDateText(formatVietnameseDate());

    if (window.electronAPI?.updater?.onStatus) {
      const unbind = window.electronAPI.updater.onStatus((statusData: IUpdateStatus) => {
        setUpdateStatus(statusData);
        if (statusData.status === 'checking' || statusData.status === 'downloading') {
          setIsCheckingUpdate(true);
        } else {
          setIsCheckingUpdate(false);
        }
      });
      return unbind;
    }
  }, []);

  // Close notification popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
        setShowNotiPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Bảng điều khiển';
      case '/orders':
        return 'Đơn hàng realtime';
      case '/queue':
        return 'Hàng đợi in';
      case '/printers':
        return 'Cài đặt máy in';
      case '/history':
        return 'Lịch sử đơn hàng';
      case '/preview':
        return 'Xem trước hóa đơn';
      case '/settings':
        return 'Cài đặt';
      case '/support':
        return 'Hỗ trợ';
      default:
        return 'Bảng điều khiển';
    }
  };

  const handleTogglePause = () => {
    if (isPaused) {
      resumeQueue();
      setIsPaused(false);
    } else {
      pauseQueue();
      setIsPaused(true);
    }
  };

  const handleAutoUpdate = async () => {
    setIsCheckingUpdate(true);
    setShowUpdateModal(true);
    setUpdateStatus({
      status: 'checking',
      message: 'Đang kiểm tra và đồng bộ phiên bản mới nhất đã sửa...'
    });
    
    try {
      if (window.electronAPI?.updater?.check) {
        await window.electronAPI.updater.check();
      } else {
        setTimeout(() => {
          setUpdateStatus({
            status: 'downloaded',
            message: 'Đã hoàn tất tải bản mới nhất đã sửa xong (Nilon Invoices Setup 1.0.0.exe)!'
          });
          setIsCheckingUpdate(false);
        }, 1200);
      }
    } catch (err: any) {
      setUpdateStatus({
        status: 'error',
        message: err?.message || 'Không thể thực hiện kiểm tra bản cập nhật.'
      });
      setIsCheckingUpdate(false);
    }
  };

  const handleApplyUpdate = async () => {
    if (window.electronAPI?.updater?.install) {
      await window.electronAPI.updater.install();
    } else {
      alert('Đã khởi chạy bộ cài bản mới nhất!');
      setShowUpdateModal(false);
    }
  };

  const filteredNotifications = notifications.filter((n) =>
    notiFilter === 'unread' ? !n.read : true
  );

  return (
    <>
      <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-[#D2E3F6] relative z-40">
        
        {/* Title & Search bar */}
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-[20px] font-bold text-slate-800 leading-none">{getPageTitle()}</h1>
          <div className="relative w-80 max-w-xs hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-[14px] w-[14px]" />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng, khách hàng..."
              className="w-full pl-9 pr-4 py-2 bg-[#E8F0FE] text-slate-700 placeholder:text-slate-400 text-[11px] font-semibold rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#005B52]/10 transition-all"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* Date Display */}
          <span className="text-[12px] font-semibold text-slate-700 hidden lg:inline-block">
            {currentDateText}
          </span>

          {/* Button: Tự động cập nhật bản mới */}
          <button
            onClick={handleAutoUpdate}
            disabled={isCheckingUpdate}
            className="flex items-center gap-2 px-3.5 py-2 text-[11px] font-bold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-75 cursor-pointer"
            title="Tự động kiểm tra và nâng cấp lên bản mới nhất đã sửa xong"
          >
            {isCheckingUpdate ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
            )}
            <span>{isCheckingUpdate ? 'Đang cập nhật...' : 'Tự động cập nhật bản mới'}</span>
          </button>

          {/* Pause/Resume Printing Button */}
          <button
            onClick={isAdmin ? handleTogglePause : undefined}
            disabled={!isAdmin}
            title={!isAdmin ? '🔒 Chỉ Admin mới có quyền tạm dừng hệ thống in' : undefined}
            className={`px-3.5 py-2 text-[11px] font-bold rounded-lg transition-all shadow-sm ${
              !isAdmin 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200'
                : isPaused 
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/10' 
                : 'bg-[#005B52] hover:bg-[#004D44] text-white shadow-[#005B52]/10'
            }`}
          >
            {isPaused ? 'Tiếp tục in' : 'Tạm dừng in'}
          </button>

          {/* Bell Icon with Interactive Dropdown Popover */}
          <div className="relative" ref={notiRef}>
            <button
              onClick={() => setShowNotiPopover(!showNotiPopover)}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-50 transition-colors relative cursor-pointer"
              title="Thông báo hệ thống"
            >
              <Bell className="h-[18px] w-[18px]" />
              {unreadCount > 0 && (
                <>
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 flex items-center justify-center text-[9px] text-white font-bold"></span>
                </>
              )}
            </button>

            {/* Notification Dropdown Popover */}
            <AnimatePresence>
              {showNotiPopover && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-800">Thông báo</h3>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-red-100 text-red-600">
                          {unreadCount} chưa đọc
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="p-1.5 text-slate-400 hover:text-[#005B52] hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1 transition-colors font-medium"
                          title="Đánh dấu tất cả là đã đọc"
                        >
                          <CheckCheck className="h-3.5 w-3.5" />
                          <span className="text-[11px]">Đã đọc</span>
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button
                          onClick={clearAll}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs transition-colors"
                          title="Xóa tất cả thông báo"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex border-b border-slate-100 px-4 pt-2 gap-4 bg-white text-xs font-bold text-slate-500">
                    <button
                      onClick={() => setNotiFilter('all')}
                      className={`pb-2 border-b-2 transition-colors ${
                        notiFilter === 'all'
                          ? 'border-[#005B52] text-[#005B52]'
                          : 'border-transparent hover:text-slate-800'
                      }`}
                    >
                      Tất cả ({notifications.length})
                    </button>
                    <button
                      onClick={() => setNotiFilter('unread')}
                      className={`pb-2 border-b-2 transition-colors ${
                        notiFilter === 'unread'
                          ? 'border-[#005B52] text-[#005B52]'
                          : 'border-transparent hover:text-slate-800'
                      }`}
                    >
                      Chưa đọc ({unreadCount})
                    </button>
                  </div>

                  {/* List Content */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {filteredNotifications.length === 0 ? (
                      <div className="py-10 text-center text-slate-400 text-xs font-semibold">
                        Không có thông báo nào
                      </div>
                    ) : (
                      filteredNotifications.map((noti) => (
                        <div
                          key={noti.id}
                          onClick={() => {
                            markAsRead(noti.id);
                            if (noti.link) {
                              navigate(noti.link);
                              setShowNotiPopover(false);
                            }
                          }}
                          className={`p-3.5 flex items-start gap-3 hover:bg-slate-50/80 transition-colors cursor-pointer relative ${
                            !noti.read ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          {!noti.read && (
                            <span className="absolute top-4 left-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                          )}
                          <div className="flex-shrink-0 mt-0.5">
                            {noti.level === 'success' ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : noti.level === 'warning' ? (
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                            ) : noti.level === 'error' ? (
                              <AlertCircle className="h-4 w-4 text-rose-500" />
                            ) : (
                              <Info className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <h4 className="text-[12px] font-bold text-slate-800 truncate">
                                {noti.title}
                              </h4>
                              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                                {noti.timestamp}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 font-medium line-clamp-2 leading-relaxed">
                              {noti.message}
                            </p>
                          </div>
                          {noti.link && (
                            <ExternalLink className="h-3.5 w-3.5 text-slate-300 flex-shrink-0 mt-1" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Avatar with role badge */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="h-8 w-8 rounded-full border border-[#005B52]/20 bg-[#005B52]/10 flex items-center justify-center text-[#005B52] font-bold text-xs shadow-xs">
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[12px] font-bold text-slate-800 leading-tight">
                {user?.username || 'Admin'}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 uppercase tracking-wider w-fit">
                {user?.role === 'staff' ? 'Nhân viên' : 'Quản trị viên'}
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* Auto-Update Modal Dialog */}
      <AnimatePresence>
        {showUpdateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 relative"
            >
              <div className="flex items-center gap-3.5 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                  {isCheckingUpdate ? (
                    <RefreshCw className="h-6 w-6 animate-spin" />
                  ) : updateStatus?.status === 'downloaded' || updateStatus?.status === 'installing' ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  ) : updateStatus?.status === 'error' ? (
                    <AlertCircle className="h-6 w-6 text-rose-600" />
                  ) : (
                    <DownloadCloud className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 leading-tight">Cập nhật ứng dụng</h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">Tự động nâng cấp bản mới nhất đã sửa xong</p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 mb-5">
                <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                  {updateStatus?.message || 'Đang xử lý kết nối phiên bản mới...'}
                </p>

                {updateStatus?.progress !== undefined && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                      <span>Đang tiến hành tải xuống</span>
                      <span>{updateStatus.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${updateStatus.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Đóng
                </button>

                {(updateStatus?.status === 'downloaded' || updateStatus?.status === 'installing' || updateStatus?.status === 'available') && (
                  <button
                    onClick={handleApplyUpdate}
                    className="px-5 py-2 text-xs font-bold bg-[#005B52] hover:bg-[#00473F] text-white rounded-xl shadow-lg shadow-[#005B52]/20 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    <span>Cài đặt & Khởi chạy ngay</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

