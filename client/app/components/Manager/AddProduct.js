import React from 'react';
import { Row, Col } from 'reactstrap';
import Input from '../Common/Input';
import Switch from '../Common/Switch';
import Button from '../Common/Button';
import SelectOption from '../Common/SelectOption';
import { formatCurrencyVN } from '../../utils/format';

const taxableSelect = [
  { value: 1, label: 'Có' },
  { value: 0, label: 'Không' }
];

const AddProduct = props => {
  const {
    productFormData,
    productChange,
    formErrors,
    brands,
    addProduct,
    user
  } = props;

  const handleSubmit = event => {
    event.preventDefault();
    addProduct();
  };

  return (
    <div className='add-product'>
      <form onSubmit={handleSubmit} noValidate>
        <Row>
          <Col xs='12'>
            <Input
              type={'text'}
              error={formErrors['name']}
              label={'Tên'}
              name={'name'}
              placeholder={'Tên sản phẩm'}
              value={productFormData.name}
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
              label={'Mã SKU'}
              name={'sku'}
              placeholder={'Mã SKU sản phẩm'}
              value={productFormData.sku}
              onInputChange={(name, value) => {
                productChange(name, value);
              }}
            />
          </Col>
          <Col xs='12'>
            <Input
              type={'text'}
              error={formErrors['slug']}
              label={'Slug'}
              name={'slug'}
              placeholder={'Slug sản phẩm'}
              value={productFormData.slug}
              onInputChange={(name, value) => {
                productChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='12'>
            <Input
              type={'textarea'}
              error={formErrors['description']}
              label={'Mô tả'}
              name={'description'}
              placeholder={'Mô tả sản phẩm'}
              value={productFormData.description}
              onInputChange={(name, value) => {
                productChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' lg='6'>
            <Input
              type={'number'}
              error={formErrors['quantity']}
              label={'Số lượng'}
              name={'quantity'}
              decimals={false}
              placeholder={'Số lượng sản phẩm'}
              value={productFormData.quantity}
              onInputChange={(name, value) => {
                productChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' lg='6'>
            <Input
              type={'number'}
              error={formErrors['price']}
              label={'Giá'}
              name={'price'}
              min={1}
              placeholder={'Giá sản phẩm'}
              value={productFormData.price ? parseInt(productFormData.price) : ''}
              onInputChange={(name, value) => {
                productChange(name, value);
              }}
              addonAfter={formatCurrencyVN(productFormData.price)}
            />
          </Col>
          <Col xs='12' md='12'>
            <SelectOption
              error={formErrors['taxable']}
              label={'Chịu thuế'}
              multi={false}
              name={'taxable'}
              value={[
                productFormData.taxable !== null && productFormData.taxable !== undefined
                  ? productFormData.taxable
                    ? taxableSelect[0]
                    : taxableSelect[1]
                  : taxableSelect[1]
              ]}
              options={taxableSelect}
              handleSelectChange={value => {
                productChange('taxable', value.value);
              }}
            />
          </Col>
          {user && user.role === 'ROLE ADMIN' && (
            <Col xs='12' md='12'>
              <SelectOption
                error={formErrors['brand']}
                label={'Chọn thương hiệu'}
                defaultValue={productFormData.brand || null}
                options={brands}
                handleSelectChange={value => {
                  productChange('brand', value);
                }}
              />
            </Col>
          )}
          <Col xs='12' md='12' className='mt-3 mb-2'>
            <Switch
              id={`enable-product`}
              name={'is_active'}
              label={'Hoạt động?'}
              checked={productFormData.is_active || false}
              toggleCheckboxChange={value => {
                productChange('is_active', value);
              }}
            />
          </Col>
        </Row>
        <hr />
        <div className='d-flex flex-column flex-md-row'>
          <Button
            type='submit'
            text={'Lưu'}
            className='mb-3 mb-md-0 mr-0 mr-md-3'
          />
        </div>
      </form>
    </div>
  );
};

export default AddProduct; 