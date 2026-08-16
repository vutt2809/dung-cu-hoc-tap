/**
 *
 * token.js
 * axios default headers setup
 */

import axios from 'axios';

const setToken = token => {
  if (token) {
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    axios.defaults.headers.common['Authorization'] = formattedToken;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export default setToken;
