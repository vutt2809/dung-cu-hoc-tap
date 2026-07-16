import axios from 'axios';
import handleError from '../../utils/error';
import { API_URL } from '../../constants';
import {
  FETCH_REPORTS_REQUEST,
  FETCH_REPORTS_SUCCESS,
  FETCH_REPORTS_FAILURE,
  SET_REPORTS_RANGE,
  SET_REPORTS_CUSTOM_DATES
} from './constants';

export const setReportsRange = range => {
  return {
    type: SET_REPORTS_RANGE,
    payload: range
  };
};

export const setReportsCustomDates = dates => {
  return {
    type: SET_REPORTS_CUSTOM_DATES,
    payload: dates
  };
};

export const fetchReports = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: FETCH_REPORTS_REQUEST });
      
      const { selectedRange, customDates } = getState().reports;
      
      const params = {
        range: selectedRange
      };
      
      if (selectedRange === 'custom' && customDates.startDate && customDates.endDate) {
        params.start_date = customDates.startDate;
        params.end_date = customDates.endDate;
      }
      
      const response = await axios.get(`${API_URL}/reports/statistics`, { params });
      
      dispatch({
        type: FETCH_REPORTS_SUCCESS,
        payload: response.data
      });
    } catch (error) {
      dispatch({ type: FETCH_REPORTS_FAILURE, payload: error });
      handleError(error, dispatch);
    }
  };
};
