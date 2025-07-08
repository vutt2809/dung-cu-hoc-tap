/*
 *
 * WishList actions
 *
 */

import { success, warning } from 'react-notification-system-redux';
import axios from 'axios';

import { FETCH_WISHLIST, SET_WISHLIST_LOADING } from './constants';
import handleError from '../../utils/error';
import { API_URL } from '../../constants';

export const updateWishlist = (isLiked, productId) => {
  return async (dispatch, getState) => {
    try {
      if (getState().authentication.authenticated === true) {
        const response = await axios.post(`${API_URL}/wishlist`, {
          product_id: productId
        });

        const successfulOptions = {
          title: isLiked ? 'Đã thêm vào danh sách yêu thích!' : 'Đã xóa khỏi danh sách yêu thích!',
          position: 'tr',
          autoDismiss: 1
        };

        if (response.data.success === true) {
          dispatch(success(successfulOptions));
          dispatch(fetchWishlist());
        }
      } else {
        const retryOptions = {
          title: 'Vui lòng đăng nhập để sử dụng danh sách yêu thích',
          position: 'tr',
          autoDismiss: 1
        };
        dispatch(warning(retryOptions));
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

// fetch wishlist api
export const fetchWishlist = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: SET_WISHLIST_LOADING, payload: true });

      const response = await axios.get(`${API_URL}/wishlist`);

      dispatch({ type: FETCH_WISHLIST, payload: response.data.wishlist });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch({ type: SET_WISHLIST_LOADING, payload: false });
    }
  };
};
