/*
 *
 * Login actions
 *
 */

import { success } from 'react-notification-system-redux';
import axios from 'axios';
import { push } from 'connected-react-router';

import {
  LOGIN_CHANGE,
  LOGIN_RESET,
  SET_LOGIN_LOADING,
  SET_LOGIN_FORM_ERRORS,
  SET_LOGIN_SUBMITTING
} from './constants';
import { setAuth, clearAuth } from '../Authentication/actions';
import { FETCH_PROFILE } from '../Account/constants';
import setToken from '../../utils/token';
import handleError from '../../utils/error';
import { clearCart } from '../Cart/actions';
import { clearAccount } from '../Account/actions';
import { allFieldsValidation } from '../../utils/validation';
import { API_URL } from '../../constants';

export const loginChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: LOGIN_CHANGE,
    payload: formData
  };
};

export const login = () => {
  return async (dispatch, getState) => {
    const rules = {
      email: 'required|email',
      password: 'required|min:6'
    };

    const user = getState().login.loginFormData;

    const { isValid, errors } = allFieldsValidation(user, rules, {
      'required.email': 'Email là bắt buộc.',
      'email.email': 'Email không đúng định dạng.',
      'required.password': 'Mật khẩu là bắt buộc.',
      'min.password': 'Mật khẩu phải có ít nhất 6 ký tự.'
    });

    if (!isValid) {
      return dispatch({ type: SET_LOGIN_FORM_ERRORS, payload: errors });
    }

    dispatch({ type: SET_LOGIN_SUBMITTING, payload: true });
    dispatch({ type: SET_LOGIN_LOADING, payload: true });

    try {
      const response = await axios.post(`${API_URL}/auth/login`, user);
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      setToken(token);

      const successfulOptions = {
        title: `Chào mừng${userData.first_name ? ` ${userData.first_name}` : ''}, đăng nhập thành công!`,
        position: 'tr',
        autoDismiss: 1
      };

      dispatch({ type: FETCH_PROFILE, payload: userData });
      dispatch(setAuth());
      dispatch(success(successfulOptions));
      dispatch({ type: LOGIN_RESET });
    } catch (error) {
      let message = error?.response?.data?.error || '';
      if (message === 'Password Incorrect') {
        message = 'Mật khẩu không đúng.';
      }
      if (message === 'No user found for this email address.') {
        message = 'Không tìm thấy tài khoản với email này.';
      }
      if (message === 'This account was created with a different login method.') {
        message = 'Tài khoản này được tạo bằng phương thức đăng nhập khác.';
      }
      if (message === 'That email address is already in use using Google provider.') {
        message = 'Email này đã được đăng ký bằng Google.';
      }
      if (!message) {
        message = 'Vui lòng thử đăng nhập lại!';
      }
      handleError({ response: { data: { error: message } } }, dispatch, message);
    } finally {
      dispatch({ type: SET_LOGIN_SUBMITTING, payload: false });
      dispatch({ type: SET_LOGIN_LOADING, payload: false });
    }
  };
};

export const signOut = () => {
  return (dispatch, getState) => {
    const successfulOptions = {
      title: `You have signed out!`,
      position: 'tr',
      autoDismiss: 1
    };

    dispatch(clearAuth());
    dispatch(clearAccount());
    dispatch(push('/login'));

    localStorage.removeItem('token');

    dispatch(success(successfulOptions));
    // dispatch(clearCart());
  };
};
