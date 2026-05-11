import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function FooterV2() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap size={20} className="text-neon" />
              <span className="font-heading font-bold text-foreground tracking-wider">TEKNOVA</span>
            </div>
            <p className="text-sm text-muted-foreground">Supercharged tech store.</p>
          </div>
          <div>
            <h5 className="font-heading font-semibold text-neon mb-3 text-xs tracking-widest uppercase">Categories</h5>
            <div className="flex flex-col gap-2">
              {['Smartphones','Laptops','Audio','Peripherals','Monitors'].map(c => (
                <Link key={c} href={`/products?category=${c}`} className="text-sm text-muted-foreground hover:text-neon transition-colors">{c}</Link>
              ))}
            </div>
          </div>
          <div>
            <h5 className="font-heading font-semibold text-neon mb-3 text-xs tracking-widest uppercase">Info</h5>
            <div className="flex flex-col gap-2">
              {[['About','/about'],['Privacy','/privacy'],['Terms','/terms'],['Contact','/contact']].map(([l,h]) => (
                <Link key={l} href={h} className="text-sm text-muted-foreground hover:text-neon transition-colors">{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <h5 className="font-heading font-semibold text-neon mb-3 text-xs tracking-widest uppercase">Account</h5>
            <div className="flex flex-col gap-2">
              {[['Dashboard','/account'],['Orders','/account/orders'],['Wishlist','/account/wishlist']].map(([l,h]) => (
                <Link key={l} href={h} className="text-sm text-muted-foreground hover:text-neon transition-colors">{l}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex justify-between items-center">
          <p className="text-xs text-muted-foreground">© 2026 Teknova</p>
          <div className="h-0.5 w-24 bg-gradient-neon rounded-full" />
        </div>
      </div>
    </footer>
  );
}
