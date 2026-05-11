import Link from 'next/link';
import { useTheme } from '../../context/ThemeContext';
import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import ProductCard from '../ui/ProductCard';
import { searchAmazon, mapAmazonProducts } from '../../api/amazon';

export default function AISuggestions1({ product, keyword }) {
  const { variation } = useTheme();
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        // Using prop keyword, product name, or a fixed home page keyword
        let query;
        if (keyword) {
          query = keyword;
        } else if (product) {
          query = product.name || product.title || 'latest gadgets';
        } else {
          // Default keyword for homepage
          query = 'latest tech gadgets';
        }

        const result = await searchAmazon(query, 3);
        
        if (result.success && result.data) {
          const mapped = mapAmazonProducts(result.data.slice(0, 3));
          setSuggested(mapped);
        } else {
          setSuggested([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, [product, keyword]);

  return (
    <section className={'py-20 ' + (variation === 2 ? 'bg-secondary' : 'bg-background')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles size={20} className={variation === 2 ? 'text-neon' : 'text-primary'} />
            <span className="text-sm font-medium tracking-wider uppercase text-muted-foreground">AI Picks</span>
          </div>
          {variation === 2 && <h2 className="font-heading text-3xl font-bold"><span className="text-gradient-neon">Recommended For You</span></h2>}
          {variation === 3 && <h2 className="font-heading text-3xl font-semibold text-foreground italic">Recommended For You</h2>}
          {variation === 1 && <h2 className="font-heading text-3xl font-bold text-foreground">Recommended For You</h2>}
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {loading ? (
             <div className="col-span-3 text-center py-10 text-muted-foreground">Loading AI recommendations...</div>
          ) : suggested.length > 0 ? (
             suggested.map(p => <ProductCard key={p.id} product={p} />)
          ) : (
             <div className="col-span-3 text-center py-10 text-muted-foreground">No recommendations right now.</div>
          )}
        </div>
      </div>
    </section>
  );
}
