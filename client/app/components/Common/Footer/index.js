/**
 *
 * Footer
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';
import Newsletter from '../../../containers/Newsletter';
import { StoreLogoIcon } from '../Icon';

const Footer = () => {
  const serviceLinks = [
    { id: 0, name: 'Liên hệ & Hỗ trợ', to: '/contact' },
    { id: 1, name: 'Chính sách vận chuyển', to: '/shipping' },
    { id: 2, name: 'Chính sách đổi trả', to: '/contact' },
    { id: 3, name: 'Bán cùng chúng tôi', to: '/sell' }
  ];

  const quickLinks = [
    { id: 0, name: 'Tất cả sản phẩm', to: '/shop' },
    { id: 1, name: 'Thương hiệu đối tác', to: '/brands' },
    { id: 2, name: 'Tài khoản của tôi', to: '/dashboard' },
    { id: 3, name: 'Đơn hàng đã đặt', to: '/dashboard/orders' },
    { id: 4, name: 'Danh sách yêu thích', to: '/dashboard/wishlist' }
  ];

  return (
    <footer className='footer'>
      <Container>
        <div className='footer-content'>
          {/* Column 1: Brand Info */}
          <div className='footer-block'>
            <div className='footer-brand-title'>
              <StoreLogoIcon width={32} height={32} />
              <span>DỤNG CỤ HỌC TẬP</span>
            </div>
            <p className='footer-brand-desc'>
              Hệ thống cung cấp đồ dùng học tập, sách vở, bút viết và thiết bị học đường chính hãng hàng đầu tại Việt Nam.
            </p>
            <ul className='footer-contact-list'>
              <li>
                <div className='contact-icon-box blue'>
                  <i className='fa fa-map-marker' />
                </div>
                <span>Ninh Kiều, TP. Cần Thơ</span>
              </li>
              <li>
                <div className='contact-icon-box green'>
                  <i className='fa fa-phone' />
                </div>
                <span>Hotline: <strong>0123 456 789</strong></span>
              </li>
              <li>
                <div className='contact-icon-box orange'>
                  <i className='fa fa-envelope' />
                </div>
                <span>hotro@dungcuhoctap.vn</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Service */}
          <div className='footer-block'>
            <div className='block-title'>
              <h3>Dịch vụ khách hàng</h3>
            </div>
            <div className='block-content'>
              <ul>
                {serviceLinks.map(link => (
                  <li key={link.id} className='footer-link'>
                    <Link to={link.to}>
                      <i className='fa fa-chevron-right link-arrow' />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className='footer-block'>
            <div className='block-title'>
              <h3>Liên kết nhanh</h3>
            </div>
            <div className='block-content'>
              <ul>
                {quickLinks.map(link => (
                  <li key={link.id} className='footer-link'>
                    <Link to={link.to}>
                      <i className='fa fa-chevron-right link-arrow' />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4: Newsletter & Payment */}
          <div className='footer-block'>
            <div className='block-title'>
              <h3>Đăng ký nhận tin</h3>
            </div>
            <div className='block-content newsletter-section'>
              <p className='newsletter-desc'>
                Đăng ký để nhận thông báo về sản phẩm mới và tin tức hữu ích sớm nhất.
              </p>
              <Newsletter />
              <div className='payment-methods-wrap'>
                <span className='payment-label'>PHƯƠNG THỨC THANH TOÁN</span>
                <div className='payment-icons'>
                  <span className='payment-badge visa'>
                    <i className='fa fa-cc-visa' /> Visa
                  </span>
                  <span className='payment-badge mastercard'>
                    <i className='fa fa-cc-mastercard' /> Master
                  </span>
                  <span className='payment-badge atm'>
                    <i className='fa fa-credit-card' /> ATM
                  </span>
                  <span className='payment-badge cod'>
                    <i className='fa fa-money' /> COD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Footer Bottom Bar */}
      <div className='footer-bottom-wrap'>
        <Container>
          <div className='footer-bottom-inner'>
            <div className='footer-copyright'>
              <span>© {new Date().getFullYear()} Dụng Cụ Học Tập Store. All rights reserved.</span>
            </div>
            <ul className='footer-social-item'>
              <li>
                <a href='https://facebook.com' className='fb' rel='noreferrer noopener' target='_blank' title='Facebook'>
                  <i className='fa fa-facebook' />
                </a>
              </li>
              <li>
                <a href='https://instagram.com' className='insta' rel='noreferrer noopener' target='_blank' title='Instagram'>
                  <i className='fa fa-instagram' />
                </a>
              </li>
              <li>
                <a href='https://youtube.com' className='yt' rel='noreferrer noopener' target='_blank' title='YouTube'>
                  <i className='fa fa-youtube-play' />
                </a>
              </li>
              <li>
                <a href='https://twitter.com' className='tw' rel='noreferrer noopener' target='_blank' title='Twitter'>
                  <i className='fa fa-twitter' />
                </a>
              </li>
            </ul>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
