/**
 *
 * UserList
 *
 */

import React from 'react';

import { formatDate } from '../../../utils/date';

const UserList = props => {
  const { users } = props;

  return (
    <div className='u-list'>
      {users.map((user, index) => (
        <div key={index} className='mt-3 px-4 py-3 user-box'>
          <label className='text-black'>Tên</label>
          <p className='fw-medium'>
            {user?.first_name ? `${user?.first_name} ${user?.last_name}` : 'N/A'}
          </p>
          <label className='text-black'>Địa chỉ email</label>
          <p>{user?.email ?? '-'}</p>
          <label className='text-black'>Provider</label>
          <p>{user?.provider}</p>
          <label className='text-black'>Ngày tham gia</label>
          <p>{formatDate(user?.created)}</p>
          <label className='text-black'>Vai trò</label>
          <p className='mb-0'>
            {/* <UserRole user={user} className='d-inline-block mt-2' /> */}
          </p>
        </div>
      ))}
    </div>
  );
};

export default UserList;
