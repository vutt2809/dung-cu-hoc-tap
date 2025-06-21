/*
 *
 * Edit
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';
import { VI } from '../../constants/vi';

import EditCategory from '../../components/Manager/EditCategory';
import SubPage from '../../components/Manager/SubPage';
import NotFound from '../../components/Common/NotFound';

class Edit extends React.PureComponent {
  componentDidMount() {
    this.props.resetCategory();
    const category_id = this.props.match.params.id;
    this.props.fetchCategory(category_id);
    this.props.fetchProductsSelect();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.props.resetCategory();
      const category_id = this.props.match.params.id;
      this.props.fetchCategory(category_id);
    }
  }

  render() {
    const {
      history,
      products,
      category,
      formErrors,
      categoryEditChange,
      updateCategory,
      deleteCategory,
      activateCategory
    } = this.props;

    return (
      <SubPage
        title={VI['Edit Category'] || 'Edit Category'}
        actionTitle={VI['Cancel'] || 'Cancel'}
        handleAction={history.goBack}
      >
        {category && category.id ? (
          <EditCategory
            products={products}
            category={category}
            formErrors={formErrors}
            categoryChange={categoryEditChange}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
            activateCategory={activateCategory}
          />
        ) : (
          <NotFound message={VI['No categories found.']} />
        )}
      </SubPage>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.product.productsSelect,
    category: state.category.category,
    formErrors: state.category.editFormErrors
  };
};

export default connect(mapStateToProps, actions)(Edit);
