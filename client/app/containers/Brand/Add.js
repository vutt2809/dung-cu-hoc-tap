/*
 *
 * Add
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import AddBrand from '../../components/Manager/AddBrand';
import SubPage from '../../components/Manager/SubPage';
import Button from '../../components/Common/Button';

class Add extends React.PureComponent {
  render() {
    const {
      history,
      brandFormData,
      formErrors,
      brandChange,
      addBrand
    } = this.props;

    return (
      <SubPage title='Thêm thương hiệu' isMenuOpen={null}>
        <AddBrand
          brandFormData={brandFormData}
          formErrors={formErrors}
          brandChange={brandChange}
          addBrand={addBrand}
        />
        <Button type='submit' text='Lưu' />
      </SubPage>
    );
  }
}

const mapStateToProps = state => {
  return {
    brandFormData: state.brand.brandFormData,
    formErrors: state.brand.formErrors
  };
};

export default connect(mapStateToProps, actions)(Add);
