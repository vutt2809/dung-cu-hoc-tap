/**
 *
 * OrderMeta
 *
 */

import React from 'react';

import { Row, Col } from 'reactstrap';

import { CART_ITEM_STATUS } from '../../../constants';
import { formatDateVN } from '../../../utils/format';
import Button from '../../Common/Button';
import { ArrowBackIcon } from '../../Common/Icon';

const OrderMeta = props => {
  const { order, cancelOrder, onBack } = props;

  const isCancelled =
    order.status?.toLowerCase() === 'cancelled' ||
    ((order.items || []).length > 0 &&
      (order.items || []).every(
        i => (i.status?.toLowerCase() || '') === 'cancelled'
      ));

  const isDelivered =
    order.status?.toLowerCase() === 'delivered' ||
    (order.items || []).some(
      i => (i.status?.toLowerCase() || '') === 'delivered'
    );

  const renderMetaAction = () => {
    if (!isCancelled && !isDelivered) {
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
          <Row>
            <Col xs='4'>
              <p className='one-line-ellipsis'>Mã đơn hàng</p>
            </Col>
            <Col xs='8'>
              <span className='order-label one-line-ellipsis'>{` ${order.order_number || order.id || order._id}`}</span>
            </Col>
          </Row>
          <Row>
            <Col xs='4'>
              <p className='one-line-ellipsis'>Ngày đặt hàng</p>
            </Col>
            <Col xs='8'>
              <span className='order-label one-line-ellipsis'>{` ${formatDateVN(order.created || order.created_at)}`}</span>
            </Col>
          </Row>
          <Row>
            <Col xs='4'>
              <p className='one-line-ellipsis'>Trạng thái</p>
            </Col>
            <Col xs='8'>
              {isCancelled ? (
                <span className='custom-badge custom-badge-danger'>
                  <i className='fa fa-ban mr-1' /> Đã hủy
                </span>
              ) : isDelivered ? (
                <span className='custom-badge custom-badge-success'>
                  <i className='fa fa-check mr-1' /> Đã giao hàng
                </span>
              ) : (
                <span className='custom-badge custom-badge-primary'>
                  <i className='fa fa-clock-o mr-1' /> Đang xử lý
                </span>
              )}
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
