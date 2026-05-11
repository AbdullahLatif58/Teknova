import { useState } from 'react';
import { Star, Heart, ShoppingCart, Truck, Shield, RefreshCw, Share2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function ProductInfo({ product }) {
  const { addItem } = useCart();
  const { variation } = useTheme();
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const discount = product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100) : null;

  const handleAdd = () => {
    addItem({ ...product, color: selectedColor }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const accentCls = variation === 2 ? 'text-neon' : variation === 3 ? 'text-primary' : 'text-primary';
  const btnCls = variation === 2
    ? 'flex-1 bg-gradient-neon text-teknova-dark py-3.5 rounded-lg font-bold glow-neon flex items-center justify-center gap-2'
    : variation === 3
      ? 'flex-1 bg-primary text-primary-foreground py-3.5 rounded-full font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity'
      : 'flex-1 bg-primary text-primary-foreground py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity';

  return (
    <div className="space-y-6">
      {/* Brand + name */}
      <div>
        <p className={'text-xs font-semibold uppercase tracking-widest mb-1 ' + accentCls}>{product.brand}</p>
        <h1 className={'font-heading font-bold text-foreground leading-tight ' + (variation === 3 ? 'text-3xl italic' : 'text-3xl')}>{product.name}</h1>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-3">
        <div className="flex">
          {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < Math.round(product.rating) ? 'fill-primary text-primary' : 'text-muted-foreground'} />)}
        </div>
        <span className="text-sm text-muted-foreground">{product.rating} ({product.reviewCount?.toLocaleString()} reviews)</span>
        <span className="text-xs text-green-500 font-medium">{product.stock}</span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className={'font-heading font-bold text-foreground ' + (variation === 3 ? 'text-4xl' : 'text-3xl')}>${product.price}</span>
        {product.compareAt && <>
          <span className="text-muted-foreground line-through text-lg">${product.compareAt}</span>
          <span className="text-xs font-bold bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">-{discount}%</span>
        </>}
      </div>

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed text-sm">{product.description}</p>

      {/* Color */}
      {product.colors?.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Color: <span className="text-foreground">{selectedColor}</span></p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map(c => (
              <button key={c} onClick={() => setSelectedColor(c)}
                className={'px-3 py-1.5 text-xs rounded-full border transition-all ' + (c === selectedColor ? 'border-primary bg-primary/5 text-foreground font-medium' : 'border-border text-muted-foreground hover:border-foreground')}>
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size/variant */}
      {product.sizes?.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Option: <span className="text-foreground">{selectedSize}</span></p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map(s => (
              <button key={s} onClick={() => setSelectedSize(s)}
                className={'px-3 py-1.5 text-xs rounded-full border transition-all ' + (s === selectedSize ? 'border-primary bg-primary/5 text-foreground font-medium' : 'border-border text-muted-foreground hover:border-foreground')}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Qty + Add to cart */}
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-border rounded-xl overflow-hidden">
          <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-11 flex items-center justify-center hover:bg-secondary transition-colors text-lg">−</button>
          <span className="w-10 text-center font-medium">{qty}</span>
          <button onClick={() => setQty(q => q + 1)} className="w-10 h-11 flex items-center justify-center hover:bg-secondary transition-colors text-lg">+</button>
        </div>
        <button onClick={handleAdd} className={btnCls}>
          <ShoppingCart size={18} />
          {added ? 'Added!' : 'Add to Cart'}
        </button>
        <button className="p-3 border border-border rounded-xl hover:bg-secondary transition-colors"><Heart size={18} /></button>
        <button className="p-3 border border-border rounded-xl hover:bg-secondary transition-colors"><Share2 size={18} /></button>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        {[{ icon: Truck, label: 'Free Shipping' }, { icon: Shield, label: '2yr Warranty' }, { icon: RefreshCw, label: 'Easy Returns' }].map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 text-center">
            <Icon size={18} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
