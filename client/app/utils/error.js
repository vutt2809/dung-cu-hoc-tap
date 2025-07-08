/**
 *
 * error.js
 * This is a generic error handler, it receives the error returned from the server and present it on a pop up
 */

import { error } from 'react-notification-system-redux';

import { signOut } from '../containers/Login/actions';
import { VI } from '../constants/vi';

const handleError = (err, dispatch, title = '') => {
  const unsuccessfulOptions = {
    title: `${title}`,
    message: ``,
    position: 'tr',
    autoDismiss: 1
  };

  if (err.response) {
    if (err.response.status === 400) {
      unsuccessfulOptions.title = title ? title : 'Vui lòng thử lại!';
      unsuccessfulOptions.message = err.response.data.error;
      dispatch(error(unsuccessfulOptions));
    } else if (err.response.status === 404) {
      // unsuccessfulOptions.title =
      //   err.response.data.message ||
      //   'Yêu cầu của bạn không thể xử lý. Vui lòng thử lại.';
      // dispatch(error(unsuccessfulOptions));
    } else if (err.response.status === 401) {
      unsuccessfulOptions.message = 'Bạn không có quyền truy cập! Vui lòng đăng nhập lại.';
      dispatch(signOut());
      dispatch(error(unsuccessfulOptions));
    } else if (err.response.status === 403) {
      unsuccessfulOptions.message = 'Bạn không được phép truy cập tài nguyên này.';
      dispatch(error(unsuccessfulOptions));
    }
  } else if (err.message) {
    unsuccessfulOptions.message = err.message;
    dispatch(error(unsuccessfulOptions));
  } else {
    // fallback
    unsuccessfulOptions.message = 'Yêu cầu của bạn không thể xử lý. Vui lòng thử lại.';
  }
};

export default handleError;
