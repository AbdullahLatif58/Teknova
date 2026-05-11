import Link from 'next/link';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function CartSidebar() {
  const { items, isCartOpen, setCartOpen, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const { variation } = useTheme();

  const btnCls = variation === 2
    ? 'block w-full text-center bg-gradient-neon text-teknova-dark py-3 rounded-lg font-bold glow-neon'
    : 'block w-full text-center bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:opacity-90 transition-opacity';

  const outlineCls = variation === 2
    ? 'block w-full text-center border border-border text-foreground py-3 rounded-lg font-medium hover:border-neon transition-colors'
    : 'block w-full text-center bg-secondary text-foreground py-3 rounded-xl font-medium hover:bg-muted transition-colors';

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50" onClick={() => setCartOpen(false)} />
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-heading text-lg font-bold">Cart ({totalItems})</h2>
          <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors"><X size={20} /></button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
            <ShoppingBag size={48} className="text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <button onClick={() => setCartOpen(false)} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium">Continue Shopping</button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 p-3 bg-secondary rounded-xl">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-heading font-semibold text-sm text-foreground truncate">{item.name}</h4>
                    {item.color && <p className="text-xs text-muted-foreground">{item.color}</p>}
                    <p className="font-bold text-foreground mt-1">${item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"><Minus size={14} /></button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"><Plus size={14} /></button>
                      <button onClick={() => removeItem(item.id)} className="ml-auto text-xs text-destructive hover:underline">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-border space-y-3">
              <div className="flex justify-between text-foreground font-heading font-bold text-lg">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <Link href="/cart" onClick={() => setCartOpen(false)} className={outlineCls}>View Cart</Link>
              <Link href="/checkout" onClick={() => setCartOpen(false)} className={btnCls}>Checkout</Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
