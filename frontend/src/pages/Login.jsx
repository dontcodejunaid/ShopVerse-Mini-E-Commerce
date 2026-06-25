import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please enter all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back! Logged in successfully.', 'success');
      navigate('/');
    } catch (err) {
      setFormError(err.message || 'Invalid credentials');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={containerStyle}>
      <div style={cardStyle} className="glass-panel">
        <h2 style={titleStyle}>Welcome Back</h2>
        <p style={subtitleStyle}>Sign in to your account to continue shopping.</p>

        {formError && (
          <div style={errorBannerStyle}>
            <span>⚠️</span> {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
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

          <button
            type="submit"
            className="btn btn-primary"
            style={submitBtnStyle}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div style={footerStyle}>
          Don't have an account? <Link to="/register" style={linkStyle}>Create one here</Link>
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
  color: 'var(--text-primary)',
  textAlign: 'center',
  marginBottom: '8px',
};

const subtitleStyle = {
  color: 'var(--text-muted)',
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
  color: 'var(--text-muted)',
};

const linkStyle = {
  color: '#8b5cf6',
  fontWeight: '600',
};
