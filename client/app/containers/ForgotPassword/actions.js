/*
 *
 * ForgotPassword actions
 *
 */

import { push } from 'connected-react-router';
import { success } from 'react-notification-system-redux';
import axios from 'axios';

import {
  FORGOT_PASSWORD_CHANGE,
  FORGOT_PASSWORD_RESET,
  SET_FORGOT_PASSWORD_FORM_ERRORS
} from './constants';
import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';
import { API_URL } from '../../constants';

export const forgotPasswordChange = (name, value) => {
  return {
    type: FORGOT_PASSWORD_CHANGE,
    payload: value
  };
};

export const forgotPassowrd = () => {
  return async (dispatch, getState) => {
    try {
      const rules = {
        email: 'required|email'
      };

      const user = getState().forgotPassword.forgotFormData;

      const { isValid, errors } = allFieldsValidation(user, rules, {
        'required.email': 'Email là bắt buộc.'
      });

      if (!isValid) {
        return dispatch({
          type: SET_FORGOT_PASSWORD_FORM_ERRORS,
          payload: errors
        });
      }

      const response = await axios.post(`${API_URL}/auth/forgot`, user);
      const successfulOptions = {
        title: 'Yêu cầu lấy lại mật khẩu thành công! Vui lòng kiểm tra email.',
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success === true) {
        dispatch(push('/login'));
      }
      dispatch(success(successfulOptions));

      dispatch({ type: FORGOT_PASSWORD_RESET });
    } catch (error) {
      let message = error?.response?.data?.error || '';
      if (message === 'No user found for this email address.') {
        message = 'Không tìm thấy tài khoản với email này.';
      }
      if (!message) {
        message = 'Vui lòng thử lại!';
      }
      handleError({ response: { data: { error: message } } }, dispatch, message);
    }
  };
};
