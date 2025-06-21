/**
 *
 * CartSummary
 *
 */

import React from 'react';

import { Container, Row, Col } from 'reactstrap';

const CartSummary = props => {
  const { cartTotal } = props;

  return (
    <div className='cart-summary'>
      <Container>
        <Row className='mb-2 summary-item'>
          <Col xs='9'>
            <p className='summary-label'>Phí vận chuyển</p>
          </Col>
          <Col xs='3' className='text-right'>
            <p className='summary-value'>Miễn phí</p>
          </Col>
        </Row>
        <Row className='mb-2 summary-item'>
          <Col xs='9'>
            <p className='summary-label'>Tổng cộng</p>
          </Col>
          <Col xs='3' className='text-right'>
            <p className='summary-value'>{cartTotal}₫</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CartSummary;
