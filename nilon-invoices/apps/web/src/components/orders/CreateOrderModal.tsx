'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ShoppingCart,
  X,
  Plus,
  Loader2,
  ShoppingBag,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomerAutocomplete } from './CustomerAutocomplete';
import { OrderProductRow } from './OrderProductRow';
import { OrderSummary } from './OrderSummary';
import { useCreateOrder } from '@/hooks/useCreateOrder';
import type { Customer, Product } from '@/services/api';
import { CreateCustomerModal } from '@/components/customers/CreateCustomerModal';

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const orderItemSchema = z.object({
  product: z.custom<Product>((v) => v !== null && typeof v === 'object' && 'id' in v, {
    message: 'Vui lòng chọn sản phẩm',
  }),
  quantity: z.number({ invalid_type_error: 'Số lượng không hợp lệ' }).int().min(1, 'Số lượng tối thiểu là 1'),
});

const createOrderSchema = z.object({
  customer: z.custom<Customer>((v) => v !== null && typeof v === 'object' && 'id' in v, {
    message: 'Vui lòng chọn khách hàng',
  }),
  note: z.string().optional(),
  items: z
    .array(orderItemSchema)
    .min(1, 'Vui lòng thêm ít nhất 1 sản phẩm')
    .refine(
      (items) =>
        items.every(
          (item) => item.product === null || item.quantity <= item.product.stock
        ),
      { message: 'Số lượng vượt quá tồn kho' }
    ),
});

type CreateOrderForm = z.infer<typeof createOrderSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface CreateOrderModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CreateOrderModal({ open, onClose, onSuccess }: CreateOrderModalProps) {
  const { createOrder, isSubmitting, error: submitError } = useCreateOrder();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<CreateOrderForm>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      customer: undefined,
      note: '',
      items: [],
    },
  });

  const [showCreateCustomer, setShowCreateCustomer] = useState(false);

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const watchedItems = useWatch({ control, name: 'items' });

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => reset(), 300);
    }
  }, [open, reset]);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Handle Ctrl+N to open modal (moved to page level or kept here if context allows)
  // Actually, I'll add it to the page instead.

  const handleAddItem = useCallback(() => {
    append({ product: null as unknown as Product, quantity: 1 });
  }, [append]);



  const onSubmit = async (data: CreateOrderForm) => {
    try {
      const order = await createOrder({
        customerId: data.customer.id,
        items: data.items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        note: data.note || undefined,
      });

      toast.success('Đơn hàng đã được tạo thành công');
      
      // Invalidate queries to refresh dashboard
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });

      onSuccess();
      onClose();
      
      // Redirect to order details
      router.push(`/dashboard/orders/${order.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo đơn';
      toast.error(message);
    }
  };

  // Calculate realtime totals from watched items
  const validItems = watchedItems?.filter((i) => i.product) ?? [];
  const subtotal = validItems.reduce(
    (acc, i) => acc + Number(i.product?.price ?? 0) * i.quantity,
    0
  );

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="relative w-full max-w-[900px] bg-white rounded-[2rem] shadow-2xl shadow-slate-900/20 flex flex-col max-h-[92vh] overflow-hidden"
          >
            {/* ── Header ─────────────────────────────────────────── */}
            <div className="flex items-center gap-4 px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
              <div className="w-13 h-13 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 p-3">
                <ShoppingCart size={26} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Tạo đơn hàng mới</h2>
                <p className="text-sm font-semibold text-slate-400 mt-0.5">
                  Điền thông tin chi tiết để tạo đơn hàng
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-white/70 rounded-xl transition-all"
                aria-label="Đóng"
              >
                <X size={20} />
              </button>
            </div>

            {/* ── Form Content ────────────────────────────────────── */}
            <form
              id="create-order-form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex-1 overflow-y-auto"
            >
              <div className="px-8 py-7 space-y-7">

                {/* Section 1: Customer + Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-4 h-4 bg-blue-600 rounded-md flex items-center justify-center text-white text-[8px] font-black">KH</span>
                      Khách hàng <span className="text-red-400">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="customer"
                      render={({ field }) => (
                        <CustomerAutocomplete
                          value={field.value as Customer | null ?? null}
                          onChange={field.onChange}
                          onCreateNew={() => setShowCreateCustomer(true)}
                          error={errors.customer?.message}
                        />
                      )}
                    />
                    <CreateCustomerModal
                      open={showCreateCustomer}
                      onClose={() => setShowCreateCustomer(false)}
                      onSuccess={(customer) => {
                        reset({ ...getValues(), customer });
                      }}
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <FileText size={14} className="text-slate-400" />
                      Ghi chú đơn hàng
                    </label>
                    <Controller
                      control={control}
                      name="note"
                      render={({ field }) => (
                        <textarea
                          {...field}
                          rows={3}
                          placeholder="Giao trong giờ hành chính, yêu cầu đặc biệt, ghi chú nội bộ..."
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Section 2: Products */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <ShoppingBag size={14} className="text-slate-400" />
                      Danh sách sản phẩm <span className="text-red-400">*</span>
                      {fields.length > 0 && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black">
                          {fields.length} dòng
                        </span>
                      )}
                    </label>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 active:scale-95"
                    >
                      <Plus size={14} />
                      Thêm sản phẩm
                    </button>
                  </div>

                  {/* Error for items array */}
                  {errors.items?.root?.message && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
                      <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                      <p className="text-sm font-bold text-red-600">{errors.items.root.message}</p>
                    </div>
                  )}
                  {errors.items?.message && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
                      <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                      <p className="text-sm font-bold text-red-600">{errors.items.message}</p>
                    </div>
                  )}

                  {/* Empty state */}
                  {fields.length === 0 && (
                    <div className="py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                        <ShoppingBag size={28} className="text-slate-300" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-500">Chưa có sản phẩm</p>
                        <p className="text-xs text-slate-400 mt-1">Nhấn nút để thêm sản phẩm vào đơn hàng</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
                      >
                        <Plus size={16} />
                        Thêm sản phẩm đầu tiên
                      </button>
                    </div>
                  )}

                  {/* Product rows */}
                  <AnimatePresence mode="popLayout">
                    {fields.map((field, index) => (
                      <Controller
                        key={field.id}
                        control={control}
                        name={`items.${index}`}
                        render={({ field: itemField }) => (
                          <OrderProductRow
                            item={itemField.value}
                            index={index}
                            onUpdate={(_, data) => {
                              itemField.onChange({ ...itemField.value, ...data });
                            }}
                            onRemove={() => remove(index)}
                            productError={
                              (errors.items?.[index] as { product?: { message?: string } } | undefined)?.product?.message
                            }
                            quantityError={
                              (errors.items?.[index] as { quantity?: { message?: string } } | undefined)?.quantity?.message
                            }
                          />
                        )}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Summary */}
                {validItems.length > 0 && (
                  <OrderSummary items={watchedItems as Parameters<typeof OrderSummary>[0]['items']} />
                )}

                {/* Submit error */}
                {submitError && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                    <p className="text-sm font-bold text-red-600">{submitError}</p>
                  </div>
                )}
              </div>
            </form>

            {/* ── Footer ─────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng tiền</p>
                <p className="text-2xl font-black text-slate-900 tracking-tight">
                  {subtotal > 0 ? subtotal.toLocaleString('vi-VN') + 'đ' : '—'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-slate-500 font-bold hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  form="create-order-form"
                  disabled={isSubmitting}
                  className="flex items-center gap-2.5 px-8 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-60 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      Xác nhận tạo đơn
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
