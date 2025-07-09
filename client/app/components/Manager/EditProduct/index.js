/**
 *
 * EditProduct
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import { ROLES } from '../../../constants';
import { VI } from '../../../constants/vi';
import Input from '../../Common/Input';
import Switch from '../../Common/Switch';
import Button from '../../Common/Button';
import SelectOption from '../../Common/SelectOption';
import { formatCurrencyVN } from '../../../utils/format';

const taxableSelect = [
  { value: 1, label: 'Yes' },
  { value: 0, label: 'No' }
];

const EditProduct = props => {
  const {
    user,
    product,
    productChange,
    formErrors,
    brands,
    updateProduct,
    deleteProduct,
    activateProduct
  } = props;

  const handleSubmit = event => {
    event.preventDefault();
    updateProduct();
  };

  return (
    <div className='edit-product'>
      <div className='d-flex flex-row mx-0 mb-3'>
        <label className='mr-1'>Link sản phẩm</label>
        <Link to={`/product/${product.slug}`} className='default-link'>
          {product.slug}
        </Link>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <Row>
          <Col xs='12'>
            <Input
              type={'text'}
              error={formErrors['name']}
              label={VI.Name}
              name={'name'}
              placeholder={VI['Product Name']}
              value={product.name}
              onInputChange={(name, value) => {
                productChange(name, value);
              }}
            />
          </Col>
          <Col xs='12'>
            <Input
              type={'file'}
              error={formErrors['image']}
              name={'image'}
              label={'Image'}
              onInputChange={(name, value) => {
                productChange(name, value);
              }}
            />
          </Col>
          <Col xs='12'>
            <Input
              type={'text'}
              error={formErrors['sku']}
              label={VI.Sku}
              name={'sku'}
              placeholder={VI['Product Sku']}
              value={product.sku}
              onInputChange={(name, value) => {
                productChange(name, value);
              }}
            />
          </Col>
          <Col xs='12'>
            <Input
              type={'text'}
              error={formErrors['slug']}
              label={VI.Slug}
              name={'slug'}
              placeholder={VI['Product Slug']}
              value={product.slug}
              onInputChange={(name, value) => {
                productChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='12'>
            <Input
              type={'textarea'}
              error={formErrors['description']}
              label={VI.Description}
              name={'description'}
              placeholder={VI['Product Description']}
              value={product.description}
              onInputChange={(name, value) => {
                productChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' lg='6'>
            <Input
              type={'number'}
              error={formErrors['quantity']}
              label={VI.Quantity}
              name={'quantity'}
              decimals={false}
              placeholder={VI['Product Quantity']}
              value={product.quantity}
              onInputChange={(name, value) => {
                productChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' lg='6'>
            <Input
              type={'number'}
              error={formErrors['price']}
              label={VI.Price}
              name={'price'}
              min={1}
              placeholder={VI['Product Price']}
              value={product.price ? parseInt(product.price) : ''}
              onInputChange={(name, value) => {
                productChange(name, value);
              }}
              addonAfter={formatCurrencyVN(product.price)}
            />
          </Col>
          <Col xs='12' md='12'>
            <SelectOption
              error={formErrors['taxable']}
              label={VI.Taxable}
              multi={false}
              name={'taxable'}
              value={[product.taxable !== null && product.taxable !== undefined ? (product.taxable ? taxableSelect[0] : taxableSelect[1]) : taxableSelect[1]]}
              options={taxableSelect}
              handleSelectChange={value => {
                productChange('taxable', value.value);
              }}
            />
          </Col>

          {user.role === ROLES.Admin && (
            <Col xs='12' md='12'>
              <SelectOption
                error={formErrors['brand']}
                label={VI['Select Brand']}
                defaultValue={product.brand || null}
                options={brands}
                handleSelectChange={value => {
                  productChange('brand', value);
                }}
              />
            </Col>
          )}
          <Col xs='12' md='12' className='mt-3 mb-2'>
            <Switch
              id={`enable-product-${product.id}`}
              name={'is_active'}
              label={VI['Active?']}
              checked={product.is_active || false}
              toggleCheckboxChange={value => {
                productChange('is_active', value);
                activateProduct(product.id, value);
              }}
            />
          </Col>
        </Row>
        <hr />
        <div className='d-flex flex-column flex-md-row'>
          <Button
            type='submit'
            text={VI.Save}
            className='mb-3 mb-md-0 mr-0 mr-md-3'
          />
          <Button
            variant='danger'
            text={VI.Delete}
            onClick={() => deleteProduct(product.id)}
          />
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
