/**
 *
 * ProductList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';


import './ProductList.css';
import { formatCurrencyVN } from '../../../utils/format';

const ProductList = props => {
  const { products } = props;

  return (
    <div className='product-list grid-list'>
      {products.map((product, index) => (
        <div key={index} className='product-card'>
          <Link
            to={`/product/${product.slug}`}
            className='product-link'
          >
            <div className='product-image-box'>
              <img
                className='product-image'
                src={product.image_url || product.imageUrl || '/images/placeholder-image.png'}
                alt={product.name}
                onError={e => { e.target.src = '/images/placeholder-image.png'; }}
              />
            </div>
            <div className='product-info'>
              <h2 className='product-name'>{product.name}</h2>

              <p className='product-desc'>{product.description}</p>
              <div className='product-footer'>
                <span className='product-price'>{formatCurrencyVN(product.price)}</span>

              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
