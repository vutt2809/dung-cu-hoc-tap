/*
 *
 * Cart reducer
 *
 */

import {
  HANDLE_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  HANDLE_CART_TOTAL,
  SET_CART_ID,
  CLEAR_CART
} from './constants';

const initialState = {
  cartItems: [],
  cartTotal: 0,
  cartId: ''
};

const cartReducer = (state = initialState, action) => {
  let newState;

  switch (action.type) {
    case ADD_TO_CART: {
      const existingItemIndex = (state.cartItems || []).findIndex(
        x => (x.id || x._id) === (action.payload.id || action.payload._id)
      );

      if (existingItemIndex > -1) {
        const updatedCartItems = [...state.cartItems];
        const existingItem = updatedCartItems[existingItemIndex];
        const newQuantity = existingItem.quantity + action.payload.quantity;
        updatedCartItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          totalPrice: parseFloat((newQuantity * existingItem.price).toFixed(2))
        };
        return {
          ...state,
          cartItems: updatedCartItems
        };
      }

      newState = {
        ...state,
        cartItems: [...state.cartItems, action.payload]
      };

      return newState;
    }
    case REMOVE_FROM_CART:
      let itemIndex = (state.cartItems || []).findIndex(
        x => x.id == action.payload.id
      );

      newState = {
        ...state,
        cartItems: [
          ...state.cartItems.slice(0, itemIndex),
          ...state.cartItems.slice(itemIndex + 1)
        ]
      };

      return newState;
    case HANDLE_CART_TOTAL:
      newState = {
        ...state,
        cartTotal: action.payload
      };

      return newState;
    case HANDLE_CART:
      newState = {
        ...state,
        cartItems: action.payload.cartItems,
        cartTotal: action.payload.cartTotal,
        cartId: action.payload.cartId
      };
      return newState;
    case SET_CART_ID:
      newState = {
        ...state,
        cartId: action.payload
      };
      return newState;
    case CLEAR_CART:
      newState = {
        ...state,
        cartItems: [],
        cartTotal: 0,
        cartId: ''
      };
      return newState;

    default:
      return state;
  }
};

export default cartReducer;
