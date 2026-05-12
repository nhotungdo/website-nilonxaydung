'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Loader2, Send } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  company: z.string().optional(),
  product: z.string().min(1, 'Interested product is required'),
  quantity: z.string().min(1, 'Quantity is required'),
  message: z.string().min(1, 'Request message cannot be empty'),
});

type FormValues = z.infer<typeof formSchema>;

export default function QuoteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      company: '',
      product: '',
      quantity: '',
      message: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Quote request submitted successfully!');
        reset();
      } else {
        toast.error(result.error || 'An error occurred, please try again.');
      }
    } catch (error: unknown) {
      console.error('Form submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred, please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-2xl mx-auto p-6 md:p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 ml-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            {...register('fullName')}
            className={`w-full px-5 py-3.5 rounded-full border bg-gray-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white ${
              errors.fullName ? 'border-red-400 focus:border-red-500' : 'border-gray-200 hover:border-blue-400 focus:border-blue-500'
            }`}
            placeholder="Nguyen Van A"
          />
          {errors.fullName && <p className="text-red-500 text-xs font-medium ml-4">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 ml-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className={`w-full px-5 py-3.5 rounded-full border bg-gray-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white ${
              errors.phone ? 'border-red-400 focus:border-red-500' : 'border-gray-200 hover:border-blue-400 focus:border-blue-500'
            }`}
            placeholder="0909123456"
          />
          {errors.phone && <p className="text-red-500 text-xs font-medium ml-4">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 ml-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`w-full px-5 py-3.5 rounded-full border bg-gray-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white ${
              errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 hover:border-blue-400 focus:border-blue-500'
            }`}
            placeholder="example@gmail.com"
          />
          {errors.email && <p className="text-red-500 text-xs font-medium ml-4">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="company" className="block text-sm font-semibold text-gray-700 ml-1">
            Company Name
          </label>
          <input
            id="company"
            type="text"
            {...register('company')}
            className="w-full px-5 py-3.5 rounded-full border border-gray-200 bg-gray-50/50 hover:border-blue-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white"
            placeholder="ABC Company (Optional)"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label htmlFor="product" className="block text-sm font-semibold text-gray-700 ml-1">
            Interested Product <span className="text-red-500">*</span>
          </label>
          <input
            id="product"
            type="text"
            {...register('product')}
            className={`w-full px-5 py-3.5 rounded-full border bg-gray-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white ${
              errors.product ? 'border-red-400 focus:border-red-500' : 'border-gray-200 hover:border-blue-400 focus:border-blue-500'
            }`}
            placeholder="Concrete floor lining plastic"
          />
          {errors.product && <p className="text-red-500 text-xs font-medium ml-4">{errors.product.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 ml-1">
            Quantity needed <span className="text-red-500">*</span>
          </label>
          <input
            id="quantity"
            type="text"
            {...register('quantity')}
            className={`w-full px-5 py-3.5 rounded-full border bg-gray-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white ${
              errors.quantity ? 'border-red-400 focus:border-red-500' : 'border-gray-200 hover:border-blue-400 focus:border-blue-500'
            }`}
            placeholder="200 rolls"
          />
          {errors.quantity && <p className="text-red-500 text-xs font-medium ml-4">{errors.quantity.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 ml-1">
          Request Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          rows={4}
          {...register('message')}
          className={`w-full px-5 py-4 rounded-3xl border bg-gray-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white resize-none ${
            errors.message ? 'border-red-400 focus:border-red-500' : 'border-gray-200 hover:border-blue-400 focus:border-blue-500'
          }`}
          placeholder="Need an urgent quote for a project in Hanoi."
        />
        {errors.message && <p className="text-red-500 text-xs font-medium ml-4">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgb(37,99,235,0.23)] hover:-translate-y-0.5 active:translate-y-0"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Get a Quote Now
          </>
        )}
      </button>
    </form>
  );
}
