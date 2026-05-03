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
import SelectOption from '../../Common/SelectOption';
import Switch from '../../Common/Switch';

const EditBrand = props => {
    const {
        products,
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

    const newProducts = products ? products.map(p => {
        return {
            value: p.id,
            label: p.name
        };
    }) : [];

    const newBrand = {
        ...brand,
        products: brand?.products?.map(p => {
            return {
                value: p.id,
                label: p.name
            };
        }) || []
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
                            label={'Tên'}
                            name={'name'}
                            placeholder={'Tên thương hiệu'}
                            value={newBrand.name}
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
                            placeholder={'Slug thương hiệu'}
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
                            label={'Mô tả'}
                            name={'description'}
                            placeholder={'Mô tả thương hiệu'}
                            value={newBrand.description}
                            onInputChange={(name, value) => {
                                brandChange(name, value);
                            }}
                        />
                    </Col>
                    <Col xs='12' md='12'>
                        <SelectOption
                            error={formErrors['products']}
                            label={'Chọn sản phẩm'}
                            multi={true}
                            defaultValue={newBrand.products}
                            options={newProducts}
                            handleSelectChange={value => {
                                brandChange('products', value);
                            }}
                        />
                    </Col>
                    <Col xs='12' md='12' className='mt-3 mb-2'>
                        <Switch
                            style={{ width: 100 }}
                            tooltip={newBrand.is_active}
                            tooltipContent={`${newBrand.name} cũng sẽ disable tất cả sản phẩm ${newBrand.name}.`}
                            id={`enable-brand-${newBrand.id}`}
                            name={'is_active'}
                            label={'Hoạt động?'}
                            checked={newBrand.is_active}
                            toggleCheckboxChange={value =>
                                activateBrand(newBrand.id, value)
                            }
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
                    <Button
                        variant='danger'
                        text={'Xóa'}
                        onClick={() => deleteBrand(newBrand.id)}
                    />
                </div>
            </form>
        </div>
    );
};

export default EditBrand;
