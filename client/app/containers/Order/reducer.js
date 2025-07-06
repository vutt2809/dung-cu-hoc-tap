/*
 *
 * Order reducer
 *
 */

import {
  FETCH_ORDERS,
  FETCH_SEARCHED_ORDERS,
  FETCH_ORDER,
  UPDATE_ORDER_STATUS,
  SET_ORDERS_LOADING,
  SET_ADVANCED_FILTERS,
  CLEAR_ORDERS
} from './constants';

const initialState = {
  orders: [],
  searchedOrders: [],
  order: {
    _id: '',
    cartId: '',
    items: [],
    totalTax: 0,
    total: 0,
    status: ''
  },
  isLoading: false,
  advancedFilters: {
    totalPages: 1,
    currentPage: 1,
    count: 0
  }
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ORDERS:
      return {
        ...state,
        orders: action.payload
      };
    case FETCH_SEARCHED_ORDERS:
      return {
        ...state,
        searchedOrders: action.payload
      };
    case FETCH_ORDER:
      return {
        ...state,
        order: action.payload
      };
    case SET_ADVANCED_FILTERS:
      return {
        ...state,
        advancedFilters: {
          ...state.advancedFilters,
          ...action.payload
        }
      };
    case UPDATE_ORDER_STATUS:
      const itemIndex = (state.order.items || []).findIndex(
        item => item.id === action.payload.itemId
      );

      if (itemIndex !== -1) {
        const newItems = [...(state.order.items || [])];
        newItems[itemIndex].status = action.payload.status;
        return {
          ...state,
          order: {
            ...state.order,
            items: newItems
          }
        };
      }
      return state;
    case SET_ORDERS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case CLEAR_ORDERS:
      return {
        ...state,
        orders: []
      };
    default:
      return state;
  }
};

export default orderReducer;
