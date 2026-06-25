import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart();
  const { isAuthenticated, token } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Form states
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !address || !city || !zipCode) {
      showToast('Please fill out all shipping details', 'error');
      return;
    }

    setLoading(true);
    try {
      const orderItems = cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,
          shippingDetails: { fullName, address, city, zipCode },
          totalAmount: subtotal,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOrderSuccess(data.order);
        clearCart();
        showToast('Order placed successfully!', 'success');
      } else {
        showToast(data.message || 'Failed to place order', 'error');
      }
    } catch (err) {
      console.error('Error during checkout:', err);
      showToast('Network error during checkout', 'error');
    } finally {
      setLoading(false);
    }
  };

  // If order is completed successfully, render Order Confirmation screen
  if (orderSuccess) {
    return (
      <div className="animate-fade-in" style={successContainerStyle}>
        <div style={successCardStyle} className="glass-panel">
          <div style={successIconStyle}>✓</div>
          <h2 style={successTitleStyle}>Thank You!</h2>
          <p style={successSubtitleStyle}>Your order has been placed successfully.</p>
          
          <div style={orderSummaryBoxStyle}>
            <p style={orderRefStyle}>Order ID: <span style={{ color: '#8b5cf6' }}>{orderSuccess._id}</span></p>
            <p style={orderTotalStyle}>Amount Charged: <span style={{ color: '#10b981' }}>₹{orderSuccess.totalAmount.toFixed(2)}</span></p>
            <p style={orderStatusStyle}>Status: <span style={statusBadgeStyle}>{orderSuccess.status}</span></p>
          </div>

          <div style={buttonRowStyle}>
            <Link to="/" className="btn btn-secondary">Continue Shopping</Link>
            <Link to="/profile" className="btn btn-primary">View My Orders</Link>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty, show empty state
  if (cartItems.length === 0) {
    return (
      <div className="animate-fade-in" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '450px', margin: '0 auto' }} className="glass-panel">
          <span style={{ fontSize: '3rem', display: 'block', margin: '20px' }}>🛒</span>
          <h2>Your Cart is Empty</h2>
          <p style={{ color: '#9ca3af', margin: '12px 0 24px' }}>Add some products to your cart before checking out.</p>
          <Link to="/" className="btn btn-primary" style={{ marginBottom: '20px' }}>Explore Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={containerStyle}>
      <h1 style={pageTitleStyle}>Checkout</h1>

      <div style={layoutGridStyle}>
        {/* Shipping Form / Auth Block */}
        <div style={formColumnStyle} className="glass-panel">
          {!isAuthenticated ? (
            <div style={authAlertStyle}>
              <h3>Authentication Required</h3>
              <p style={{ color: '#9ca3af', margin: '10px 0 20px' }}>
                You need to login or create an account to finalize your order.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Link to="/login" className="btn btn-primary">Log In</Link>
                <Link to="/register" className="btn btn-secondary">Register</Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={formStyle}>
              <h2 style={sectionTitleStyle}>Shipping Address</h2>
              
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder=""
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder=""
                  required
                />
              </div>

              <div style={formRowStyle}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder=""
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Zip Code</label>
                  <input
                    type="text"
                    className="form-input"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder=""
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', marginTop: '10px' }}
                disabled={loading}
              >
                {loading ? 'Processing Order...' : 'Place Order'}
              </button>
            </form>
          )}
        </div>

        {/* Order Summary */}
        <div style={summaryColumnStyle} className="glass-panel">
          <h2 style={sectionTitleStyle}>Order Summary</h2>
          
          <div style={itemsListStyle}>
            {cartItems.map((item) => (
              <div key={item._id} style={summaryItemStyle}>
                <img src={item.imageUrl} alt={item.name} style={itemImgStyle} />
                <div style={itemDetailsStyle}>
                  <h4 style={itemNameStyle}>{item.name}</h4>
                  <p style={itemQtyPriceStyle}>
                    Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                  </p>
                </div>
                <span style={itemTotalStyle}>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={totalsBoxStyle}>
            <div style={totalRowStyle}>
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={totalRowStyle}>
              <span>Shipping</span>
              <span style={{ color: '#10b981' }}>Free</span>
            </div>
            <div style={{ ...totalRowStyle, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', fontSize: '1.2rem', fontWeight: '800' }}>
              <span>Total</span>
              <span style={{ color: '#8b5cf6' }}>₹{subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
};

const pageTitleStyle = {
  fontSize: '2rem',
  fontWeight: '800',
  color: 'var(--text-primary)',
};

const layoutGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1.2fr 0.8fr',
  gap: '30px',
  alignItems: 'start',
};

const formColumnStyle = {
  padding: '30px',
};

const authAlertStyle = {
  padding: '20px 0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const sectionTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '700',
  color: 'var(--text-primary)',
  marginBottom: '20px',
};

const formRowStyle = {
  display: 'flex',
  gap: '16px',
};

const summaryColumnStyle = {
  padding: '30px',
};

const itemsListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  borderBottom: '1px solid var(--border-color)',
  paddingBottom: '20px',
  marginBottom: '20px',
};

const summaryItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const itemImgStyle = {
  width: '56px',
  height: '56px',
  borderRadius: '8px',
  objectFit: 'cover',
  background: 'rgba(255,255,255,0.02)',
};

const itemDetailsStyle = {
  flex: 1,
};

const itemNameStyle = {
  fontSize: '0.9rem',
  fontWeight: '600',
  color: 'var(--text-primary)',
};

const itemQtyPriceStyle = {
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  marginTop: '2px',
};

const itemTotalStyle = {
  fontWeight: '600',
  fontSize: '0.9rem',
  color: 'var(--text-primary)',
};

const totalsBoxStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const totalRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.95rem',
  color: 'var(--text-muted)',
};

// Success Confirmation Styles
const successContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 0',
};

const successCardStyle = {
  maxWidth: '500px',
  width: '100%',
  padding: '40px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const successIconStyle = {
  backgroundColor: 'rgba(16, 185, 129, 0.1)',
  border: '2px solid #10b981',
  color: '#10b981',
  width: '70px',
  height: '70px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2rem',
  fontWeight: 'bold',
  marginBottom: '24px',
};

const successTitleStyle = {
  fontSize: '2rem',
  fontWeight: '800',
  color: 'var(--text-primary)',
};

const successSubtitleStyle = {
  color: 'var(--text-muted)',
  marginTop: '8px',
  fontSize: '1rem',
};

const orderSummaryBoxStyle = {
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid var(--border-color)',
  borderRadius: '16px',
  padding: '20px',
  margin: '28px 0',
  width: '100%',
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const orderRefStyle = {
  fontSize: '0.9rem',
  color: 'var(--text-muted)',
};

const orderTotalStyle = {
  fontSize: '1rem',
  fontWeight: '600',
  color: 'var(--text-primary)',
};

const orderStatusStyle = {
  fontSize: '0.9rem',
  color: 'var(--text-muted)',
};

const statusBadgeStyle = {
  backgroundColor: 'rgba(16, 185, 129, 0.1)',
  border: '1px solid #10b981',
  color: '#10b981',
  padding: '2px 8px',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: '700',
  marginLeft: '6px',
};

const buttonRowStyle = {
  display: 'flex',
  gap: '16px',
  width: '100%',
};
