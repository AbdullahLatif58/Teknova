import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '../../context/ThemeContext';
import { getCategories } from '../../api/categories';

export default function FeaturedCategories3() {
  const { variation } = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        const cats = Array.isArray(data) ? data : (data.data || []);
        setCategories(cats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <div className="py-20 text-center text-muted-foreground">Loading categories...</div>;

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16">
          <span className="text-sm tracking-[0.3em] uppercase text-muted-foreground">Browse By</span>
          <h2 className="font-heading text-4xl font-semibold text-foreground mt-2 italic">Categories</h2>
        </div>
        <div className="flex overflow-x-auto gap-8 pb-4 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide">
          {categories.map((cat, i) => (
            <div key={cat.id} className="snap-start shrink-0 w-64">
              <Link href={'/products?category=' + encodeURIComponent(cat.name)} className="group block">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 glow-warm">
                  <img src={cat.image_url || 'https://placehold.co/400x400'} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-heading text-muted-foreground/30 font-bold">{String(i + 1).padStart(2,'0')}</span>
                  <span className="font-heading font-semibold text-foreground text-lg">{cat.name}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
