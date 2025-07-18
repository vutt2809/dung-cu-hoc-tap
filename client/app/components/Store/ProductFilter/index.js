/**
 *
 * ProductFilter
 *
 */

import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';

import RangeSlider from '../../Common/RangeSlider';

const priceMarks = {
  1000: { label: <p className='fw-normal text-black'>1.000₫</p> },
  1000000: { label: <p className='fw-normal text-black'>1.000.000₫</p> }
};

const rateMarks = {
  0: {
    label: (
      <span>
        <span className='mr-1'>5</span>
        <i
          className='fa fa-star fa-1x'
          style={{ display: 'contents' }}
          aria-hidden='true'
        ></i>
      </span>
    )
  },
  20: {
    label: (
      <span>
        <span className='mr-1'>4</span>
        <i className='fa fa-star fa-1x' aria-hidden='true'></i>
      </span>
    )
  },
  40: {
    label: (
      <span>
        <span className='mr-1'>3</span>
        <i className='fa fa-star fa-1x' aria-hidden='true'></i>
      </span>
    )
  },
  60: {
    label: (
      <span>
        <span className='mr-1'>2</span>
        <i className='fa fa-star fa-1x' aria-hidden='true'></i>
      </span>
    )
  },
  80: {
    label: (
      <span>
        <span className='mr-1'>1</span>
        <i className='fa fa-star fa-1x' aria-hidden='true'></i>
      </span>
    )
  },
  100: { label: <span>Tất cả</span> }
};

const rating = v => {
  switch (v) {
    case 100:
      return 0;
    case 80:
      return 1;
    case 60:
      return 2;
    case 40:
      return 3;
    case 20:
      return 4;
    default:
      0;
      return 5;
  }
};

const ProductFilter = props => {
  const { filterProducts } = props;

  return (
    <div className='product-filter'>
      <Card className='mb-4'>
        <CardHeader tag='h3'>Giá</CardHeader>
        <CardBody>
          <div className='mx-2 mb-3'>
            <RangeSlider
              marks={priceMarks}
              min={1000}
              defaultValue={[1000, 500000]}
              max={1000000}
              onChange={v => {
                filterProducts('price', v);
              }}
            />
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader tag='h3'>Đánh giá</CardHeader>
        <CardBody>
          <div className='mx-2 mb-4'>
            <RangeSlider
              type='slider'
              marks={rateMarks}
              step={20}
              defaultValue={[100]}
              onChange={v => {
                filterProducts('rating', rating(v));
              }}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProductFilter;
