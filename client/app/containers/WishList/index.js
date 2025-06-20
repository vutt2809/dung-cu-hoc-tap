/*
 *
 * WishList
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import SubPage from '../../components/Manager/SubPage';
import WishList from '../../components/Manager/WishList';
import NotFound from '../../components/Common/NotFound';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import { VI } from '../../constants';

class Wishlist extends React.PureComponent {
  componentDidMount() {
    this.props.fetchWishlist();
  }

  render() {
    const { wishlist, isLoading, updateWishlist } = this.props;

    const displayWishlist = wishlist.length > 0;

    return (
      <div className='wishlist-dashboard'>
        <SubPage title={VI['WishList']} isMenuOpen={null}>
          {isLoading && <LoadingIndicator />}
          {displayWishlist && (
            <WishList wishlist={wishlist} updateWishlist={updateWishlist} />
          )}
          {!isLoading && !displayWishlist && (
            <NotFound message={VI['No items found in your wishlist.']} />
          )}
        </SubPage>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    wishlist: state.wishlist.wishlist,
    isLoading: state.wishlist.isLoading
  };
};

export default connect(mapStateToProps, actions)(Wishlist);
