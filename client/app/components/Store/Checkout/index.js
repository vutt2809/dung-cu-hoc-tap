/**
 *
 * Checkout
 *
 */

import React from 'react';

import Button from '../../Common/Button';

const Checkout = props => {
  const { authenticated, handleShopping, handleCheckout, placeOrder } = props;

  return (
    <div className='easy-checkout'>
      <div className='checkout-actions'>
        <Button
          variant='primary'
          text="Tiếp tục mua sắm"
          onClick={() => handleShopping()}
        />
        {authenticated ? (
          <Button
            variant='primary'
            text="Đặt hàng"
            onClick={() => placeOrder()}
          />
        ) : (
          <Button
            variant='primary'
            text="Tiến hành thanh toán"
            onClick={() => handleCheckout()}
          />
        )}
      </div>
    </div>
  );
};

export default Checkout;
