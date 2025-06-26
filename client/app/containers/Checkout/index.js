import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Button from '../../components/Common/Button';
import axios from 'axios';
import { API_URL } from '../../constants';

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

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
          total: cartTotal
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      clearCart();
      history.push(`/order/success/${response.data.order.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Đặt hàng thất bại!');
    } finally {
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
        <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
          <label style={{fontWeight: 500}}>Địa chỉ</label>
          <input name='shipping_address' value={form.shipping_address} onChange={handleChange} required style={{padding: 10, borderRadius: 6, border: '1px solid #ccc'}} />
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
                <img src={item.imageUrl || '/images/placeholder-image.png'} alt={item.name} style={{width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #ddd'}} />
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