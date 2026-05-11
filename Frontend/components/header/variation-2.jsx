import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Search, ShoppingCart, Heart, User, Menu, X, Zap } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const navLinks = [
  { label: 'SHOP',      href: '/products' },
  { label: 'THEMES',    href: '/templates' },
  { label: 'ABOUT',     href: '/about' },
  { label: 'CONTACT',   href: '/contact' },
];

export default function HeaderV2() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems, setCartOpen } = useCart();
  const router = useRouter();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/90 backdrop-blur-xl' : 'bg-background/70 backdrop-blur-md'}`}>
      <div className="h-0.5 bg-gradient-neon w-full" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold tracking-wider text-foreground">
            <Zap size={22} className="text-neon" /> TEKNOVA
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} className="text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-neon transition-colors">{l.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:text-neon transition-colors">
              <Search size={18} />
            </button>
            <Link href="/account" className="p-2 hover:text-neon transition-colors hidden sm:block"><User size={18} /></Link>
            <button onClick={() => setCartOpen(true)} className="relative p-2 hover:text-neon transition-colors">
              <ShoppingCart size={18} />
              {totalItems > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-neon text-teknova-dark text-[10px] rounded-full flex items-center justify-center font-bold">{totalItems}</span>}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
  {(() => {
    const Icon = mobileOpen ? X : Menu;
    return <Icon size={18} />;
  })()}
</button>
          </div>
        </div>
        {searchOpen && (
          <div className="pb-3">
            <form onSubmit={handleSearch} className="flex items-center gap-2 bg-secondary border border-border rounded-lg px-4 py-2">
              <Search size={15} className="text-neon" />
              <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search tech..." className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground" />
            </form>
          </div>
        )}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="block px-2 py-2 text-sm uppercase tracking-wider text-muted-foreground hover:text-neon transition-colors">{l.label}</Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
