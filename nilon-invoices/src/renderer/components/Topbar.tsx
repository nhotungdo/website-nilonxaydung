import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import { useQueueStore } from '../stores/queueStore';
import { useAuthStore } from '../stores/authStore';

export const Topbar: React.FC = () => {
  const location = useLocation();
  const { pauseQueue, resumeQueue } = useQueueStore();
  const user = useAuthStore((s) => s.user);
  
  const [isPaused, setIsPaused] = useState(false);
  const [currentDateText, setCurrentDateText] = useState('');

  useEffect(() => {
    const formatVietnameseDate = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      return `${day} Tháng ${month}, ${year}`;
    };
    setCurrentDateText(formatVietnameseDate());
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

  return (
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
      <div className="flex items-center gap-5">
        
        {/* Date Display */}
        <span className="text-[12px] font-semibold text-slate-700 hidden lg:inline-block">
          {currentDateText}
        </span>

        {/* Pause/Resume Printing Button */}
        <button
          onClick={handleTogglePause}
          className={`px-4 py-2 text-[11px] font-bold rounded-lg text-white transition-all shadow-sm ${
            isPaused 
              ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/10' 
              : 'bg-[#005B52] hover:bg-[#004D44] shadow-[#005B52]/10'
          }`}
        >
          {isPaused ? 'Tiếp tục in' : 'Tạm dừng in'}
        </button>

        {/* Bell Icon with Red Alert Indicator */}
        <div className="relative">
          <button className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-50 transition-colors relative">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500"></span>
          </button>
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
  );
};
