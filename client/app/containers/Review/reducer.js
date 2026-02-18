/*
 *
 * Review reducer
 *
 */

import {
  FETCH_REVIEWS,
  FETCH_USER_REVIEWS,
  FETCH_PRODUCT_REVIEWS,
  SET_REVIEWS_LOADING,
  ADD_REVIEW,
  REMOVE_REVIEW,
  REVIEW_CHANGE,
  RESET_REVIEW,
  SET_REVIEW_FORM_ERRORS,
  SET_ADVANCED_FILTERS,
  SET_REVIEW_ELIGIBILITY
} from './constants';

const initialState = {
  reviews: [],
  userReviews: [],
  isLoading: false,
  advancedFilters: {
    totalPages: 1,
    currentPage: 1,
    count: 0
  },
  productReviews: [],
  reviewsSummary: {
    ratingSummary: [],
    totalRatings: 0,
    totalReviews: 0,
    totalSummary: 0
  },
  reviewFormData: {
    title: '',
    comment: '',
    rating: 0
  },
  reviewEligibility: {
    eligible: false,
    message: ''
  },
  reviewFormErrors: {}
};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REVIEWS:
      return {
        ...state,
        reviews: action.payload
      };
    case FETCH_USER_REVIEWS:
      return {
        ...state,
        userReviews: action.payload
      };
    case SET_ADVANCED_FILTERS:
      return {
        ...state,
        advancedFilters: {
          ...state.advancedFilters,
          ...action.payload
        }
      };
    case FETCH_PRODUCT_REVIEWS:
      return {
        ...state,
        productReviews: action.payload.reviews,
        reviewsSummary: action.payload.reviewsSummary
      };
    case ADD_REVIEW:
      return {
        ...state,
        productReviews: [...state.productReviews, action.payload]
      };
    case REMOVE_REVIEW:
      const index = state.reviews.findIndex(r => r.id === action.payload);
      return {
        ...state,
        reviews: [
          ...state.reviews.slice(0, index),
          ...state.reviews.slice(index + 1)
        ]
      };
    case REVIEW_CHANGE:
      return {
        ...state,
        reviewFormData: {
          ...state.reviewFormData,
          ...action.payload
        }
      };
    case SET_REVIEWS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case RESET_REVIEW:
      return {
        ...state,
        reviewFormData: {
          title: '',
          comment: '',
          rating: 0
        },
        reviewFormErrors: {}
      };
    case SET_REVIEW_FORM_ERRORS:
      return {
        ...state,
        reviewFormErrors: action.payload
      };
    case SET_REVIEW_ELIGIBILITY:
      return {
        ...state,
        reviewEligibility: action.payload
      };
    default:
      return state;
  }
};

export default reviewReducer;
