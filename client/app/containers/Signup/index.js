/*
 *
 * Signup
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { Redirect, Link } from 'react-router-dom';

import actions from '../../actions';

import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import Checkbox from '../../components/Common/Checkbox';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import SignupProvider from '../../components/Common/SignupProvider';
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
          <Row>
            <Col
              xs={{ size: 12, order: 2 }}
              md={{ size: '6', order: 1 }}
              className='p-0'
            >
              <Col xs='12' md='12'>
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
              </Col>
              <Col xs='12' md='12'>
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
              </Col>
              <Col xs='12' md='12'>
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
              </Col>
              <Col xs='12' md='12'>
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
              </Col>
            </Col>
            <Col
              xs={{ size: 12, order: 1 }}
              md={{ size: '6', order: 2 }}
              className='mb-2 mb-md-0'
            >
              <SignupProvider />
            </Col>
          </Row>
          <hr />
          <Checkbox
            id={'subscribe'}
            label={VI['Subscribe to newsletter']}
            checked={isSubscribed}
            onChange={subscribeChange}
          />
          <div className='d-flex flex-column flex-md-row align-items-md-center justify-content-between'>
            <Button
              type='submit'
              variant='primary'
              text={VI['Sign Up']}
              disabled={isSubmitting}
            />
            <Link className='mt-3 mt-md-0 redirect-link' to={'/login'}>
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
