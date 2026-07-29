/**
 * Vietnamese Phone Number Validator
 *
 * Hỗ trợ các định dạng:
 *   - 10 chữ số bắt đầu bằng 0:     0912345678
 *   - Mã quốc tế +84 (11 ký tự):    +84912345678
 *   - Mã quốc tế 84  (11 chữ số):   84912345678
 *
 * Đầu số di động hợp lệ tại Việt Nam (theo quy hoạch kho số VNPT/Viettel/Mobifone/...):
 *   03x – 032, 033, 034, 035, 036, 037, 038, 039
 *   05x – 056, 058
 *   07x – 070, 076, 077, 078, 079
 *   08x – 081, 082, 083, 084, 085, 086, 088, 089
 *   09x – 090, 091, 092, 093, 094, 095, 096, 097, 098, 099
 *
 * Ngoài ra vẫn chấp nhận toàn bộ đầu số 03x / 05x / 07x / 08x / 09x
 * để tương thích với các đầu số mới được cấp phép trong tương lai.
 */

export const VN_PHONE_REGEX =
  /^(?:\+84|84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-9]|9[0-9])[0-9]{7}$/;

export const VN_PHONE_ERROR_MSG =
  "Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng số di động Việt Nam (VD: 0912345678)";

/** Trả về true nếu số điện thoại hợp lệ */
export function isValidVnPhone(phone: string): boolean {
  return VN_PHONE_REGEX.test(phone.trim().replace(/\s/g, ""));
}

/**
 * Chuẩn hóa số điện thoại về dạng 0xxxxxxxxx (10 số)
 * VD: "+84912345678" → "0912345678"
 *     "84912345678"  → "0912345678"
 */
export function normalizeVnPhone(phone: string): string {
  const cleaned = phone.trim().replace(/\s/g, "");
  if (cleaned.startsWith("+84")) return "0" + cleaned.slice(3);
  if (cleaned.startsWith("84") && cleaned.length === 11) return "0" + cleaned.slice(2);
  return cleaned;
}
