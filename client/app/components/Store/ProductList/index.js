/**
 *
 * ProductList
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import AddToWishList from '../AddToWishList';
import './ProductList.css';
import { formatCurrencyVN } from '../../../utils/format';

const ProductList = props => {
  const { products, updateWishlist, authenticated } = props;

  return (
    <div className='product-list grid-list'>
      {products.map((product, index) => {
        return (
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
                  src={product.image_url || product.imageUrl || '/images/placeholder-image.png'}
                  alt={product.name}
                  onError={e => { e.target.src = '/images/placeholder-image.png'; }}
                />
              </div>
              <div className='product-info'>
                {product.brand && Object.keys(product.brand).length > 0 && (
                  <span className='product-brand-tag'>{product.brand.name}</span>
                )}
                <h2 className='product-name'>{product.name}</h2>
                <p className='product-desc'>{product.description}</p>
                <div className='product-footer'>
                  <span className='product-price'>{formatCurrencyVN(product.price)}</span>
                  {product.totalReviews > 0 ? (
                    <span className='product-rating'>
                      <span>{parseFloat(product?.averageRating).toFixed(1)}</span>
                      <i className='fa fa-star' />
                    </span>
                  ) : (
                    <span className='product-rating' style={{ background: '#f1f5f9', color: '#94a3b8' }}>
                      <i className='fa fa-star-o' /> 5.0
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;
