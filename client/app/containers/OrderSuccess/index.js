/*
 *
 * OrderSuccess
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import actions from '../../actions';

import NotFound from '../../components/Common/NotFound';
import LoadingIndicator from '../../components/Common/LoadingIndicator';

class OrderSuccess extends React.PureComponent {
  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.fetchOrder(id);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      const id = this.props.match.params.id;
      this.props.fetchOrder(id);
    }
  }

  render() {
    const { order, isLoading } = this.props;
    const orderId = order.id || order._id || '';

    return (
      <div className='order-success'>
        {isLoading ? (
          <LoadingIndicator />
        ) : orderId ? (
          <div className='order-message'>
            <h2>Cảm ơn bạn đã đặt hàng.</h2>
            <p>
              Đơn hàng{' '}
              <Link
                to={{
                  pathname: `/order/${orderId}?success`,
                  state: { prevPath: location.pathname }
                }}
                className='order-label'
              >
                #{orderId}
              </Link>{' '}
              đã hoàn tất.
            </p>
            <p>Email xác nhận sẽ được gửi đến bạn ngay lập tức.</p>
            <div className='order-success-actions'>
              <Link to='/dashboard/orders' className='btn-link'>
                Quản lý đơn hàng
              </Link>
              <Link to='/shop' className='btn-link shopping-btn'>
                Tiếp tục mua hàng
              </Link>
            </div>
          </div>
        ) : (
          <NotFound message='No order found.' />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    order: state.order.order,
    isLoading: state.order.isLoading
  };
};

export default connect(mapStateToProps, actions)(OrderSuccess);
