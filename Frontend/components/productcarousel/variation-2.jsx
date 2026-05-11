import { useState, useEffect } from 'react';
import ProductCard from '../ui/ProductCard';
import { useTheme } from '../../context/ThemeContext';
import { getCategories } from '../../api/categories';
import { getFeaturedProducts } from '../../api/products';

export default function ProductCarousel2() {
  const { variation } = useTheme();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch categories for mapping
        const catData = await getCategories();
        const catMap = {};
        if (catData.success && catData.data) {
          catData.data.forEach(c => { catMap[c.id] = c.name; });
        }

        const data = await getFeaturedProducts();
        if (data) {
          if (Array.isArray(data)) {
            const mapped = data.map(p => ({
              id: p.id,
              slug: p.page_handle,
              name: p.title,
              brand: 'Teknova',
              category: catMap[p.category_id] || 'Other',
              price: Number(p.price),
              rating: p.popularity ? 4.5 : 4.0,
              reviewCount: 0,
              image: p.images && p.images[0] ? (typeof p.images === 'string' ? JSON.parse(p.images)[0] : p.images[0]) : 'https://via.placeholder.com/600',
              new: false,
              featured: true
            }));
            setFeatured(mapped);
          } else {
            setFeatured([]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section className={'py-20 ' + (variation === 2 ? 'bg-secondary' : 'bg-background')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          {variation === 1 && <div className="text-center"><h2 className="font-heading text-3xl font-bold text-foreground mb-2">Featured Products</h2><p className="text-muted-foreground">Handpicked for you</p></div>}
          {variation === 2 && <div className="text-center"><h2 className="font-heading text-3xl font-bold tracking-wider uppercase mb-2"><span className="text-gradient-neon">Top Picks</span></h2><p className="text-muted-foreground">The gear everyone's talking about</p></div>}
          {variation === 3 && <div><span className="text-sm tracking-[0.3em] uppercase text-muted-foreground">Editor's Choice</span><h2 className="font-heading text-4xl font-semibold text-foreground mt-2 italic">Featured Collection</h2></div>}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
             <div className="col-span-4 text-center py-10 text-muted-foreground">Loading products...</div>
          ) : featured.length > 0 ? (
             featured.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)
          ) : (
             <div className="col-span-4 text-center py-10 text-muted-foreground">No featured products found.</div>
          )}
        </div>
      </div>
    </section>
  );
}
