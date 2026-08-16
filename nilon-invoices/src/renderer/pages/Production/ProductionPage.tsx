import React from 'react';
import { Factory } from 'lucide-react';
import { useInventoryStore } from '../../stores/inventoryStore';
import { ProductionLogTable } from './components/ProductionLogTable';
import { DailyProductionModal } from './components/DailyProductionModal';

export const ProductionPage: React.FC = () => {
  const { setIsProductionModalOpen } = useInventoryStore();

  return (
    <div className="space-y-6 pb-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#005B52] uppercase tracking-wider">
            <Factory className="h-4 w-4" /> Quản Lý Sản Xuất
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Nhật Ký & Quản Lý Sản Xuất
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Theo dõi ca thổi nilon, cắt cuộn, sản lượng máy và tỷ lệ hao hụt phế phẩm.
          </p>
        </div>

        <button
          onClick={() => setIsProductionModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#005B52] text-white font-bold text-xs hover:bg-[#004740] shadow-md shadow-[#005B52]/20 transition-all flex items-center gap-2 active:scale-95"
        >
          <Factory className="h-4 w-4" /> Ghi Nhận Ca Sản Xuất
        </button>
      </div>

      {/* Production Log Table & Stats */}
      <ProductionLogTable />

      <DailyProductionModal />
    </div>
  );
};
