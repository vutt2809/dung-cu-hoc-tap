/*
 *
 * Signup
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import actions from '../../actions';

import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import Checkbox from '../../components/Common/Checkbox';
import LoadingIndicator from '../../components/Common/LoadingIndicator';

import { VI } from '../../constants';

class Signup extends React.PureComponent {
  render() {
    const {
      authenticated,
      signupFormData,
      formErrors,
      isLoading,
      isSubmitting,
      isSubscribed,
      signupChange,
      signUp,
      subscribeChange
    } = this.props;

    if (authenticated) return <Redirect to='/dashboard' />;

    const handleSubmit = event => {
      event.preventDefault();
      signUp();
    };

    return (
      <div className='signup-form'>
        {isLoading && <LoadingIndicator />}
        <h2>{VI['Sign Up']}</h2>
        <hr />
        <form onSubmit={handleSubmit} noValidate>
          <div className='form-group'>
            <Input
              type={'text'}
              error={formErrors['email']}
              label={VI['Email Address']}
              name={'email'}
              placeholder={VI['Please Enter Your Email']}
              value={signupFormData.email}
              onInputChange={(name, value) => {
                signupChange(name, value);
              }}
            />
          </div>
          <div className='form-group'>
            <Input
              type={'text'}
              error={formErrors['first_name']}
              label={VI['First Name']}
              name={'first_name'}
              placeholder={VI['Please Enter Your First Name']}
              value={signupFormData.first_name}
              onInputChange={(name, value) => {
                signupChange(name, value);
              }}
            />
          </div>
          <div className='form-group'>
            <Input
              type={'text'}
              error={formErrors['last_name']}
              label={VI['Last Name']}
              name={'last_name'}
              placeholder={VI['Please Enter Your Last Name']}
              value={signupFormData.last_name}
              onInputChange={(name, value) => {
                signupChange(name, value);
              }}
            />
          </div>
          <div className='form-group'>
            <Input
              type={'password'}
              label={VI['Password']}
              error={formErrors['password']}
              name={'password'}
              placeholder={VI['Please Enter Your Password']}
              value={signupFormData.password}
              onInputChange={(name, value) => {
                signupChange(name, value);
              }}
            />
          </div>
          <hr />
          <Checkbox
            id={'subscribe'}
            label={VI['Subscribe to newsletter']}
            checked={isSubscribed}
            onChange={subscribeChange}
          />
          <div className='d-flex flex-column align-items-center'>
            <Button
              type='submit'
              variant='primary'
              text={VI['Sign Up']}
              disabled={isSubmitting}
              className='mb-3'
            />
            <Link className='redirect-link' to={'/login'}>
              {VI['Back To Login']}
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.authentication.authenticated,
    signupFormData: state.signup.signupFormData,
    formErrors: state.signup.formErrors,
    isLoading: state.signup.isLoading,
    isSubmitting: state.signup.isSubmitting,
    isSubscribed: state.signup.isSubscribed
  };
};

export default connect(mapStateToProps, actions)(Signup);
