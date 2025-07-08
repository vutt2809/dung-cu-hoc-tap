/*
 *
 * Newsletter actions
 *
 */

import { success } from 'react-notification-system-redux';
import axios from 'axios';

import {
  NEWSLETTER_CHANGE,
  SET_NEWSLETTER_FORM_ERRORS,
  NEWSLETTER_RESET
} from './constants';
import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';
import { API_URL } from '../../constants';

export const newsletterChange = (name, value) => {
  return {
    type: NEWSLETTER_CHANGE,
    payload: { name, value }
  };
};

export const subscribeNewsletter = () => {
  return async (dispatch, getState) => {
    try {
      const rules = {
        email: 'required|email'
      };

      const user = getState().newsletter.newsletterFormData;

      const { isValid, errors } = allFieldsValidation(user, rules, {
        'required.email': 'Email là bắt buộc.',
        'email.email': 'Email không đúng định dạng.'
      });

      if (!isValid) {
        return dispatch({ type: SET_NEWSLETTER_FORM_ERRORS, payload: errors });
      }

      const response = await axios.post(
        `${API_URL}/newsletter/subscribe`,
        user
      );

      const successfulOptions = {
        title: 'Đăng ký nhận bản tin thành công!',
        position: 'tr',
        autoDismiss: 1
      };

      dispatch({ type: NEWSLETTER_RESET });
      dispatch(success(successfulOptions));
    } catch (error) {
      let message = error?.response?.data?.error || '';
      if (message === 'The email has already been taken.') {
        message = 'Email này đã được đăng ký nhận bản tin.';
      }
      if (!message) {
        message = 'Vui lòng thử lại!';
      }
      handleError({ response: { data: { error: message } } }, dispatch, message);
    }
  };
};

export const resetNewsletter = () => ({
  type: NEWSLETTER_RESET
});
