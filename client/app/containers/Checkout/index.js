import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Button from '../../components/Common/Button';
import axios from 'axios';
import { API_URL } from '../../constants';
import './styles.css';

const Checkout = ({ cartItems, cartTotal, clearCart }) => {
  const history = useHistory();
  const [form, setForm] = useState({
    shipping_name: '',
    shipping_phone: '',
    shipping_address: '',
    shipping_note: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressList, setShowAddressList] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [saveNewAddress, setSaveNewAddress] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Function to get display name from user
  const getDisplayName = (user) => {
    if (!user) return null;
    
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    let displayName = `${firstName} ${lastName}`.trim();
    
    // Nếu không có first_name và last_name, sử dụng email
    if (!displayName && user.email) {
      displayName = user.email.split('@')[0];
    }
    
    return displayName || null;
  };

  // Fetch user addresses on component mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
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
      setLoadingAddresses(false);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddressSelect = (address) => {
    setSelectedAddressId(address.id);
    
    // Lấy thông tin họ tên từ user
    let fullName = '';
    if (address.user) {
      const firstName = address.user.first_name || '';
      const lastName = address.user.last_name || '';
      fullName = `${firstName} ${lastName}`.trim();
      
      // Nếu không có first_name và last_name, sử dụng email
      if (!fullName && address.user.email) {
        fullName = address.user.email.split('@')[0]; // Lấy phần trước @ của email
      }
    }
    
    // Nếu vẫn không có tên, giữ nguyên giá trị hiện tại
    if (!fullName) {
      fullName = form.shipping_name;
    }
    
    setForm({
      ...form,
      shipping_name: fullName || form.shipping_name,
      shipping_phone: address.phone_number || form.shipping_phone,
      shipping_address: `${address.address}, ${address.city}, ${address.state}, ${address.country} ${address.zip_code}`,
    });
    setShowAddressList(false);
    setSaveNewAddress(false); // Không lưu địa chỉ đã chọn
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/order/add`,
        {
          ...form,
          total: cartTotal,
          save_address: saveNewAddress
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      clearCart();
      if (saveNewAddress) {
        setSuccessMessage('Địa chỉ đã được lưu thành công!');
        setTimeout(() => {
          history.push(`/order/success/${response.data.order.id}`);
        }, 1500);
      } else {
        history.push(`/order/success/${response.data.order.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Đặt hàng thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='checkout-page'>
      <h2 style={{textAlign: 'center', marginBottom: 32}}>Thông tin nhận hàng</h2>
      
      {/* Address Selection Section */}
      {loadingAddresses && (
        <div style={{marginBottom: 24, padding: 16, background: '#f8f9fa', borderRadius: 8, border: '1px solid #e9ecef', textAlign: 'center'}}>
          <div style={{color: '#6c757d'}}>Đang tải địa chỉ...</div>
        </div>
      )}
      
      {!loadingAddresses && addresses.length > 0 && (
        <div style={{marginBottom: 24, padding: 16, background: '#f8f9fa', borderRadius: 8, border: '1px solid #e9ecef'}}>
          <h4 style={{marginBottom: 16, fontWeight: 600, color: '#495057'}}>Chọn địa chỉ đã lưu</h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            {addresses.map((address) => (
              <div 
                key={address.id}
                onClick={() => handleAddressSelect(address)}
                style={{
                  padding: 12,
                  border: selectedAddressId === address.id ? '2px solid #007bff' : '1px solid #dee2e6',
                  borderRadius: 6,
                  background: selectedAddressId === address.id ? '#f8f9ff' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <div style={{fontWeight: 500, marginBottom: 4}}>
                      {address.is_default && <span style={{color: '#28a745', marginRight: 8}}></span>}
                      {getDisplayName(address.user) && (
                        <span style={{fontWeight: 600, color: '#495057', marginRight: 8}}>
                          {getDisplayName(address.user)}
                        </span>
                      )}
                      {`${address.address}, ${address.city}`}
                    </div>
                    <div style={{fontSize: 14, color: '#6c757d'}}>
                      {`${address.state}, ${address.country} ${address.zip_code}`}
                    </div>
                    {address.phone_number && (
                      <div style={{fontSize: 14, color: '#6c757d'}}>
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
              onClick={() => setSelectedAddressId(null)}
              style={{background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline'}}
            >
              nhập địa chỉ mới
            </button>
          </div>
        </div>
      )}

      {/* Add New Address Button */}
      {!loadingAddresses && addresses.length === 0 && (
        <div style={{marginBottom: 24, padding: 16, background: '#e3f2fd', borderRadius: 8, border: '1px solid #bbdefb'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <h4 style={{marginBottom: 8, fontWeight: 600, color: '#1976d2'}}>Chưa có địa chỉ nào</h4>
              <p style={{margin: 0, fontSize: 14, color: '#424242'}}>
                Bạn có thể nhập địa chỉ mới bên dưới. Địa chỉ sẽ được tự động lưu cho lần sau.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Selected Address Display */}
      {/* {selectedAddressId && (
        <div style={{marginBottom: 24, padding: 16, background: '#d4edda', borderRadius: 8, border: '1px solid #c3e6cb'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8}}>
            <h4 style={{margin: 0, fontWeight: 600, color: '#155724'}}>Địa chỉ đã chọn</h4>
            <button 
              type="button" 
              onClick={() => setSelectedAddressId(null)}
              style={{background: 'none', border: 'none', color: '#155724', cursor: 'pointer', textDecoration: 'underline', fontSize: 14}}
            >
              Thay đổi
            </button>
          </div>
          <div style={{color: '#155724', fontSize: 14}}>
            <div style={{fontWeight: 600, marginBottom: 4}}>{form.shipping_name}</div>
            <div>{form.shipping_address}</div>
            {form.shipping_phone && <div style={{marginTop: 4}}>📞 {form.shipping_phone}</div>}
          </div>
        </div>
      )} */}

      <form onSubmit={handleSubmit} className='checkout-form' style={{maxWidth: 500, margin: '0 auto 32px auto', display: 'flex', flexDirection: 'column', gap: 16}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
          <label style={{fontWeight: 500}}>Họ tên</label>
          <input 
            name='shipping_name' 
            value={form.shipping_name} 
            onChange={handleChange} 
            required 
            style={{padding: 10, borderRadius: 6, border: '1px solid #ccc'}} 
          />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
          <label style={{fontWeight: 500}}>Số điện thoại</label>
          <input 
            name='shipping_phone' 
            value={form.shipping_phone} 
            onChange={handleChange} 
            required 
            style={{padding: 10, borderRadius: 6, border: '1px solid #ccc'}} 
          />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
          <label style={{fontWeight: 500}}>Địa chỉ</label>
          <textarea 
            name='shipping_address' 
            value={form.shipping_address} 
            onChange={handleChange} 
            required 
            style={{padding: 10, borderRadius: 6, border: '1px solid #ccc', minHeight: 80, resize: 'vertical'}} 
            placeholder="Nhập địa chỉ chi tiết: số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
          />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
          <label style={{fontWeight: 500}}>Ghi chú</label>
          <textarea 
            name='shipping_note' 
            value={form.shipping_note} 
            onChange={handleChange} 
            style={{padding: 10, borderRadius: 6, border: '1px solid #ccc', minHeight: 60}} 
            placeholder="Ghi chú thêm về địa chỉ giao hàng (không bắt buộc)"
          />
        </div>
        
        {/* Save Address Checkbox */}
        {selectedAddressId === null && (
          <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: 12, background: '#f8f9fa', borderRadius: 6, border: '1px solid #e9ecef'}}>
            <input 
              type="checkbox" 
              id="saveAddress" 
              checked={saveNewAddress} 
              onChange={(e) => setSaveNewAddress(e.target.checked)}
              style={{width: 16, height: 16}}
            />
            <label htmlFor="saveAddress" style={{fontSize: 14, color: '#495057', cursor: 'pointer'}}>
              Lưu địa chỉ này cho lần sau
            </label>
          </div>
        )}
        {error && <div style={{color: 'red', marginBottom: 8}}>{error}</div>}
        {successMessage && <div style={{color: 'green', marginBottom: 8, fontWeight: 500}}>{successMessage}</div>}
        <Button 
          type='submit' 
          text={loading ? 'Đang đặt hàng...' : 'Đặt hàng'} 
          disabled={loading} 
          style={{marginTop: 8, fontWeight: 600, fontSize: 18, padding: '12px 0', borderRadius: 6}} 
        />
      </form>
      
      <h3 style={{margin: '32px 0 16px 0', fontWeight: 600}}>Giỏ hàng của bạn</h3>
      <div style={{border: '1px solid #eee', borderRadius: 8, padding: 16, background: '#fafbfc'}}>
        {cartItems.length === 0 ? (
          <div style={{textAlign: 'center', color: '#888'}}>Giỏ hàng trống</div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
            {cartItems.map(item => (
              <div key={item.id} style={{display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid #eee', paddingBottom: 12}}>
                <img src={item.image_url || item.imageUrl || '/images/placeholder-image.png'} alt={item.name} style={{width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #ddd'}} />
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 500, fontSize: 16}}>{item.name}</div>
                  <div style={{color: '#888', fontSize: 14}}>Số lượng: {item.quantity}</div>
                </div>
                <div style={{fontWeight: 600, color: '#1a8917', fontSize: 16}}>{Number(item.price).toLocaleString()}₫</div>
              </div>
            ))}
            <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 12}}>
              <span style={{fontWeight: 600, fontSize: 18}}>Tổng cộng:&nbsp;</span>
              <span style={{fontWeight: 700, fontSize: 22, color: '#e53935'}}>{Number(cartTotal).toLocaleString()}₫</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  cartItems: state.cart.cartItems,
  cartTotal: state.cart.cartTotal
});

const mapDispatchToProps = dispatch => ({
  clearCart: () => dispatch({ type: 'CLEAR_CART' })
});

export default connect(mapStateToProps, mapDispatchToProps)(Checkout); 