/*
 *
 * Login
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import actions from '../../actions';

import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import LoadingIndicator from '../../components/Common/LoadingIndicator';

import { VI } from '../../constants';

class Login extends React.PureComponent {
  render() {
    const {
      authenticated,
      loginFormData,
      loginChange,
      login,
      formErrors,
      isLoading,
      isSubmitting
    } = this.props;

    if (authenticated) return <Redirect to='/dashboard' />;

    const registerLink = () => {
      this.props.history.push('/register');
    };

    const handleSubmit = event => {
      event.preventDefault();
      login();
    };

    return (
      <div className='login-form'>
        {isLoading && <LoadingIndicator />}
        <h2>{VI.Login}</h2>
        <hr />
        <form onSubmit={handleSubmit} noValidate>
          <div className='form-group'>
            <Input
              type={'text'}
              error={formErrors['email']}
              label={VI['Email Address']}
              name={'email'}
              placeholder={VI['Please Enter Your Email']}
              value={loginFormData.email}
              onInputChange={(name, value) => {
                loginChange(name, value);
              }}
            />
          </div>
          <div className='form-group'>
            <Input
              type={'password'}
              error={formErrors['password']}
              label={VI.Password}
              name={'password'}
              placeholder={VI['Please Enter Your Password']}
              value={loginFormData.password}
              onInputChange={(name, value) => {
                loginChange(name, value);
              }}
            />
          </div>
          <hr />
          <div className='d-flex flex-column align-items-center'>
            <div className='d-flex flex-column align-items-center mb-3'>
              <Button
                type='submit'
                variant='primary'
                text={VI.Login}
                disabled={isSubmitting}
                className='mb-3'
              />
              <Button
                text={VI['Create an account']}
                variant='link'
                onClick={registerLink}
              />
            </div>
            <Link
              className='redirect-link forgot-password-link'
              to={'/forgot-password'}
            >
              {VI['Forgot Password?']}
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
    loginFormData: state.login.loginFormData,
    formErrors: state.login.formErrors,
    isLoading: state.login.isLoading,
    isSubmitting: state.login.isSubmitting
  };
};

export default connect(mapStateToProps, actions)(Login);
