import Link from 'next/link';

export default function FooterV1() {
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-heading font-bold text-foreground mb-4">TEKNOVA</h4>
            <p className="text-sm text-muted-foreground">Premium tech for the modern world.</p>
          </div>
          <div>
            <h5 className="font-heading font-semibold text-foreground mb-3 text-sm">Shop</h5>
            <div className="flex flex-col gap-2">
              {['Smartphones','Laptops','Audio','Wearables','Monitors'].map(c => (
                <Link key={c} href={`/products?category=${c}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{c}</Link>
              ))}
            </div>
          </div>
          <div>
            <h5 className="font-heading font-semibold text-foreground mb-3 text-sm">Company</h5>
            <div className="flex flex-col gap-2">
              {[['About','/about'],['Privacy','/privacy'],['Terms','/terms'],['Contact','/contact']].map(([l,h]) => (
                <Link key={l} href={h} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <h5 className="font-heading font-semibold text-foreground mb-3 text-sm">Account</h5>
            <div className="flex flex-col gap-2">
              {[['My Account','/account'],['Orders','/account/orders'],['Wishlist','/account/wishlist'],['Settings','/account/settings']].map(([l,h]) => (
                <Link key={l} href={h} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">© 2026 Teknova. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
