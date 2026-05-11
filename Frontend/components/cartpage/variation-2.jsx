import Link from 'next/link';
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function CartPage2() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const { variation } = useTheme();

  const btnPrimary = variation === 2
    ? 'block w-full text-center bg-gradient-neon text-teknova-dark py-4 rounded-lg font-bold glow-neon'
    : 'block w-full text-center bg-primary text-primary-foreground py-4 rounded-xl font-medium hover:opacity-90 transition-opacity';

  if (items.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
      <ShoppingBag size={64} className="text-muted-foreground" />
      <h2 className="font-heading text-2xl font-bold text-foreground">Your cart is empty</h2>
      <p className="text-muted-foreground">Looks like you haven't added anything yet.</p>
      <Link href="/products" className={'inline-flex items-center gap-2 ' + (variation === 2 ? 'bg-gradient-neon text-teknova-dark px-6 py-3 rounded-lg font-bold' : 'bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium')}>
        <ArrowLeft size={16} /> Continue Shopping
      </Link>
    </div>
  );

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className={'font-heading text-3xl font-bold text-foreground ' + (variation === 3 ? 'italic' : '')}>
          {variation === 2 ? <span className="text-gradient-neon">Your Cart</span> : 'Your Cart'}
        </h1>
        <button onClick={clearCart} className="text-sm text-muted-foreground hover:text-destructive transition-colors">Clear all</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={`${item.id}-${item.color || 'default'}`} className="flex gap-4 p-4 bg-card border border-border rounded-2xl">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-24 h-24 object-cover rounded-xl"
                onError={(e) => { e.target.src = 'https://placehold.co/600x600'; }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-primary font-medium uppercase tracking-wider mb-1">{item.brand}</p>
                    <h3 className="font-heading font-semibold text-foreground text-sm line-clamp-2">{item.name}</h3>
                    {item.color && <p className="text-xs text-muted-foreground mt-0.5">{item.color}</p>}
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors ml-2"><X size={16} /></button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors"><Minus size={13} /></button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors"><Plus size={13} /></button>
                  </div>
                  <span className="font-heading font-bold text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-card border border-border rounded-2xl p-6 h-fit">
          <h2 className="font-heading font-bold text-foreground mb-6">Order Summary</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span className="text-green-500">Free</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax (8%)</span><span className="text-foreground">${tax.toFixed(2)}</span></div>
            <div className="pt-3 border-t border-border flex justify-between font-heading font-bold text-foreground">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Promo */}
          <div className="flex gap-2 mb-4">
            <input placeholder="Promo code" className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors" />
            <button className="px-3 py-2 border border-border rounded-lg text-sm hover:bg-secondary transition-colors">Apply</button>
          </div>

          <Link href="/checkout" className={btnPrimary}>Proceed to Checkout</Link>
          <Link href="/products" className="block w-full text-center text-sm text-muted-foreground hover:text-foreground mt-3 transition-colors">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
