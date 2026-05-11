import { createContext, useContext, useState, useEffect } from 'react';

const CART_KEY = 'teknova-cart';
const CART_VERSION = '2'; // bump this to clear stale carts
const CART_VERSION_KEY = 'teknova-cart-version';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isCartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    // Clear stale carts from old code versions
    const savedVersion = localStorage.getItem(CART_VERSION_KEY);
    if (savedVersion !== CART_VERSION) {
      localStorage.removeItem(CART_KEY);
      localStorage.setItem(CART_VERSION_KEY, CART_VERSION);
    } else {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) {
        try { setItems(JSON.parse(saved)); } catch (e) { localStorage.removeItem(CART_KEY); }
      }
    }
  }, []);

  const persist = (updated) => {
    setItems(updated);
    localStorage.setItem(CART_KEY, JSON.stringify(updated));
  };

  const addItem = (product, qty = 1, color = null) => {
    // Normalize image more robustly
    let image = 'https://placehold.co/600x600';
    try {
      if (product.image) {
        image = product.image;
      } else if (product.image_url) {
        image = product.image_url;
      } else if (product.images) {
        const parsed = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
        if (Array.isArray(parsed) && parsed[0]) {
          image = parsed[0];
        } else if (typeof parsed === 'string') {
          image = parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to parse product images", e);
      if (Array.isArray(product.images) && product.images[0]) {
        image = product.images[0];
      }
    }
    
    const normalizedProduct = { ...product, image };

    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id && i.color === color);
      const updated = existing
        ? prev.map((i) => i.id === product.id && i.color === color ? { ...i, quantity: i.quantity + qty } : i)
        : [...prev, { ...normalizedProduct, quantity: qty, color }];
      localStorage.setItem(CART_KEY, JSON.stringify(updated));
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
