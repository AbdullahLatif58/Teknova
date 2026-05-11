import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isCartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('teknova-cart');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const persist = (updated) => {
    setItems(updated);
    localStorage.setItem('teknova-cart', JSON.stringify(updated));
  };

  const addItem = (product, qty = 1, color = null) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id && i.color === color);
      const updated = existing
        ? prev.map((i) => i.id === product.id && i.color === color ? { ...i, quantity: i.quantity + qty } : i)
        : [...prev, { ...product, quantity: qty, color }];
      localStorage.setItem('teknova-cart', JSON.stringify(updated));
      return updated;
    });
    setCartOpen(true);
  };

  const removeItem = (id) => persist(items.filter((i) => i.id !== id));

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeItem(id);
    persist(items.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearCart = () => persist([]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, isCartOpen, setCartOpen,
      addItem, removeItem, updateQuantity, clearCart,
      totalItems, subtotal,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
