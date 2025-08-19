/**
 *
 * ResetPasswordForm
 *
 */

import React from 'react';

import { Row, Col } from 'reactstrap';

import Input from '../Input';
import Button from '../Button';

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
                label={'Mật khẩu hiện tại'}
                name={'current_password'}
                placeholder={'Mật khẩu hiện tại'}
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
              label={'Mật khẩu mới'}
              name={'password'}
              placeholder={'Mật khẩu mới'}
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
              label={'Xác nhận mật khẩu mới'}
              name={'confirmPassword'}
              placeholder={'Xác nhận mật khẩu mới'}
              value={resetFormData.confirmPassword}
              onInputChange={(name, value) => {
                resetPasswordChange(name, value);
              }}
            />
          </Col>
        </Row>
        <hr />
        <div className='reset-actions'>
          <Button type='submit' text={'Thay đổi mật khẩu'} />
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
