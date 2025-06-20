/**
 *
 * Checkout
 *
 */

import React from 'react';

import Button from '../../Common/Button';
import { VI } from '../../../constants/vi';

const Checkout = props => {
  const { authenticated, handleShopping, handleCheckout, placeOrder } = props;

  return (
    <div className='easy-checkout'>
      <div className='checkout-actions'>
        <Button
          variant='primary'
          text={VI['Continue shopping']}
          onClick={() => handleShopping()}
        />
        {authenticated ? (
          <Button
            variant='primary'
            text={VI['Place Order']}
            onClick={() => placeOrder()}
          />
        ) : (
          <Button
            variant='primary'
            text={VI['Proceed To Checkout']}
            onClick={() => handleCheckout()}
          />
        )}
      </div>
    </div>
  );
};

export default Checkout;
