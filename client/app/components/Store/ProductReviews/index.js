/**
 *
 * ProductReviews
 *
 */

import React from 'react';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

import AddReview from './Add';
import ReviewList from './List';
import ReviewSummary from './Summary';

const ProductReviews = props => {
  const {
    authenticated,
    reviewEligibility,
    reviewsSummary,
    reviews,
    reviewFormData,
    reviewChange,
    reviewFormErrors,
    addReview
  } = props;

  return (
    <div className='mt-md-4 product-reviews'>
      <Row className='flex-row'>
        <Col xs='12' md='5' lg='5' className='mb-3 px-3 px-md-2'>
          {Object.keys(reviewsSummary).length > 0 && (
            <ReviewSummary reviewsSummary={reviewsSummary} />
          )}
        </Col>
        <Col xs='12' md='7' lg='7' className='mb-3 px-3 px-md-2'>
          {reviews.length > 0 && <ReviewList reviews={reviews} />}

          <div className='mt-4'>
            {authenticated ? (
              reviewEligibility.eligible ? (
                <AddReview
                  reviewFormData={reviewFormData}
                  reviewChange={reviewChange}
                  reviewFormErrors={reviewFormErrors}
                  addReview={addReview}
                />
              ) : (
                <div className='bg-white p-4 box-shadow-primary'>
                  <p className='mb-0 text-warning'>
                    {reviewEligibility.message || 'Bạn không đủ điều kiện để đánh giá sản phẩm này.'}
                  </p>
                </div>
              )
            ) : (
              <div className='bg-white p-4 box-shadow-primary'>
                <p className='mb-0'>
                  Vui lòng <Link to='/login'>đăng nhập</Link> để đánh giá sản phẩm này.
                </p>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProductReviews;
