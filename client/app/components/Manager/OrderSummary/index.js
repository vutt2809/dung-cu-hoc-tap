/**
 *
 * OrderSummary
 *
 */

import React from 'react';

import { Col } from 'reactstrap';
import { formatCurrencyVN } from '../../../utils/format';

const OrderSummary = props => {
  const { order } = props;

  // Tính tổng tiền từ các item trong đơn hàng
  const totalItems = (order.items || []).reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  const totalTax = order.totalTax || 0;
  const shipping = 0;
  const totalWithTax = totalItems + totalTax + shipping;

  return (
    <Col className='order-summary pt-3'>
      <h2>Tóm tắt đơn hàng</h2>
      <div className='d-flex align-items-center summary-item'>
        <p className='summary-label'>Tạm tính</p>
        <p className='summary-value ml-auto'>{formatCurrencyVN(totalItems)}</p>
      </div>
      <div className='d-flex align-items-center summary-item'>
        <p className='summary-label'>Thuế</p>
        <p className='summary-value ml-auto'>{formatCurrencyVN(totalTax)}</p>
      </div>
      <div className='d-flex align-items-center summary-item'>
        <p className='summary-label'>Vận chuyển</p>
        <p className='summary-value ml-auto'>0₫</p>
      </div>
      <hr />
      <div className='d-flex align-items-center summary-item'>
        <p className='summary-label'>Tổng cộng</p>
        <p className='summary-value ml-auto'>{formatCurrencyVN(totalWithTax)}</p>
      </div>
    </Col>
  );
};

export default OrderSummary;
