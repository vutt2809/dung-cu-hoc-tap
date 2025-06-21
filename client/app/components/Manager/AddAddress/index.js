/**
 *
 * AddAddress
 *
 */

import React from 'react';

import { Row, Col } from 'reactstrap';

import Checkbox from '../../Common/Checkbox';
import Input from '../../Common/Input';
import Button from '../../Common/Button';
import { VI } from '../../../constants';

const AddAddress = props => {
  const { addressFormData, formErrors, addressChange, addAddress } = props;

  const handleSubmit = event => {
    event.preventDefault();
    addAddress();
  };

  return (
    <div className='add-address'>
      <form onSubmit={handleSubmit} noValidate>
        <Row>
          <Col xs='12' md='12'>
            <Input
              type={'text'}
              error={formErrors['address']}
              label={VI['Address']}
              name={'address'}
              placeholder={'Address: Street, House No / Apartment No'}
              value={addressFormData.address}
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
              value={addressFormData.city}
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
              value={addressFormData.state}
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
              placeholder={'Please Enter Your country'}
              value={addressFormData.country}
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
              value={addressFormData.zip_code}
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
              checked={addressFormData.isDefault}
              onChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
        </Row>
        <hr />
        <div className='add-address-actions'>
          <Button type='submit' text={VI['Add Address']} />
        </div>
      </form>
    </div>
  );
};

export default AddAddress;
