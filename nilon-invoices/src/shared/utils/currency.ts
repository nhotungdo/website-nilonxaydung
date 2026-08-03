/**
 * Utility helper định dạng mệnh giá tiền tệ phân cách bằng dấu phẩy ","
 * Ví dụ: 1000000 -> "1,000,000 ₫" hoặc "1,000,000 VNĐ"
 */

export interface CurrencyFormatOptions {
  suffix?: string; // Ví dụ: '₫', 'VNĐ', 'đ' hoặc '' (không có hậu tố)
  showSymbol?: boolean; // Mặc định: true
  decimalPlaces?: number; // Số chữ số thập phân (mặc định: 0)
}

/**
 * Định dạng số thành chuỗi mệnh giá phân cách hàng nghìn bằng dấu phẩy ","
 * @param amount Số tiền (number hoặc string)
 * @param options Cấu hình định dạng (suffix, symbol, decimals)
 * @returns Chuỗi tiền đã format bằng dấu phẩy (VD: "1,500,000 ₫")
 */
export function formatCurrencyWithComma(
  amount: number | string | null | undefined,
  options: CurrencyFormatOptions = {}
): string {
  const { suffix = '₫', showSymbol = true, decimalPlaces = 0 } = options;

  if (amount === null || amount === undefined || amount === '') {
    return showSymbol && suffix ? `0 ${suffix}`.trim() : '0';
  }

  const numericValue = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;

  if (isNaN(numericValue)) {
    return showSymbol && suffix ? `0 ${suffix}`.trim() : '0';
  }

  // Format phân cách bằng dấu phẩy ","
  const parts = numericValue.toFixed(decimalPlaces).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const decimalPart = parts[1] ? `.${parts[1]}` : '';

  const formattedNumber = `${integerPart}${decimalPart}`;

  if (!showSymbol || !suffix) {
    return formattedNumber;
  }

  return `${formattedNumber} ${suffix}`.trim();
}

/**
 * Shortcut định dạng số tiền VNĐ bằng dấu phẩy (VD: "1,250,000 ₫")
 */
export function formatVNDComma(amount: number | string | null | undefined): string {
  return formatCurrencyWithComma(amount, { suffix: '₫', showSymbol: true });
}

/**
 * Shortcut định dạng số tiền VNĐ chữ (VD: "1,250,000 VNĐ")
 */
export function formatVNDTextComma(amount: number | string | null | undefined): string {
  return formatCurrencyWithComma(amount, { suffix: 'VNĐ', showSymbol: true });
}

/**
 * Shortcut chỉ định dạng chuỗi số phân cách dấu phẩy (VD: "1,250,000")
 */
export function formatNumberComma(amount: number | string | null | undefined): string {
  return formatCurrencyWithComma(amount, { showSymbol: false });
}

/**
 * Chuyển đổi chuỗi định dạng tiền mặt dấu phẩy ngược lại thành kiểu số pure number
 * Ví dụ: "1,250,000 ₫" -> 1250000
 */
export function parseCurrencyToNumber(formattedStr: string | null | undefined): number {
  if (!formattedStr) return 0;
  const cleanStr = formattedStr.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleanStr);
  return isNaN(parsed) ? 0 : parsed;
}
