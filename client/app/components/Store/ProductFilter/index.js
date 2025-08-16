/**
 *
 * ProductFilter
 *
 */

import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import SelectOption from '../../Common/SelectOption';

const ProductFilter = props => {
  const { filterProducts, categories } = props;

  // Chuyển đổi categories thành format cho SelectOption
  const categoryOptions = [
    { value: 'all', label: 'Tất cả danh mục' },
    ...categories.map(category => ({
      value: category.id,
      label: category.name
    }))
  ];

  return (
    <div className='product-filter'>
      <Card>
        <CardHeader tag='h3'>Danh mục sản phẩm</CardHeader>
        <CardBody>
          <div className='mx-2 mb-3'>
            <SelectOption
              name={'category'}
              label={'Chọn danh mục'}
              placeholder={'Tất cả danh mục'}
              options={categoryOptions}
              handleSelectChange={(value) => {
                filterProducts('category', value.value);
              }}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProductFilter;
