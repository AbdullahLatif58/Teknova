import Link from 'next/link';

export default function FooterV3() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h4 className="font-heading text-3xl font-semibold text-foreground italic mb-4">Teknova</h4>
            <p className="text-muted-foreground font-body max-w-sm leading-relaxed">
              A curated collection of premium technology. Crafted for those who appreciate the finer details.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h5 className="font-heading text-sm font-semibold text-foreground mb-4">Explore</h5>
              <div className="flex flex-col gap-3">
                {['Smartphones','Laptops','Audio','Tablets','Wearables'].map(c => (
                  <Link key={c} href={`/products?category=${c}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{c}</Link>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-heading text-sm font-semibold text-foreground mb-4">Company</h5>
              <div className="flex flex-col gap-3">
                {[['About','/about'],['Privacy','/privacy'],['Terms','/terms'],['Contact','/contact'],['Account','/account']].map(([l,h]) => (
                  <Link key={l} href={h} className="text-sm text-muted-foreground hover:text-primary transition-colors">{l}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground italic">© 2026 Teknova. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
