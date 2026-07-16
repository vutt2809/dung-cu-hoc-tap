/**
 *
 * OrderDetails
 *
 */

import React from 'react';

import { Row, Col } from 'reactstrap';

import OrderMeta from '../OrderMeta';
import OrderItems from '../OrderItems';
import OrderSummary from '../OrderSummary';
import { formatCurrencyVN, formatDateVN } from '../../../utils/format';

const OrderDetails = props => {
  const { order, user, cancelOrder, updateOrderItemStatus, onBack } = props;

  let shippingDetails = null;
  if (order.notes) {
    try {
      shippingDetails = typeof order.notes === 'string' ? JSON.parse(order.notes) : order.notes;
    } catch (e) {
      // Notes is plain text or not JSON
    }
  }

  const shippingName = order.shipping_name || shippingDetails?.shipping_name;
  const shippingPhone = order.shipping_phone || shippingDetails?.shipping_phone;
  const shippingAddress = order.shipping_address || shippingDetails?.shipping_address;
  const shippingNote = order.shipping_note || shippingDetails?.shipping_note || (typeof order.notes === 'string' && !shippingDetails ? order.notes : '');

  return (
    <div className='order-details'>
      <Row>
        <Col xs='12' md='12'>
          <OrderMeta order={order} cancelOrder={cancelOrder} onBack={onBack} />
        </Col>
      </Row>

      {(shippingName || shippingPhone || shippingAddress) && (
        <Row className='mt-4'>
          <Col xs='12'>
            <div className='shipping-details-box' style={{
              padding: '20px', 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px', 
              background: '#fcfcfc',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                Thông tin giao nhận hàng
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, auto) 1fr', gap: '10px 20px', fontSize: '14px', alignItems: 'start' }}>
                {shippingName && (
                  <>
                    <div style={{ color: '#666', fontWeight: '500' }}>Người nhận:</div>
                    <div style={{ fontWeight: '600', color: '#111' }}>{shippingName}</div>
                  </>
                )}
                {shippingPhone && (
                  <>
                    <div style={{ color: '#666', fontWeight: '500' }}>Số điện thoại:</div>
                    <div style={{ color: '#111' }}>{shippingPhone}</div>
                  </>
                )}
                {shippingAddress && (
                  <>
                    <div style={{ color: '#666', fontWeight: '500' }}>Địa chỉ nhận:</div>
                    <div style={{ color: '#111', lineHeight: '1.4' }}>{shippingAddress}</div>
                  </>
                )}
                {shippingNote && (
                  <>
                    <div style={{ color: '#666', fontWeight: '500' }}>Ghi chú:</div>
                    <div style={{ color: '#555', fontStyle: 'italic', background: '#f5f5f5', padding: '6px 12px', borderRadius: '4px', borderLeft: '3px solid #ccc' }}>
                      {shippingNote}
                    </div>
                  </>
                )}
              </div>
            </div>
          </Col>
        </Row>
      )}

      <Row className='mt-5'>
        <Col xs='12' lg='8'>
          <OrderItems
            order={order}
            user={user}
            updateOrderItemStatus={updateOrderItemStatus}
          />
        </Col>
        <Col xs='12' lg='4' className='mt-5 mt-lg-0'>
          <OrderSummary order={order} />
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetails;
