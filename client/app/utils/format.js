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

// Lấy thông tin trạng thái đơn hàng (Đồng bộ giữa order.status và order.items)
export function getOrderStatusInfo(order) {
  if (!order) {
    return {
      key: 'Processing',
      label: 'Đang xử lý',
      className: 'custom-badge-primary',
      icon: 'fa-clock-o'
    };
  }

  const rawStatus = (order.status || '').toString().trim().toLowerCase();
  const items = order.items || [];

  if (items.length > 0) {
    const allCancelled = items.every(
      i => (i.status || '').toString().trim().toLowerCase() === 'cancelled'
    );
    if (allCancelled) {
      return {
        key: 'Cancelled',
        label: 'Đã hủy',
        className: 'custom-badge-danger',
        icon: 'fa-ban'
      };
    }

    const nonCancelledItems = items.filter(
      i => (i.status || '').toString().trim().toLowerCase() !== 'cancelled'
    );

    const allDelivered =
      nonCancelledItems.length > 0 &&
      nonCancelledItems.every(
        i => (i.status || '').toString().trim().toLowerCase() === 'delivered'
      );
    if (allDelivered) {
      return {
        key: 'Delivered',
        label: 'Đã giao hàng',
        className: 'custom-badge-success',
        icon: 'fa-check'
      };
    }

    const anyShippedOrDelivered = nonCancelledItems.some(i => {
      const s = (i.status || '').toString().trim().toLowerCase();
      return s === 'shipped' || s === 'delivered';
    });
    if (anyShippedOrDelivered) {
      return {
        key: 'Shipped',
        label: 'Đã gửi hàng',
        className: 'custom-badge-warning',
        icon: 'fa-truck'
      };
    }

    return {
      key: 'Processing',
      label: 'Đang xử lý',
      className: 'custom-badge-primary',
      icon: 'fa-clock-o'
    };
  }

  // Fallback nếu chưa load danh sách items
  if (rawStatus === 'cancelled') {
    return {
      key: 'Cancelled',
      label: 'Đã hủy',
      className: 'custom-badge-danger',
      icon: 'fa-ban'
    };
  }
  if (rawStatus === 'delivered') {
    return {
      key: 'Delivered',
      label: 'Đã giao hàng',
      className: 'custom-badge-success',
      icon: 'fa-check'
    };
  }
  if (rawStatus === 'shipped') {
    return {
      key: 'Shipped',
      label: 'Đã gửi hàng',
      className: 'custom-badge-warning',
      icon: 'fa-truck'
    };
  }

  return {
    key: 'Processing',
    label: 'Đang xử lý',
    className: 'custom-badge-primary',
    icon: 'fa-clock-o'
  };
} 