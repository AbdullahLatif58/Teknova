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

export default function FeaturedCategories2() {
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

  return (
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
}
