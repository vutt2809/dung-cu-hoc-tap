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
  hasFetched = false;

  fetchByRoleIfReady = () => {
    const role = this.props.user?.role;
    if (!role || this.hasFetched) return;

    if (role === 'ROLE ADMIN') {
      this.props.fetchReviews();
    } else {
      this.props.fetchUserReviews();
    }

    this.hasFetched = true;
  };

  componentDidMount() {
    this.fetchByRoleIfReady();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user?.role !== this.props.user?.role) {
      this.fetchByRoleIfReady();
    }
  }

  render() {
    const {
      user,
      reviews,
      userReviews,
      isLoading,
      advancedFilters,
      fetchReviews,
      fetchUserReviews,
      approveReview,
      rejectReview,
      deleteReview
    } = this.props;

    const displayPagination = advancedFilters.totalPages > 1;
    const isMember = user.role === 'ROLE MEMBER';
    const data = isMember ? userReviews : reviews;
    const displayReviews = data && data.length > 0;

    return (
      <div className='review-dashboard'>
        <SubPage title={VI['Reviews']} isMenuOpen={null}>
          {isLoading && <LoadingIndicator />}

          {displayPagination && (
            <Pagination
              totalPages={advancedFilters.totalPages}
              onPagination={isMember ? fetchUserReviews : fetchReviews}
            />
          )}
          {displayReviews && (
            <>
              <SearchResultMeta label={VI['Reviews'].toLowerCase()} count={advancedFilters.count} />
              <ReviewList
                reviews={data}
                approveReview={approveReview}
                rejectReview={rejectReview}
                deleteReview={deleteReview}
                isMember={isMember}
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
    user: state.account.user,
    reviews: state.review.reviews,
    userReviews: state.review.userReviews,
    isLoading: state.review.isLoading,
    advancedFilters: state.review.advancedFilters
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchReviews: (page) => dispatch(reviewActions.fetchReviews(null, page)),
    fetchUserReviews: (page) => dispatch(reviewActions.fetchUserReviews(null, page)),
    approveReview: (review) => dispatch(reviewActions.approveReview(review)),
    rejectReview: (review) => dispatch(reviewActions.rejectReview(review)),
    deleteReview: (id) => dispatch(reviewActions.deleteReview(id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Review);
