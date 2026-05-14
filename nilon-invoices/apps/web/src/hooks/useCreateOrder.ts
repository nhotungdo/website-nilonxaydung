'use client';

import { useState, useCallback } from 'react';
import { ordersApi } from '@/services/api';

export interface CreateOrderPayload {
  customerId: string;
  items: { productId: string; quantity: number }[];
  note?: string;
}

export function useCreateOrder() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = useCallback(async (data: CreateOrderPayload) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await ordersApi.create(data);
      return res.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi tạo đơn hàng';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { createOrder, isSubmitting, error };
}
