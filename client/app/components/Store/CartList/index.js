/**
 *
 * CartList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

import Button from '../../Common/Button';

const CartList = props => {
  const { cartItems, handleRemoveFromCart } = props;

  const handleProductClick = () => {
    props.toggleCart();
  };

  return (
    <div className='cart-list'>
      {cartItems.map((item, index) => (
        <div key={index} className='item-box'>
          <div className='item-details'>
            <Container>
              <Row className='mb-2 align-items-center'>
                <Col xs='10' className='pr-0'>
                  <div className='d-flex align-items-center'>
                    <img
                      className='item-image mr-2'
                      src={item.image_url || item.imageUrl || '/images/placeholder-image.png'}
                      alt={item.name}
                      onError={e => { e.target.src = '/images/placeholder-image.png'; }}
                    />

                    <Link
                      to={`/product/${item.slug}`}
                      className='item-link one-line-ellipsis'
                      onClick={handleProductClick}
                    >
                      <h2 className='item-name one-line-ellipsis'>
                        {item.name}
                      </h2>
                    </Link>
                  </div>
                </Col>
                <Col xs='2' className='text-right'>
                  <Button
                    borderless
                    variant='empty'
                    ariaLabel={`remove ${item.name} from cart`}
                    icon={<i className='icon-trash' aria-hidden='true' />}
                    onClick={() => handleRemoveFromCart(item)}
                  />
                </Col>
              </Row>
              <Row className='mb-2 align-items-center'>
                <Col xs='9'>
                  <p className='item-label'>Giá</p>
                </Col>
                <Col xs='3' className='text-right'>
                  <p className='value price'>{`${item?.totalPrice}₫`}</p>
                </Col>
              </Row>
              <Row className='mb-2 align-items-center'>
                <Col xs='9'>
                  <p className='item-label'>Số lượng</p>
                </Col>
                <Col xs='3' className='text-right'>
                  <p className='value quantity'>{` ${item.quantity}`}</p>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartList;
