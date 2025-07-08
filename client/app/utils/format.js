// Định dạng tiền tệ Việt Nam
export function formatCurrencyVN(amount) {
  if (isNaN(amount)) return '0 ₫';
  return Number(amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

// Định dạng ngày/tháng/năm Việt Nam
export function formatDateVN(date) {
  if (!date) return 'Không xác định';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Không xác định';
  return d.toLocaleDateString('vi-VN');
} 