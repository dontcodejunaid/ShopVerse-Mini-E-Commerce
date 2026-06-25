import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock <= 0) {
      showToast('Item is out of stock!', 'error');
      return;
    }

    addToCart(product, 1);
    showToast(`Added ${product.name} to cart!`, 'success');
  };

  // Helper to render stars
  const renderStars = (rating) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<span key={i} style={{ color: '#fbbf24' }}>★</span>);
      } else {
        stars.push(<span key={i} style={{ color: '#4b5563' }}>★</span>);
      }
    }
    return (
      <div style={starsStyle}>
        {stars}
        <span style={ratingValueStyle}>{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <Link to={`/product/${product._id}`} style={cardLinkStyle}>
      <div className="glass-card" style={cardStyle}>
        {/* Product Image */}
        <div style={imgContainerStyle}>
          <img src={product.imageUrl} alt={product.name} style={imgStyle} className="product-card-img" />
          <span style={categoryBadgeStyle}>{product.category}</span>
        </div>

        {/* Product Details */}
        <div style={detailsStyle}>
          <h3 style={nameStyle}>{product.name}</h3>
          
          {renderStars(product.rating || 4.5)}

          <div style={footerRowStyle}>
            <span style={priceStyle}>₹{product.price.toFixed(2)}</span>
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="btn btn-primary"
              style={addToCartBtnStyle}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>

        <style>{`
          .product-card-img {
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .glass-card:hover .product-card-img {
            transform: scale(1.08);
          }
        `}</style>
      </div>
    </Link>
  );
}

const cardLinkStyle = {
  display: 'block',
  height: '100%',
};

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
  cursor: 'pointer',
};

const imgContainerStyle = {
  position: 'relative',
  height: '220px',
  overflow: 'hidden',
  background: 'rgba(255, 255, 255, 0.02)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const imgStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const categoryBadgeStyle = {
  position: 'absolute',
  top: '12px',
  left: '12px',
  backgroundColor: 'rgba(8, 11, 17, 0.75)',
  backdropFilter: 'blur(4px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  color: '#8b5cf6',
  fontSize: '0.75rem',
  fontWeight: '700',
  padding: '4px 10px',
  borderRadius: '8px',
  letterSpacing: '0.5px',
};

const detailsStyle = {
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: '8px',
};

const nameStyle = {
  fontSize: '1.05rem',
  fontWeight: '700',
  color: '#ffffff',
  lineHeight: '1.4',
  /* Ellipsis for multiline */
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

const starsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '0.85rem',
};

const ratingValueStyle = {
  fontSize: '0.8rem',
  color: '#9ca3af',
  marginLeft: '4px',
  fontWeight: '500',
};

const footerRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 'auto',
  paddingTop: '12px',
};

const priceStyle = {
  fontSize: '1.2rem',
  fontWeight: '800',
  color: '#ffffff',
};

const addToCartBtnStyle = {
  padding: '8px 14px',
  borderRadius: '10px',
  fontSize: '0.85rem',
  boxShadow: 'none',
};
