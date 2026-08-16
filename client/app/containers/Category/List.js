/*
 *
 * List
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';
import { VI } from '../../constants/vi';

import CategoryList from '../../components/Manager/CategoryList';
import SubPage from '../../components/Manager/SubPage';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import NotFound from '../../components/Common/NotFound';
import SearchBar from '../../components/Common/SearchBar';

class List extends React.PureComponent {
  componentDidMount() {
    this.props.fetchCategories();
  }

  handleSearch = e => {
    if (e.value && e.value.trim().length >= 2) {
      this.props.fetchCategories(e.value.trim());
    } else if (!e.value) {
      this.props.fetchCategories();
    }
  };

  handleSearchSubmit = e => {
    this.props.fetchCategories(e.value ? e.value.trim() : '');
  };

  render() {
    const { history, categories, isLoading } = this.props;

    return (
      <>
        <SubPage
          title={VI['Categories']}
          actionTitle={VI['Add']}
          handleAction={() => history.push('/dashboard/category/add')}
        >
          <SearchBar
            name='category'
            placeholder='Tìm kiếm danh mục...'
            btnText='Tìm kiếm'
            onSearch={this.handleSearch}
            onSearchSubmit={this.handleSearchSubmit}
          />
          {isLoading ? (
            <LoadingIndicator inline />
          ) : categories.length > 0 ? (
            <CategoryList categories={categories} />
          ) : (
            <NotFound message={VI['No categories found.']} />
          )}
        </SubPage>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    categories: state.category.categories,
    isLoading: state.category.isLoading,
    user: state.account.user
  };
};

export default connect(mapStateToProps, actions)(List);
