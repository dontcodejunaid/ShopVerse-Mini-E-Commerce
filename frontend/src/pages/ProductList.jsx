import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  const categories = ['All', 'Electronics', 'Wearables', 'Accessories', 'Home', 'Lifestyle', 'Apparel'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = 'http://localhost:5000/api/products';
        const params = [];
        if (category && category !== 'All') {
          params.push(`category=${encodeURIComponent(category)}`);
        }
        if (search) {
          params.push(`search=${encodeURIComponent(search)}`);
        }
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search input
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [category, search]);

  // Handle client-side sorting
  const getSortedProducts = () => {
    const sorted = [...products];
    if (sortBy === 'price-asc') {
      return sorted.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return sorted.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'rating') {
      return sorted.sort((a, b) => b.rating - a.rating);
    }
    return sorted; // Default sorting by seed position
  };

  const sortedProducts = getSortedProducts();

  return (
    <div className="animate-fade-in" style={containerStyle}>
      {/* Hero Banner */}
      <div style={heroStyle} className="glass-panel">
        <div style={heroOverlayStyle}></div>
        <div style={heroContentStyle}>
          <h1 style={heroTitleStyle}>Futuristic Storefront</h1>
          <p style={heroSubStyle}>Discover premium hand-crafted tech, wearables, and active lifestyle accessories.</p>
        </div>
      </div>

      {/* Controls Bar */}
      <div style={controlsStyle} className="glass-panel">
        {/* Search */}
        <div style={searchWrapperStyle}>
          <span style={searchIconStyle}>🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInputStyle}
          />
        </div>

        {/* Sort */}
        <div style={sortWrapperStyle}>
          <label style={sortLabelStyle}>Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={sortSelectStyle}
          >
            <option value="default">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={tabsContainerStyle}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              ...tabButtonStyle,
              backgroundColor: category === cat ? '#8b5cf6' : 'rgba(255, 255, 255, 0.03)',
              borderColor: category === cat ? '#a78bfa' : 'rgba(255, 255, 255, 0.08)',
              color: category === cat ? '#ffffff' : '#9ca3af',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div style={loadingStyle}>
          <div className="spinner"></div>
          <p style={{ marginTop: '16px', color: '#9ca3af' }}>Loading catalog...</p>
        </div>
      ) : sortedProducts.length === 0 ? (
        <div style={emptyStateStyle} className="glass-panel">
          <span style={{ fontSize: '2.5rem' }}>🔍</span>
          <h3 style={{ marginTop: '12px' }}>No products found</h3>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>Try clearing filters or search query.</p>
        </div>
      ) : (
        <div style={gridStyle}>
          {sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      <style>{`
        .spinner {
          border: 4px solid rgba(255, 255, 255, 0.05);
          border-top: 4px solid #8b5cf6;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '30px',
};

const heroStyle = {
  position: 'relative',
  padding: '60px 40px',
  borderRadius: '20px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const heroOverlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.25) 0%, rgba(8, 11, 17, 0) 60%)',
  pointerEvents: 'none',
};

const heroContentStyle = {
  position: 'relative',
  zIndex: 1,
  maxWidth: '600px',
};

const heroTitleStyle = {
  fontSize: '2.5rem',
  fontWeight: '800',
  lineHeight: '1.2',
  marginBottom: '12px',
  color: '#ffffff',
  background: 'linear-gradient(to right, #ffffff, #a78bfa)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const heroSubStyle = {
  fontSize: '1.1rem',
  color: '#9ca3af',
  fontWeight: '400',
};

const controlsStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 24px',
  flexWrap: 'wrap',
  gap: '16px',
};

const searchWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '12px',
  padding: '0 16px',
  width: '350px',
  maxWidth: '100%',
};

const searchIconStyle = {
  fontSize: '0.95rem',
  marginRight: '10px',
};

const searchInputStyle = {
  background: 'none',
  border: 'none',
  outline: 'none',
  color: '#ffffff',
  padding: '12px 0',
  width: '100%',
  fontSize: '0.95rem',
};

const sortWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const sortLabelStyle = {
  fontSize: '0.9rem',
  color: '#9ca3af',
};

const sortSelectStyle = {
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '10px',
  padding: '10px 16px',
  color: '#ffffff',
  outline: 'none',
  fontSize: '0.9rem',
  cursor: 'pointer',
};

const tabsContainerStyle = {
  display: 'flex',
  gap: '10px',
  overflowX: 'auto',
  paddingBottom: '8px',
};

const tabButtonStyle = {
  border: '1px solid',
  padding: '8px 18px',
  borderRadius: '10px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s ease',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: '30px',
};

const loadingStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '80px 0',
};

const emptyStateStyle = {
  padding: '60px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
};
