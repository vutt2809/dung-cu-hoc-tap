/**
 *
 * SignupProvider
 *
 */

import React from 'react';

import { GoogleIcon, FacebookIcon } from '../Icon';
import { API_URL, VI } from '../../../constants';

const SignupProvider = () => {
  return (
    <div className='signup-provider'>
      <a href={`${API_URL}/auth/google`} className='mb-2 google-btn'>
        <GoogleIcon />
        <span className='btn-text'>{VI['Login with Google']}</span>
      </a>

      <a href={`${API_URL}/auth/facebook`} className='facebook-btn'>
        <FacebookIcon />
        <span className='btn-text'>{VI['Login with Facebook']}</span>
      </a>
    </div>
  );
};

export default SignupProvider;
