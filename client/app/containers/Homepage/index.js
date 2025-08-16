/**
 *
 * Homepage
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import actions from '../../actions';
import ProductsShop from '../ProductsShop';
import CategoryShop from '../CategoryShop';
import ProductFilter from '../../components/Store/ProductFilter';
import Pagination from '../../components/Common/Pagination';
import Page404 from '../../components/Common/Page404';

class Homepage extends React.PureComponent {
  componentDidMount() {
    this.props.fetchStoreCategories();
    // Load products khi vào trang chủ
    this.props.filterProducts();
  }

  render() {
    const { products, advancedFilters, filterProducts, categories } = this.props;
    const { totalPages, currentPage } = advancedFilters;
    const displayPagination = totalPages > 1;

    return (
      <div className='homepage'>
        <Row xs='12'>
          <Col
            xs={{ size: 12, order: 1 }}
            sm={{ size: 12, order: 1 }}
            md={{ size: 12, order: 1 }}
            lg={{ size: 3, order: 1 }}
          >
            <ProductFilter filterProducts={filterProducts} categories={categories} />
          </Col>
          <Col
            xs={{ size: 12, order: 2 }}
            sm={{ size: 12, order: 2 }}
            md={{ size: 12, order: 2 }}
            lg={{ size: 9, order: 2 }}
          >

            <Switch>
              <Route exact path='/' component={ProductsShop} />
              <Route path='/category/:id' component={CategoryShop} />
              <Route path='*' component={Page404} />
            </Switch>

            {displayPagination && (
              <div className='d-flex justify-content-center text-center mt-4'>
                <Pagination
                  totalPages={totalPages}
                  onPagination={filterProducts}
                />
              </div>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    advancedFilters: state.product.advancedFilters,
    products: state.product.storeProducts,
    categories: state.category.storeCategories
  };
};

export default connect(mapStateToProps, actions)(Homepage);
