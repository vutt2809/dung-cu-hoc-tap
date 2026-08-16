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
  // Notprocessed: 'Chưa xử lý',
};

const getViStatusForDetail = status => {
  // In order detail, fallback should be "Đang xử lý"
  if (!status) return viStatus.Processing;
  const normalized = String(status).trim();
  const key =
    normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
  return viStatus[normalized] || viStatus[key] || viStatus.Processing;
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
    const isOrderCancelled =
      order.status?.toLowerCase() === 'cancelled' ||
      ((order.items || []).length > 0 &&
        (order.items || []).every(
          i => (i.status?.toLowerCase() || '') === 'cancelled'
        ));

    const isItemCancelled = (item.status?.toLowerCase() || '') === 'cancelled';

    // If entire order is cancelled OR this specific item is cancelled, show badge only (no dropdown)
    if (isOrderCancelled || isItemCancelled) {
      return (
        <span
          className='custom-badge custom-badge-danger'
          style={{ minWidth: 100, justifyContent: 'center' }}
        >
          <i className='fa fa-ban mr-1' /> {viStatus.Cancelled}
        </span>
      );
    }

    if (isAdmin) {
      return (
        <DropdownConfirm
          label={getViStatusForDetail(item.status)}
          className='admin'
        >
          {renderPopoverContent(item)}
        </DropdownConfirm>
      );
    }

    if (item.status === CART_ITEM_STATUS.Delivered) {
      if (item.product?.slug) {
        return (
          <Link
            to={`/product/${item.product.slug}`}
            className='btn-link text-center py-2 fs-12'
            style={{ minWidth: 120 }}
          >
            Đánh giá sản phẩm
          </Link>
        );
      }
      return null;
    }

    if (
      item.status !== CART_ITEM_STATUS.Cancelled &&
      item.status !== CART_ITEM_STATUS.Delivered
    ) {
      return (
        <DropdownConfirm label='Hủy'>
          <div className='d-flex flex-column align-items-center justify-content-center p-2'>
            <p className='text-center mb-2'>{`Bạn có chắc chắn muốn hủy ${item.product_name || item.product?.name || 'sản phẩm này'}?`}</p>
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
                        <>
                          <h4 className='d-block item-name one-line-ellipsis'>
                            {item.product_name || 'Không có sản phẩm'}
                          </h4>
                          <div className='d-flex align-items-center justify-content-between'>
                            <span className='price'>
                              {Number(item.price).toLocaleString()}₫
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className='d-flex justify-content-between flex-wrap d-md-none mt-1'>
                      <p className='mb-1 mr-4'>
                        Trạng thái
                        <span className='order-label order-status'>{` ${getViStatusForDetail(item.status)}`}</span>
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
                    <p>Trạng thái</p>
                    <p className='order-label order-status'>{`${getViStatusForDetail(item.status)}`}</p>
                  </div>

                  <div className='text-center'>
                    <p>Số lượng</p>
                    <p className='order-label'>{` ${item.quantity}`}</p>
                  </div>

                  <div className='text-center'>
                    <p>Thành tiền</p>
                    <p className='order-label'>{` ${Number(item.total).toLocaleString()}₫`}</p>
                  </div>
                </div>
              </div>
              <div className='text-right mt-2 mt-md-0'>
                {renderItemsAction(item)}
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default OrderItems;
