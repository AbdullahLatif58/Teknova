import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroV3() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 animate-fade-in-up">
            <span className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6 block font-body">Curated Technology</span>
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-semibold leading-tight text-foreground mb-8 italic">
              Elegance in<br />Every Detail
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-md font-body leading-relaxed">
              Handpicked tech that blends craftsmanship with innovation. Experience devices that inspire.
            </p>
            <Link href="/products" className="inline-flex items-center gap-3 text-foreground font-heading text-lg border-b-2 border-primary pb-1 hover:gap-5 transition-all">
              Discover the Collection <ArrowRight size={20} />
            </Link>
          </div>
          <div className="order-1 lg:order-2">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden glow-warm">
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=1000&fit=crop" alt="Premium Audio" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
