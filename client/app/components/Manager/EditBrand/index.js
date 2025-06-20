/**
 *
 * EditBrand
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import Input from '../../Common/Input';
import Button from '../../Common/Button';
import Switch from '../../Common/Switch';
import { ROLES, VI } from '../../../constants';

const EditBrand = props => {
  const {
    user,
    brand,
    brandChange,
    formErrors,
    updateBrand,
    deleteBrand,
    activateBrand
  } = props;

  const handleSubmit = event => {
    event.preventDefault();
    updateBrand();
  };

  return (
    <div className='edit-brand'>
      <div className='d-flex flex-row mx-0 mb-3'>
        <label className='mr-1'>Brand link </label>
        <Link to={`/shop/brand/${brand.slug}`} className='default-link'>
          {brand.slug}
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
              placeholder={VI['Brand Name'] || 'Brand Name'}
              value={brand.name}
              onInputChange={(name, value) => {
                brandChange(name, value);
              }}
            />
          </Col>
          <Col xs='12'>
            <Input
              type={'text'}
              error={formErrors['slug']}
              label={'Slug'}
              name={'slug'}
              placeholder={'Brand Slug'}
              value={brand.slug}
              onInputChange={(name, value) => {
                brandChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='12'>
            <Input
              type={'textarea'}
              error={formErrors['description']}
              label={VI['Description']}
              name={'description'}
              placeholder={VI['Brand Description'] || 'Brand Description'}
              value={brand.description}
              onInputChange={(name, value) => {
                brandChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='12' className='mt-3 mb-2'>
            <Switch
              style={{ width: 100 }}
              tooltip={brand.isActive}
              tooltipContent={`Disabling ${brand.name} will also disable all ${brand.name} products.`}
              id={`enable-brand-${brand.id}`}
              name={'isActive'}
              label={VI['Active?']}
              checked={brand.isActive}
              toggleCheckboxChange={value => activateBrand(brand.id, value)}
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
            disabled={user.role === ROLES.Merchant}
            onClick={() => deleteBrand(brand.id)}
          />
        </div>
      </form>
    </div>
  );
};

export default EditBrand;
