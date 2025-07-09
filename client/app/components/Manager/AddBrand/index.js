/**
 *
 * AddBrand
 *
 */

import React from 'react';

import { Row, Col } from 'reactstrap';

import Input from '../../Common/Input';
import Switch from '../../Common/Switch';
import Button from '../../Common/Button';

const AddBrand = props => {
  const { brandFormData, formErrors, brandChange, addBrand } = props;

  const handleSubmit = event => {
    event.preventDefault();
    addBrand();
  };

  return (
    <div className='add-brand'>
      <form onSubmit={handleSubmit} noValidate>
        <Row>
          <Col xs='12'>
            <Input
              type={'text'}
              error={formErrors['name']}
              label={'Tên'}
              name={'name'}
              placeholder={'Tên thương hiệu'}
              value={brandFormData.name}
              onInputChange={(name, value) => {
                brandChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='12'>
            <Input
              type={'textarea'}
              error={formErrors['description']}
              label={'Mô tả'}
              name={'description'}
              placeholder={'Mô tả thương hiệu'}
              value={brandFormData.description}
              onInputChange={(name, value) => {
                brandChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='12' className='my-2'>
            <Switch
              id={'active-brand'}
              name={'is_active'}
              label={'Hoạt động?'}
              checked={brandFormData.is_active}
              toggleCheckboxChange={value => brandChange('is_active', value)}
            />
          </Col>
        </Row>
        <hr />
        <div className='add-brand-actions'>
          <Button type='submit' text={'Thêm thương hiệu'} />
        </div>
      </form>
    </div>
  );
};

export default AddBrand;
