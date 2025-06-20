/**
 *
 * OrderList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';

import { formatDate } from '../../../utils/date';
import { VI } from '../../../constants';

const OrderList = props => {
  const { orders } = props;

  const renderFirstItem = order => {
    if (order.products) {
      const product = order.products[0].product;
      return (
        <img
          className='item-image'
          src={`${
            product && product?.imageUrl
              ? product?.imageUrl
              : '/images/placeholder-image.png'
          }`}
        />
      );
    } else {
      return <img className='item-image' src='/images/placeholder-image.png' />;
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
                    <span>{VI['Status']}</span>
                    {order?.products ? (
                      <span className='order-label order-status'>{` ${order?.products[0].status}`}</span>
                    ) : (
                      <span className='order-label order-status'>{` Unavailable`}</span>
                    )}
                  </div>
                  <div className='mb-1'>
                    <span>{VI['Order ID']}</span>
                    <span className='order-label'>{` ${order.id}`}</span>
                  </div>
                  <div className='mb-1'>
                    <span>{VI['Order Date']}</span>
                    <span className='order-label'>{` ${formatDate(
                      order.created
                    )}`}</span>
                  </div>
                  <div className='mb-1'>
                    <span>{VI['Total']}</span>
                    <span className='order-label'>{` $${
                      order?.totalWithTax ? order?.totalWithTax : 0
                    }`}</span>
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
