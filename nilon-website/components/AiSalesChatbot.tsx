"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  FileText, 
  Download, 
  User, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Zap 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export interface QuoteCalcResult {
  product: {
    name: string;
    thicknessZem: string;
  };
  quantityKg: number;
  unitPriceBeforeDiscount: number;
  discountPercentage: number;
  unitPriceAfterDiscount: number;
  subtotal: number;
  shippingFee: number;
  grandTotal: number;
  estimatedAreaSqM: number;
  tierNote: string;
  shippingNote: string;
}

export interface ChatMsg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  quoteData?: QuoteCalcResult;
  pdfData?: {
    pdfBase64: string;
    filename: string;
  };
  timestamp: string;
}

const QUICK_PROMPTS = [
  { label: '💡 Tư vấn độ xé rách & ISO 9001', prompt: 'Công ty tư vấn giúp tôi độ xé rách ASTM và các chứng chỉ ISO 9001 của nilon lót móng.' },
  { label: '📊 Hỏi giá sỉ 1,000 kg nilon 4zem', prompt: 'Tôi cần báo giá sỉ cho 1000 kg nilon lót sàn 4zem giao công trình TPHCM.' },
  { label: '🧪 Nhựa nguyên sinh vs tái sinh?', prompt: 'Phân biệt sự khác nhau giữa màng PE nguyên sinh và tái sinh Grade A?' },
  { label: '📄 Xuất PDF Báo Giá Tạm Tính', prompt: 'Tôi muốn nhập thông tin để xuất File Báo Giá PDF Tạm Tính.' }
];

export default function AiSalesChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Lead Form Modal State inside Chat
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadAddress, setLeadAddress] = useState('');
  const [leadProduct, setLeadProduct] = useState('Nilon lót sàn 4zem');
  const [leadKg, setLeadKg] = useState('500');

  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: 'Dạ xin chào Anh/Chị! Em là **AI Sales Assistant (Tư vấn 24/7)** của Nilon Xây Dựng.\n\nEm có thể giúp Anh/Chị:\n- 📜 **Giải đáp kỹ thuật**: Độ xé rách ASTM D1922, tiêu chuẩn ISO 9001/14001, tỷ lệ nhựa nguyên sinh/tái sinh.\n- 📊 **Tính giá sỉ theo kg & phí giao công trình**.\n- 📄 **Tự động xuất File Báo Giá PDF Tạm Tính** ngay trong đoạn chat.\n\nAnh/Chị cần hỗ trợ thông tin gì cho công trình mình ạ?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    const userMsg: ChatMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const history = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });

      if (!res.ok) {
        throw new Error('Không thể kết nối đến AI Server');
      }

      const data = await res.json();

      const botMsg: ChatMsg = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.content,
        quoteData: data.quoteData,
        pdfData: data.pdfData,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);

      // If user prompted for PDF quote or bot suggested lead form, trigger lead prompt
      if (text.toLowerCase().includes('pdf') || text.toLowerCase().includes('báo giá') || data.content.includes('Tên, Số điện thoại')) {
        // Auto pre-fill if available
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Lỗi hệ thống';
      toast.error('Có lỗi xảy ra khi trò chuyện với AI: ' + errMsg);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Dạ hệ thống AI đang bận một chút, Anh/Chị có thể gọi ngay Hotline **0901.234.567** để được nhân viên hỗ trợ trực tiếp ạ!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePdfFromForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone || !leadAddress) {
      toast.error('Vui lòng điền đủ Họ tên, SĐT và Địa chỉ công trình!');
      return;
    }

    setLoading(true);
    setShowLeadForm(false);

    const promptText = `Xuất PDF Báo Giá Tạm Tính cho khách hàng ${leadName}, SĐT: ${leadPhone}, Địa chỉ công trình: ${leadAddress}, Sản phẩm: ${leadProduct}, Số lượng: ${leadKg} kg.`;
    await handleSendMessage(promptText);
  };

  const downloadPdfBlob = (pdfBase64: string, filename: string) => {
    try {
      const link = document.createElement('a');
      link.href = pdfBase64;
      link.download = filename || 'Bao_Gia_Nilon_Xay_Dung.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Đã tải xuống File Báo Giá PDF Tạm Tính thành công!', { icon: '📄' });
    } catch {
      toast.error('Lỗi khi tải file PDF');
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white px-5 py-3.5 rounded-full shadow-2xl hover:shadow-blue-500/50 border border-blue-400/30 transition-all duration-300"
        >
          {/* Animated pulse ring */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900"></span>
          </span>

          <div className="bg-white/20 p-2 rounded-full backdrop-blur-md">
            <Bot className="w-6 h-6 text-white animate-bounce" />
          </div>

          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-blue-200 uppercase tracking-wider flex items-center gap-1">
              <span>AI Sales Assistant</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded border border-emerald-500/30 font-mono">24/7</span>
            </div>
            <div className="text-sm font-bold text-white">Tư vấn Kỹ thuật & Báo giá PDF</div>
          </div>
        </motion.button>
      )}

      {/* Main Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`flex flex-col bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
              isExpanded 
                ? 'w-[95vw] sm:w-[700px] h-[85vh]' 
                : 'w-[92vw] sm:w-[440px] h-[620px] max-h-[90vh]'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-lg">
                    <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">AI Sales Assistant</h3>
                    <span className="bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 rounded-full border border-blue-500/30 flex items-center gap-1 font-medium">
                      <Zap className="w-3 h-3 text-amber-400" /> Groq AI 24/7
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Tư vấn ISO 9001 & Báo Giá PDF Công Trình
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
                  title={isExpanded ? "Thu nhỏ" : "Phóng to"}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
                  title="Đóng chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Body - Messages Container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-lg transition-all ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-900/90 text-slate-100 border border-slate-800 rounded-bl-none'
                    }`}
                  >
                    {/* Role Header */}
                    <div className="flex items-center justify-between gap-2 mb-1.5 opacity-75 text-[11px] font-medium border-b border-white/10 pb-1">
                      <span className="flex items-center gap-1">
                        {msg.role === 'user' ? (
                          <>
                            <User className="w-3 h-3" /> Bạn (Khách hàng)
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-amber-400" /> AI Sales Expert
                          </>
                        )}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {/* Content text */}
                    <div className="text-sm whitespace-pre-wrap leading-relaxed font-sans">
                      {msg.content}
                    </div>

                    {/* Calculated Quote Summary Box (If attached) */}
                    {msg.quoteData && (
                      <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-blue-500/30 text-xs space-y-1.5">
                        <div className="font-bold text-blue-400 flex items-center justify-between border-b border-slate-800 pb-1">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" /> Bảng tính Báo giá Tạm tính
                          </span>
                          <span className="text-emerald-400 font-mono">Giảm {msg.quoteData.discountPercentage}%</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1">
                          <div>Sản phẩm: <strong className="text-white">{msg.quoteData.product.name}</strong></div>
                          <div>Khối lượng: <strong className="text-white">{msg.quoteData.quantityKg} kg</strong></div>
                          <div>Đơn giá sỉ: <strong className="text-emerald-400">{msg.quoteData.unitPriceAfterDiscount.toLocaleString('vi-VN')} đ/kg</strong></div>
                          <div>Phí giao hàng: <strong className="text-amber-400">{msg.quoteData.shippingFee === 0 ? 'Miễn phí' : `${msg.quoteData.shippingFee.toLocaleString('vi-VN')} đ`}</strong></div>
                        </div>
                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-bold text-sm">
                          <span className="text-slate-200">Tổng tạm tính:</span>
                          <span className="text-blue-400 font-mono text-base">{msg.quoteData.grandTotal.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                      </div>
                    )}

                    {/* Generated PDF Download Card */}
                    {msg.pdfData && (
                      <div className="mt-3 p-3.5 bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 rounded-xl border border-emerald-500/40 shadow-xl">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-white text-xs truncate">{msg.pdfData.filename}</div>
                            <div className="text-[10px] text-emerald-300 flex items-center gap-1 mt-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Đã hoàn tất file PDF chuẩn B2B
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => downloadPdfBlob(msg.pdfData!.pdfBase64, msg.pdfData!.filename)}
                          className="w-full mt-3 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow flex items-center justify-center gap-2 transition-all"
                        >
                          <Download className="w-4 h-4" /> Tải File PDF Báo Giá Ngay
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-none p-3.5 flex items-center gap-3 text-slate-400 text-xs">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                    <span>Groq AI đang phân tích dữ liệu & tính toán báo giá...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Form Thu Thập Lead Inline (Nổi lên khi bấm xuất PDF) */}
            <AnimatePresence>
              {showLeadForm && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleGeneratePdfFromForm}
                  className="bg-slate-900 border-t border-blue-500/40 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-blue-300 border-b border-slate-800 pb-2">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-amber-400" /> Nhập thông tin để xuất PDF Báo Giá
                    </span>
                    <button type="button" onClick={() => setShowLeadForm(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Họ tên người nhận *</label>
                      <input
                        type="text"
                        required
                        placeholder="Vd: Anh Minh (Công ty Coteccons)"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Số điện thoại *</label>
                      <input
                        type="tel"
                        required
                        placeholder="Vd: 0908123456"
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block text-slate-400 mb-1">Địa chỉ công trình nhận hàng *</label>
                    <input
                      type="text"
                      required
                      placeholder="Vd: Công trình KCN VSIP 2, Bình Dương"
                      value={leadAddress}
                      onChange={(e) => setLeadAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Loại Nilon</label>
                      <select
                        value={leadProduct}
                        onChange={(e) => setLeadProduct(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="Nilon lót sàn 4zem">Nilon lót sàn 4zem</option>
                        <option value="Nilon lót sàn 6zem">Nilon lót sàn 6zem</option>
                        <option value="Màng PE 10zem nguyên sinh">Màng PE 10zem nguyên sinh</option>
                        <option value="Màng phủ nông nghiệp 7zem">Màng phủ nông nghiệp 7zem</option>
                        <option value="Màng PE quấn pallet 2zem">Màng PE quấn pallet 2zem</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Khối lượng (kg)</label>
                      <input
                        type="number"
                        min="50"
                        value={leadKg}
                        onChange={(e) => setLeadKg(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 text-xs"
                  >
                    <Download className="w-4 h-4" /> Xuất & Tải File Báo Giá PDF Tạm Tính
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Quick Action Pills */}
            <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-850 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {QUICK_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.label.includes('Xuất PDF')) {
                      setShowLeadForm(true);
                    } else {
                      handleSendMessage(item.prompt);
                    }
                  }}
                  disabled={loading}
                  className="whitespace-nowrap bg-slate-800/80 hover:bg-blue-600/30 text-slate-300 hover:text-white border border-slate-700/60 hover:border-blue-500/50 rounded-full px-3 py-1 text-[11px] transition-all flex items-center gap-1"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowLeadForm(!showLeadForm)}
                className={`p-2 rounded-xl transition-colors ${
                  showLeadForm ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
                title="Mở Form xuất PDF Báo giá"
              >
                <FileText className="w-5 h-5 text-amber-400" />
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="Hỏi về ISO, độ xé rách, giá sỉ kg, cước giao..."
                disabled={loading}
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              />

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || loading}
                className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl shadow-lg transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
