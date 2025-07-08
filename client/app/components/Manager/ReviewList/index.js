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
import { CheckIcon, RefreshIcon, TrashIcon, XIcon } from '../../Common/Icon';

const ReviewList = props => {
  const { reviews, approveReview, rejectReview, deleteReview } = props;

  const getStatusDisplay = (status) => {
    switch (status) {
      case REVIEW_STATUS.APPROVED:
        return {
          text: VI['Approved'] || 'Đã duyệt',
          icon: <CheckIcon className='text-green' />,
          className: 'text-green'
        };
      case REVIEW_STATUS.PENDING:
        return {
          text: VI['Waiting Approval'] || 'Chờ phê duyệt',
          icon: <RefreshIcon className='text-warning' />,
          className: 'text-warning'
        };
      case REVIEW_STATUS.REJECTED:
        return {
          text: VI['Rejected'] || 'Đã từ chối',
          icon: <XIcon className='text-red' />,
          className: 'text-red'
        };
      default:
        return {
          text: VI['Unknown'] || 'Không xác định',
          icon: null,
          className: 'text-muted'
        };
    }
  };

  return (
    <div className='review-list'>
      {reviews.map((review, index) => {
        const statusInfo = getStatusDisplay(review.status);
        
        return (
          <div key={index} className='review-box'>
            <Row>
              <Col xs='12' md='6'>
                <div className='review-meta'>
                  <h4 className='mb-2'>{review.title}</h4>
                  <p className='mb-2'>{review.comment}</p>
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
                    review.created_at
                  )}`}</label>
                  <hr />
                  
                  {/* Status Display */}
                  <div className='d-flex flex-row align-items-center mb-3'>
                    {statusInfo.icon}
                    <p className={`ml-2 mb-0 ${statusInfo.className}`}>
                      {statusInfo.text}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  {review.status === REVIEW_STATUS.PENDING ? (
                    <div className='d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mx-0'>
                      <div className='d-flex flex-row mx-0'>
                        <Button
                          className='text-uppercase mr-2'
                          variant='primary'
                          size='md'
                          text={VI['Approve'] || 'Phê duyệt'}
                          onClick={() => approveReview(review)}
                        />
                        <Button
                          className='text-uppercase'
                          variant='danger'
                          size='md'
                          text={VI['Reject'] || 'Từ chối'}
                          onClick={() => rejectReview(review)}
                        />
                      </div>
                      <Button
                        className='mt-3 mt-lg-0'
                        text={VI['Delete']}
                        icon={<TrashIcon width={15} />}
                        onClick={() => deleteReview(review.id)}
                      />
                    </div>
                  ) : (
                    <div className='d-flex flex-row align-items-center'>
                      <Button
                        className='mt-3 mt-lg-0'
                        text={VI['Delete']}
                        icon={<TrashIcon width={15} />}
                        onClick={() => deleteReview(review.id)}
                      />
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;
