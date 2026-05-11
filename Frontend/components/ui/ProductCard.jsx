import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Star, Heart, Eye, ShoppingCart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product, onQuickView }) {
  const [imgError, setImgError] = useState(false);

  const optimizeImage = (url) => {
    if (!url) return 'https://placehold.co/600x600';


    let singleUrl = url;
    if (Array.isArray(url)) {
      singleUrl = url[0];
    } else if (typeof url === 'string' && url.startsWith('[')) {

      try {
        const parsed = JSON.parse(url);
        if (Array.isArray(parsed)) singleUrl = parsed[0];
      } catch (e) {

      }
    } else if (typeof url === 'string' && url.includes(',') && !url.includes('cloudinary')) {
      singleUrl = url.split(',')[0].trim();
    }

    if (typeof singleUrl !== 'string') return 'https://placehold.co/600x600';
    return singleUrl;
  };

  const imageUrl = optimizeImage(product.image);
  const fallbackUrl = 'https://placehold.co/600x600';
  const { variation } = useTheme();
  const { addItem } = useCart();

  const discount = product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : null;

  const isExternal = product.slug?.startsWith('http');
  const href = isExternal ? product.slug : `/product/${product.slug}`;

  const isAmazon = product.isAmazonProduct || product.brand === 'Amazon' || isExternal;

  if (variation === 2) {
    return (
      <div className="group relative bg-card rounded-xl border border-border overflow-hidden hover:border-neon/50 transition-all duration-300 hover:-translate-y-1">
        <Link href={href} {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          <div className={`relative aspect-square overflow-hidden ${isAmazon ? 'bg-white p-2' : 'bg-secondary'}`}>
            <Image 
              src={imgError ? fallbackUrl : imageUrl} 
              alt={product.name} 
              fill 
              className={`${isAmazon ? 'object-contain' : 'object-cover'} group-hover:scale-105 transition-transform duration-500`} 
              sizes="(max-width: 768px) 50vw, 33vw" 
              onError={() => setImgError(true)} 
            />
            {product.new && <span className="absolute top-3 left-3 bg-gradient-neon text-teknova-dark text-xs font-bold px-2 py-1 rounded">NEW</span>}
            {discount && <span className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">-{discount}%</span>}
          </div>
          <div className="p-4">
            <p className="text-xs text-neon font-semibold uppercase tracking-wider mb-1">{product.brand}</p>
            <h3 className="font-heading font-semibold text-foreground text-sm mb-2 line-clamp-2">{product.name}</h3>
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < Math.round(product.rating) ? 'fill-neon text-neon' : 'text-muted-foreground'} />)}
              <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-foreground">${product.price}</span>
                {product.compareAt && <span className="text-sm text-muted-foreground line-through">${product.compareAt}</span>}
              </div>
              <button onClick={e => { e.preventDefault(); addItem({ ...product, image: imageUrl }); }} className="p-1.5 bg-neon/10 hover:bg-neon/20 rounded-lg transition-colors">
                <ShoppingCart size={14} className="text-neon" />
              </button>
            </div>
          </div>
        </Link>
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {!discount && <button className="p-2 bg-card/80 backdrop-blur rounded-lg border border-border hover:border-neon transition-colors"><Heart size={14} /></button>}
          {onQuickView && <button onClick={e => { e.preventDefault(); onQuickView(); }} className="p-2 bg-card/80 backdrop-blur rounded-lg border border-border hover:border-neon transition-colors"><Eye size={14} /></button>}
        </div>
      </div>
    );
  }

  if (variation === 3) {
    return (
      <div className="group relative hover:-translate-y-1 transition-transform duration-300">
        <Link href={href} {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          <div className={`relative aspect-[4/5] rounded-xl overflow-hidden mb-4 glow-warm ${isAmazon ? 'bg-white p-4' : ''}`}>
            <Image 
              src={imgError ? fallbackUrl : imageUrl} 
              alt={product.name} 
              fill 
              className={`${isAmazon ? 'object-contain' : 'object-cover'} group-hover:scale-105 transition-transform duration-700`} 
              sizes="(max-width: 768px) 50vw, 33vw" 
              onError={() => setImgError(true)} 
            />
            {product.new && <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">New</span>}
          </div>
          <div>
            <p className="text-xs text-muted-foreground tracking-wide mb-1">{product.brand}</p>
            <h3 className="font-heading font-semibold text-foreground mb-2 line-clamp-2 italic">{product.name}</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-foreground">${product.price}</span>
                {product.compareAt && <span className="text-sm text-muted-foreground line-through">${product.compareAt}</span>}
              </div>
              <button onClick={e => { e.preventDefault(); addItem({ ...product, image: imageUrl }); }} className="p-1.5 border border-border rounded-lg hover:border-primary transition-colors opacity-0 group-hover:opacity-100">
                <ShoppingCart size={14} className="text-foreground" />
              </button>
            </div>
          </div>
        </Link>
      </div>
    );
  }


  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden border border-border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <Link href={href} {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        <div className={`relative aspect-square overflow-hidden ${isAmazon ? 'bg-white p-4' : 'bg-secondary'}`}>
          <Image 
            src={imgError ? fallbackUrl : imageUrl} 
            alt={product.name} 
            fill 
            className={`${isAmazon ? 'object-contain' : 'object-cover'} group-hover:scale-110 transition-transform duration-500`} 
            sizes="(max-width: 768px) 50vw, 33vw" 
            onError={() => setImgError(true)} 
          />
          {product.new && <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">New</span>}
          {discount && <span className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded-full">Save ${product.compareAt - product.price}</span>}
        </div>
        <div className="p-4">
          <p className="text-xs text-primary font-medium uppercase tracking-wider mb-1">{product.brand}</p>
          <h3 className="font-heading font-semibold text-foreground text-sm mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < Math.round(product.rating) ? 'fill-primary text-primary' : 'text-muted-foreground'} />)}
            <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-foreground">${product.price}</span>
              {product.compareAt && <span className="text-sm text-muted-foreground line-through">${product.compareAt}</span>}
            </div>
            <button onClick={e => { e.preventDefault(); addItem({ ...product, image: imageUrl }); }} className="p-1.5 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-lg transition-all opacity-0 group-hover:opacity-100">
              <ShoppingCart size={14} />
            </button>
          </div>
        </div>
      </Link>
      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 bg-card/90 backdrop-blur rounded-lg border border-border hover:bg-secondary transition-colors"><Heart size={14} /></button>
        {onQuickView && <button onClick={e => { e.preventDefault(); onQuickView(); }} className="p-2 bg-card/90 backdrop-blur rounded-lg border border-border hover:bg-secondary transition-colors"><Eye size={14} /></button>}
      </div>
    </div>
  );
}
