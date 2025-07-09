/*
 *
 * List
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';
import { ROLES } from '../../constants';

import SubPage from '../../components/Manager/SubPage';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import NotFound from '../../components/Common/NotFound';

class List extends React.PureComponent {
  componentDidMount() {
    this.props.fetchBrands();
  }

  render() {
    const { history, brands, isLoading, user } = this.props;

    return (
      <>
        <SubPage title='Thương hiệu' isMenuOpen={null} actionTitle='Thêm' handleAction={this.handleAddBrand}>
          {isLoading ? (
            <LoadingIndicator inline />
          ) : brands.length > 0 ? (
            <div className='brand-list'>
              {brands.map((brand, idx) => (
                <div
                  key={brand.id || idx}
                  className='brand-box clickable'
                  onClick={() => history.push(`/dashboard/brand/edit/${brand.id}`)}
                  style={{ cursor: 'pointer', marginBottom: 16 }}
                >
                  <h4 style={{ marginBottom: 4 }}>{brand.name}</h4>
                  <p className='brand-desc' style={{ color: '#666', margin: 0 }}>{brand.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <NotFound message='No brands found.' />
          )}
        </SubPage>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    brands: state.brand.brands,
    isLoading: state.brand.isLoading,
    user: state.account.user
  };
};

export default connect(mapStateToProps, actions)(List);
