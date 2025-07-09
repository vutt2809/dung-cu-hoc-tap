/**
 *
 * AddCategory
 *
 */

import React from 'react';

import { Row, Col } from 'reactstrap';

import Input from '../../Common/Input';
import SelectOption from '../../Common/SelectOption';
import Switch from '../../Common/Switch';
import Button from '../../Common/Button';

const AddCategory = props => {
  const { categoryFormData, formErrors, categoryChange, addCategory } = props;

  const handleSubmit = event => {
    event.preventDefault();
    addCategory();
  };

  return (
    <div className='add-category'>
      <form onSubmit={handleSubmit} noValidate>
        <Row>
          <Col xs='12'>
            <Input
              type={'text'}
              error={formErrors['name']}
              label={'Tên'}
              name={'name'}
              placeholder={'Tên danh mục'}
              value={categoryFormData.name}
              onInputChange={(name, value) => {
                categoryChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='12'>
            <Input
              type={'textarea'}
              error={formErrors['description']}
              label={'Mô tả'}
              name={'description'}
              placeholder={'Mô tả danh mục'}
              value={categoryFormData.description}
              onInputChange={(name, value) => {
                categoryChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='12'>
            <SelectOption
              label={'Sản phẩm'}
              name={'products'}
              value={categoryFormData.products}
              options={categoryFormData.products}
              handleSelectChange={value => {
                categoryChange('products', value);
              }}
            />
          </Col>
          <Col xs='12' md='12' className='my-2'>
            <Switch
              id={'active-category'}
              name={'is_active'}
              label={'Hoạt động?'}
              checked={categoryFormData.is_active}
              toggleCheckboxChange={value => categoryChange('is_active', value)}
            />
          </Col>
        </Row>
        <hr />
        <div className='add-category-actions'>
          <Button type='submit' text={'Thêm danh mục'} />
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
