/**
 *
 * EditCategory
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import Input from '../../Common/Input';
import Button from '../../Common/Button';
import SelectOption from '../../Common/SelectOption';
import Switch from '../../Common/Switch';
import { VI } from '../../../constants/vi';

const EditCategory = props => {
  const {
    products,
    category,
    categoryChange,
    formErrors,
    updateCategory,
    deleteCategory,
    activateCategory
  } = props;

  const handleSubmit = event => {
    event.preventDefault();
    updateCategory();
  };

  const newProducts = products.map(p => {
    return {
      value: p.id,
      label: p.name
    };
  });
  const newCategory = {
    ...category,
    products: category?.products?.map(p => {
      return {
        value: p.id,
        label: p.name
      };
    })
  };

  return (
    <div className='edit-category'>
      <div className='d-flex flex-row mx-0 mb-3'>
        <label className='mr-1'>Category link </label>
        <Link to={`/shop/category/${category.slug}`} className='default-link'>
          {category.slug}
        </Link>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <Row>
          <Col xs='12'>
            <Input
              type={'text'}
              error={formErrors['name']}
              label={VI['Name']}
              name={'name'}
              placeholder={'Category Name'}
              value={newCategory.name}
              onInputChange={(name, value) => {
                categoryChange(name, value);
              }}
            />
          </Col>
          <Col xs='12'>
            <Input
              type={'text'}
              error={formErrors['slug']}
              label={'Slug'}
              name={'slug'}
              placeholder={'Category Slug'}
              value={category.slug}
              onInputChange={(name, value) => {
                categoryChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='12'>
            <Input
              type={'textarea'}
              error={formErrors['description']}
              label={VI['Description']}
              name={'description'}
              placeholder={'Category Description'}
              value={newCategory.description}
              onInputChange={(name, value) => {
                categoryChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='12'>
            <SelectOption
              error={formErrors['products']}
              label={'Chọn sản phẩm'}
              multi={true}
              defaultValue={newCategory.products}
              options={newProducts}
              handleSelectChange={value => {
                categoryChange('products', value);
              }}
            />
          </Col>
          <Col xs='12' md='12' className='mt-3 mb-2'>
            <Switch
              style={{ width: 100 }}
              tooltip={newCategory.is_active}
              tooltipContent={`${newCategory.name} cũng sẽ disable tất cả sản phẩm ${newCategory.name}.`}
              id={`enable-category-${newCategory.id}`}
              name={'is_active'}
              label={VI['Active?']}
              checked={newCategory.is_active}
              toggleCheckboxChange={value =>
                activateCategory(newCategory.id, value)
              }
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
            onClick={() => deleteCategory(newCategory.id)}
          />
        </div>
      </form>
    </div>
  );
};

export default EditCategory;
