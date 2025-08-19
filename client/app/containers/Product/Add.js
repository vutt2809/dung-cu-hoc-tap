/*
 *
 * Add
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import SubPage from '../../components/Manager/SubPage';
import AddProduct from '../../components/Manager/AddProduct';

class Add extends React.PureComponent {


  render() {
    const {
      history,
      user,
      productFormData,
      formErrors,
      productChange,
      addProduct
    } = this.props;

    return (
      <SubPage
        title={"Thêm sản phẩm"}
        actionTitle={"Hủy"}
        handleAction={history.goBack}
      >
        <AddProduct
          productFormData={productFormData}
          formErrors={formErrors}
          productChange={productChange}
          addProduct={addProduct}
          user={user}
        />
      </SubPage>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.account.user,
    productFormData: state.product.productFormData,
    formErrors: state.product.formErrors,

  };
};

export default connect(mapStateToProps, actions)(Add);
