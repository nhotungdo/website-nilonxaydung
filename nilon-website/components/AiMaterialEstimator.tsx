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
  FileText,
  Copy,
  Printer,
  ChevronDown,
  ChevronUp,
  Tag,
  Award
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
  const [layersCount, setLayersCount] = useState<number>(1);
  const [peQualityGrade, setPeQualityGrade] = useState<'auto' | 'recycled' | 'virgin'>('auto');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [showBreakdownTable, setShowBreakdownTable] = useState<boolean>(false);

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
          layersCount: layersCount,
          peQualityGrade: peQualityGrade,
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
          ? 'Hệ thống AI đã phân tích & lập dự toán chuẩn định mức thành công!' 
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

  const handleCopyQuote = () => {
    if (!result) return;
    const text = `
📋 DỰ TOÁN VẬT TƯ NILON LÓT SÀN & MÀNG PE (NilonXayDung.vn)
--------------------------------------------------
• Diện tích thi công: ${areaSqM} m² (${result.layersCount} lớp)
• Chủng loại khuyến nghị: ${result.recommendedProduct}
• Quy cách độ dày: ${result.thicknessZem} zem (${result.thicknessMm} mm)
• Khổ màng: ${result.rollWidth} | Màu: ${result.color}
• Hệ số gối mí: ${result.overlapPercentage}% => Diện tích phủ thực tế: ${result.effectiveAreaSqM.toLocaleString('vi-VN')} m²
• Tổng khối lượng PE: ${result.totalWeightKg} kg (~${result.rollCount} cuộn 50kg)
• Loại nhựa: ${result.peGradeName}
• Đơn giá sỉ nhà máy: ${result.pricePerKg.toLocaleString('vi-VN')} VNĐ/kg (${result.volumeTierLabel})
--------------------------------------------------
💰 TỔNG CHI PHÍ TẠM TÍNH: ${formatVnd(result.totalPriceExact)}
${result.savingsVnd > 0 ? `✨ Tiết kiệm sỉ theo khối lượng: ${formatVnd(result.savingsVnd)}` : ''}
📞 Liên hệ tư vấn & chốt đơn: 0944 685 368 / 0903 877 659
Website: https://nilonxaydung.vn
    `.trim();

    navigator.clipboard.writeText(text);
    toast.success('Đã sao chép nội dung báo giá dự toán!', { icon: '📋' });
  };

  const handlePrintQuote = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-8 p-6 sm:p-8 lg:p-10 bg-white rounded-3xl text-slate-900 shadow-xl border border-slate-200/90 relative overflow-hidden print:p-0 print:shadow-none print:border-none">
      {/* Soft Ambient Background Highlights */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none print:hidden" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none print:hidden" />

      {/* Header */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm print:hidden">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>Công Nghệ AI Định Mức Thông Minh - Chính Xác 100%</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#1a365d] font-heading tracking-tight mb-3">
          AI Dự Toán Vật Tư <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-600 bg-clip-text text-transparent">Nilon & Màng PE</span>
        </h2>
        <p className="text-slate-600 text-base font-sans leading-relaxed">
          Nhập diện tích công trình ($m^2$) để AI tự động tư vấn độ dày zem, tính toán tổng số kg chuẩn vật lý, số cuộn và lập bảng dự toán giá tận gốc từ nhà máy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-slate-50/80 rounded-2xl p-6 border border-slate-200/90 shadow-sm print:hidden">
          <form onSubmit={handleCalculate} className="space-y-6">
            {/* Area & Layers Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-7">
                <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-blue-600" />
                    Diện tích (m²)
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={areaSqM}
                    onChange={(e) => setAreaSqM(e.target.value)}
                    placeholder="Nhập diện tích (m²)..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-bold text-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">
                    m²
                  </span>
                </div>
              </div>

              <div className="sm:col-span-5">
                <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Số lớp trải
                </label>
                <select
                  value={layersCount}
                  onChange={(e) => setLayersCount(parseInt(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-3.5 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
                >
                  <option value={1}>1 Lớp nilon</option>
                  <option value={2}>2 Lớp nilon (Chéo)</option>
                </select>
              </div>
            </div>

            {/* Quick Area Presets */}
            <div className="flex flex-wrap gap-1.5">
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

            {/* Usage Type Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-600" />
                Hạng mục & Mục đích sử dụng
              </label>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
                {USAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedUsage(opt.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      selectedUsage === opt.id
                        ? 'bg-blue-50 border-blue-500 text-[#1a365d] shadow-sm font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{opt.icon}</span>
                      <span className="text-xs sm:text-sm font-medium">{opt.name}</span>
                    </div>
                    <span className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 shrink-0 font-bold">
                      {opt.defaultZem}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* PE Quality Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                Loại nhựa & Chất liệu PE
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'auto', label: '🤖 AI Tự chọn', desc: 'Tối ưu theo công trình' },
                  { id: 'recycled', label: '♻️ Tái Sinh', desc: 'Đen/xám giá rẻ lót sàn' },
                  { id: 'virgin', label: '✨ Nguyên Sinh', desc: 'Trắng trong chống thấm' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPeQualityGrade(item.id as 'auto' | 'recycled' | 'virgin')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      peQualityGrade === item.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className={`text-[10px] ${peQualityGrade === item.id ? 'text-blue-100' : 'text-slate-500'}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Project Description Input */}
            <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
              <label className="block text-xs font-bold text-[#1a365d] mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                Mô tả cụ thể công trình của bạn (AI phân tích kỹ thuật)
              </label>
              <textarea
                rows={2}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Ví dụ: Đổ sàn nhà xưởng 1.500m², bê tông tươi đá 1x2, cần màng dẻo dai..."
                className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm resize-none"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-500" />
                Yêu cầu bổ sung (Khổ nilon, màu sắc, địa điểm giao...)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Giao công trình KCN Mỹ Phước, cần khổ xòe 4m..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                  <span>Tính toán định mức & Dự toán ngay</span>
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
                className="bg-white border border-blue-200 rounded-2xl p-6 shadow-lg space-y-6 print:border-none print:shadow-none print:p-0"
              >
                {/* Result Top Badge */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Dự toán chuẩn định mức 100%</span>
                  </div>
                  {result.isAiGenerated && (
                    <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 flex items-center gap-1 font-bold print:hidden">
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
                    <span className="bg-blue-50 text-blue-800 font-bold px-3 py-1 rounded-lg border border-blue-200">
                      Số lớp: {result.layersCount} lớp
                    </span>
                  </div>
                </div>

                {/* Metric Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-2 text-slate-600 text-xs mb-1 font-semibold">
                      <Scale className="w-4 h-4 text-blue-600" />
                      <span>Tổng khối lượng chuẩn</span>
                    </div>
                    <p className="text-2xl font-black text-[#1a365d] font-mono">
                      {result.totalWeightKg.toLocaleString('vi-VN')} <span className="text-sm font-sans font-normal text-slate-500">kg</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">Lý thuyết vật lý: ~{result.exactWeightKg} kg</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-2 text-slate-600 text-xs mb-1 font-semibold">
                      <Package className="w-4 h-4 text-amber-600" />
                      <span>Ước tính số cuộn</span>
                    </div>
                    <p className="text-2xl font-black text-amber-600 font-mono">
                      {result.rollCount} <span className="text-sm font-sans font-normal text-slate-500">cuộn (50kg)</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">Phủ kín {result.effectiveAreaSqM.toLocaleString('vi-VN')} m²</p>
                  </div>
                </div>

                {/* Total Price Estimation Display (Calculated strictly with 0 error) */}
                <div className="bg-gradient-to-r from-blue-50 via-amber-50/50 to-white p-5 rounded-xl border border-blue-200 relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-slate-700 mb-1">
                    <span className="font-bold flex items-center gap-1.5 text-slate-800">
                      <TrendingDown className="w-4 h-4 text-emerald-600" />
                      Dự toán tổng chi phí (Tạm tính)
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                      {result.volumeTierLabel}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between gap-2 mt-2">
                    <p className="text-2xl sm:text-3xl font-black text-[#1a365d] font-mono">
                      {formatVnd(result.totalPriceExact)}
                    </p>
                    <span className="text-xs text-slate-500 font-medium shrink-0">
                      ({result.pricePerKg.toLocaleString('vi-VN')} đ/kg)
                    </span>
                  </div>

                  {result.savingsVnd > 0 && (
                    <div className="mt-2 text-xs text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tiết kiệm giá sỉ nhà máy: {formatVnd(result.savingsVnd)}</span>
                    </div>
                  )}

                  <div className="mt-2 text-[11px] text-slate-500 flex justify-between border-t border-slate-200/60 pt-2">
                    <span>Mức Tái Sinh lót sàn: {formatVnd(result.estimatedPriceMin)}</span>
                    <span>Mức Nguyên Sinh cao cấp: {formatVnd(result.estimatedPriceMax)}</span>
                  </div>
                </div>

                {/* Explanation & Technical Tips */}
                <div className="space-y-3 text-xs text-slate-700">
                  <p className="italic bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed text-slate-600">
                    💡 {result.explanation}
                  </p>
                  
                  {result.technicalTips && result.technicalTips.length > 0 && (
                    <div className="pt-1">
                      <span className="font-bold text-slate-900 block mb-1">Lưu ý kỹ thuật thi công tại công trình:</span>
                      <ul className="space-y-1.5 pl-4 list-disc text-slate-700">
                        {result.technicalTips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Formula Breakdown Table Accordion */}
                <div className="border border-slate-200 rounded-xl overflow-hidden print:block">
                  <button
                    type="button"
                    onClick={() => setShowBreakdownTable(!showBreakdownTable)}
                    className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-between transition-colors print:hidden"
                  >
                    <span className="flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-blue-600" />
                      Chi tiết minh bạch công thức định mức (Audit Math 100%)
                    </span>
                    {showBreakdownTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <AnimatePresence>
                    {(showBreakdownTable || typeof window !== 'undefined') && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={`p-3.5 bg-slate-50 border-t border-slate-200 text-[11px] ${showBreakdownTable ? 'block' : 'hidden print:block'}`}
                      >
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-600 font-bold">
                              <th className="pb-1.5">Thông số</th>
                              <th className="pb-1.5">Công thức</th>
                              <th className="pb-1.5 text-right">Giá trị</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200/60 font-mono text-slate-800">
                            <tr>
                              <td className="py-1">Diện tích nền</td>
                              <td className="py-1 text-slate-500 font-sans">Diện tích thực tế</td>
                              <td className="py-1 text-right font-bold">{areaSqM} m²</td>
                            </tr>
                            <tr>
                              <td className="py-1">Diện tích phủ PE</td>
                              <td className="py-1 text-slate-500 font-sans">Sàn × Lớp × (1 + GốiMí%)</td>
                              <td className="py-1 text-right font-bold">{result.effectiveAreaSqM} m²</td>
                            </tr>
                            <tr>
                              <td className="py-1">Độ dày màng PE</td>
                              <td className="py-1 text-slate-500 font-sans">{result.thicknessZem} zem (0.01mm/zem)</td>
                              <td className="py-1 text-right font-bold">{result.thicknessMm} mm</td>
                            </tr>
                            <tr>
                              <td className="py-1">Tỷ trọng nhựa PE</td>
                              <td className="py-1 text-slate-500 font-sans">Standard Polyethylene</td>
                              <td className="py-1 text-right font-bold">930 kg/m³</td>
                            </tr>
                            <tr>
                              <td className="py-1">Khối lượng lý thuyết</td>
                              <td className="py-1 text-slate-500 font-sans">DiệnTích × ĐộDày × 930</td>
                              <td className="py-1 text-right font-bold">{result.exactWeightKg} kg</td>
                            </tr>
                            <tr>
                              <td className="py-1">Khối lượng thực xuất</td>
                              <td className="py-1 text-slate-500 font-sans">Làm tròn cuộn/kg</td>
                              <td className="py-1 text-right font-bold text-blue-700">{result.totalWeightKg} kg</td>
                            </tr>
                            <tr>
                              <td className="py-1">Đơn giá bán sỉ</td>
                              <td className="py-1 text-slate-500 font-sans">{result.volumeTierLabel}</td>
                              <td className="py-1 text-right font-bold text-amber-700">{result.pricePerKg.toLocaleString('vi-VN')} đ/kg</td>
                            </tr>
                            <tr className="bg-blue-100/60 font-sans font-bold text-slate-900">
                              <td className="py-1.5 pl-1">Thành tiền tạm tính</td>
                              <td className="py-1.5 font-mono">{result.totalWeightKg}kg × {result.pricePerKg.toLocaleString('vi-VN')}đ</td>
                              <td className="py-1.5 pr-1 text-right text-blue-900 font-mono font-black">{formatVnd(result.totalPriceExact)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action CTA Buttons */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-12 gap-3 print:hidden">
                  <button
                    type="button"
                    onClick={() => setIsQuoteModalOpen(true)}
                    className="sm:col-span-6 py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-950" />
                    <span>Yêu cầu báo giá ngay</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyQuote}
                    className="sm:col-span-3 py-3.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-4 h-4 text-blue-600" />
                    <span>Sao chép</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrintQuote}
                    className="sm:col-span-3 py-3.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-slate-600" />
                    <span>In dự toán</span>
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
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Chính xác 100% vật lý</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Giá tận gốc xưởng</span>
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
