import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!username || !email || !password || !confirmPassword) {
      setFormError('Please enter all fields');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      showToast('Account created! Welcome to ShopVerse.', 'success');
      navigate('/');
    } catch (err) {
      setFormError(err.message || 'Registration failed');
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={containerStyle}>
      <div style={cardStyle} className="glass-panel">
        <h2 style={titleStyle}>Create Account</h2>
        <p style={subtitleStyle}>Join ShopVerse to buy premium items and manage orders.</p>

        {formError && (
          <div style={errorBannerStyle}>
            <span>⚠️</span> {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={submitBtnStyle}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={footerStyle}>
          Already have an account? <Link to="/login" style={linkStyle}>Log in here</Link>
        </div>
      </div>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 'calc(100vh - var(--nav-height) - 100px)',
};

const cardStyle = {
  width: '100%',
  maxWidth: '440px',
  padding: '40px',
  borderRadius: '24px',
};

const titleStyle = {
  fontSize: '1.8rem',
  fontWeight: '800',
  color: '#ffffff',
  textAlign: 'center',
  marginBottom: '8px',
};

const subtitleStyle = {
  color: '#9ca3af',
  fontSize: '0.95rem',
  textAlign: 'center',
  marginBottom: '28px',
};

const errorBannerStyle = {
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  color: '#f87171',
  padding: '12px 16px',
  borderRadius: '10px',
  fontSize: '0.9rem',
  fontWeight: '500',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '20px',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const submitBtnStyle = {
  marginTop: '10px',
  padding: '12px',
  fontSize: '1rem',
};

const footerStyle = {
  marginTop: '24px',
  textAlign: 'center',
  fontSize: '0.9rem',
  color: '#9ca3af',
};

const linkStyle = {
  color: '#8b5cf6',
  fontWeight: '600',
};
