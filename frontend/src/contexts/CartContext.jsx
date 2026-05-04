// frontend/src/contexts/CartContext.jsx
// Contexte panier — zéro dépendance Base44
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cm_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem('cm_cart', JSON.stringify(items)); } catch {}
  }, [items]);

  const addItem = (product) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === product.id)) return prev;
      return [...prev, { id: product.id, product }];
    });
    setIsOpen(true);
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
  };

  const isInCart = (productId) => items.some((i) => i.id === productId);

  const clearCart = () => {
    setItems([]);
    setIsOpen(false);
  };

  const itemCount = items.length;

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, isInCart, clearCart, itemCount, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export default CartContext;
