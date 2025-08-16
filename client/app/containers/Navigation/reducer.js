/*
 *
 * Navigation reducer
 *
 */

import {
  TOGGLE_MENU,
  TOGGLE_CART,
  SEARCH_CHANGE,
  SUGGESTIONS_FETCH_REQUEST,
  SUGGESTIONS_CLEAR_REQUEST
} from './constants';

const initialState = {
  isMenuOpen: false,
  isCartOpen: false,
  searchValue: '',
  searchSuggestions: []
};

const navigationReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_MENU:
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen,
        isCartOpen: false
      };
    case TOGGLE_CART:
      return {
        ...state,
        isCartOpen: !state.isCartOpen,
        isMenuOpen: false
      };

    case SEARCH_CHANGE:
      return {
        ...state,
        searchValue: action.payload
      };
    case SUGGESTIONS_FETCH_REQUEST:
      return {
        ...state,
        searchSuggestions: action.payload
      };
    case SUGGESTIONS_CLEAR_REQUEST:
      return {
        ...state,
        searchSuggestions: action.payload
      };
    default:
      return state;
  }
};

export default navigationReducer;
