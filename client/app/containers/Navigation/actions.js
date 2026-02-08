/*
 *
 * Navigation actions
 *
 */

import axios from 'axios';
import handleError from '../../utils/error';
import { push } from 'connected-react-router';
import { filterProducts } from '../Product/actions';
import {
  TOGGLE_MENU,
  TOGGLE_CART,
  TOGGLE_BRAND,
  SEARCH_CHANGE,
  SUGGESTIONS_FETCH_REQUEST,
  SUGGESTIONS_CLEAR_REQUEST
} from './constants';
import { API_URL } from '../../constants';

export const toggleMenu = () => {
  return {
    type: TOGGLE_MENU
  };
};

export const toggleCart = () => {
  return {
    type: TOGGLE_CART
  };
};

export const toggleBrand = () => {
  return {
    type: TOGGLE_BRAND
  };
};

export const onSearch = v => {
  return {
    type: SEARCH_CHANGE,
    payload: v
  };
};

export const onSuggestionsFetchRequested = value => {
  const inputValue = value.value.trim().toLowerCase();

  return async (dispatch, getState) => {
    try {
      if (inputValue) {
        // Cập nhật danh sách sản phẩm ở trang shop/category/brand theo keyword search
        dispatch(filterProducts('name', inputValue));

        // Chuyển hướng sang trang shop nếu không phải đang ở các trang shop
        const path = getState().router.location.pathname;
        if (
          path !== '/shop' &&
          !path.includes('/shop/category') &&
          !path.includes('/shop/brand')
        ) {
          dispatch(push('/shop'));
        }

        const response = await axios.get(
          `${API_URL}/product?search=${inputValue}`
        );
        dispatch({
          type: SUGGESTIONS_FETCH_REQUEST,
          payload: response.data.products
        });
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const onSuggestionsClearRequested = () => {
  return {
    type: SUGGESTIONS_CLEAR_REQUEST,
    payload: []
  };
};
