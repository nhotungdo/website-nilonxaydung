import { z } from "zod";
import { VN_PHONE_REGEX, VN_PHONE_ERROR_MSG } from "./phone";

export const contactSchema = z.object({
  name: z.string().min(1, "Họ và tên là bắt buộc"),
  phone: z
    .string()
    .min(1, "Số điện thoại là bắt buộc")
    .transform((v) => v.trim().replace(/\s/g, ""))
    .refine((v) => VN_PHONE_REGEX.test(v), VN_PHONE_ERROR_MSG),
  email: z.string().email("Email không hợp lệ").or(z.literal("")),
  company: z.string().optional(),
  need: z.string().optional(),
  message: z.string().optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
