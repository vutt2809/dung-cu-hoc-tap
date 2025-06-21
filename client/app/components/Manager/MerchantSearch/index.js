/**
 *
 * MerchantSearch
 *
 */

import React from 'react';

import SearchBar from '../../Common/SearchBar';
import { VI } from '../../../constants/vi';

const MerchantSearch = props => {
  return (
    <div className='mb-3'>
      <SearchBar
        name='merchant'
        placeholder={VI['Type Email, Phone Number, Brand Or Status']}
        btnText={VI.Search}
        onSearch={props.onSearch}
        onBlur={props.onBlur}
        onSearchSubmit={props.onSearchSubmit}
      />
    </div>
  );
};

export default MerchantSearch;
