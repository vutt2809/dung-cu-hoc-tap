/**
 *
 * ReviewList
 *
 */

import React from 'react';

import { Row, Col } from 'reactstrap';

import { formatDate } from '../../../utils/date';
import { REVIEW_STATUS } from '../../../constants';
import { VI } from '../../../constants/vi';
import Button from '../../Common/Button';
import { CheckIcon, RefreshIcon, TrashIcon } from '../../Common/Icon';

const ReviewList = props => {
  const { reviews, approveReview, deleteReview } = props;

  return (
    <div className='review-list'>
      {reviews.map((review, index) => (
        <div key={index} className='review-box'>
          <Row>
            <Col xs='12' md='6'>
              <div className='review-meta'>
                <h4 className='mb-2'>{review.title}</h4>
                <p className='mb-2'>{review.review}</p>
                <div className='review-rating'>
                  <span className='stars'>
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fa fa-star${
                          i < review.rating ? ' active' : ''
                        }`}
                      />
                    ))}
                  </span>
                </div>
              </div>
            </Col>
            <Col xs='12' md='6'>
              <div className='review-actions'>
                <div className='d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mx-0'>
                  <div className='d-flex flex-row mx-0'>
                    <p className='mb-0'>{review.user.first_name}</p>
                  </div>
                </div>
                <label className='text-black'>{`${VI['Review Added on']} ${formatDate(
                  review.created
                )}`}</label>
                <hr />
                {review.status === REVIEW_STATUS.Approved ? (
                  <div className='d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mx-0'>
                    <div className='d-flex flex-row mx-0'>
                      <CheckIcon className='text-green' />
                      <p className='ml-2 mb-0'>{VI['Approved']}</p>
                    </div>
                    <Button
                      className='mt-3 mt-lg-0'
                      text={VI['Delete']}
                      icon={<TrashIcon width={15} />}
                      onClick={() => deleteReview(review._id)}
                    />
                  </div>
                ) : review.status === REVIEW_STATUS.Rejected ? (
                  <>
                    <div className='d-flex align-items-center mb-3'>
                      <RefreshIcon className='text-primary' />
                      <p className='fw-medium ml-3 mb-0'>{VI['Re Approve Review']}</p>
                    </div>
                    <div className='d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mx-0'>
                      <Button
                        className='text-uppercase'
                        variant='primary'
                        size='md'
                        text={VI['Approve']}
                        onClick={() => approveReview(review)}
                      />
                      <Button
                        className='mt-3 mt-lg-0'
                        text={VI['Delete']}
                        icon={<TrashIcon width={15} />}
                        onClick={() => deleteReview(review._id)}
                      />
                    </div>
                  </>
                ) : (
                  <div className='d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mx-0'>
                    <div className='d-flex flex-row mx-0'>
                      <p className='mb-0'>{VI['Waiting Approval']}</p>
                    </div>
                    <div className='d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mx-0'>
                      <Button
                        className='text-uppercase'
                        variant='primary'
                        size='md'
                        text={VI['Approve']}
                        onClick={() => approveReview(review)}
                      />
                      <Button
                        className='mt-3 mt-lg-0'
                        text={VI['Delete']}
                        icon={<TrashIcon width={15} />}
                        onClick={() => deleteReview(review._id)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
