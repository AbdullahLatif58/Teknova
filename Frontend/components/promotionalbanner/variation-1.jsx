import Link from 'next/link';
import { useTheme } from '../../context/ThemeContext';
import { ArrowRight } from 'lucide-react';

export default function PromotionalBanner1() {
  const { variation } = useTheme();

  if (variation === 2) return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden border border-border">
          <img src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1200&h=500&fit=crop" alt="Gaming Setup"
            className="w-full h-64 md:h-96 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent flex items-center">
            <div className="p-8 md:p-12 max-w-lg">
              <span className="text-neon font-heading font-bold tracking-widest uppercase text-sm">Limited Drop</span>
              <h3 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4 tracking-wider">GAMING SETUP SALE</h3>
              <p className="text-muted-foreground mb-6">Up to 40% off on monitors, keyboards, and peripherals.</p>
              <Link href="/products?category=Peripherals" className="inline-flex items-center gap-2 bg-gradient-neon text-teknova-dark px-6 py-3 rounded-lg font-bold tracking-wide glow-neon">
                SHOP NOW <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  if (variation === 3) return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden glow-warm">
            <img src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=600&fit=crop" alt="iPad Pro" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-sm tracking-[0.3em] uppercase text-muted-foreground">Special Offer</span>
            <h3 className="font-heading text-4xl font-semibold text-foreground mt-2 mb-4 italic">Tablets That Inspire</h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">Experience the perfect canvas for creativity. Save up to 00 on selected tablets this season.</p>
            <Link href="/products?category=Tablets" className="inline-flex items-center gap-3 text-foreground font-heading text-lg border-b-2 border-primary pb-1 hover:gap-5 transition-all">
              Shop Tablets <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <section className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-foreground">
          <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=400&fit=crop" alt="MacBook" className="w-full h-64 md:h-80 object-cover opacity-40" />
          <div className="absolute inset-0 flex items-center justify-center text-center p-8">
            <div>
              <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">Limited Time</p>
              <h3 className="font-heading text-3xl md:text-5xl font-bold text-background mb-4">Up to 20% Off<br />MacBooks</h3>
              <Link href="/products?category=Laptops" className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-3.5 rounded-full font-medium hover:opacity-90 transition-opacity">
                Shop Laptops <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
