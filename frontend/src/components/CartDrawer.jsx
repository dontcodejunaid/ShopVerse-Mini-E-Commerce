import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, subtotal } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div style={overlayStyle} onClick={() => setIsCartOpen(false)}>
      <div style={drawerStyle} className="glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>Shopping Cart</h2>
          <button style={closeButtonStyle} onClick={() => setIsCartOpen(false)}>&times;</button>
        </div>

        {/* Drawer Content */}
        <div style={contentStyle}>
          {cartItems.length === 0 ? (
            <div style={emptyCartStyle}>
              <span style={{ fontSize: '3rem', marginBottom: '16px' }}>🛒</span>
              <p style={{ color: '#9ca3af', marginBottom: '24px' }}>Your cart is empty.</p>
              <button className="btn btn-secondary" onClick={() => setIsCartOpen(false)}>Continue Shopping</button>
            </div>
          ) : (
            <div style={itemsListStyle}>
              {cartItems.map((item) => (
                <div key={item._id} style={itemStyle} className="glass-card">
                  <img src={item.imageUrl} alt={item.name} style={itemImgStyle} />
                  <div style={itemDetailsStyle}>
                    <h4 style={itemNameStyle}>{item.name}</h4>
                    <p style={itemPriceStyle}>₹{item.price.toFixed(2)}</p>
                    
                    {/* Quantity Controls */}
                    <div style={quantityControlsStyle}>
                      <button
                        style={qtyBtnStyle}
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span style={qtyValueStyle}>{item.quantity}</span>
                      <button
                        style={qtyBtnStyle}
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button style={removeBtnStyle} onClick={() => removeFromCart(item._id)}>
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div style={footerStyle}>
            <div style={subtotalRowStyle}>
              <span>Subtotal:</span>
              <span style={subtotalValStyle}>₹{subtotal.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleCheckoutClick}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(8, 11, 17, 0.7)',
  backdropFilter: 'blur(4px)',
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'flex-end',
};

const drawerStyle = {
  width: '450px',
  maxWidth: '90%',
  height: '100%',
  borderTop: 'none',
  borderBottom: 'none',
  borderRight: 'none',
  borderRadius: '16px 0px 0px 16px',
  display: 'flex',
  flexDirection: 'column',
  animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
};

const headerStyle = {
  padding: '24px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const titleStyle = {
  fontSize: '1.25rem',
  fontWeight: '700',
  color: '#ffffff',
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#9ca3af',
  fontSize: '1.8rem',
  cursor: 'pointer',
  transition: 'color 0.2s ease',
  lineHeight: 1,
};

const contentStyle = {
  flex: 1,
  padding: '24px',
  overflowY: 'auto',
};

const emptyCartStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
};

const itemsListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const itemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '12px',
  gap: '16px',
  position: 'relative',
};

const itemImgStyle = {
  width: '70px',
  height: '70px',
  borderRadius: '8px',
  objectFit: 'cover',
  background: 'rgba(255,255,255,0.02)',
};

const itemDetailsStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const itemNameStyle = {
  fontSize: '0.95rem',
  fontWeight: '600',
  color: '#ffffff',
};

const itemPriceStyle = {
  fontSize: '0.9rem',
  color: '#8b5cf6',
  fontWeight: '500',
};

const quantityControlsStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  marginTop: '4px',
};

const qtyBtnStyle = {
  background: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  color: '#ffffff',
  width: '26px',
  height: '26px',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '0.9rem',
};

const qtyValueStyle = {
  fontSize: '0.9rem',
  fontWeight: '600',
  minWidth: '16px',
  textAlign: 'center',
};

const removeBtnStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1rem',
  padding: '8px',
  opacity: 0.7,
  transition: 'opacity 0.2s ease',
};

const footerStyle = {
  padding: '24px',
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const subtotalRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '1.05rem',
  fontWeight: '600',
  color: '#ffffff',
};

const subtotalValStyle = {
  fontSize: '1.2rem',
  color: '#10b981',
};
