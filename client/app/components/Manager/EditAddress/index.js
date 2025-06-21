/**
 *
 * Edit Address
 *
 */

import React from 'react';

import { Row, Col } from 'reactstrap';

import Checkbox from '../../Common/Checkbox';
import Input from '../../Common/Input';
import Button from '../../Common/Button';
import { VI } from '../../../constants';

const EditAddress = props => {
  const { address, addressChange, formErrors, updateAddress, deleteAddress } =
    props;

  const handleSubmit = event => {
    event.preventDefault();
    updateAddress();
  };

  return (
    <div className='edit-address'>
      <form onSubmit={handleSubmit} noValidate>
        <Row>
          <Col xs='12' md='12'>
            <Input
              type={'text'}
              error={formErrors['address']}
              label={VI['Address']}
              name={'address'}
              placeholder={'Address: Street, House No / Apartment No'}
              value={address.address}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='12'>
            <Input
              type={'text'}
              error={formErrors['city']}
              label={VI['City']}
              name={'city'}
              placeholder={VI['City']}
              value={address.city}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' lg='6'>
            <Input
              type={'text'}
              error={formErrors['state']}
              label={VI['State']}
              name={'state'}
              placeholder={VI['State']}
              value={address.state}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' lg='6'>
            <Input
              type={'text'}
              error={formErrors['country']}
              label={VI['Country']}
              name={'country'}
              placeholder={'Please Enter Your Country'}
              value={address.country}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' lg='6'>
            <Input
              type={'text'}
              error={formErrors['zip_code']}
              label={VI['Zip Code']}
              name={'zip_code'}
              placeholder={'Please Enter Your zip_code'}
              value={address.zip_code}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='12'>
            <Checkbox
              id={'default'}
              label={VI['Set as default']}
              name={'isDefault'}
              checked={address.isDefault}
              onChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
        </Row>
        <hr />
        <div className='d-flex flex-column flex-md-row'>
          <Button
            type='submit'
            text={VI['Save']}
            className='mb-3 mb-md-0 mr-0 mr-md-3'
          />
          <Button
            variant='danger'
            text={VI['Delete']}
            onClick={() => deleteAddress(address.id)}
          />
        </div>
      </form>
    </div>
  );
};

export default EditAddress;
