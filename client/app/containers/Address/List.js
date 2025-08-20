/*
 *
 * List
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import AddressList from '../../components/Manager/AddressList';
import SubPage from '../../components/Manager/SubPage';
import NotFound from '../../components/Common/NotFound';

class List extends React.PureComponent {
  componentDidMount() {
    this.props.fetchAddresses();
  }

  render() {
    const { history, addresses } = this.props;

    return (
      <>
        <SubPage
          title="Danh sách địa chỉ"
          actionTitle="Thêm"
          handleAction={() => history.push('/dashboard/address/add')}
        >
          {addresses.length > 0 ? (
            <AddressList addresses={addresses} />
          ) : (
            <NotFound message="Không tìm thấy địa chỉ." />
          )}
        </SubPage>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    addresses: state.address.addresses
  };
};

export default connect(mapStateToProps, actions)(List);
