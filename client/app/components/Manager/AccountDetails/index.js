/**
 *
 * AccountDetails
 *
 */

import React from 'react';

import { Row, Col } from 'reactstrap';

import { EMAIL_PROVIDER } from '../../../constants';
import { VI } from '../../../constants/vi';
import Input from '../../Common/Input';
import Button from '../../Common/Button';

const AccountDetails = props => {
  const { user, accountChange, updateProfile } = props;

  const handleSubmit = event => {
    event.preventDefault();
    updateProfile();
  };

  return (
    <div className='account-details'>
      <div className='info'>
        <div className='desc'>
          <p className='one-line-ellipsis mr-3'>
            {user.provider === EMAIL_PROVIDER.Email ? (
              user.email
            ) : (
              <span className='provider-email'>
                {VI['Logged In With'] || 'Logged in With'} {user.provider}
              </span>
            )}
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <Row>
          <Col xs='12' md='6'>
            <Input
              type={'text'}
              label={VI['First Name'] || 'First Name'}
              name={'first_name'}
              placeholder={VI['Please Enter Your First Name'] || 'Please Enter Your First Name'}
              value={user.first_name ? user.first_name : ''}
              onInputChange={(name, value) => {
                accountChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='6'>
            <Input
              type={'text'}
              label={VI['Last Name'] || 'Last Name'}
              name={'last_name'}
              placeholder={VI['Please Enter Your Last Name'] || 'Please Enter Your Last Name'}
              value={user.last_name ? user.last_name : ''}
              onInputChange={(name, value) => {
                accountChange(name, value);
              }}
            />
          </Col>
          {/* TODO: update email feature to be added instead form change */}
          {/* <Col xs='12' md='6'>
            <Input
              type={'text'}
              label={'Email'}
              name={'email'}
              placeholder={'Please Enter Your Email'}
              value={user.email ? user.email : ''}
              onInputChange={(name, value) => {
                accountChange(name, value);
              }}
            />
          </Col> */}
          <Col xs='12' md='12'>
            <Input
              type={'text'}
              label={VI['Phone Number'] || 'Phone Number'}
              name={'phone_number'}
              placeholder={VI['Please Enter Your Phone Number'] || 'Please Enter Your Phone Number'}
              value={user.phone_number ? user.phone_number : ''}
              onInputChange={(name, value) => {
                accountChange(name, value);
              }}
            />
          </Col>
        </Row>
        <hr />
        <div className='profile-actions'>
          <Button
            type='submit'
            variant='secondary'
            text={VI['Save Changes'] || 'Save Changes'}
          />
        </div>
      </form>
    </div>
  );
};

export default AccountDetails;
