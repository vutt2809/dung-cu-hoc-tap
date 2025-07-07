/*
 *
 * Add
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';
import { VI } from '../../constants';

import SubPage from '../../components/Manager/SubPage';

class Add extends React.PureComponent {
  componentDidMount() {
    this.props.fetchBrandsSelect();
  }

  render() {
    const {
      history,
      user,
      productFormData,
      formErrors,
      brands,
      productChange,
      addProduct
    } = this.props;

    return (
      <SubPage
        title={VI['Add Product']}
        actionTitle={VI['Cancel']}
        handleAction={history.goBack}
      >
      </SubPage>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.account.user,
    productFormData: state.product.productFormData,
    formErrors: state.product.formErrors,
    brands: state.brand.brandsSelect
  };
};

export default connect(mapStateToProps, actions)(Add);
