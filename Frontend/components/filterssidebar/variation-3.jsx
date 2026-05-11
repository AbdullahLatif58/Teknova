import { useTheme } from '../../context/ThemeContext';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState } from 'react';

const priceRanges = [
  { label: 'Under $100', min: 0, max: 100 },
  { label: '$100 – $500', min: 100, max: 500 },
  { label: '$500 – $1000', min: 500, max: 1000 },
  { label: '$1000 – $2000', min: 1000, max: 2000 },
  { label: 'Over $2000', min: 2000, max: Infinity },
];

export default function FiltersSidebar3({ filters, onFilterChange, onClear, categories = [] }) {
  const { variation } = useTheme();
  const [open, setOpen] = useState({ category: true, brand: true, price: true });

  const toggle = (key) => setOpen(p => ({ ...p, [key]: !p[key] }));
  const isActive = Object.values(filters || {}).some(v => (Array.isArray(v) ? v.length : v));

  const labelCls = variation === 2 ? 'text-xs font-bold uppercase tracking-widest text-neon mb-3' : variation === 3 ? 'text-sm font-heading font-semibold text-foreground mb-3 italic' : 'text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3';
  const checkActiveCls = variation === 2 ? 'text-neon' : 'text-primary';

  return (
    <aside className={'w-64 shrink-0 ' + (variation === 2 ? 'bg-card border border-border rounded-xl p-5' : variation === 3 ? 'bg-background' : 'bg-card border border-border rounded-2xl p-5')}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-bold text-foreground">Filters</h3>
        {isActive && <button onClick={onClear} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"><X size={12} /> Clear</button>}
      </div>

      {/* Category */}
      <div className="mb-6 border-b border-border pb-6">
        <button onClick={() => toggle('category')} className="flex items-center justify-between w-full mb-3">
          <span className={labelCls.replace('mb-3','')}>Category</span>
          {open.category ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
        </button>
        {open.category && (
          <div className="space-y-2">
            {categories.map(cat => {
              const name = typeof cat === 'string' ? cat : cat.name;
              const active = filters?.category === name;
              return (
                <label key={name} className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="radio" name="category" checked={active} onChange={() => onFilterChange?.('category', active ? '' : name)}
                    className="accent-primary" />
                  <span className={'text-sm transition-colors ' + (active ? checkActiveCls + ' font-medium' : 'text-muted-foreground group-hover:text-foreground')}>{name}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="mb-4">
        <button onClick={() => toggle('price')} className="flex items-center justify-between w-full mb-3">
          <span className={labelCls.replace('mb-3','')}>Price</span>
          {open.price ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
        </button>
        {open.price && (
          <div className="space-y-2">
            {priceRanges.map(r => {
              const active = filters?.priceMin === r.min && filters?.priceMax === r.max;
              return (
                <label key={r.label} className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="radio" name="price" checked={active}
                    onChange={() => onFilterChange?.('price', active ? null : { min: r.min, max: r.max })}
                    className="accent-primary" />
                  <span className={'text-sm transition-colors ' + (active ? checkActiveCls + ' font-medium' : 'text-muted-foreground group-hover:text-foreground')}>{r.label}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
