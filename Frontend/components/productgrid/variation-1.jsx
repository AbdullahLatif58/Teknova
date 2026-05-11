import { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ProductCard from '../ui/ProductCard';
import QuickViewModal from '../quickviewmodal/variation-1';
import { Grid, List } from 'lucide-react';

export default function ProductGrid1({ products = [], title = '' }) {
  const { variation } = useTheme();
  const [view, setView] = useState('grid');
  const [quickView, setQuickView] = useState(null);

  if (!products.length) return (
    <div className="text-center py-20">
      <p className="text-4xl mb-4">🔍</p>
      <p className="font-heading text-xl text-foreground mb-2">No products found</p>
      <p className="text-muted-foreground">Try adjusting your filters</p>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        {title && <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">{products.length}</span> products</p>}
        <div className={'flex items-center gap-1 p-1 rounded-lg border border-border bg-card ' + (variation === 2 ? '' : '')}>
          <button onClick={() => setView('grid')} className={'p-1.5 rounded transition-colors ' + (view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}><Grid size={15} /></button>
          <button onClick={() => setView('list')} className={'p-1.5 rounded transition-colors ' + (view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}><List size={15} /></button>
        </div>
      </div>

      <div className={view === 'grid' ? 'grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6' : 'flex flex-col gap-4'}>
        {products.map(p => (
          <ProductCard key={p.id} product={p} onQuickView={() => setQuickView(p)} />
        ))}
      </div>

      {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />}
    </div>
  );
}
