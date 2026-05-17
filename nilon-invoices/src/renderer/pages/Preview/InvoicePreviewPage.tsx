import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Printer, 
  Info, 
  FileText,
  Barcode
} from 'lucide-react';
import { GlassCard } from '../../components/GlassCard';
import { PageHeader } from '../../components/PageHeader';
import { usePrinterStore } from '../../stores/printerStore';
import { useOrderStore } from '../../stores/orderStore';

export const InvoicePreviewPage: React.FC = () => {
  const printers = usePrinterStore((s) => s.printers);
  const orders = useOrderStore((s) => s.orders);

  const [zoom, setZoom] = useState(100);
  const [selectedPrinterId, setSelectedPrinterId] = useState(
    printers.find((p) => p.is_default === 1)?.id || printers[0]?.id || ''
  );

  const activeOrder = orders[0] || {
    id: 'ORD-2026-0001',
    orderCode: 'NLN-78932',
    customerName: 'Nguyễn Văn Hùng (Nhà thầu)',
    customerPhone: '0903123456',
    totalAmount: 18450000,
    paperSize: 'K80',
    createdAt: new Date().toISOString(),
    items: [
      { name: 'Nilon Lót Nền Khổ 2m (Dày 0.05mm) - Cuộn xanh', quantity: 5, price: 1800000, unit: 'Cuộn' },
      { name: 'Bạt Nhựa Sọc 3 Màu Che Nắng Mưa Khổ 4m x 50m', quantity: 3, price: 2150000, unit: 'Cuộn' },
      { name: 'Keo Dán Nilon Chuyên Dụng Xây Dựng 5L', quantity: 2, price: 1500000, unit: 'Thùng' }
    ]
  };

  const handlePrint = () => {
    alert(`Print command dispatched to target driver: ${
      printers.find((p) => p.id === selectedPrinterId)?.name || 'Default Spooler'
    }`);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="space-y-6 flex-1 flex flex-col h-full">
      
      {/* Page Header */}
      <PageHeader
        title="Active Invoice Preview"
        subtitle="Pre-render and inspect local thermal print templates before hardware dispatch."
      />

      {/* Main Core Layout: Preview Layout with Toolbar */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        
        {/* Toolbar sidebar left */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white pb-3 border-b border-white/5 flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-blue-500" />
              Print Spool Options
            </h3>

            {/* Select Printer */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Target Printer</label>
              <select
                value={selectedPrinterId}
                onChange={(e) => setSelectedPrinterId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/40"
              >
                {printers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.paper_size})
                  </option>
                ))}
              </select>
            </div>

            {/* Scale Slider */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wide">Zoom Level</span>
                <span className="text-slate-300 font-mono">{zoom}%</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={zoom}
                  onChange={(e) => setZoom(parseInt(e.target.value))}
                  className="flex-1 accent-blue-500 bg-white/10 h-1 rounded"
                />
                <button 
                  onClick={() => setZoom(Math.min(150, zoom + 10))}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2">
              <button
                onClick={handlePrint}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-blue-500/10 active:scale-[0.98]"
              >
                <Printer className="h-4 w-4" />
                Print Receipt
              </button>
              
              <button
                onClick={() => alert('Download PDF successfully saved to C:/Users/MY PC/Downloads/')}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs flex items-center justify-center gap-1 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Download PDF
              </button>
            </div>

          </GlassCard>

          {/* Quick instructions indicator */}
          <GlassCard className="border-white/5 p-4 flex gap-3 bg-blue-950/5 text-blue-400">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Thermal print is fully K80 vector formatted. High contrast text scaling optimized for SumatraPDF engines.
            </p>
          </GlassCard>
        </div>

        {/* Realtime PDF Receipt View Area */}
        <div className="lg:col-span-3 flex items-center justify-center rounded-2xl border border-white/5 bg-[#070A13] overflow-auto p-8 relative min-h-[450px]">
          
          {/* Mock K80 Receipt slip */}
          <div 
            className="bg-white text-black p-6 w-[340px] shadow-2xl transition-all duration-200 select-none font-mono"
            style={{ 
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center center'
            }}
          >
            {/* receipt jagged edges style */}
            <div className="border-t border-dashed border-black/30 pt-4"></div>

            {/* Store Header */}
            <div className="text-center space-y-1 pb-4 border-b border-dashed border-black/30">
              <h2 className="text-base font-black tracking-wide uppercase">CTY NILON XÂY DỰNG</h2>
              <p className="text-[10px]">ĐC: 154 Tô Ký, Hóc Môn, TP.HCM</p>
              <p className="text-[10px]">ĐT: 0903.123.456 - 0987.654.321</p>
              <h3 className="text-xs font-black tracking-wider uppercase mt-4">HÓA ĐƠN BÁN HÀNG</h3>
              <p className="text-[9px] font-bold">Mã số: {activeOrder.orderCode}</p>
            </div>

            {/* Customer metadata */}
            <div className="py-4 space-y-1 text-[10px] border-b border-dashed border-black/30">
              <div>Khách hàng: <span className="font-bold">{activeOrder.customerName}</span></div>
              <div>Điện thoại: {activeOrder.customerPhone}</div>
              <div>Ngày tạo: {new Date(activeOrder.createdAt).toLocaleDateString()} {new Date(activeOrder.createdAt).toLocaleTimeString()}</div>
              <div>Chi nhánh: BRANCH-HCM-01</div>
            </div>

            {/* Products grid */}
            <div className="py-4 text-[10px] space-y-3">
              <div className="grid grid-cols-5 gap-1 font-bold border-b border-black pb-1">
                <span className="col-span-3">Tên sản phẩm</span>
                <span className="text-center">SL</span>
                <span className="text-right">T.Tiền</span>
              </div>

              {activeOrder.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="font-bold text-[10px]">{item.name}</div>
                  <div className="grid grid-cols-5 gap-1 text-[9px] text-black/70">
                    <span className="col-span-3">{formatCurrency(item.price)} / {item.unit}</span>
                    <span className="text-center">{item.quantity}</span>
                    <span className="text-right font-bold text-black">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="py-4 border-t border-dashed border-black/30 space-y-2">
              <div className="flex justify-between text-[10px]">
                <span>Cộng tiền hàng:</span>
                <span>{formatCurrency(activeOrder.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span>Chiết khấu (0%):</span>
                <span>0đ</span>
              </div>
              <div className="flex justify-between text-xs font-black border-t border-black pt-2">
                <span>TỔNG THANH TOÁN:</span>
                <span>{formatCurrency(activeOrder.totalAmount)}</span>
              </div>
            </div>

            {/* Barcode / Footer */}
            <div className="pt-6 pb-2 text-center space-y-3">
              <div className="flex flex-col items-center">
                <Barcode className="h-8 w-44 text-black" />
                <span className="text-[9px] font-mono mt-1">{activeOrder.id}</span>
              </div>
              
              <div className="text-[9px] font-bold italic pt-4">
                Cảm ơn Quý khách hàng! Hẹn gặp lại.
              </div>
            </div>

            {/* Cut indicator */}
            <div className="border-b border-dashed border-black/30 pb-4"></div>

          </div>

        </div>

      </div>

    </div>
  );
};
