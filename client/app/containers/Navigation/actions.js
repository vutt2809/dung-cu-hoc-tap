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

let suggestionsDebounceTimer = null;
let suggestionsAbortController = null;
let suggestionsRequestSeq = 0;

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
      if (suggestionsDebounceTimer) {
        clearTimeout(suggestionsDebounceTimer);
      }

      if (!inputValue) {
        if (suggestionsAbortController) {
          suggestionsAbortController.abort();
          suggestionsAbortController = null;
        }
        dispatch({
          type: SUGGESTIONS_CLEAR_REQUEST,
          payload: []
        });
        return;
      }

      const requestId = ++suggestionsRequestSeq;

      suggestionsDebounceTimer = setTimeout(async () => {
        try {
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

          if (suggestionsAbortController) {
            suggestionsAbortController.abort();
          }
          suggestionsAbortController = new AbortController();

          const response = await axios.get(`${API_URL}/product`, {
            params: { search: inputValue },
            signal: suggestionsAbortController.signal
          });

          // Ignore stale responses
          if (requestId !== suggestionsRequestSeq) return;

          dispatch({
            type: SUGGESTIONS_FETCH_REQUEST,
            payload: response.data.products
          });
        } catch (error) {
          // Abort is expected while typing fast
          if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') {
            return;
          }
          handleError(error, dispatch);
        }
      }, 300);
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
