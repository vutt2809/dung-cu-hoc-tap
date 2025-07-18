/**
 *
 * ProductList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';

const ProductList = props => {
  const { products } = props;

  return (
    <div className='p-list'>
      {products.map((product, index) => (
        <Link
          to={`/dashboard/product/edit/${product.id}`}
          key={index}
          className='d-flex flex-row align-items-center mx-0 mb-3 product-box'
        >
          <img
            className='item-image'
            src={`${
              product && (product.image_url || product.imageUrl)
                ? (product.image_url || product.imageUrl)
                : '/images/placeholder-image.png'
            }`}
            alt={product.name}
            onError={(e) => {
              e.target.src = '/images/placeholder-image.png';
            }}
          />
          <div className='d-flex flex-column justify-content-center px-3 text-truncate'>
            <h4 className='text-truncate'>{product.name}</h4>
            <p className='mb-2 text-truncate'>{product.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
