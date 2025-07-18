/*
 *
 * Brand reducer
 *
 */

import {
  FETCH_BRANDS,
  FETCH_STORE_BRANDS,
  FETCH_BRAND,
  BRAND_CHANGE,
  BRAND_EDIT_CHANGE,
  SET_BRAND_FORM_ERRORS,
  SET_BRAND_FORM_EDIT_ERRORS,
  ADD_BRAND,
  REMOVE_BRAND,
  FETCH_BRANDS_SELECT,
  RESET_BRAND,
  SET_BRANDS_LOADING
} from './constants';

const initialState = {
  brands: [],
  storeBrands: [],
  brand: {
    name: '',
    description: ''
  },
  brandsSelect: [],
  brandFormData: {
    name: '',
    description: '',
    is_active: true
  },
  formErrors: {},
  editFormErrors: {},
  isLoading: false
};

const brandReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BRANDS:
      return {
        ...state,
        brands: action.payload
      };
    case FETCH_STORE_BRANDS:
      return {
        ...state,
        storeBrands: action.payload
      };
    case FETCH_BRAND:
      return {
        ...state,
        brand: action.payload,
        editFormErrors: {}
      };
    case FETCH_BRANDS_SELECT:
      return {
        ...state,
        brandsSelect: action.payload
      };
    case ADD_BRAND:
      return {
        ...state,
        brands: [...state.brands, action.payload]
      };
    case REMOVE_BRAND:
      const index = (state.brands || []).findIndex(b => bid === action.payload);
      return {
        ...state,
        brands: [
          ...state.brands.slice(0, index),
          ...state.brands.slice(index + 1)
        ]
      };
    case BRAND_CHANGE:
      return {
        ...state,
        brandFormData: {
          ...state.brandFormData,
          ...action.payload
        }
      };
    case BRAND_EDIT_CHANGE:
      return {
        ...state,
        brand: {
          ...state.brand,
          ...action.payload
        }
      };
    case SET_BRAND_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload
      };
    case SET_BRAND_FORM_EDIT_ERRORS:
      return {
        ...state,
        editFormErrors: action.payload
      };
    case SET_BRANDS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case RESET_BRAND:
      return {
        ...state,
        brandFormData: {
          name: '',
          description: '',
          is_active: true
        },
        formErrors: {}
      };
    default:
      return state;
  }
};

export default brandReducer;
