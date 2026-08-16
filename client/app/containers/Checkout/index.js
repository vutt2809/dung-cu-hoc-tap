import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import actions from '../../actions';
import Button from '../../components/Common/Button';
import axios from 'axios';
import { API_URL } from '../../constants';

const Checkout = ({ cartItems, cartTotal, clearCart, syncCartToServer }) => {
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
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [isManualAddress, setIsManualAddress] = useState(true);

  const formatAddress = (addr) => {
    if (!addr) return '';
    const parts = [
      addr.address,
      addr.city,
      addr.state,
      addr.country,
      addr.zip_code
    ].filter(Boolean);
    return parts.join(', ');
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAddressesAndProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const addrRes = await axios.get(`${API_URL}/address`);
        if (isMounted && addrRes.data && addrRes.data.success) {
          const addrList = addrRes.data.addresses || [];
          setAddresses(addrList);
          
          const defaultAddr = addrList.find(a => a.is_default || a.isDefault);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            setIsManualAddress(false);
            setForm(prev => ({
              ...prev,
              shipping_address: formatAddress(defaultAddr)
            }));
          } else if (addrList.length > 0) {
            setSelectedAddressId(addrList[0].id);
            setIsManualAddress(false);
            setForm(prev => ({
              ...prev,
              shipping_address: formatAddress(addrList[0])
            }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch addresses:', err);
      }

      try {
        const profileRes = await axios.get(`${API_URL}/auth/me`);
        if (isMounted && profileRes.data && profileRes.data.user) {
          const user = profileRes.data.user;
          const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
          setForm(prev => ({
            ...prev,
            shipping_name: prev.shipping_name || fullName,
            shipping_phone: prev.shipping_phone || user.phone_number || ''
          }));
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    fetchAddressesAndProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectAddress = addr => {
    setSelectedAddressId(addr.id);
    setIsManualAddress(false);
    setForm(prev => ({
      ...prev,
      shipping_address: formatAddress(addr)
    }));
  };

  const handleSelectManual = () => {
    setSelectedAddressId('');
    setIsManualAddress(true);
    setForm(prev => ({
      ...prev,
      shipping_address: ''
    }));
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!cartItems || cartItems.length === 0) {
      setError('Giỏ hàng của bạn đang trống. Vui lòng chọn sản phẩm trước khi đặt hàng!');
      return;
    }
    setError('');
    setLoading(true);
    try {
      if (syncCartToServer) {
        await syncCartToServer();
      }

      const response = await axios.post(`${API_URL}/order/add`, {
        ...form,
        total: cartTotal,
        cart_items: cartItems
      });
      clearCart();
      history.push(`/order/success/${response.data.order.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Đặt hàng thất bại!');
      setLoading(false);
    }
  };

  return (
    <div className='checkout-page' style={{maxWidth: 900, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0001', padding: 32}}>
      <h2 style={{textAlign: 'center', marginBottom: 32}}>Thông tin nhận hàng</h2>
      <form onSubmit={handleSubmit} className='checkout-form' style={{maxWidth: 500, margin: '0 auto 32px auto', display: 'flex', flexDirection: 'column', gap: 16}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
          <label style={{fontWeight: 500}}>Họ tên</label>
          <input name='shipping_name' value={form.shipping_name} onChange={handleChange} required style={{padding: 10, borderRadius: 6, border: '1px solid #ccc'}} />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
          <label style={{fontWeight: 500}}>Số điện thoại</label>
          <input name='shipping_phone' value={form.shipping_phone} onChange={handleChange} required style={{padding: 10, borderRadius: 6, border: '1px solid #ccc'}} />
        </div>

        {addresses.length > 0 && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4, marginBottom: 8}}>
            <label style={{fontWeight: 600, fontSize: 15, color: '#333'}}>Chọn địa chỉ giao hàng đã lưu</label>
            <div style={{display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 220, overflowY: 'auto', paddingRight: 4}}>
              {addresses.map(addr => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => handleSelectAddress(addr)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: isSelected ? '2px solid #1a8917' : '1px solid #e0e0e0',
                      background: isSelected ? '#f4faf4' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      boxShadow: isSelected ? '0 2px 8px rgba(26, 137, 23, 0.12)' : 'none'
                    }}
                  >
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span style={{fontWeight: 600, fontSize: 14, color: isSelected ? '#1a8917' : '#333'}}>
                        {addr.address} {addr.is_default || addr.isDefault ? <span style={{fontSize: 11, background: '#1a8917', color: '#fff', padding: '2px 6px', borderRadius: 4, marginLeft: 6}}>Mặc định</span> : ''}
                      </span>
                      {isSelected && <span style={{color: '#1a8917', fontWeight: 'bold', fontSize: 16}}>✓</span>}
                    </div>
                    <div style={{fontSize: 13, color: '#666'}}>
                      {`${addr.city}, ${addr.state || ''}, ${addr.country}`}
                    </div>
                  </div>
                );
              })}
              
              <div
                onClick={handleSelectManual}
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: isManualAddress ? '2px solid #1a8917' : '1px solid #e0e0e0',
                  background: isManualAddress ? '#f4faf4' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{fontWeight: 600, fontSize: 14, color: isManualAddress ? '#1a8917' : '#333'}}>
                  + Sử dụng địa chỉ khác (Nhập thủ công)
                </span>
                {isManualAddress && <span style={{color: '#1a8917', fontWeight: 'bold', fontSize: 16}}>✓</span>}
              </div>
            </div>
          </div>
        )}

        <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
          <label style={{fontWeight: 500}}>Địa chỉ nhận hàng</label>
          <input 
            name='shipping_address' 
            value={form.shipping_address} 
            onChange={handleChange} 
            required 
            readOnly={!isManualAddress}
            style={{
              padding: 10, 
              borderRadius: 6, 
              border: '1px solid #ccc',
              backgroundColor: !isManualAddress ? '#f5f5f5' : '#fff',
              color: !isManualAddress ? '#555' : '#000',
              cursor: !isManualAddress ? 'not-allowed' : 'text'
            }} 
            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
          />
          {!isManualAddress && (
            <span style={{fontSize: 12, color: '#1a8917', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4}}>
              ℹ Đang sử dụng địa chỉ đã lưu. Chọn "Sử dụng địa chỉ khác" để nhập thủ công.
            </span>
          )}
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
          <label style={{fontWeight: 500}}>Ghi chú</label>
          <textarea name='shipping_note' value={form.shipping_note} onChange={handleChange} style={{padding: 10, borderRadius: 6, border: '1px solid #ccc', minHeight: 60}} />
        </div>
        {error && <div style={{color: 'red', marginBottom: 8}}>{error}</div>}
        <Button type='submit' text={loading ? 'Đang đặt hàng...' : 'Đặt hàng'} disabled={loading} style={{marginTop: 8, fontWeight: 600, fontSize: 18, padding: '12px 0', borderRadius: 6}} />
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

export default connect(mapStateToProps, actions)(Checkout);