/**
 *
 * OrderList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';

import { formatDate, formatCurrencyVN, formatDateVN } from '../../../utils/format';
import { CART_ITEM_STATUS } from '../../../constants';

const OrderList = props => {
  const { orders } = props;

  const renderFirstItem = order => {
    if (order.items && order.items.length > 0) {
      const item = order.items[0];
      return (
        <img
          className='item-image'
          src={`${
            item.product && (item.product.image_url || item.product.imageUrl)
              ? (item.product.image_url || item.product.imageUrl)
              : '/images/placeholder-image.png'
          }`}
          alt={item.product?.name || 'Product'}
          onError={(e) => {
            e.target.src = '/images/placeholder-image.png';
          }}
        />
      );
    } else {
      return <img className='item-image' src='/images/placeholder-image.png' alt="Placeholder" />;
    }
  };

  return (
    <div className='order-list'>
      {orders.map((order, index) => (
        <div key={index} className='order-box'>
          <Link to={`/order/${order.id}`} className='d-block box-link'>
            <div className='d-flex flex-column flex-lg-row mb-3'>
              <div className='order-first-item p-lg-3'>
                {renderFirstItem(order)}
              </div>
              <div className='d-flex flex-column flex-xl-row justify-content-between flex-1 ml-lg-2 mr-xl-4 p-3'>
                <div className='order-details'>
                  <div className='mb-1'>
                    <span>{"Trạng thái"}</span>
                    {order?.items ? (
                      <span className='order-label order-status'>{` ${CART_ITEM_STATUS[order?.items[0].status] || order?.items[0].status}`}</span>
                    ) : (
                      <span className='order-label order-status'>{` Không có sẵn`}</span>
                    )}
                  </div>
                  <div className='mb-1'>
                    <span>{"Mã đơn hàng"}</span>
                    <span className='order-label'>{` ${order.id}`}</span>
                  </div>
                  <div className='mb-1'>
                    <span>{"Ngày đặt hàng"}</span>
                    <span className='order-label'>{` ${formatDateVN(order.created_at)}`}</span>
                  </div>
                  <div className='mb-1'>
                    <span>{"Tổng tiền"}</span>
                    <span className='order-label'>{` ${formatCurrencyVN((order?.totalWithTax ? order?.totalWithTax : (order?.total || 0)))}₫`}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
