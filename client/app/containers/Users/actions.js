/*
 *
 * Users actions
 *
 */

import axios from 'axios';

import {
  FETCH_USERS,
  FETCH_SEARCHED_USERS,
  SET_ADVANCED_FILTERS,
  SET_USERS_LOADING
} from './constants';

import handleError from '../../utils/error';
import { API_URL } from '../../constants';

export const setUserLoading = value => {
  return {
    type: SET_USERS_LOADING,
    payload: value
  };
};

export const fetchUsers = page => {
  return async (dispatch, getState) => {
    try {
      dispatch(setUserLoading(true));
      const response = await axios.get(`${API_URL}/user`, {
        params: {
          page: page ?? 1,
          limit: 20
        }
      });

      const { data, current_page, last_page, total } = response.data.users;

      dispatch({
        type: FETCH_USERS,
        payload: data
      });
      dispatch({
        type: SET_ADVANCED_FILTERS,
        payload: { totalPages: last_page, currentPage: current_page, count: total }
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setUserLoading(false));
    }
  };
};

export const searchUsers = filter => {
  return async (dispatch, getState) => {
    try {
      dispatch(setUserLoading(true));

      const response = await axios.get(`${API_URL}/user/search`, {
        params: {
          search: filter.value
        }
      });

      dispatch({ type: FETCH_SEARCHED_USERS, payload: response.data.users });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setUserLoading(false));
    }
  };
};
