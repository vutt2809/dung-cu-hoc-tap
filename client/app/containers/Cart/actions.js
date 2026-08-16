/*
 *
 * Cart actions
 *
 */

import { push } from 'connected-react-router';
import { success } from 'react-notification-system-redux';
import axios from 'axios';

import {
  HANDLE_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  HANDLE_CART_TOTAL,
  SET_CART_ID,
  CLEAR_CART
} from './constants';

import {
  SET_PRODUCT_SHOP_FORM_ERRORS,
  RESET_PRODUCT_SHOP
} from '../Product/constants';

import { API_URL, CART_ID, CART_ITEMS, CART_TOTAL } from '../../constants';
import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';
import { toggleCart } from '../Navigation/actions';

// Handle Add To Cart
export const handleAddToCart = product => {
  return async (dispatch, getState) => {
    product.quantity = Number(getState().product.productShopData.quantity);
    product.totalPrice = product.quantity * product.price;
    product.totalPrice = parseFloat(product.totalPrice.toFixed(2));
    const inventory = getState().product.storeProduct.inventory;

    const result = calculatePurchaseQuantity(inventory);

    const rules = {
      quantity: `min:1|max:${result}`
    };

    const { isValid, errors } = allFieldsValidation(product, rules, {
      'min.quantity': 'Quantity must be at least 1.',
      'max.quantity': `Quantity may not be greater than ${result}.`
    });

    if (!isValid) {
      return dispatch({ type: SET_PRODUCT_SHOP_FORM_ERRORS, payload: errors });
    }

    dispatch({
      type: RESET_PRODUCT_SHOP
    });

    dispatch({
      type: ADD_TO_CART,
      payload: product
    });

    const cartItems = JSON.parse(localStorage.getItem(CART_ITEMS)) || [];
    const existingIndex = cartItems.findIndex(
      item => (item.id || item._id) === (product.id || product._id)
    );
    let newCartItems = [];
    if (existingIndex > -1) {
      newCartItems = [...cartItems];
      const existingItem = newCartItems[existingIndex];
      const newQuantity = existingItem.quantity + product.quantity;
      newCartItems[existingIndex] = {
        ...existingItem,
        quantity: newQuantity,
        totalPrice: parseFloat((newQuantity * existingItem.price).toFixed(2))
      };
    } else {
      newCartItems = [...cartItems, product];
    }
    localStorage.setItem(CART_ITEMS, JSON.stringify(newCartItems));

    dispatch(calculateCartTotal());
    dispatch(toggleCart());

    // --- Đồng bộ lên server nếu đã đăng nhập ---
    const token = localStorage.getItem('token');
    if (!token) return;

    const productId = product.id || product._id;
    if (!productId) return;

    try {
      await axios.post(`${API_URL}/cart`, {
        product_id: productId,
        quantity: product.quantity,
        price: product.price,
        taxable: product.taxable
      });
    } catch (err) {
      console.error('Lỗi đồng bộ giỏ hàng lên server:', err);
    }
  };
};

// Handle Remove From Cart
export const handleRemoveFromCart = product => {
  return async (dispatch, getState) => {
    const cartItems = JSON.parse(localStorage.getItem(CART_ITEMS));
    const newCartItems = cartItems.filter(item => item.id !== product.id);
    localStorage.setItem(CART_ITEMS, JSON.stringify(newCartItems));

    dispatch({
      type: REMOVE_FROM_CART,
      payload: product
    });
    dispatch(calculateCartTotal());
    // dispatch(toggleCart());

    // --- Xóa trên server nếu đã đăng nhập ---
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.delete(`${API_URL}/cart/${product.id || product._id}`);
    } catch (err) {
      console.error('Lỗi xóa sản phẩm khỏi giỏ hàng server:', err);
    }
  };
};

export const calculateCartTotal = () => {
  return (dispatch, getState) => {
    const cartItems = getState().cart.cartItems;

    let total = 0;

    cartItems.map(item => {
      total += item.price * item.quantity;
    });

    total = parseFloat(total.toFixed(2));
    localStorage.setItem(CART_TOTAL, total);
    dispatch({
      type: HANDLE_CART_TOTAL,
      payload: total
    });
  };
};

// set cart store from local storage
export const handleCart = () => {
  const cart = {
    cartItems: JSON.parse(localStorage.getItem(CART_ITEMS)),
    cartTotal: localStorage.getItem(CART_TOTAL),
    cartId: localStorage.getItem(CART_ID)
  };

  return (dispatch, getState) => {
    if (cart.cartItems != undefined) {
      dispatch({
        type: HANDLE_CART,
        payload: cart
      });
      dispatch(calculateCartTotal());
    }
  };
};

export const handleCheckout = () => {
  return (dispatch, getState) => {
    const successfulOptions = {
      title: 'Vui lòng đăng nhập để tiến hành thanh toán',
      position: 'tr',
      autoDismiss: 1
    };

    dispatch(toggleCart());
    dispatch(push('/login'));
    dispatch(success(successfulOptions));
  };
};

// Continue shopping use case
export const handleShopping = () => {
  return (dispatch, getState) => {
    dispatch(push('/shop'));
    dispatch(toggleCart());
  };
};

// create cart id api
export const getCartId = () => {
  return async (dispatch, getState) => {
    try {
      const cartId = localStorage.getItem(CART_ID);
      const cartItems = getState().cart.cartItems;
      const products = getCartItems(cartItems);

      // create cart id if there is no one
      if (!cartId) {
        const response = await axios.post(`${API_URL}/cart`, { products });

        dispatch(setCartId(response.data.cartId));
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const setCartId = cartId => {
  return (dispatch, getState) => {
    localStorage.setItem(CART_ID, cartId);
    dispatch({
      type: SET_CART_ID,
      payload: cartId
    });
  };
};

export const clearCart = () => {
  return async (dispatch, getState) => {
    localStorage.removeItem(CART_ITEMS);
    localStorage.removeItem(CART_TOTAL);
    localStorage.removeItem(CART_ID);

    dispatch({
      type: CLEAR_CART
    });

    // --- Clear trên server nếu đã đăng nhập ---
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.delete(`${API_URL}/cart`);
    } catch (err) {
      console.error('Lỗi clear giỏ hàng server:', err);
    }
  };
};

const getCartItems = cartItems => {
  const newCartItems = [];
  cartItems.map(item => {
    const newItem = {};
    newItem.quantity = item.quantity;
    newItem.price = item.price;
    newItem.taxable = item.taxable;
    newItem.product = item.id;
    newCartItems.push(newItem);
  });

  return newCartItems;
};

const calculatePurchaseQuantity = inventory => {
  if (inventory <= 25) {
    return 1;
  } else if (inventory > 25 && inventory <= 100) {
    return 5;
  } else if (inventory > 100 && inventory < 500) {
    return 25;
  } else {
    return 50;
  }
};

// Sync cart from localStorage to server
export const syncCartToServer = () => {
  return async (dispatch, getState) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const cartItems = getState().cart.cartItems;
    if (!cartItems || cartItems.length === 0) return;

    try {
      // Clear server cart first
      await axios.delete(`${API_URL}/cart`);

      // Add all items from localStorage to server
      for (const item of cartItems) {
        const pId = item.id || item._id;
        if (pId) {
          await axios.post(`${API_URL}/cart`, {
            product_id: pId,
            quantity: item.quantity,
            price: item.price,
            taxable: item.taxable || false
          });
        }
      }
    } catch (err) {
      console.error('Lỗi đồng bộ giỏ hàng lên server:', err);
    }
  };
};

// Load cart from server and sync with localStorage
export const loadCartFromServer = () => {
  return async (dispatch, getState) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get(`${API_URL}/cart`);

      const serverCartItems = response.data.cart || [];
      const localCartItems = JSON.parse(localStorage.getItem(CART_ITEMS) || '[]');

      // If server has items, use server data
      if (serverCartItems.length > 0) {
        const formattedItems = serverCartItems.map(item => ({
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          image_url: item.product.image_url,
          price: parseFloat(item.price),
          quantity: item.quantity,
          taxable: item.taxable || false
        }));

        localStorage.setItem(CART_ITEMS, JSON.stringify(formattedItems));

        dispatch({
          type: HANDLE_CART,
          payload: {
            cartItems: formattedItems,
            cartTotal: 0,
            cartId: localStorage.getItem(CART_ID)
          }
        });
        dispatch(calculateCartTotal());
      } else if (localCartItems.length > 0) {
        // If server is empty but local has items, keep local items and sync them to server
        dispatch({
          type: HANDLE_CART,
          payload: {
            cartItems: localCartItems,
            cartTotal: localStorage.getItem(CART_TOTAL) || 0,
            cartId: localStorage.getItem(CART_ID)
          }
        });
        dispatch(calculateCartTotal());
        await dispatch(syncCartToServer());
      }
    } catch (err) {
      console.error('Lỗi load giỏ hàng từ server:', err);
    }
  };
};
