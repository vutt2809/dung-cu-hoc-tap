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

  return (
    <Col className='order-summary pt-3'>
      <h2>Tóm tắt đơn hàng</h2>
      <div className='d-flex align-items-center summary-item'>
        <p className='summary-label'>Tạm tính</p>
        <p className='summary-value ml-auto'>{formatCurrencyVN(order.total)}</p>
      </div>
      <div className='d-flex align-items-center summary-item'>
        <p className='summary-label'>Thuế</p>
        <p className='summary-value ml-auto'>{formatCurrencyVN(order.totalTax)}</p>
      </div>
      <div className='d-flex align-items-center summary-item'>
        <p className='summary-label'>Vận chuyển</p>
        <p className='summary-value ml-auto'>0₫</p>
      </div>
      <hr />
      <div className='d-flex align-items-center summary-item'>
        <p className='summary-label'>Tổng cộng</p>
        <p className='summary-value ml-auto'>{formatCurrencyVN(order.totalWithTax ? order.totalWithTax : order.total)}</p>
      </div>
    </Col>
  );
};

export default OrderSummary;
