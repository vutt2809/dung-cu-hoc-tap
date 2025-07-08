/*
 *
 * Review
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import * as reviewActions from './actions';

import SubPage from '../../components/Manager/SubPage';
import ReviewList from '../../components/Manager/ReviewList';
import SearchResultMeta from '../../components/Manager/SearchResultMeta';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import NotFound from '../../components/Common/NotFound';
import Pagination from '../../components/Common/Pagination';
import { VI } from '../../constants';

class Review extends React.PureComponent {
  componentDidMount() {
    this.props.fetchReviews();
  }

  render() {
    const {
      reviews,
      isLoading,
      advancedFilters,
      fetchReviews,
      approveReview,
      rejectReview,
      deleteReview
    } = this.props;

    const displayPagination = advancedFilters.totalPages > 1;
    const displayReviews = reviews && reviews.length > 0;

    return (
      <div className='review-dashboard'>
        <SubPage title={VI['Reviews']} isMenuOpen={null}>
          {isLoading && <LoadingIndicator />}

          {displayPagination && (
            <Pagination
              totalPages={advancedFilters.totalPages}
              onPagination={fetchReviews}
            />
          )}
          {displayReviews && (
            <>
              <SearchResultMeta label={VI['Reviews'].toLowerCase()} count={advancedFilters.count} />
              <ReviewList
                reviews={reviews}
                approveReview={approveReview}
                rejectReview={rejectReview}
                deleteReview={deleteReview}
              />
            </>
          )}

          {!isLoading && !displayReviews && (
            <NotFound message={VI['No reviews found']} />
          )}
        </SubPage>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    reviews: state.review.reviews,
    isLoading: state.review.isLoading,
    advancedFilters: state.review.advancedFilters
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchReviews: (page) => dispatch(reviewActions.fetchReviews(page)),
    approveReview: (review) => dispatch(reviewActions.approveReview(review)),
    rejectReview: (review) => dispatch(reviewActions.rejectReview(review)),
    deleteReview: (id) => dispatch(reviewActions.deleteReview(id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Review);
