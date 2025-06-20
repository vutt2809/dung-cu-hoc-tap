/*
 *
 * Newsletter reducer
 *
 */

import {
  NEWSLETTER_CHANGE,
  SET_NEWSLETTER_FORM_ERRORS,
  NEWSLETTER_RESET
} from './constants';

const initialState = {
  newsletterFormData: {
    email: ''
  },
  formErrors: {}
};

const newsletterReducer = (state = initialState, action) => {
  switch (action.type) {
    case NEWSLETTER_CHANGE:
      return {
        ...state,
        newsletterFormData: {
          ...state.newsletterFormData,
          [action.payload.name]: action.payload.value
        }
      };
    case SET_NEWSLETTER_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload
      };
    case NEWSLETTER_RESET:
      return {
        ...state,
        newsletterFormData: { email: '' },
        formErrors: {}
      };
    default:
      return state;
  }
};

export default newsletterReducer;
