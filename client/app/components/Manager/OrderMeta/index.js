/**
 *
 * OrderMeta
 *
 */

import React from 'react';

import { Row, Col } from 'reactstrap';

import { formatDateVN, getOrderStatusInfo } from '../../../utils/format';
import Button from '../../Common/Button';
import { ArrowBackIcon } from '../../Common/Icon';

const OrderMeta = props => {
  const { order, cancelOrder, onBack } = props;

  const statusInfo = getOrderStatusInfo(order);
  const isCancelled = statusInfo.key === 'Cancelled';
  const isDelivered = statusInfo.key === 'Delivered';
  const isShipped = statusInfo.key === 'Shipped';

  const renderMetaAction = () => {
    if (!isCancelled && !isDelivered && !isShipped) {
      return <Button size='sm' text='Hủy đơn hàng' onClick={cancelOrder} />;
    }
    return null;
  };

  return (
    <div className='order-meta'>
      <div className='d-flex align-items-center justify-content-between mb-3 title'>
        <h2 className='mb-0'>Chi tiết đơn hàng</h2>
        <Button
          variant='link'
          icon={<ArrowBackIcon />}
          size='sm'
          text='Quay lại đơn hàng'
          onClick={onBack}
        ></Button>
      </div>

      <Row>
        <Col xs='12' md='8'>
          <Row className='align-items-center mb-2'>
            <Col xs='4'>
              <p className='one-line-ellipsis mb-0'>Mã đơn hàng</p>
            </Col>
            <Col xs='8'>
              <span className='order-label one-line-ellipsis'>{` ${order.order_number || order.id || order._id}`}</span>
            </Col>
          </Row>
          <Row className='align-items-center mb-2'>
            <Col xs='4'>
              <p className='one-line-ellipsis mb-0'>Ngày đặt hàng</p>
            </Col>
            <Col xs='8'>
              <span className='order-label one-line-ellipsis'>{` ${formatDateVN(order.created || order.created_at)}`}</span>
            </Col>
          </Row>
          <Row className='align-items-center mb-2'>
            <Col xs='4'>
              <p className='one-line-ellipsis mb-0'>Trạng thái</p>
            </Col>
            <Col xs='8'>
              <span className={`custom-badge ${statusInfo.className}`}>
                <i className={`fa ${statusInfo.icon} mr-1`} /> {statusInfo.label}
              </span>
            </Col>
          </Row>
        </Col>
        <Col xs='12' md='4' className='text-left text-md-right'>
          {renderMetaAction()}
        </Col>
      </Row>
    </div>
  );
};

export default OrderMeta;
