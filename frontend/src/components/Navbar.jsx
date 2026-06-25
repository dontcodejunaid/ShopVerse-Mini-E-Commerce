import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount, setIsCartOpen, animateCartIcon } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={navStyle} className="glass-panel">
      <div style={navContainerStyle}>
        {/* Brand Logo */}
        <Link to="/" style={logoStyle}>
          <img src="/logo.jpg" alt="ShopVerse Logo" style={logoImgStyle} /> ShopVerse
        </Link>

        {/* Links */}
        <div style={linksContainerStyle}>
          <Link to="/" style={navLinkStyle}>Catalog</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/profile" style={navLinkStyle}>My Orders</Link>
              <span style={greetingStyle}>Hello, {user?.username}</span>
              <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={navLinkStyle}>Login</Link>
              <Link to="/register" style={{ ...navLinkStyle, ...registerButtonStyle }}>Register</Link>
            </>
          )}

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              ...cartButtonStyle,
              animation: animateCartIcon ? 'bounceCart 0.6s ease' : 'none',
            }}
          >
            <span style={cartIconStyle}>🛒</span>
            {itemCount > 0 && <span style={cartBadgeStyle}>{itemCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}

const navStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '74px',
  zIndex: 999,
  borderTop: 'none',
  borderLeft: 'none',
  borderRight: 'none',
  borderRadius: '0px 0px 16px 16px',
  display: 'flex',
  alignItems: 'center',
};

const navContainerStyle = {
  maxWidth: '1200px',
  width: '100%',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 20px',
};

const logoStyle = {
  fontSize: '1.4rem',
  fontWeight: '800',
  letterSpacing: '0.5px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#ffffff',
};

const logoImgStyle = {
  height: '36px',
  width: '36px',
  borderRadius: '8px',
  objectFit: 'contain',
};

const linksContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
};

const navLinkStyle = {
  fontSize: '0.95rem',
  fontWeight: '500',
  color: '#9ca3af',
  transition: 'color 0.2s ease',
};

const registerButtonStyle = {
  background: '#8b5cf6',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '10px',
  fontSize: '0.9rem',
};

const greetingStyle = {
  fontSize: '0.9rem',
  color: '#d1d5db',
  borderLeft: '1px solid rgba(255,255,255,0.1)',
  paddingLeft: '16px',
};

const logoutButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#ef4444',
  fontSize: '0.95rem',
  fontWeight: '500',
  cursor: 'pointer',
  padding: 0,
};

const cartButtonStyle = {
  position: 'relative',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  width: '44px',
  height: '44px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const cartIconStyle = {
  fontSize: '1.15rem',
};

const cartBadgeStyle = {
  position: 'absolute',
  top: '-6px',
  right: '-6px',
  backgroundColor: '#8b5cf6',
  color: '#ffffff',
  fontSize: '0.75rem',
  fontWeight: 'bold',
  borderRadius: '50%',
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px solid #080b11',
};
