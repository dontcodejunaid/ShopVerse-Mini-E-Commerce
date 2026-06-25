import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('cart');
    return localData ? JSON.parse(localData) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [animateCartIcon, setAnimateCartIcon] = useState(false);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);
      
      let newItems;
      if (existingItem) {
        // Limit quantity to stock
        const newQty = Math.min(existingItem.quantity + quantity, product.stock || 99);
        newItems = prevItems.map((item) =>
          item._id === product._id ? { ...item, quantity: newQty } : item
        );
      } else {
        newItems = [...prevItems, { ...product, quantity: Math.min(quantity, product.stock || 99) }];
      }

      // Trigger cart badge micro-animation
      setAnimateCartIcon(true);
      setTimeout(() => setAnimateCartIcon(false), 600);

      return newItems;
    });
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
  };

  // Update quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item._id === productId) {
          const maxStock = item.stock || 99;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      })
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        animateCartIcon,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setIsCartOpen,
        subtotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
