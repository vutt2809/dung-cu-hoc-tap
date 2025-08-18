/**
 *
 * ProductPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

import actions from '../../actions';

import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import NotFound from '../../components/Common/NotFound';
import { BagIcon } from '../../components/Common/Icon';

class ProductPage extends React.PureComponent {
  componentDidMount() {
    const slug = this.props.match.params.slug;
    this.props.fetchStoreProduct(slug);
    document.body.classList.add('product-page');
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.slug !== prevProps.match.params.slug) {
      const slug = this.props.match.params.slug;
      this.props.fetchStoreProduct(slug);
    }
  }

  componentWillUnmount() {
    document.body.classList.remove('product-page');
  }

  render() {
    const {
      isLoading,
      product,
      productShopData,
      shopFormErrors,
      itemInCart,
      productShopChange,
      handleAddToCart,
      handleRemoveFromCart
    } = this.props;

    return (
      <div className='product-shop'>
        {isLoading ? (
          <LoadingIndicator />
        ) : Object.keys(product).length > 0 ? (
          <>
            <Row className='flex-row'>
              <Col xs='12' md='5' lg='5' className='mb-3 px-3 px-md-2'>
                <div className='position-relative'>
                  <img
                    className='item-image'
                    src={product.image_url || product.imageUrl || '/images/placeholder-image.png'}
                    alt={product.name}
                    onError={e => { e.target.src = '/images/placeholder-image.png'; }}
                  />
                  {product.inventory <= 0 && !shopFormErrors['quantity'] ? (
                    <p className='stock out-of-stock'>Hết hàng</p>
                  ) : (
                    <p className='stock in-stock'>Còn hàng</p>
                  )}
                </div>
              </Col>
              <Col xs='12' md='7' lg='7' className='mb-3 px-3 px-md-2'>
                <div className='product-container'>
                  <div className='item-box'>
                    <div className='item-details'>
                      <h1 className='item-name'>
                        {product.name}
                      </h1>
                      <p className='sku text-gray mb-2'>{product.sku}</p>
                      <hr />

                      <p className='item-desc mb-3'>{product.description}</p>
                      <p className='price mb-3'>{product.price}₫</p>
                    </div>
                    <div className='item-customize mb-3'>
                      <Input
                        type={'number'}
                        error={shopFormErrors['quantity']}
                        label={'Số lượng thêm'}
                        name={'quantity'}
                        decimals={false}
                        min={1}
                        max={product.inventory}
                        placeholder={'Số lượng sản phẩm'}
                        disabled={
                          product.inventory <= 0 && !shopFormErrors['quantity']
                        }
                        value={productShopData.quantity}
                        onInputChange={(name, value) => {
                          productShopChange(name, value);
                        }}
                      />
                    </div>
                    <div className='item-actions'>
                      {itemInCart ? (
                        <Button
                          variant='danger'
                          disabled={
                            product.inventory <= 0 &&
                            !shopFormErrors['quantity']
                          }
                          text='Xóa khỏi giỏ hàng'
                          className='bag-btn'
                          icon={<BagIcon />}
                          onClick={() => handleRemoveFromCart(product)}
                        />
                      ) : (
                        <Button
                          variant='primary'
                          disabled={
                            product.quantity <= 0 && !shopFormErrors['quantity']
                          }
                          text='Thêm vào giỏ hàng'
                          className='bag-btn'
                          icon={<BagIcon />}
                          onClick={() => handleAddToCart(product)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

          </>
        ) : (
          <NotFound message='Không tìm thấy sản phẩm.' />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const itemInCart = state.cart.cartItems.find(
    item => item._id === state.product.storeProduct.id
  )
    ? true
    : false;

  return {
    product: state.product.storeProduct,
    productShopData: state.product.productShopData,
    shopFormErrors: state.product.shopFormErrors,
    isLoading: state.product.isLoading,
    itemInCart
  };
};

export default connect(mapStateToProps, actions)(ProductPage);
