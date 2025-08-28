/*
 *
 * Add
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import AddCategory from '../../components/Manager/AddCategory';
import SubPage from '../../components/Manager/SubPage';

class Add extends React.PureComponent {

  render() {
    const {
      history,
      categoryFormData,
      formErrors,
      categoryChange,
      addCategory
    } = this.props;

    return (
      <SubPage
        title={"Thêm danh mục"}
        actionTitle={"Hủy"}
        handleAction={() => history.goBack()}
      >
        <AddCategory
          categoryFormData={categoryFormData}
          formErrors={formErrors}
          categoryChange={categoryChange}
          addCategory={addCategory}
        />
      </SubPage>
    );
  }
}

const mapStateToProps = state => {
  return {
    categoryFormData: state.category.categoryFormData,
    formErrors: state.category.formErrors
  };
};

export default connect(mapStateToProps, actions)(Add);
