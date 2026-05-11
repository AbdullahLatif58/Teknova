import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function HeroV1() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <span className="inline-block text-sm font-medium tracking-widest uppercase text-primary mb-4">New Arrival</span>
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-foreground mb-6">
              The Future<br /><span className="text-primary">Is Here.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md font-body">
              Discover the latest in technology. Premium devices engineered for those who demand excellence.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-medium hover:opacity-90 transition-opacity">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link href="/products?category=Smartphones" className="inline-flex items-center gap-2 border border-border text-foreground px-8 py-3.5 rounded-full font-medium hover:bg-secondary transition-colors">
                Explore Phones
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-background shadow-2xl">
              <img src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop" alt="iPhone 15 Pro" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-card rounded-2xl p-4 shadow-lg border border-border">
              <p className="text-xs text-muted-foreground">Starting from</p>
              <p className="text-2xl font-heading font-bold text-foreground">$1,199</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
