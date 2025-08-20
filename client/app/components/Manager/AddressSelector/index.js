/**
 *
 * AddressSelector
 *
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../../constants';

const AddressSelector = ({ onAddressSelect, selectedAddressId, onAddressChange }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/address`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAddresses(response.data.addresses || []);
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (address) => {
    if (onAddressSelect) {
      onAddressSelect(address);
    }
  };

  if (loading) {
    return (
      <div className="loading-addresses">
        <div>Đang tải địa chỉ...</div>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="no-address-message">
        <h4 style={{marginBottom: 8, fontWeight: 600, color: '#1976d2'}}>Chưa có địa chỉ nào</h4>
        <p style={{margin: 0, fontSize: 14, color: '#424242'}}>
          Bạn có thể nhập địa chỉ mới bên dưới.
        </p>
      </div>
    );
  }

  return (
    <div className="address-selection">
      <h4 style={{marginBottom: 16, fontWeight: 600, color: '#495057'}}>Chọn địa chỉ đã lưu</h4>
      <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
        {addresses.map((address) => (
          <div 
            key={address.id}
            className={`address-item ${selectedAddressId === address.id ? 'selected' : ''}`}
            onClick={() => handleAddressSelect(address)}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <div className="address-details">
                  {address.is_default && <span className="address-default"></span>}
                  {address.user && (() => {
                    const firstName = address.user.first_name || '';
                    const lastName = address.user.last_name || '';
                    let displayName = `${firstName} ${lastName}`.trim();
                    
                    // Nếu không có first_name và last_name, sử dụng email
                    if (!displayName && address.user.email) {
                      displayName = address.user.email.split('@')[0];
                    }
                    
                    return displayName ? (
                      <span style={{fontWeight: 600, color: '#495057', marginRight: 8}}>
                        {displayName}
                      </span>
                    ) : null;
                  })()}
                  {`${address.address}, ${address.city}`}
                </div>
                <div className="address-subdetails">
                  {`${address.state}, ${address.country} ${address.zip_code}`}
                </div>
                {address.phone_number && (
                  <div className="address-phone">
                    {address.phone_number}
                  </div>
                )}
              </div>
              {selectedAddressId === address.id && (
                <div style={{color: '#007bff', fontWeight: 600}}>✓</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{marginTop: 12, fontSize: 14, color: '#6c757d'}}>
        Hoặc <button 
          type="button" 
          onClick={() => onAddressChange && onAddressChange(null)}
          style={{background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline'}}
        >
          nhập địa chỉ mới
        </button>
      </div>
    </div>
  );
};

export default AddressSelector;
