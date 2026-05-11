import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Họ và tên là bắt buộc"),
  phone: z.string().regex(/^(0|84)[0-9\s.-]{9,13}$/, "Số điện thoại không đúng định dạng"),
  email: z.string().email("Email không hợp lệ").or(z.literal("")),
  company: z.string().optional(),
  need: z.string().optional(),
  message: z.string().optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
