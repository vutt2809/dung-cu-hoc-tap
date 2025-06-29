/**
 *
 * ProductList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';

import AddToWishList from '../AddToWishList';
import './ProductList.css';

const ProductList = props => {
  const { products, updateWishlist, authenticated } = props;

  return (
    <div className='product-list grid-list'>
      {products.map((product, index) => (
        <div key={index} className='product-card'>
          <div className='add-wishlist-box'>
            <AddToWishList
              id={product.id}
              liked={product?.isLiked ?? false}
              enabled={authenticated}
              updateWishlist={updateWishlist}
              authenticated={authenticated}
            />
          </div>
          <Link
            to={`/product/${product.slug}`}
            className='product-link'
          >
            <div className='product-image-box'>
              <img
                className='product-image'
                src={`$${(product.image_url || product.imageUrl) ? (product.image_url || product.imageUrl) : '/images/placeholder-image.png'}`}
                alt={product.name}
                onError={(e) => {
                  e.target.src = '/images/placeholder-image.png';
                }}
              />
            </div>
            <div className='product-info'>
              <h2 className='product-name'>{product.name}</h2>
              {product.brand && Object.keys(product.brand).length > 0 && (
                <p className='product-brand'>Thương hiệu: <span>{product.brand.name}</span></p>
              )}
              <p className='product-desc'>{product.description}</p>
              <div className='product-footer'>
                <span className='product-price'>{product.price.toLocaleString('vi-VN')}₫</span>
                {product.totalReviews > 0 && (
                  <span className='product-rating'>
                    <span className='fs-16 fw-normal mr-1'>
                      {parseFloat(product?.averageRating).toFixed(1)}
                    </span>
                    <span
                      className={`fa fa-star ${product.totalReviews !== 0 ? 'checked' : ''}`}
                      style={{ color: '#ffb302' }}
                    ></span>
                  </span>
                )}
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
