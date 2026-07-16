import {
  FETCH_REPORTS_REQUEST,
  FETCH_REPORTS_SUCCESS,
  FETCH_REPORTS_FAILURE,
  SET_REPORTS_RANGE,
  SET_REPORTS_CUSTOM_DATES
} from './constants';

const initialState = {
  isLoading: false,
  error: null,
  selectedRange: '30days',
  customDates: {
    startDate: '',
    endDate: ''
  },
  data: {
    summary: {
      revenue: { current: 0, previous: 0, change: 0 },
      orders: { current: 0, previous: 0, change: 0 },
      aov: { current: 0, previous: 0, change: 0 },
      new_customers: { current: 0, previous: 0, change: 0 },
      items_sold: { current: 0, previous: 0, change: 0 }
    },
    sales_by_date: [],
    top_products: [],
    category_sales: [],
    order_statuses: []
  }
};

const reportsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REPORTS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case FETCH_REPORTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        error: null
      };
    case FETCH_REPORTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case SET_REPORTS_RANGE:
      return {
        ...state,
        selectedRange: action.payload
      };
    case SET_REPORTS_CUSTOM_DATES:
      return {
        ...state,
        customDates: {
          ...state.customDates,
          ...action.payload
        }
      };
    default:
      return state;
  }
};

export default reportsReducer;
