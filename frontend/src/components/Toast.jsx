import React from 'react';
import { useToast } from '../context/ToastContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div style={containerStyle}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            ...toastStyle,
            backgroundColor: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#8b5cf6',
          }}
          className="animate-toast"
          onClick={() => removeToast(toast.id)}
        >
          <span style={textStyle}>{toast.message}</span>
          <button style={closeButtonStyle}>&times;</button>
        </div>
      ))}
      <style>{`
        @keyframes toastSlide {
          from { transform: translateY(20px) scale(0.9); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-toast {
          animation: toastSlide 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards;
        }
      `}</style>
    </div>
  );
}

const containerStyle = {
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  zIndex: 9999,
  maxWidth: '350px',
};

const toastStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 18px',
  borderRadius: '12px',
  color: '#ffffff',
  fontSize: '0.9rem',
  fontWeight: '600',
  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  minWidth: '220px',
};

const textStyle = {
  flex: 1,
  marginRight: '12px',
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#ffffff',
  fontSize: '1.2rem',
  cursor: 'pointer',
  opacity: 0.8,
  lineHeight: 1,
};
