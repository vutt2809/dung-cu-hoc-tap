/**
 *
 * AccountMenu
 *
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Collapse, Navbar } from 'reactstrap';
import Button from '../../Common/Button';
import { UserIcon } from '../../Common/Icon';

const AccountMenu = props => {
  const { user, isMenuOpen, links, toggleMenu } = props;

  const getAllowedProvider = link => {
    if (!link.provider) return true;
    const userProvider = user.provider ?? '';
    if (!userProvider) return true;
    return link.provider.includes(userProvider);
  };

  const isAdmin = user.role === 'ROLE ADMIN';
  const fullName = user.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : 'Tài khoản của tôi';

  return (
    <div className='panel-sidebar modern-sidebar'>
      {/* User Header Profile Card */}
      <div className='user-sidebar-card'>
        <div className='user-avatar-wrap'>
          <UserIcon width={28} height={28} />
        </div>
        <div className='user-sidebar-info'>
          <h4 className='user-name-display'>{fullName}</h4>
          <span className='user-email-display'>{user.email || 'user@email.com'}</span>
          <div className='mt-2'>
            <span className={`badge-role ${isAdmin ? 'admin' : 'member'}`}>
              <i className={`fa ${isAdmin ? 'fa-shield' : 'fa-user'} mr-1`} />
              {isAdmin ? 'Quản trị viên' : 'Thành viên'}
            </span>
          </div>
        </div>
      </div>

      <Button
        text='Menu bảng điều khiển'
        className={`${isMenuOpen ? 'menu-panel' : 'menu-panel collapse'}`}
        ariaExpanded={isMenuOpen ? 'true' : 'false'}
        onClick={toggleMenu}
      />

      <Navbar color='light' light expand='md'>
        <Collapse isOpen={isMenuOpen} navbar>
          <ul className='panel-links'>
            {links.map((link, index) => {
              const PREFIX = link.prefix ? link.prefix : '';
              const isProviderAllowed = getAllowedProvider(link);
              if (!isProviderAllowed) return null;
              return (
                <li key={index}>
                  <NavLink
                    to={PREFIX + link.to}
                    activeClassName='active-link'
                    exact
                  >
                    <span
                      className='link-icon-wrap'
                      style={{ color: link.color || '#4f46e5' }}
                    >
                      <i className={`fa ${link.icon || 'fa-circle'}`} />
                    </span>
                    <span className='link-name'>{link.name}</span>
                    <i className='fa fa-angle-right link-caret' />
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default AccountMenu;
