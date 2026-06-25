import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await response.json();
        if (response.ok) {
          setProduct(data);
        }
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleQtyChange = (type) => {
    if (type === 'dec') {
      setQuantity((prev) => Math.max(prev - 1, 1));
    } else {
      const maxStock = product?.stock || 99;
      setQuantity((prev) => Math.min(prev + 1, maxStock));
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.stock <= 0) {
      showToast('Item is out of stock!', 'error');
      return;
    }

    addToCart(product, quantity);
    showToast(`Added ${quantity} ${product.name} to cart!`, 'success');
  };

  if (loading) {
    return (
      <div style={spinnerContainerStyle}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={notFoundStyle} className="glass-panel">
        <h2>Product Not Found</h2>
        <p style={{ color: '#9ca3af', margin: '12px 0 24px' }}>The item you are looking for does not exist or has been removed.</p>
        <Link to="/" className="btn btn-primary">Back to Catalog</Link>
      </div>
    );
  }

  // Stock availability indicators
  const getStockStatus = () => {
    if (product.stock <= 0) return { label: 'Out of Stock', color: '#ef4444' };
    if (product.stock <= 5) return { label: `Only ${product.stock} left in stock`, color: '#f59e0b' };
    return { label: 'In Stock', color: '#10b981' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="animate-fade-in" style={containerStyle}>
      {/* Back Button */}
      <Link to="/" style={backLinkStyle}>
        ← Back to Catalog
      </Link>

      {/* Main product detail card */}
      <div style={cardStyle} className="glass-panel">
        <div style={gridStyle}>
          {/* Image */}
          <div style={imageWrapperStyle}>
            <img src={product.imageUrl} alt={product.name} style={imageStyle} />
          </div>

          {/* Details */}
          <div style={infoWrapperStyle}>
            <span style={categoryTagStyle}>{product.category}</span>
            <h1 style={titleStyle}>{product.name}</h1>
            
            {/* Rating Stars */}
            <div style={ratingRowStyle}>
              <div style={starsStyle}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <span
                    key={idx}
                    style={{ color: idx < Math.floor(product.rating || 4.5) ? '#fbbf24' : '#4b5563' }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span style={ratingTextStyle}>{product.rating || 4.5} rating</span>
            </div>

            <div style={priceRowStyle}>
              <span style={priceStyle}>₹{product.price.toFixed(2)}</span>
              <span style={{ ...stockLabelStyle, color: stockStatus.color }}>
                ● {stockStatus.label}
              </span>
            </div>

            <p style={descriptionStyle}>{product.description}</p>

            {/* Cart Operations */}
            {product.stock > 0 && (
              <div style={cartActionsStyle}>
                <div style={{ ...quantitySelectorStyle, background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)', borderColor: 'var(--border-color)' }}>
                  <button style={qtyBtnStyle} onClick={() => handleQtyChange('dec')}>-</button>
                  <span style={qtyValStyle}>{quantity}</span>
                  <button style={qtyBtnStyle} onClick={() => handleQtyChange('inc')}>+</button>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleAddToCart}
                  style={addToCartBtnStyle}
                >
                  Add to Cart
                </button>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div style={specsWrapperStyle}>
                <h3 style={specsTitleStyle}>Specifications</h3>
                <div style={specsGridStyle}>
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} style={{ ...specItemStyle, background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)', borderColor: 'var(--border-color)' }}>
                      <span style={specKeyStyle}>{key}</span>
                      <span style={specValStyle}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const backLinkStyle = {
  alignSelf: 'flex-start',
  color: '#9ca3af',
  fontSize: '0.95rem',
  fontWeight: '500',
  transition: 'color 0.2s ease',
  textDecoration: 'none',
  padding: '6px 0',
};

const cardStyle = {
  padding: '40px',
  borderRadius: '24px',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '50px',
  alignItems: 'start',
};

const imageWrapperStyle = {
  borderRadius: '16px',
  overflow: 'hidden',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255, 255, 255, 0.02)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '450px',
};

const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const infoWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const categoryTagStyle = {
  alignSelf: 'flex-start',
  backgroundColor: 'rgba(139, 92, 246, 0.1)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  color: '#a78bfa',
  fontSize: '0.8rem',
  fontWeight: '700',
  padding: '6px 12px',
  borderRadius: '8px',
  letterSpacing: '0.5px',
};

const titleStyle = {
  fontSize: '2.2rem',
  fontWeight: '800',
  color: 'var(--text-primary)',
  lineHeight: '1.2',
};

const ratingRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const starsStyle = {
  display: 'flex',
  gap: '4px',
  fontSize: '1rem',
};

const ratingTextStyle = {
  fontSize: '0.9rem',
  color: 'var(--text-muted)',
};

const priceRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
  margin: '10px 0',
};

const priceStyle = {
  fontSize: '2rem',
  fontWeight: '800',
  color: 'var(--text-primary)',
};

const stockLabelStyle = {
  fontSize: '0.9rem',
  fontWeight: '600',
};

const descriptionStyle = {
  color: 'var(--text-muted)',
  fontSize: '1rem',
  lineHeight: '1.6',
};

const cartActionsStyle = {
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
  margin: '10px 0',
};

const quantitySelectorStyle = {
  display: 'flex',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '12px',
  padding: '4px',
};

const qtyBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--text-primary)',
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.2s',
};

const qtyValStyle = {
  fontSize: '1.05rem',
  fontWeight: '600',
  minWidth: '32px',
  textAlign: 'center',
};

const addToCartBtnStyle = {
  flex: 1,
  padding: '14px',
};

const specsWrapperStyle = {
  marginTop: '24px',
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  paddingTop: '24px',
};

const specsTitleStyle = {
  fontSize: '1.1rem',
  fontWeight: '700',
  color: 'var(--text-primary)',
  marginBottom: '16px',
};

const specsGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
};

const specItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  background: 'rgba(255, 255, 255, 0.02)',
  padding: '12px',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.04)',
};

const specKeyStyle = {
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
  fontWeight: '500',
  textTransform: 'uppercase',
};

const specValStyle = {
  fontSize: '0.95rem',
  color: 'var(--text-primary)',
  fontWeight: '600',
};

const spinnerContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
};

const notFoundStyle = {
  padding: '60px',
  textAlign: 'center',
  maxWidth: '500px',
  margin: '40px auto',
};
