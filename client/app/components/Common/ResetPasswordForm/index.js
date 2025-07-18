/**
 *
 * ResetPasswordForm
 *
 */

import React from 'react';

import { Row, Col } from 'reactstrap';

import Input from '../Input';
import Button from '../Button';
import { VI } from '../../../constants';

const ResetPasswordForm = props => {
  const {
    resetFormData,
    formErrors,
    isToken,
    resetPasswordChange,
    resetPassword
  } = props;

  const handleSubmit = event => {
    event.preventDefault();
    resetPassword();
  };

  return (
    <div className='reset-password-form'>
      <form onSubmit={handleSubmit} noValidate>
        <Row>
          {!isToken && (
            <Col xs='12' lg='12'>
              <Input
                type={'password'}
                error={formErrors['current_password']}
                label={VI['Current Password'] || 'Mật khẩu hiện tại'}
                name={'current_password'}
                placeholder={VI['Current Password'] || 'Mật khẩu hiện tại'}
                value={resetFormData.current_password || ''}
                onInputChange={(name, value) => {
                  resetPasswordChange(name, value);
                }}
              />
            </Col>
          )}
          <Col xs='12' lg='6'>
            <Input
              type={'password'}
              error={formErrors['password']}
              label={VI['Password']}
              name={'password'}
              placeholder={isToken ? VI['Password'] : VI['New Password'] || 'Mật khẩu mới'}
              value={resetFormData.password}
              onInputChange={(name, value) => {
                resetPasswordChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' lg='6'>
            <Input
              type={'password'}
              error={formErrors['confirmPassword']}
              label={VI['Confirm Password']}
              name={'confirmPassword'}
              placeholder={VI['Confirm New Password']}
              value={resetFormData.confirmPassword}
              onInputChange={(name, value) => {
                resetPasswordChange(name, value);
              }}
            />
          </Col>
        </Row>
        <hr />
        <div className='reset-actions'>
          <Button type='submit' text={VI['Change Password']} />
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
