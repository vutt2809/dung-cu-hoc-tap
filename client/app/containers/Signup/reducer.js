/*
 *
 * Signup reducer
 *
 */

import {
  SIGNUP_CHANGE,
  SIGNUP_RESET,
  SET_SIGNUP_LOADING,
  SET_SIGNUP_SUBMITTING,
  SUBSCRIBE_CHANGE,
  SET_SIGNUP_FORM_ERRORS
} from './constants';

const initialState = {
  signupFormData: {
    email: '',
    first_name: '',
    last_name: '',
    password: ''
  },
  formErrors: {},
  isSubmitting: false,
  isLoading: false,
  isSubscribed: false
};

const signupReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGNUP_CHANGE:
      return {
        ...state,
        signupFormData: { ...state.signupFormData, ...action.payload }
      };
    case SUBSCRIBE_CHANGE:
      return {
        ...state,
        isSubscribed: !state.isSubscribed
      };
    case SET_SIGNUP_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload
      };
    case SET_SIGNUP_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case SET_SIGNUP_SUBMITTING:
      return {
        ...state,
        isSubmitting: action.payload
      };
    case SIGNUP_RESET:
      return {
        ...state,
        signupFormData: {
          email: '',
          first_name: '',
          last_name: '',
          password: ''
        },
        formErrors: {},
        isLoading: false
      };
    default:
      return state;
  }
};

export default signupReducer;
