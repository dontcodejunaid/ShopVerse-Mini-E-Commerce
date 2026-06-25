import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setOrders(data);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="animate-fade-in" style={containerStyle}>
      {/* Profile Info Header */}
      <div style={profileHeaderStyle} className="glass-panel">
        <div style={avatarStyle}>👤</div>
        <div style={profileInfoStyle}>
          <h2 style={usernameStyle}>{user?.username}</h2>
          <p style={emailStyle}>Email: {user?.email}</p>
          <span style={badgeStyle}>Gold Member</span>
        </div>
      </div>

      {/* Order History Section */}
      <div style={ordersSectionStyle}>
        <h2 style={sectionTitleStyle}>Your Order History</h2>

        {loading ? (
          <div style={loadingStyle}>
            <div className="spinner"></div>
            <p style={{ marginTop: '16px', color: '#9ca3af' }}>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={emptyOrdersStyle} className="glass-panel">
            <span style={{ fontSize: '2.5rem' }}>📦</span>
            <h3 style={{ marginTop: '12px' }}>No orders found</h3>
            <p style={{ color: '#9ca3af', margin: '8px 0 20px', fontSize: '0.95rem' }}>You haven't placed any orders yet.</p>
            <Link to="/" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div style={ordersListStyle}>
            {orders.map((order) => (
              <div key={order._id} style={orderCardStyle} className="glass-panel">
                {/* Order Meta Header */}
                <div style={orderHeaderStyle}>
                  <div style={metaGroupStyle}>
                    <span style={metaLabelStyle}>ORDER PLACED</span>
                    <span style={metaValueStyle}>{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div style={metaGroupStyle}>
                    <span style={metaLabelStyle}>TOTAL AMOUNT</span>
                    <span style={{ ...metaValueStyle, color: '#10b981', fontWeight: '700' }}>₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div style={metaGroupStyle}>
                    <span style={metaLabelStyle}>ORDER REFERENCE</span>
                    <span style={orderIdStyle}>{order._id}</span>
                  </div>
                  <span style={statusBadgeStyle}>{order.status}</span>
                </div>

                {/* Order Details Body */}
                <div style={orderBodyStyle}>
                  {/* Items Ordered */}
                  <div style={itemsListStyle}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={itemStyle}>
                        <div style={itemDetailsStyle}>
                          <span style={itemNameStyle}>{item.name}</span>
                          <span style={itemQtyStyle}>Quantity: {item.quantity} × ₹{item.price.toFixed(2)}</span>
                        </div>
                        <span style={itemTotalStyle}>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address Summary */}
                  <div style={shippingDetailsBoxStyle}>
                    <h4 style={shippingTitleStyle}>Shipping Destination</h4>
                    <p style={shippingNameStyle}>{order.shippingDetails?.fullName}</p>
                    <p style={shippingAddrStyle}>{order.shippingDetails?.address}</p>
                    <p style={shippingAddrStyle}>{order.shippingDetails?.city}, {order.shippingDetails?.zipCode}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '30px',
};

const profileHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
  padding: '30px',
  borderRadius: '20px',
};

const avatarStyle = {
  fontSize: '3rem',
  background: 'rgba(139, 92, 246, 0.1)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const profileInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '4px',
};

const usernameStyle = {
  fontSize: '1.5rem',
  fontWeight: '800',
  color: '#ffffff',
};

const emailStyle = {
  fontSize: '0.95rem',
  color: '#9ca3af',
};

const badgeStyle = {
  backgroundColor: 'rgba(139, 92, 246, 0.15)',
  border: '1px solid #8b5cf6',
  color: '#a78bfa',
  fontSize: '0.75rem',
  fontWeight: '700',
  padding: '3px 8px',
  borderRadius: '6px',
  marginTop: '4px',
};

const ordersSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const sectionTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '700',
  color: '#ffffff',
};

const loadingStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '60px 0',
};

const emptyOrdersStyle = {
  padding: '50px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
};

const ordersListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
};

const orderCardStyle = {
  borderRadius: '20px',
  overflow: 'hidden',
  border: '1px solid rgba(255,255,255,0.06)',
};

const orderHeaderStyle = {
  background: 'rgba(255, 255, 255, 0.02)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  padding: '20px 24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '16px',
};

const metaGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
};

const metaLabelStyle = {
  fontSize: '0.75rem',
  fontWeight: '600',
  color: '#9ca3af',
  letterSpacing: '0.5px',
};

const metaValueStyle = {
  fontSize: '0.9rem',
  color: '#ffffff',
  fontWeight: '500',
};

const orderIdStyle = {
  fontSize: '0.9rem',
  color: '#8b5cf6',
  fontWeight: '500',
};

const statusBadgeStyle = {
  backgroundColor: 'rgba(16, 185, 129, 0.1)',
  border: '1px solid #10b981',
  color: '#10b981',
  padding: '4px 10px',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: '700',
  letterSpacing: '0.5px',
};

const orderBodyStyle = {
  padding: '24px',
  display: 'grid',
  gridTemplateColumns: '1.2fr 0.8fr',
  gap: '30px',
  alignItems: 'start',
};

const itemsListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
};

const itemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '12px',
  borderBottom: '1px solid rgba(255,255,255,0.03)',
};

const itemDetailsStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const itemNameStyle = {
  fontSize: '0.95rem',
  fontWeight: '600',
  color: '#ffffff',
};

const itemQtyStyle = {
  fontSize: '0.85rem',
  color: '#9ca3af',
  marginTop: '2px',
};

const itemTotalStyle = {
  fontWeight: '600',
  fontSize: '0.95rem',
  color: '#ffffff',
};

const shippingDetailsBoxStyle = {
  background: 'rgba(255, 255, 255, 0.01)',
  border: '1px solid rgba(255, 255, 255, 0.04)',
  borderRadius: '12px',
  padding: '16px',
};

const shippingTitleStyle = {
  fontSize: '0.85rem',
  color: '#9ca3af',
  fontWeight: '700',
  textTransform: 'uppercase',
  marginBottom: '10px',
};

const shippingNameStyle = {
  fontSize: '0.95rem',
  fontWeight: '600',
  color: '#ffffff',
  marginBottom: '2px',
};

const shippingAddrStyle = {
  fontSize: '0.9rem',
  color: '#9ca3af',
};
