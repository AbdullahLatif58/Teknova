import ProductCard from '../ui/ProductCard';
import { useTheme } from '../../context/ThemeContext';

export default function RelatedProducts({ products = [], currentId }) {
  const { variation } = useTheme();
  const related = products.filter(p => p.id !== currentId).slice(0, 4);
  if (!related.length) return null;
  return (
    <section className="py-12">
      <h2 className={'font-heading text-2xl font-bold text-foreground mb-8 ' + (variation === 3 ? 'italic' : '')}>
        {variation === 2 ? <span className="text-gradient-neon">You Might Also Like</span> : 'You Might Also Like'}
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
