import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const navLeft = [
  { label: 'Shop',    href: '/products' },
  { label: 'Themes',  href: '/templates' },
];
const navRight = [
  { label: 'About',   href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function HeaderV3() {
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-background/90 backdrop-blur-xl shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <nav className="hidden md:flex items-center gap-8">
            {navLeft.map(l => (
              <Link key={l.href} href={l.href} className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors font-body">{l.label}</Link>
            ))}
          </nav>
          <Link href="/" className="font-heading text-2xl font-semibold tracking-wide text-foreground italic">Teknova</Link>
          <div className="hidden md:flex items-center gap-8">
            {navRight.map(l => (
              <Link key={l.href} href={l.href} className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors font-body">{l.label}</Link>
            ))}
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-1 text-muted-foreground hover:text-foreground transition-colors"><Search size={18} /></button>
            <Link href="/account" className="text-muted-foreground hover:text-foreground transition-colors"><User size={18} /></Link>
            <button onClick={() => setCartOpen(true)} className="relative text-muted-foreground hover:text-foreground transition-colors">
              <ShoppingCart size={18} />
              {totalItems > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">{totalItems}</span>}
            </button>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-foreground">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {searchOpen && (
          <div className="pb-4 max-w-md mx-auto">
            <form onSubmit={handleSearch} className="border-b border-border flex items-center gap-2 pb-2">
              <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..." className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground font-heading italic" />
              <Search size={16} className="text-muted-foreground" />
            </form>
          </div>
        )}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-6 space-y-4">
            {[...navLeft, ...navRight].map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors italic">{l.label}</Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
