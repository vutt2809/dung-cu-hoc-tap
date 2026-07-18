/*
 *
 * List
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import ProductList from '../../components/Manager/ProductList';
import SubPage from '../../components/Manager/SubPage';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import NotFound from '../../components/Common/NotFound';
import SearchBar from '../../components/Common/SearchBar';

class List extends React.PureComponent {
  componentDidMount() {
    this.props.fetchProducts();
  }

  handleSearch = e => {
    if (e.value && e.value.trim().length >= 2) {
      this.props.fetchProducts(e.value.trim());
    } else if (!e.value) {
      this.props.fetchProducts();
    }
  };

  handleSearchSubmit = e => {
    this.props.fetchProducts(e.value ? e.value.trim() : '');
  };

  render() {
    const { history, products, isLoading } = this.props;

    return (
      <>
        <SubPage
          title='Products'
          actionTitle='Add'
          handleAction={() => history.push('/dashboard/product/add')}
        >
          <SearchBar
            name='product'
            placeholder='Tìm kiếm sản phẩm theo tên, SKU hoặc mô tả...'
            btnText='Tìm kiếm'
            onSearch={this.handleSearch}
            onSearchSubmit={this.handleSearchSubmit}
          />
          {isLoading ? (
            <LoadingIndicator inline />
          ) : products.length > 0 ? (
            <ProductList products={products} />
          ) : (
            <NotFound message='Không tìm thấy sản phẩm.' />
          )}
        </SubPage>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.product.products,
    isLoading: state.product.isLoading,
    user: state.account.user
  };
};

export default connect(mapStateToProps, actions)(List);
