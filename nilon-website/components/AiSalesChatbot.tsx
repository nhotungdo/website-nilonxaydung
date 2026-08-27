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
  Building2, 
  Maximize2, 
  Minimize2, 
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export interface QuoteCalcResult {
  product: {
    name: string;
    thicknessZem: string;
  };
  quantityKg: number;
  unitLabel?: string;
  isSafetyEquipment?: boolean;
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
  timestamp: string;
  quoteData?: QuoteCalcResult;
  pdfData?: {
    pdfDataUrl?: string;
    pdfBase64?: string;
    filename: string;
    quoteCode?: string;
  };
}

const QUICK_PROMPTS = [
  { label: '📊 Hỏi giá sỉ Nilon 4zem/6zem', prompt: 'Tôi cần báo giá sỉ cho 1000 kg nilon lót sàn 4zem giao công trình TPHCM.' },
  { label: '⛑️ Hỏi giá Bảo hộ lao động', prompt: 'Tôi muốn tư vấn giá sỉ Mũ bảo hộ công trình, Găng tay chống cắt và Giày bảo hộ mũi thép.' },
  { label: '📄 Xuất PDF Báo Giá', prompt: 'Tôi muốn nhập thông tin để xuất File Báo Giá PDF Tạm Tính.' }
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

  const [messages, setMessages] = useState<ChatMsg[]>([]);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedChat = localStorage.getItem('ai_sales_chat_history');
    if (savedChat) {
      try {
        const parsed = JSON.parse(savedChat);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      } catch (e) {
        console.error("Error parsing chat history:", e);
      }
    }
    // Default welcome message if no history
    setMessages([{
      id: 'welcome-msg',
      role: 'assistant',
      content: 'Dạ xin chào Anh/Chị! Em là AI Sales Assistant (Tư vấn 24/7) của Nilon Xây Dựng.\n\nEm có thể giúp Anh/Chị:\n- 📜 Tư vấn Nilon lót sàn & Màng PE: 2zem - 10zem, độ xé rách ASTM D1922, tiêu chuẩn ISO 9001/14001.\n- ⛑️ Trang thiết bị Bảo hộ lao động: Mũ bảo hộ công trình, Găng tay chống cắt, Giày mũi lót thép (CE S3), Áo phản quang, Bạt che công trình...\n- 📊 Tính giá sỉ theo kg/cuộn/bộ & phí giao công trình.\n- 📄 Tự động xuất File Báo Giá PDF Tạm Tính ngay trong đoạn chat.\n\nAnh/Chị cần hỗ trợ thông tin hoặc báo giá vật tư nào cho công trình ạ?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ai_sales_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  const handleClearChat = () => {
    if (window.confirm("Anh/chị có chắc muốn xóa lịch sử trò chuyện không?")) {
      localStorage.removeItem('ai_sales_chat_history');
      setMessages([{
        id: 'welcome-msg',
        role: 'assistant',
        content: 'Dạ xin chào Anh/Chị! Em là AI Sales Assistant (Tư vấn 24/7) của Nilon Xây Dựng.\n\nEm có thể giúp Anh/Chị:\n- 📜 Tư vấn Nilon lót sàn & Màng PE: 2zem - 10zem, độ xé rách ASTM D1922, tiêu chuẩn ISO 9001/14001.\n- ⛑️ Trang thiết bị Bảo hộ lao động: Mũ bảo hộ công trình, Găng tay chống cắt, Giày mũi lót thép (CE S3), Áo phản quang, Bạt che công trình...\n- 📊 Tính giá sỉ theo kg/cuộn/bộ & phí giao công trình.\n- 📄 Tự động xuất File Báo Giá PDF Tạm Tính ngay trong đoạn chat.\n\nAnh/Chị cần hỗ trợ thông tin hoặc báo giá vật tư nào cho công trình ạ?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

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
      const sanitizedContent = (data.content || '').replace(/\*/g, '');

      const botMsg: ChatMsg = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: sanitizedContent,
        quoteData: data.quoteData,
        pdfData: data.pdfData,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);

      // If user prompted for PDF quote or bot suggested lead form, trigger lead prompt
      if (text.toLowerCase().includes('pdf') || text.toLowerCase().includes('báo giá') || sanitizedContent.includes('Tên, Số điện thoại')) {
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
          content: 'Dạ hệ thống AI đang bận một chút, Anh/Chị có thể gọi ngay Hotline 0901.234.567 để được nhân viên hỗ trợ trực tiếp ạ!',
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
          <div className="relative">
            <Bot className="w-6 h-6 text-amber-300" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
              <span>AI Sales Assistant</span>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] px-1.5 py-0.2 rounded border border-amber-400/30">24/7</span>
            </div>
            <div className="text-[10px] text-blue-200">Tư vấn kỹ thuật & Báo giá tự động</div>
          </div>
        </motion.button>
      )}

      {/* Main Chat Modal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`bg-slate-950 text-slate-100 shadow-2xl border border-slate-800 overflow-hidden flex flex-col transition-all duration-300 z-[100] ${
              isExpanded 
                ? 'fixed inset-0 w-full h-[100dvh] rounded-none sm:relative sm:w-[800px] sm:h-[85vh] sm:rounded-2xl' 
                : 'fixed bottom-0 left-0 w-full h-[85dvh] rounded-t-2xl rounded-b-none sm:relative sm:bottom-auto sm:left-auto sm:w-[420px] sm:h-[600px] sm:max-h-[82vh] sm:rounded-2xl'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-4 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-amber-300 shadow-inner">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">AI Sales Assistant</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Sẵn sàng 24/7
                    </span>
                    <span>• Nilon Xây Dựng</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClearChat}
                  className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Xóa lịch sử chat"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors hidden sm:block"
                  title={isExpanded ? "Thu nhỏ" : "Phóng to"}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  title="Đóng cửa sổ chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {/* Role Tag & Time */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 gap-2">
                      <span className="font-bold flex items-center gap-1 text-slate-300">
                        {msg.role === 'user' ? (
                          <>
                            <User className="w-3 h-3 text-blue-300" /> Khách hàng
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
                            <Building2 className="w-3.5 h-3.5" /> Thông tin Đơn giá Niêm yết
                          </span>
                          <span className="text-emerald-400 font-mono">{msg.quoteData.isSafetyEquipment ? 'Bảo hộ lao động' : 'Nilon lót móng'}</span>
                        </div>
                        {!msg.quoteData.isSafetyEquipment ? (
                          <div className="space-y-1 text-slate-300 pt-1">
                            <div>Sản phẩm: <strong className="text-white">{msg.quoteData.product.name}</strong></div>
                            <div>Đơn giá theo 1 kg: <strong className="text-emerald-400 font-mono">{msg.quoteData.unitPriceBeforeDiscount.toLocaleString('vi-VN')} VNĐ / kg</strong></div>
                            <div>Đơn giá 1 Cuộn (~50kg): <strong className="text-blue-400 font-mono">{(msg.quoteData.unitPriceBeforeDiscount * 50).toLocaleString('vi-VN')} VNĐ / cuộn</strong></div>
                          </div>
                        ) : (
                          <div className="space-y-1 text-slate-300 pt-1">
                            <div>Sản phẩm: <strong className="text-white">{msg.quoteData.product.name}</strong></div>
                            <div>Đơn giá 1 sản phẩm: <strong className="text-emerald-400 font-mono text-sm">{msg.quoteData.unitPriceBeforeDiscount.toLocaleString('vi-VN')} VNĐ / {msg.quoteData.unitLabel || 'cái'}</strong></div>
                          </div>
                        )}
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
                          onClick={() => downloadPdfBlob(msg.pdfData!.pdfBase64 || msg.pdfData!.pdfDataUrl || '', msg.pdfData!.filename)}
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
                    <span>Đang xử lý & tính toán báo giá...</span>
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
                      <label className="block text-slate-400 mb-1">Họ tên người nhận (bắt buộc)</label>
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
                      <label className="block text-slate-400 mb-1">Số điện thoại (bắt buộc)</label>
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
                    <label className="block text-slate-400 mb-1">Địa chỉ công trình nhận hàng (bắt buộc)</label>
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
                      <label className="block text-slate-400 mb-1">Loại sản phẩm</label>
                      <select
                        value={leadProduct}
                        onChange={(e) => setLeadProduct(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="Nilon lót sàn 4zem">Nilon lót sàn 4zem</option>
                        <option value="Nilon lót sàn 6zem">Nilon lót sàn 6zem</option>
                        <option value="Màng PE 10zem nguyên sinh">Màng PE 10zem nguyên sinh</option>
                        <option value="Mũ bảo hộ công trình HDPE">Mũ bảo hộ công trình HDPE</option>
                        <option value="Giày bảo hộ lao động CE S3">Giày bảo hộ lao động CE S3</option>
                        <option value="Găng tay bảo hộ chống cắt">Găng tay bảo hộ chống cắt</option>
                        <option value="Áo phản quang kỹ sư">Áo phản quang kỹ sư</option>
                        <option value="Bạt che công trình xanh cam">Bạt che công trình xanh cam</option>
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
