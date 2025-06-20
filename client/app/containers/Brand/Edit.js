/*
 *
 * Edit
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import EditBrand from '../../components/Manager/EditBrand';
import SubPage from '../../components/Manager/SubPage';
import NotFound from '../../components/Common/NotFound';
import { VI } from '../../constants';

class Edit extends React.PureComponent {
  componentDidMount() {
    const brand_id = this.props.match.params.id;
    this.props.fetchBrand(brand_id);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      const brand_id = this.props.match.params.id;
      this.props.fetchBrand(brand_id);
    }
  }

  render() {
    const {
      history,
      user,
      brand,
      formErrors,
      brandEditChange,
      updateBrand,
      deleteBrand,
      activateBrand
    } = this.props;

    return (
      <SubPage
        title={VI['Edit Brand'] || 'Edit Brand'}
        actionTitle={VI['Cancel'] || 'Cancel'}
        handleAction={history.goBack}
      >
        {brand && brand.id ? (
          <EditBrand
            user={user}
            brand={brand}
            brandChange={brandEditChange}
            formErrors={formErrors}
            updateBrand={updateBrand}
            deleteBrand={deleteBrand}
            activateBrand={activateBrand}
          />
        ) : (
          <NotFound message={VI['No brand found.'] || 'No brand found.'} />
        )}
      </SubPage>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.account.user,
    brand: state.brand.brand,
    formErrors: state.brand.editFormErrors
  };
};

export default connect(mapStateToProps, actions)(Edit);
