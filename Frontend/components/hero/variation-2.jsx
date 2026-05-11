import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

export default function HeroV2() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-neon/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 w-full text-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-secondary border border-border rounded-full px-4 py-1.5 mb-8">
            <Zap size={14} className="text-neon" />
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Supercharged Tech</span>
          </div>
          <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-bold leading-none mb-6">
            <span className="text-foreground">POWER</span><br />
            <span className="text-gradient-neon">UNLEASHED</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto font-body">
            Next-gen devices. Unmatched performance. Shop the cutting edge of technology.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products" className="inline-flex items-center gap-2 bg-gradient-neon text-teknova-dark px-8 py-3.5 rounded-lg font-bold tracking-wide hover:opacity-90 transition-opacity glow-neon">
              SHOP NOW <ArrowRight size={18} />
            </Link>
            <Link href="/products?category=Laptops" className="inline-flex items-center gap-2 border border-border text-foreground px-8 py-3.5 rounded-lg font-semibold tracking-wide hover:border-neon hover:text-neon transition-colors">
              EXPLORE
            </Link>
          </div>
        </div>
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
            <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=600&fit=crop" alt="MacBook Pro" className="w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
