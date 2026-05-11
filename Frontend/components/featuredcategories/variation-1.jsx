import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '../../context/ThemeContext';
import { Smartphone, Laptop, Headphones, Watch, Monitor, Keyboard, Package } from 'lucide-react';
import { getCategories } from '../../api/categories';

const iconMap = {
  'Smartphones': Smartphone,
  'Laptops': Laptop,
  'Audio': Headphones,
  'Wearables': Watch,
  'Monitors': Monitor,
  'Peripherals': Keyboard,
  'default': Package
};

export default function FeaturedCategories1() {
  const { variation } = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const result = await getCategories();
        if (result && result.data) {
          setCategories(result.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getIcon = (name) => iconMap[name] || iconMap['default'];

  if (loading) return <div className="py-20 text-center text-muted-foreground">Loading categories...</div>;

  if (variation === 2) return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-bold text-center mb-4 tracking-wider uppercase"><span className="text-gradient-neon">Categories</span></h2>
        <p className="text-center text-muted-foreground mb-12">Find your next upgrade</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat, i) => {
            const Icon = getIcon(cat.name);
            return (
              <Link key={cat.id} href={'/products?category=' + encodeURIComponent(cat.name)}
                className={'group relative overflow-hidden rounded-xl border border-border hover:border-neon/50 transition-all duration-300 block ' + (i === 0 ? 'md:row-span-2' : '')}>
                <div className={(i === 0 ? 'aspect-square md:aspect-auto md:h-full' : 'aspect-video') + ' relative'}>
                  <img src={cat.image_url || 'https://via.placeholder.com/400'} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <Icon size={18} className="text-neon" />
                    <span className="font-heading font-semibold text-foreground tracking-wider uppercase text-sm">{cat.name}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );

  if (variation === 3) return (
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
                  <img src={cat.image_url || 'https://via.placeholder.com/400'} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
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

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Shop by Category</h2>
          <p className="text-muted-foreground">Find exactly what you're looking for</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => {
            const Icon = getIcon(cat.name);
            return (
              <Link key={cat.id} href={'/products?category=' + encodeURIComponent(cat.name)}
                className="group flex flex-col items-center p-6 rounded-2xl border border-border bg-card hover:border-primary hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                  <Icon size={22} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-sm font-heading font-medium text-foreground text-center">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
