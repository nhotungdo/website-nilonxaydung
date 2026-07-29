import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import {
  Settings,
  Server,
  Printer,
  ShieldCheck,
  Save,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  TerminalSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';

export const SettingsPage: React.FC = () => {
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'admin';

  const [formData, setFormData] = useState({
    api_url: '',
    branch_id: '',
    api_key: '',
    auto_print: false,
    sound_alert: false,
    run_on_startup: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        api_url: settings.api_url || '',
        branch_id: settings.branch_id || '',
        api_key: settings.api_key || '',
        auto_print: settings.auto_print || false,
        sound_alert: settings.sound_alert || false,
        run_on_startup: settings.run_on_startup || false,
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleToggle = (key: keyof typeof formData) => {
    setFormData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateSettings({
        api_url: formData.api_url,
        branch_id: formData.branch_id,
        api_key: formData.api_key,
        auto_print: formData.auto_print,
        sound_alert: formData.sound_alert,
        run_on_startup: formData.run_on_startup,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi lưu cài đặt!');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {!isAdmin && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between shadow-xs">
          <span>🔒 Chế độ Nhân viên: Bạn đang xem thông số cài đặt ở chế độ Chỉ đọc (Read-only). Vui lòng liên hệ Admin để thay đổi.</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <div className="h-10 w-10 bg-[#005B52] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#005B52]/20">
            <Settings className="h-5 w-5" />
          </div>
          Cài đặt hệ thống
        </h1>
        {isAdmin && (
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#005B52] hover:bg-[#00473F] text-white rounded-xl font-bold shadow-lg shadow-[#005B52]/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        )}
      </div>

      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3 font-semibold shadow-sm"
          >
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            Cài đặt đã được lưu thành công.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column */}
        <div className="space-y-6">
          
          {/* Máy chủ & API */}
          <div className="bg-white border border-[#D2E3F6] rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
            <div className="flex items-center gap-2 mb-6">
              <Server className="h-5 w-5 text-blue-500" />
              <h2 className="text-[15px] font-bold text-slate-800">Kết nối Máy chủ</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">API URL (Máy chủ trung tâm)</label>
                <input
                  type="url"
                  name="api_url"
                  value={formData.api_url}
                  onChange={handleChange}
                  disabled={!isAdmin}
                  placeholder="https://api.domain.com"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#005B52]/20 focus:border-[#005B52] outline-none transition-all placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">Branch ID (Mã chi nhánh)</label>
                <input
                  type="text"
                  name="branch_id"
                  value={formData.branch_id}
                  onChange={handleChange}
                  disabled={!isAdmin}
                  placeholder="NILON-CN1"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#005B52]/20 focus:border-[#005B52] outline-none transition-all placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1 flex items-center justify-between">
                  <span>API Key (Khóa bảo mật)</span>
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                </label>
                <input
                  type="password"
                  name="api_key"
                  value={formData.api_key}
                  onChange={handleChange}
                  disabled={!isAdmin}
                  placeholder="••••••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#005B52]/20 focus:border-[#005B52] outline-none transition-all placeholder:text-slate-400 font-mono tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Thiết bị & Hệ thống */}
          <div className="bg-white border border-[#D2E3F6] rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
            <div className="flex items-center gap-2 mb-6">
              <TerminalSquare className="h-5 w-5 text-slate-500" />
              <h2 className="text-[15px] font-bold text-slate-800">Khởi động hệ thống</h2>
            </div>
            
            <div 
              className={`flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 transition-colors ${isAdmin ? 'cursor-pointer hover:bg-slate-100/70' : 'opacity-60 cursor-not-allowed'}`}
              onClick={() => isAdmin && handleToggle('run_on_startup')}
            >
              <div>
                <h3 className="text-[13px] font-bold text-slate-800">Khởi động cùng Windows</h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Tự động bật ứng dụng khi máy tính khởi động.</p>
              </div>
              <div className={`transition-colors ${formData.run_on_startup ? 'text-[#005B52]' : 'text-slate-300'}`}>
                {formData.run_on_startup ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Tính năng máy in */}
          <div className="bg-white border border-[#D2E3F6] rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
            <div className="flex items-center gap-2 mb-6">
              <Printer className="h-5 w-5 text-amber-500" />
              <h2 className="text-[15px] font-bold text-slate-800">Thiết lập In ấn</h2>
            </div>
            
            <div 
              className={`flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 mb-3 transition-colors ${isAdmin ? 'cursor-pointer hover:bg-slate-100/70' : 'opacity-60 cursor-not-allowed'}`}
              onClick={() => isAdmin && handleToggle('auto_print')}
            >
              <div>
                <h3 className="text-[13px] font-bold text-slate-800">Tự động in đơn mới</h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Tự động đẩy đơn từ Website sang máy in nhiệt.</p>
              </div>
              <div className={`transition-colors ${formData.auto_print ? 'text-[#005B52]' : 'text-slate-300'}`}>
                {formData.auto_print ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
              </div>
            </div>

            <div 
              className={`flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 transition-colors ${isAdmin ? 'cursor-pointer hover:bg-slate-100/70' : 'opacity-60 cursor-not-allowed'}`}
              onClick={() => isAdmin && handleToggle('sound_alert')}
            >
              <div>
                <h3 className="text-[13px] font-bold text-slate-800">Âm thanh thông báo</h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Phát âm thanh chuông báo khi có đơn hàng mới hoặc lỗi in.</p>
              </div>
              <div className={`transition-colors ${formData.sound_alert ? 'text-[#005B52]' : 'text-slate-300'}`}>
                {formData.sound_alert ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          {isAdmin && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6">
              <h2 className="text-[13px] font-bold text-rose-800 uppercase tracking-wider mb-2">Vùng nguy hiểm</h2>
              <p className="text-[11px] text-rose-600 font-medium mb-4">
                Cảnh báo: Đặt lại dữ liệu ứng dụng sẽ xóa toàn bộ cài đặt cục bộ và nhật ký. Hãy thận trọng!
              </p>
              <button className="px-4 py-2 bg-white text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white rounded-lg text-xs font-bold transition-colors">
                Xóa bộ nhớ cache
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
