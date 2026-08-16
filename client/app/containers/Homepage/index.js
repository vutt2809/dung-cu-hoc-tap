/**
 *
 * Homepage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Container } from 'reactstrap';
import { Link } from 'react-router-dom';

import actions from '../../actions';
import banners from './banners.json';
import CarouselSlider from '../../components/Common/CarouselSlider';
import { responsiveOneItemCarousel } from '../../components/Common/CarouselSlider/utils';

class Homepage extends React.PureComponent {
  componentDidMount() {
    if (this.props.fetchStoreCategories) {
      this.props.fetchStoreCategories();
    }
    if (this.props.fetchStoreBrands) {
      this.props.fetchStoreBrands();
    }
  }

  render() {
    const { categories, brands } = this.props;

    const categoryIcons = [
      'fa-book',
      'fa-pencil',
      'fa-folder-open',
      'fa-calculator',
      'fa-paint-brush',
      'fa-scissors',
      'fa-backpack',
      'fa-bookmark'
    ];

    return (
      <div className='homepage'>
        {/* 1. Hero Section */}
        <section className='hero-section'>
          <Row className='flex-row'>
            <Col xs='12' lg='6' className='order-lg-2 mb-3 px-3 px-md-2'>
              <div className='home-carousel'>
                <CarouselSlider
                  swipeable={true}
                  showDots={true}
                  infinite={true}
                  autoPlay={true}
                  autoPlaySpeed={4000}
                  slides={banners}
                  responsive={responsiveOneItemCarousel}
                >
                  {banners.map((item, index) => (
                    <img key={index} src={item.imageUrl} alt={`Banner ${index + 1}`} />
                  ))}
                </CarouselSlider>
              </div>
            </Col>
            <Col xs='12' lg='3' className='order-lg-1 mb-3 px-3 px-md-2'>
              <div className='d-flex flex-column h-100 justify-content-between'>
                <div className='hero-side-card mb-3'>
                  <img src='/images/banners/banner-2.jpg' alt='Dụng cụ học tập' />
                </div>
                <div className='hero-side-card'>
                  <img src='/images/banners/banner-5.jpg' alt='Dụng cụ vẽ & thủ công' />
                </div>
              </div>
            </Col>
            <Col xs='12' lg='3' className='order-lg-3 mb-3 px-3 px-md-2'>
              <div className='d-flex flex-column h-100 justify-content-between'>
                <div className='hero-side-card mb-3'>
                  <img src='/images/banners/banner-2.jpg' alt='Văn phòng phẩm' />
                </div>
                <div className='hero-side-card'>
                  <img src='/images/banners/banner-6.jpg' alt='Bút viết cao cấp' />
                </div>
              </div>
            </Col>
          </Row>
        </section>

        {/* 2. Value Proposition / Benefits Bar */}
        <section className='benefits-bar'>
          <Row>
            <Col xs='12' sm='6' lg='3' className='mb-3 mb-lg-0'>
              <div className='benefit-card'>
                <div className='benefit-icon-wrap indigo'>
                  <i className='fa fa-truck' />
                </div>
                <div className='benefit-info'>
                  <div className='benefit-title'>Giao hàng siêu tốc</div>
                  <p className='benefit-desc'>Miễn phí vận chuyển từ 200.000₫</p>
                </div>
              </div>
            </Col>
            <Col xs='12' sm='6' lg='3' className='mb-3 mb-lg-0'>
              <div className='benefit-card'>
                <div className='benefit-icon-wrap emerald'>
                  <i className='fa fa-shield' />
                </div>
                <div className='benefit-info'>
                  <div className='benefit-title'>100% Chính hãng</div>
                  <p className='benefit-desc'>Cam kết chất lượng cao cấp</p>
                </div>
              </div>
            </Col>
            <Col xs='12' sm='6' lg='3' className='mb-3 mb-lg-0'>
              <div className='benefit-card'>
                <div className='benefit-icon-wrap amber'>
                  <i className='fa fa-refresh' />
                </div>
                <div className='benefit-info'>
                  <div className='benefit-title'>Đổi trả 7 ngày</div>
                  <p className='benefit-desc'>Thủ tục đổi trả nhanh chóng, dễ dàng</p>
                </div>
              </div>
            </Col>
            <Col xs='12' sm='6' lg='3'>
              <div className='benefit-card'>
                <div className='benefit-icon-wrap rose'>
                  <i className='fa fa-headphones' />
                </div>
                <div className='benefit-info'>
                  <div className='benefit-title'>Hỗ trợ 24/7</div>
                  <p className='benefit-desc'>Hotline tư vấn: 0123 456 789</p>
                </div>
              </div>
            </Col>
          </Row>
        </section>

        {/* 3. Featured Categories Showcase */}
        {categories && categories.length > 0 && (
          <section className='categories-showcase'>
            <div className='section-header'>
              <h2 className='section-title'>
                <i className='fa fa-th-large text-primary' /> Danh mục Sản phẩm Nổi bật
              </h2>
              <p className='section-subtitle'>Khám phá đầy đủ các loại đồ dùng học tập, sách vở và dụng cụ sáng tạo</p>
              <div className='title-accent-line' />
            </div>
            <div className='category-grid'>
              {categories.slice(0, 6).map((cat, idx) => (
                <Link
                  key={cat.id || idx}
                  to={`/shop/category/${cat.slug}`}
                  className='category-item-card'
                >
                  <div className='category-icon-box'>
                    <i className={`fa ${categoryIcons[idx % categoryIcons.length]}`} />
                  </div>
                  <span className='category-name'>{cat.name}</span>
                  <span className='category-count'>Khám phá ngay</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 4. Brands Showcase */}
        {brands && brands.length > 0 && (
          <section className='brands-showcase'>
            <div className='section-header'>
              <h2 className='section-title'>
                <i className='fa fa-bookmark text-warning' /> Thương hiệu Uy tín Hàng đầu
              </h2>
              <p className='section-subtitle'>Đối tác chính hãng cung cấp các thương hiệu văn phòng phẩm hàng đầu</p>
              <div className='title-accent-line' />
            </div>
            <div className='brand-grid'>
              {brands.map((brand, idx) => (
                <Link
                  key={brand.id || idx}
                  to={`/shop/brand/${brand.slug}`}
                  className='brand-card-item'
                >
                  <i className='fa fa-check-circle text-primary mr-2' style={{ fontSize: 13 }} />
                  <span>{brand.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.product.storeProducts,
    categories: state.category.storeCategories,
    brands: state.brand.storeBrands,
    authenticated: state.authentication.authenticated
  };
};

export default connect(mapStateToProps, actions)(Homepage);
