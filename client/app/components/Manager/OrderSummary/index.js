/**
 *
 * OrderSummary
 *
 */

import React from 'react';

import { Col } from 'reactstrap';

const OrderSummary = props => {
  const { order } = props;

  return (
    <Col className='order-summary pt-3'>
      <h2>Tóm tắt đơn hàng</h2>
      <div className='d-flex align-items-center summary-item'>
        <p className='summary-label'>Tạm tính</p>
        <p className='summary-value ml-auto'>{order.total ? order.total.toLocaleString('vi-VN') + '₫' : '0₫'}</p>
      </div>
      <div className='d-flex align-items-center summary-item'>
        <p className='summary-label'>Thuế</p>
        <p className='summary-value ml-auto'>{order.totalTax ? order.totalTax.toLocaleString('vi-VN') + '₫' : '0₫'}</p>
      </div>
      <div className='d-flex align-items-center summary-item'>
        <p className='summary-label'>Vận chuyển</p>
        <p className='summary-value ml-auto'>0₫</p>
      </div>
      <hr />
      <div className='d-flex align-items-center summary-item'>
        <p className='summary-label'>Tổng cộng</p>
        <p className='summary-value ml-auto'>{order.totalWithTax ? order.totalWithTax.toLocaleString('vi-VN') + '₫' : (order.total ? order.total.toLocaleString('vi-VN') + '₫' : '0₫')}</p>
      </div>
    </Col>
  );
};

export default OrderSummary;
