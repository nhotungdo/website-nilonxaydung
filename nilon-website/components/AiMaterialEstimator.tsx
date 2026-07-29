"use client";

import React, { useState } from 'react';
import { 
  Sparkles, 
  Calculator, 
  Layers, 
  Scale, 
  Package, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Building2, 
  ShieldCheck, 
  Info, 
  Bot,
  Ruler,
  TrendingDown,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import QuickQuoteModal from '@/components/QuickQuoteModal';
import type { EstimateResult } from '@/app/api/ai/estimate-material/route';

const USAGE_OPTIONS = [
  {
    id: 'lot-san-be-tong-mang',
    name: 'Lót sàn bê tông móng / Cầu đường',
    icon: '🏗️',
    defaultZem: '4-6 zem'
  },
  {
    id: 'lot-san-dan-dung',
    name: 'Đổ sàn bê tông nhà dân dụng / Sàn tầng',
    icon: '🏢',
    defaultZem: '2-4 zem'
  },
  {
    id: 'chong-tham-mong-sau',
    name: 'Màng PE chống thấm hầm / Hồ nước',
    icon: '🌊',
    defaultZem: '8-10 zem'
  },
  {
    id: 'mang-nong-nghiep',
    name: 'Màng phủ nông nghiệp & Nhà kính',
    icon: '🌱',
    defaultZem: '5-7 zem'
  },
  {
    id: 'quan-pallet-boc-hang',
    name: 'Màng PE quấn pallet & Bọc hàng hóa',
    icon: '📦',
    defaultZem: '2-3 zem'
  },
  {
    id: 'khac-mo-ta-rieng',
    name: 'Mục đích khác (Tự mô tả công trình bên dưới)',
    icon: '✍️',
    defaultZem: 'Tự động AI'
  }
];

export default function AiMaterialEstimator() {
  const [areaSqM, setAreaSqM] = useState<string>('500');
  const [selectedUsage, setSelectedUsage] = useState<string>(USAGE_OPTIONS[0].id);
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const numArea = parseFloat(areaSqM);
    if (!numArea || numArea <= 0) {
      toast.error('Vui lòng nhập diện tích m² hợp lệ (> 0)');
      return;
    }

    setLoading(true);
    try {
      const selectedOption = USAGE_OPTIONS.find(u => u.id === selectedUsage);
      const res = await fetch('/api/ai/estimate-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          areaSqM: numArea,
          usageType: selectedUsage,
          usageTypeName: selectedOption?.name || selectedUsage,
          projectDescription: projectDescription,
          notes: notes
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Lỗi hệ thống');
      }

      const data: EstimateResult = await res.json();
      setResult(data);
      toast.success(
        data.isAiGenerated 
          ? 'Hệ thống AI đã phân tích & lập dự toán thành công!' 
          : 'Đã hoàn tất tính toán định mức chuẩn vật lý PE!', 
        { icon: '🤖' }
      );
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Có lỗi khi kết nối AI');
    } finally {
      setLoading(false);
    }
  };

  const formatVnd = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-8 p-6 sm:p-8 lg:p-10 bg-white rounded-3xl text-slate-900 shadow-xl border border-slate-200/90 relative overflow-hidden">
      {/* Soft Ambient Background Highlights */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>Công Nghệ AI Định Mức Thông Minh</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#1a365d] font-heading tracking-tight mb-3">
          AI Dự Toán Vật Tư <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-600 bg-clip-text text-transparent">Nilon & Màng PE</span>
        </h2>
        <p className="text-slate-600 text-base font-sans leading-relaxed">
          Nhập diện tích công trình ($m^2$) để AI tự động tư vấn độ dày zem, tính toán tổng số kg, số cuộn và lập bảng dự toán chi phí trong dưới 1 giây.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-slate-50/80 rounded-2xl p-6 border border-slate-200/90 shadow-sm">
          <form onSubmit={handleCalculate} className="space-y-6">
            {/* Input Area */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-blue-600" />
                  Diện tích công trình thực tế (m²)
                </span>
                <span className="text-xs text-slate-500 font-normal">Ví dụ: 100, 500, 1200</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={areaSqM}
                  onChange={(e) => setAreaSqM(e.target.value)}
                  placeholder="Nhập diện tích (m²)..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-slate-900 font-bold text-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                  m²
                </span>
              </div>
              
              {/* Quick Area Preset Buttons */}
              <div className="flex flex-wrap gap-2 mt-3">
                {[100, 300, 500, 1000, 2000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAreaSqM(preset.toString())}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                      areaSqM === preset.toString()
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {preset.toLocaleString('vi-VN')} m²
                  </button>
                ))}
              </div>
            </div>

            {/* Usage Type Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-600" />
                Hạng mục & Mục đích sử dụng
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {USAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedUsage(opt.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                      selectedUsage === opt.id
                        ? 'bg-blue-50 border-blue-500 text-[#1a365d] shadow-sm font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{opt.icon}</span>
                      <span className="text-sm font-medium">{opt.name}</span>
                    </div>
                    <span className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 shrink-0 font-bold">
                      {opt.defaultZem}
                    </span>
                  </button>
                ))}
              </div>

              {/* Detailed Project Description Input for Customer */}
              <div className="mt-3.5 bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
                <label className="block text-xs font-bold text-[#1a365d] mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  Mô tả cụ thể công trình của bạn (Giúp AI phân tích chính xác hơn)
                </label>
                <textarea
                  rows={2}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Ví dụ: Công trình móng nhà xưởng 1.500m² tại KCN, đổ bê tông đá 1x2 tươi, cần nilon dẻo dai chống xé rách..."
                  className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm resize-none"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-500" />
                Yêu cầu bổ sung (Không bắt buộc)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Cần màng màu trắng nguyên sinh, khổ 2m..."
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#1a365d] via-blue-700 to-amber-500 hover:brightness-110 text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-white" />
                  <span>Hệ thống AI đang phân tích định mức...</span>
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
                  <span>Tính toán quy cách & Dự toán ngay</span>
                  <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-6 flex flex-col h-full justify-between">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-blue-200 rounded-2xl p-6 shadow-lg space-y-6"
              >
                {/* Result Top Badge */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Dự toán AI thành công</span>
                  </div>
                  {result.isAiGenerated && (
                    <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 flex items-center gap-1 font-bold">
                      <Bot className="w-3.5 h-3.5" /> Llama-3.1 8B Instant
                    </span>
                  )}
                </div>

                {/* Recommended Product Title */}
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1">Chủng loại khuyến nghị</span>
                  <h3 className="text-xl font-bold text-[#1a365d] font-heading leading-snug">
                    {result.recommendedProduct}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-3 text-xs">
                    <span className="bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-lg border border-amber-200">
                      Độ dày: {result.thicknessZem} zem ({result.thicknessMm} mm)
                    </span>
                    <span className="bg-slate-100 text-slate-800 font-semibold px-3 py-1 rounded-lg border border-slate-200">
                      Quy cách: {result.rollWidth}
                    </span>
                    <span className="bg-slate-100 text-slate-800 font-semibold px-3 py-1 rounded-lg border border-slate-200">
                      Hao hụt gối mí: {result.overlapPercentage}%
                    </span>
                  </div>
                </div>

                {/* Metric Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-2 text-slate-600 text-xs mb-1 font-semibold">
                      <Scale className="w-4 h-4 text-blue-600" />
                      <span>Tổng khối lượng</span>
                    </div>
                    <p className="text-2xl font-black text-[#1a365d] font-mono">
                      ~{result.totalWeightKg.toLocaleString('vi-VN')} <span className="text-sm font-sans font-normal text-slate-500">kg</span>
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-2 text-slate-600 text-xs mb-1 font-semibold">
                      <Package className="w-4 h-4 text-amber-600" />
                      <span>Ước tính số cuộn</span>
                    </div>
                    <p className="text-2xl font-black text-amber-600 font-mono">
                      {result.rollCount} <span className="text-sm font-sans font-normal text-slate-500">cuộn (~50kg)</span>
                    </p>
                  </div>
                </div>

                {/* Total Price Estimation */}
                <div className="bg-gradient-to-r from-blue-50 via-amber-50/50 to-white p-5 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between text-xs text-slate-700 mb-1">
                    <span className="font-bold flex items-center gap-1.5 text-slate-800">
                      <TrendingDown className="w-4 h-4 text-emerald-600" />
                      Dự toán tổng chi phí (Tạm tính)
                    </span>
                    <span className="text-slate-500 font-medium">Đơn giá ~{result.pricePerKg.toLocaleString('vi-VN')} đ/kg</span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-[#1a365d] font-mono">
                    {formatVnd(result.estimatedPriceMin)} - {formatVnd(result.estimatedPriceMax)}
                  </p>
                </div>

                {/* Explanation & Technical Tips */}
                <div className="space-y-3 text-xs text-slate-700">
                  <p className="italic bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed text-slate-600">
                    💡 {result.explanation}
                  </p>
                  
                  {result.technicalTips && result.technicalTips.length > 0 && (
                    <div className="pt-1">
                      <span className="font-bold text-slate-900 block mb-1">Lưu ý kỹ thuật thi công:</span>
                      <ul className="space-y-1.5 pl-4 list-disc text-slate-700">
                        {result.technicalTips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action CTA Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsQuoteModalOpen(true)}
                    className="w-full py-4 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-5 h-5 text-slate-950" />
                    <span>Yêu cầu báo giá chính thức ngay</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[380px] h-full shadow-inner">
                <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 mb-4 shadow-sm">
                  <Layers className="w-8 h-8 text-blue-600 animate-pulse" />
                </div>
                <h4 className="text-lg font-bold text-[#1a365d] mb-2">Chưa có kết quả dự toán</h4>
                <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-6">
                  Vui lòng nhập diện tích ($m^2$) và chọn loại công trình ở bảng bên trái, sau đó nhấn nút <strong>Tính toán quy cách</strong> để AI lập dự toán.
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-600 font-semibold">
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Chính xác 98%</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Tối ưu chi phí</span>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Quick Quote Modal Integration */}
      <QuickQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        productName={
          result
            ? `${result.recommendedProduct} (${result.totalWeightKg}kg - ~${result.rollCount} cuộn cho ${areaSqM}m²)`
            : "Nilon lót sàn"
        }
      />
    </div>
  );
}
