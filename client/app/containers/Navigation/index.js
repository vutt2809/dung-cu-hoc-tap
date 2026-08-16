/**
 *
 * Navigation
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Link, NavLink as ActiveLink, withRouter } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

import actions from '../../actions';
import { VI } from '../../constants/vi';

import Button from '../../components/Common/Button';
import CartIcon from '../../components/Common/CartIcon';
import {
  BarsIcon,
  UserIcon,
  StoreLogoIcon,
  SearchIcon
} from '../../components/Common/Icon';
import MiniBrand from '../../components/Store//MiniBrand';
import Menu from '../NavigationMenu';
import Cart from '../Cart';

class Navigation extends React.PureComponent {
  componentDidMount() {
    this.props.fetchStoreBrands();
    this.props.fetchStoreCategories();
  }

  toggleBrand() {
    this.props.fetchStoreBrands();
    this.props.toggleBrand();
  }

  toggleMenu() {
    this.props.fetchStoreCategories();
    this.props.toggleMenu();
  }

  getSuggestionValue(suggestion) {
    return suggestion.name;
  }

  renderSuggestion(suggestion, { query, isHighlighted }) {
    const BoldName = (suggestion, query) => {
      const matches = AutosuggestHighlightMatch(suggestion.name, query);
      const parts = AutosuggestHighlightParse(suggestion.name, matches);

      return (
        <div>
          {parts.map((part, index) => {
            const className = part.highlight
              ? 'react-autosuggest__suggestion-match'
              : null;
            return (
              <span className={className} key={index}>
                {part.text}
              </span>
            );
          })}
        </div>
      );
    };

    return (
      <Link to={`/product/${suggestion.slug}`}>
        <div className='d-flex align-items-center p-2'>
          <img
            className='item-image rounded mr-2'
            style={{ width: 44, height: 44, objectFit: 'contain' }}
            src={`${suggestion.imageUrl
                ? suggestion.imageUrl
                : '/images/placeholder-image.png'
              }`}
          />
          <div>
            <div className='font-weight-bold' style={{ fontSize: 13, color: '#1e293b' }}>
              {BoldName(suggestion, query)}
            </div>
            <div className='text-danger font-weight-bold' style={{ fontSize: 12 }}>
              {Number(suggestion.price).toLocaleString()}₫
            </div>
          </div>
        </div>
      </Link>
    );
  }

  render() {
    const {
      history,
      authenticated,
      user,
      cartItems,
      brands,
      categories,
      signOut,
      isMenuOpen,
      isCartOpen,
      isBrandOpen,
      toggleCart,
      toggleMenu,
      searchValue,
      suggestions,
      onSearch,
      onSuggestionsFetchRequested,
      onSuggestionsClearRequested
    } = this.props;

    const inputProps = {
      placeholder: 'Tìm kiếm dụng cụ học tập, bút, sách, balo...',
      value: searchValue,
      onChange: (_, { newValue }) => {
        onSearch(newValue);
      }
    };

    return (
      <header className='header fixed-mobile-header'>
        <div className='header-info'>
          <Container>
            <Row className='align-items-center justify-content-between'>
              <Col md='3' className='text-center d-none d-md-block'>
                <span className='info-item'>
                  <span className='info-icon green'><i className='fa fa-truck' /></span>
                  <span>Miễn phí vận chuyển từ 200k</span>
                </span>
              </Col>
              <Col md='3' className='text-center d-none d-md-block'>
                <span className='info-item'>
                  <span className='info-icon blue'><i className='fa fa-check-circle' /></span>
                  <span>100% Hàng chính hãng</span>
                </span>
              </Col>
              <Col md='3' className='text-center d-none d-md-block'>
                <span className='info-item'>
                  <span className='info-icon orange'><i className='fa fa-refresh' /></span>
                  <span>Đổi trả dễ dàng trong 7 ngày</span>
                </span>
              </Col>
              <Col md='3' className='text-center d-none d-md-block'>
                <span className='info-item'>
                  <span className='info-icon'><i className='fa fa-phone' /></span>
                  <span>Hotline: <strong>0123 456 789</strong></span>
                </span>
              </Col>
              <Col xs='12' className='text-center d-block d-md-none'>
                <span className='info-item'>
                  <span className='info-icon'><i className='fa fa-phone' /></span>
                  <span>Hotline tư vấn: <strong>0123 456 789</strong></span>
                </span>
              </Col>
            </Row>
          </Container>
        </div>
        <Container>
          <Row className='align-items-center top-header'>
            <Col
              xs={{ size: 12, order: 1 }}
              sm={{ size: 12, order: 1 }}
              md={{ size: 3, order: 1 }}
              lg={{ size: 3, order: 1 }}
              className='pr-0'
            >
              <div className='brand'>
                {categories && categories.length > 0 && (
                  <Button
                    borderless
                    variant='empty'
                    className='d-none d-md-block mr-2'
                    ariaLabel='open the menu'
                    icon={<BarsIcon />}
                    onClick={() => this.toggleMenu()}
                  />
                )}
                <Link to='/' className='brand-link-wrapper'>
                  <div className='brand-icon-box'>
                    <StoreLogoIcon width={36} height={36} />
                  </div>
                  <div className='brand-text-box'>
                    <span className='brand-title'>DỤNG CỤ HỌC TẬP</span>
                    <span className='brand-tagline'>STORE & STATIONERY</span>
                  </div>
                </Link>
              </div>
            </Col>
            <Col
              xs={{ size: 12, order: 4 }}
              sm={{ size: 12, order: 4 }}
              md={{ size: 12, order: 4 }}
              lg={{ size: 5, order: 2 }}
              className='pt-2 pt-lg-0'
            >
              <div className='search-box-wrapper'>
                <span className='search-icon-prefix'>
                  <SearchIcon width={18} height={18} />
                </span>
                <Autosuggest
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={onSuggestionsClearRequested}
                  getSuggestionValue={this.getSuggestionValue}
                  renderSuggestion={this.renderSuggestion}
                  inputProps={inputProps}
                  onSuggestionSelected={(_, item) => {
                    history.push(`/product/${item.suggestion.slug}`);
                  }}
                />
              </div>
            </Col>
            <Col
              xs={{ size: 12, order: 2 }}
              sm={{ size: 12, order: 2 }}
              md={{ size: 4, order: 1 }}
              lg={{ size: 5, order: 3 }}
              className='desktop-hidden'
            >
              <div className='header-links'>
                <Button
                  borderless
                  variant='empty'
                  ariaLabel='open the menu'
                  icon={<BarsIcon />}
                  onClick={() => this.toggleMenu()}
                />
                <CartIcon cartItems={cartItems} onClick={toggleCart} />
              </div>
            </Col>
            <Col
              xs={{ size: 12, order: 2 }}
              sm={{ size: 12, order: 2 }}
              md={{ size: 9, order: 1 }}
              lg={{ size: 4, order: 3 }}
            >
              <Navbar color='light' light expand='md' className='mt-1 mt-md-0'>
                <CartIcon
                  className='d-none d-md-block'
                  cartItems={cartItems}
                  onClick={toggleCart}
                />
                <Nav navbar>
                  {brands && brands.length > 0 && (
                    <Dropdown
                      nav
                      inNavbar
                      toggle={() => this.toggleBrand()}
                      isOpen={isBrandOpen}
                    >
                      <DropdownToggle nav>
                        <i className='fa fa-bookmark text-primary mr-1'></i>
                        {VI['Brands']}
                        <span className='fa fa-chevron-down dropdown-caret ml-1'></span>
                      </DropdownToggle>
                      <DropdownMenu right className='nav-brand-dropdown'>
                        <div className='mini-brand'>
                          <MiniBrand
                            brands={brands}
                            toggleBrand={() => this.toggleBrand()}
                          />
                        </div>
                      </DropdownMenu>
                    </Dropdown>
                  )}
                  {authenticated ? (
                    <UncontrolledDropdown nav inNavbar>
                      <DropdownToggle nav className='user-dropdown-btn'>
                        <UserIcon width={18} height={18} />
                        <span className='d-none d-md-inline ml-1 font-weight-medium'>
                          {user.first_name ? user.first_name : 'Tài khoản'}
                        </span>
                        <span className='fa fa-chevron-down dropdown-caret ml-1'></span>
                      </DropdownToggle>
                      <DropdownMenu right className='user-dropdown-menu shadow'>
                        <DropdownItem onClick={() => history.push('/dashboard')}>
                          <i className='fa fa-th-large text-primary mr-2'></i>
                          {VI['Dashboard']}
                        </DropdownItem>
                        <DropdownItem onClick={() => history.push('/dashboard/orders')}>
                          <i className='fa fa-shopping-bag text-success mr-2'></i>
                          Đơn hàng
                        </DropdownItem>
                        <DropdownItem onClick={() => history.push('/dashboard/wishlist')}>
                          <i className='fa fa-heart text-danger mr-2'></i>
                          Yêu thích
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={signOut}>
                          <i className='fa fa-sign-out text-secondary mr-2'></i>
                          {VI['Sign Out']}
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  ) : (
                    <UncontrolledDropdown nav inNavbar>
                      <DropdownToggle nav className='user-dropdown-btn'>
                        <UserIcon width={18} height={18} />
                        <span className='d-none d-md-inline ml-1'>Tài khoản</span>
                        <span className='fa fa-chevron-down dropdown-caret ml-1'></span>
                      </DropdownToggle>
                      <DropdownMenu right className='user-dropdown-menu shadow'>
                        <DropdownItem onClick={() => history.push('/login')}>
                          <i className='fa fa-sign-in text-primary mr-2'></i>
                          {VI['Login']}
                        </DropdownItem>
                        <DropdownItem onClick={() => history.push('/register')}>
                          <i className='fa fa-user-plus text-success mr-2'></i>
                          {VI['Sign Up']}
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  )}
                </Nav>
              </Navbar>
            </Col>
          </Row>
        </Container>

        {/* hidden cart drawer */}
        <div
          className={isCartOpen ? 'mini-cart-open' : 'hidden-mini-cart'}
          aria-hidden={`${isCartOpen ? false : true}`}
        >
          <div className='mini-cart'>
            <Cart />
          </div>
          <div
            className={
              isCartOpen ? 'drawer-backdrop dark-overflow' : 'drawer-backdrop'
            }
            onClick={toggleCart}
          />
        </div>

        {/* hidden menu drawer */}
        <div
          className={isMenuOpen ? 'mini-menu-open' : 'hidden-mini-menu'}
          aria-hidden={`${isMenuOpen ? false : true}`}
        >
          <div className='mini-menu'>
            <Menu />
          </div>
          <div
            className={
              isMenuOpen ? 'drawer-backdrop dark-overflow' : 'drawer-backdrop'
            }
            onClick={toggleMenu}
          />
        </div>
      </header>
    );
  }
}

const mapStateToProps = state => {
  return {
    isMenuOpen: state.navigation.isMenuOpen,
    isCartOpen: state.navigation.isCartOpen,
    isBrandOpen: state.navigation.isBrandOpen,
    cartItems: state.cart.cartItems,
    brands: state.brand.storeBrands,
    categories: state.category.storeCategories,
    authenticated: state.authentication.authenticated,
    user: state.account.user,
    searchValue: state.navigation.searchValue,
    suggestions: state.navigation.searchSuggestions
  };
};

export default connect(mapStateToProps, actions)(withRouter(Navigation));
