import { X, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function QuickViewModal({ product, onClose }) {
  const { addItem } = useCart();
  const { variation } = useTheme();

  const btnCls = variation === 2
    ? 'bg-gradient-neon text-teknova-dark font-bold glow-neon'
    : variation === 3
      ? 'bg-primary text-primary-foreground font-medium'
      : 'bg-primary text-primary-foreground font-medium';

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors z-10">
          <X size={18} />
        </button>
        <div className="grid sm:grid-cols-2">
          <div className="aspect-square bg-secondary">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 flex flex-col justify-center">
            <p className="text-xs text-primary font-medium uppercase tracking-wider mb-1">{product.brand}</p>
            <h3 className="font-heading font-bold text-foreground text-lg mb-2">{product.name}</h3>
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={13} className={i < Math.round(product.rating) ? 'fill-primary text-primary' : 'text-muted-foreground'} />)}
              <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-heading text-2xl font-bold text-foreground">${product.price}</span>
              {product.compareAt && <span className="text-muted-foreground line-through">${product.compareAt}</span>}
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed line-clamp-3">{product.description}</p>
            <button onClick={() => { addItem(product); onClose(); }}
              className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${btnCls}`}>
              <ShoppingCart size={16} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
