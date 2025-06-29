/**
 *
 * OrderItems
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';
import { Row, Col, DropdownItem } from 'reactstrap';

import { ROLES, CART_ITEM_STATUS } from '../../../constants';
import Button from '../../Common/Button';
import DropdownConfirm from '../../Common/DropdownConfirm';

const viStatus = {
  Processing: 'Đang xử lý',
  Shipped: 'Đã gửi hàng',
  Delivered: 'Đã giao',
  Cancelled: 'Đã hủy',
  NotProcessed: 'Chưa xử lý',
};

const OrderItems = props => {
  const { order, user, updateOrderItemStatus } = props;

  const renderPopoverContent = item => {
    const statuses = Object.values(CART_ITEM_STATUS);

    return (
      <div className='d-flex flex-column align-items-center justify-content-center'>
        {statuses.map((s, i) => (
          <DropdownItem
            key={`${s}-${i}`}
            className={s === item?.status ? 'active' : ''}
            onClick={() => updateOrderItemStatus(item.id, s)}
          >
            {viStatus[s]}
          </DropdownItem>
        ))}
      </div>
    );
  };

  const renderItemsAction = item => {
    const isAdmin = user.role === ROLES.Admin;

    if (item.status === CART_ITEM_STATUS.Delivered) {
      return (
        <Link
          to={`/product/${item.product.slug}`}
          className='btn-link text-center py-2 fs-12'
          style={{ minWidth: 120 }}
        >
          Đánh giá sản phẩm
        </Link>
      );
    } else if (item.status !== 'Cancelled') {
      if (!isAdmin) {
        return (
          <DropdownConfirm label='Hủy'>
            <div className='d-flex flex-column align-items-center justify-content-center p-2'>
              <p className='text-center mb-2'>{`Bạn có chắc chắn muốn hủy ${item.product?.name}?`}</p>
              <Button
                variant='danger'
                id='CancelOrderItemPopover'
                size='sm'
                text='Xác nhận hủy'
                role='menuitem'
                className='cancel-order-btn'
                onClick={() => updateOrderItemStatus(item.id, 'Cancelled')}
              />
            </div>
          </DropdownConfirm>
        );
      } else {
        return (
          <DropdownConfirm
            label={item.product && viStatus[item.status]}
            className={isAdmin ? 'admin' : ''}
          >
            {renderPopoverContent(item)}
          </DropdownConfirm>
        );
      }
    }
  };

  return (
    <div className='order-items pt-3'>
      <h2>Sản phẩm trong đơn hàng</h2>
      <Row>
        {(order.items || []).map((item, index) => (
          <Col xs='12' key={index} className='item'>
            <div className='order-item-box'>
              <div className='d-flex justify-content-between flex-column flex-md-row'>
                <div className='d-flex align-items-center box'>
                  <img
                    className='item-image'
                    src={`${
                      item.product && (item.product.image_url || item.product.imageUrl)
                        ? (item.product.image_url || item.product.imageUrl)
                        : '/images/placeholder-image.png'
                    }`}
                    alt={item.product_name || item.product?.name || 'Sản phẩm'}
                    onError={(e) => {
                      e.target.src = '/images/placeholder-image.png';
                    }}
                  />
                  <div className='d-md-flex flex-1 align-items-start ml-4 item-box'>
                    <div className='item-details'>
                      {item.product ? (
                        <>
                          <Link
                            to={`/product/${item.product?.slug}`}
                            className='item-link'
                          >
                            <h4 className='d-block item-name one-line-ellipsis'>
                              {item.product_name || item.product?.name}
                            </h4>
                          </Link>
                          <div className='d-flex align-items-center justify-content-between'>
                            <span className='price'>
                              {Number(item.price).toLocaleString()}₫
                            </span>
                          </div>
                        </>
                      ) : (
                        <h4>Không có sản phẩm</h4>
                      )}
                    </div>
                    <div className='d-flex justify-content-between flex-wrap d-md-none mt-1'>
                      <p className='mb-1 mr-4'>
                        Trạng thái
                        <span className='order-label order-status'>{` ${item.status}`}</span>
                      </p>
                      <p className='mb-1 mr-4'>
                        Số lượng
                        <span className='order-label'>{` ${item.quantity}`}</span>
                      </p>
                      <p>
                        Thành tiền
                        <span className='order-label'>{` ${Number(item.total).toLocaleString()}₫`}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className='d-none d-md-flex justify-content-between align-items-center box'>
                  <div className='text-center'>
                    <p className='order-label order-status'>{`${item.status}`}</p>
                    <p>Trạng thái</p>
                  </div>

                  <div className='text-center'>
                    <p className='order-label'>{` ${item.quantity}`}</p>
                    <p>Số lượng</p>
                  </div>

                  <div className='text-center'>
                    <p className='order-label'>{` ${Number(item.total).toLocaleString()}₫`}</p>
                    <p>Thành tiền</p>
                  </div>
                </div>
              </div>
              {item.product && (
                <div className='text-right mt-2 mt-md-0'>
                  {renderItemsAction(item)}
                </div>
              )}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default OrderItems;
