"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Phone, 
  Mail, 
  Building2, 
  MessageSquare, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validations/contact.schema";
import { toast } from "react-hot-toast";

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactInput) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus("success");
        toast.success(result.message);
        reset();
        // Reset status after 5 seconds
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        setSubmitStatus("error");
        toast.error(result.message || "Gửi thất bại");
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
      toast.error("Đã xảy ra lỗi kết nối");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (hasError?: boolean) => `
    w-full pl-11 pr-4 py-3 min-h-[44px] bg-white border rounded-[12px] outline-none transition-all duration-200 text-base placeholder:text-sm leading-[1.5]
    ${hasError 
      ? "border-red-500 focus:ring-2 focus:ring-red-100" 
      : "border-slate-300 focus:border-[#2b6cb0] focus:ring-2 focus:ring-[#2b6cb0]/20"
    }
  `;

  const labelClasses = "block text-sm font-medium text-slate-700 mb-1.5 ml-1";

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-sm p-6 md:p-10 rounded-[12px] shadow-1 border border-slate-100">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="space-y-1">
            <label className={labelClasses}>Họ và tên *</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2b6cb0] transition-colors">
                <User size={18} />
              </div>
              <input
                {...register("name")}
                type="text"
                placeholder="Nguyễn Văn A"
                className={inputClasses(!!errors.name)}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500 mt-1 ml-1">{errors.name.message}</p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-1">
            <label className={labelClasses}>Số điện thoại *</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2b6cb0] transition-colors">
                <Phone size={18} />
              </div>
              <input
                {...register("phone")}
                type="tel"
                placeholder="0912 345 678"
                className={inputClasses(!!errors.phone)}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1 ml-1">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Field */}
          <div className="space-y-1">
            <label className={labelClasses}>Email</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2b6cb0] transition-colors">
                <Mail size={18} />
              </div>
              <input
                {...register("email")}
                type="email"
                placeholder="email@example.com"
                className={inputClasses(!!errors.email)}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 mt-1 ml-1">{errors.email.message}</p>
            )}
          </div>

          {/* Company Field */}
          <div className="space-y-1">
            <label className={labelClasses}>Tên công ty</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2b6cb0] transition-colors">
                <Building2 size={18} />
              </div>
              <input
                {...register("company")}
                type="text"
                placeholder="Công ty CP Nilon..."
                className={inputClasses()}
              />
            </div>
          </div>
        </div>

        {/* Message Field */}
        <div className="space-y-1">
          <label className={labelClasses}>Nội dung cần tư vấn *</label>
          <div className="relative group">
            <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-[#2b6cb0] transition-colors">
              <MessageSquare size={18} />
            </div>
            <textarea
              {...register("message")}
              rows={4}
              placeholder="Nhập nội dung yêu cầu của bạn (tối thiểu 10 ký tự)..."
              className={`${inputClasses(!!errors.message)} resize-none`}
            />
          </div>
          {errors.message && (
            <p className="text-sm text-red-500 mt-1 ml-1">{errors.message.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            type="submit"
            className={`
              w-full min-h-[44px] py-3.5 px-6 rounded-[12px] font-semibold text-base flex items-center justify-center gap-2 transition-all shadow-1 leading-none
              ${isSubmitting 
                ? "bg-slate-300 cursor-not-allowed text-slate-600" 
                : "bg-[#2b6cb0] hover:bg-[#3182ce] text-white"
              }
            `}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>ĐANG GỬI...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>GỬI BÁO GIÁ NGAY</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {submitStatus === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-xl border border-green-100"
            >
              <CheckCircle2 size={20} />
              <span className="text-sm font-medium">Gửi liên hệ thành công! Admin sẽ liên hệ lại sớm.</span>
            </motion.div>
          )}
          {submitStatus === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100"
            >
              <AlertCircle size={20} />
              <span className="text-sm font-medium">Gửi thất bại. Vui lòng thử lại sau hoặc gọi hotline.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default ContactForm;
