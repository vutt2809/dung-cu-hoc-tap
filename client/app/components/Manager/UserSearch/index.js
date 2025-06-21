/**
 *
 * UserSearch
 *
 */

import React from 'react';

import SearchBar from '../../Common/SearchBar';
import { VI } from '../../../constants';

const UserSearch = props => {
  return (
    <div className='mb-3'>
      <SearchBar
        name='user'
        placeholder={VI['Type user name or email']}
        btnText={VI['Search']}
        onSearch={props.onSearch}
        onBlur={props.onBlur}
        onSearchSubmit={props.onSearchSubmit}
      />
    </div>
  );
};

export default UserSearch;
