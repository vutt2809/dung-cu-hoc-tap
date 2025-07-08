/*
 *
 * ResetPassword actions
 *
 */

import { push } from 'connected-react-router';
import { success } from 'react-notification-system-redux';
import axios from 'axios';

import {
  RESET_PASSWORD_CHANGE,
  RESET_PASSWORD_RESET,
  SET_RESET_PASSWORD_FORM_ERRORS
} from './constants';

import { signOut } from '../Login/actions';
import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';
import { API_URL } from '../../constants';

export const resetPasswordChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: RESET_PASSWORD_CHANGE,
    payload: formData
  };
};

export const resetPassword = token => {
  return async (dispatch, getState) => {
    try {
      const rules = {
        password: 'required|min:6',
        confirmPassword: 'required|min:6|same:password'
      };
      const user = getState().resetPassword.resetFormData;

      const { isValid, errors } = allFieldsValidation(user, rules, {
        'required.password': 'Password is required.',
        'min.password': 'Password must be at least 6 characters.',
        'required.confirmPassword': 'Confirm password is required.',
        'min.confirmPassword':
          'Confirm password must be at least 6 characters.',
        'same.confirmPassword':
          'Confirm password and password fields must match.'
      });

      if (!isValid) {
        return dispatch({
          type: SET_RESET_PASSWORD_FORM_ERRORS,
          payload: errors
        });
      }

      const response = await axios.post(`${API_URL}/auth/reset`, {
        token: token,
        password: user.password
      });
      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success == true) {
        dispatch(push('/login'));
      }

      dispatch(success(successfulOptions));
      dispatch({ type: RESET_PASSWORD_RESET });
    } catch (error) {
      const title = `Please try to reset again!`;
      handleError(error, dispatch, title);
    }
  };
};

export const resetAccountPassword = () => {
  return async (dispatch, getState) => {
    try {
      const rules = {
        current_password: 'required',
        password: 'required|min:6',
        confirmPassword: 'required|min:6|same:password'
      };

      const user = getState().resetPassword.resetFormData;

      const { isValid, errors } = allFieldsValidation(user, rules, {
        'required.current_password': 'Vui lòng nhập mật khẩu hiện tại.',
        'required.password': 'Vui lòng nhập mật khẩu mới.',
        'min.password': 'Mật khẩu mới phải có ít nhất 6 ký tự.',
        'required.confirmPassword': 'Vui lòng nhập lại mật khẩu mới.',
        'min.confirmPassword': 'Mật khẩu xác nhận phải có ít nhất 6 ký tự.',
        'same.confirmPassword': 'Mật khẩu xác nhận không khớp.'
      });

      if (!isValid) {
        return dispatch({
          type: SET_RESET_PASSWORD_FORM_ERRORS,
          payload: errors
        });
      }

      const response = await axios.put(`${API_URL}/user/password`, {
        current_password: user.current_password,
        password: user.password,
        password_confirmation: user.confirmPassword
      });
      const successfulOptions = {
        title: 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.',
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success === true) {
        dispatch(signOut());
      }

      dispatch(success(successfulOptions));
      dispatch({ type: RESET_PASSWORD_RESET });
    } catch (error) {
      let message = error?.response?.data?.error || 'Có lỗi xảy ra, vui lòng thử lại!';
      if (message === 'The current password field is required.') {
        message = 'Vui lòng nhập mật khẩu hiện tại.';
      }
      if (message === 'Current password is incorrect.') {
        message = 'Mật khẩu hiện tại không đúng.';
      }
      if (message === 'The password field is required.') {
        message = 'Vui lòng nhập mật khẩu mới.';
      }
      if (message === 'The password confirmation does not match.') {
        message = 'Mật khẩu xác nhận không khớp.';
      }
      if (message === 'Password updated successfully.') {
        message = 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.';
      }
      handleError({ response: { data: { error: message } } }, dispatch, message);
    }
  };
};
