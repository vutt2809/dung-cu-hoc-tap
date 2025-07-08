/*
 *
 * Signup actions
 *
 */

import { success } from 'react-notification-system-redux';
import axios from 'axios';

import {
  SIGNUP_CHANGE,
  SIGNUP_RESET,
  SET_SIGNUP_LOADING,
  SET_SIGNUP_SUBMITTING,
  SUBSCRIBE_CHANGE,
  SET_SIGNUP_FORM_ERRORS
} from './constants';

import { setAuth } from '../Authentication/actions';
import setToken from '../../utils/token';
import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';
import { API_URL } from '../../constants';

export const signupChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: SIGNUP_CHANGE,
    payload: formData
  };
};

export const subscribeChange = () => {
  return {
    type: SUBSCRIBE_CHANGE
  };
};

export const signUp = () => {
  return async (dispatch, getState) => {
    try {
      const rules = {
        email: 'required|email',
        password: 'required|min:6',
        first_name: 'required',
        last_name: 'required'
      };

      const newUser = getState().signup.signupFormData;
      const isSubscribed = getState().signup.isSubscribed;

      const { isValid, errors } = allFieldsValidation(newUser, rules, {
        'required.email': 'Email là bắt buộc.',
        'required.password': 'Mật khẩu là bắt buộc.',
        'required.first_name': 'Tên là bắt buộc.',
        'required.last_name': 'Họ là bắt buộc.'
      });

      if (!isValid) {
        return dispatch({ type: SET_SIGNUP_FORM_ERRORS, payload: errors });
      }

      dispatch({ type: SET_SIGNUP_SUBMITTING, payload: true });
      dispatch({ type: SET_SIGNUP_LOADING, payload: true });

      const user = {
        isSubscribed,
        ...newUser
      };

      const response = await axios.post(`${API_URL}/auth/register`, user);

      const successfulOptions = {
        title: 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.',
        position: 'tr',
        autoDismiss: 1
      };

      localStorage.setItem('token', response.data.token);

      setToken(response.data.token);

      dispatch(setAuth());
      dispatch(success(successfulOptions));
      dispatch({ type: SIGNUP_RESET });
    } catch (error) {
      let message = error?.response?.data?.error || '';
      if (message === 'The email has already been taken.') {
        message = 'Email này đã được đăng ký.';
      }
      if (!message) {
        message = 'Vui lòng thử lại!';
      }
      handleError({ response: { data: { error: message } } }, dispatch, message);
    } finally {
      dispatch({ type: SET_SIGNUP_SUBMITTING, payload: false });
      dispatch({ type: SET_SIGNUP_LOADING, payload: false });
    }
  };
};
