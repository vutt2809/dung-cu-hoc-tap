/**
 *
 * BrandsShop
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import actions from '../../actions';

import ProductList from '../../components/Store/ProductList';
import NotFound from '../../components/Common/NotFound';
import LoadingIndicator from '../../components/Common/LoadingIndicator';

class BrandsShop extends React.PureComponent {
  componentDidMount() {
    const slug = this.props.match.params.slug;
    this.props.filterProducts('brand', slug);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.slug !== prevProps.match.params.slug) {
      const slug = this.props.match.params.slug;
      this.props.filterProducts('brand', slug);
    }
  }

  render() {
    const { products, isLoading, authenticated, updateWishlist } = this.props;

    return (
      <div className='brands-shop'>
        {isLoading ? (
          <LoadingIndicator />
        ) : products.length > 0 ? (
          <ProductList
            products={products}
            authenticated={authenticated}
            updateWishlist={updateWishlist}
          />
        ) : (
          <NotFound message='Không tìm thấy sản phẩm.' />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.product.storeProducts,
    isLoading: state.product.isLoading,
    authenticated: state.authentication.authenticated
  };
};

export default connect(mapStateToProps, actions)(BrandsShop);
