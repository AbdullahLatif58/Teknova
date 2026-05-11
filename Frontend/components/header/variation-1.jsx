import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Search, ShoppingCart, Heart, User, Menu, X, Mic, MicOff } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const navLinks = [
  { label: 'Shop',      href: '/products' },
  { label: 'Templates', href: '/templates' },
  { label: 'About',     href: '/about' },
  { label: 'Contact',   href: '/contact' },
];

export default function HeaderV1() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
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

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser.');
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      router.push(`/search?q=${encodeURIComponent(transcript)}`);
      setSearchOpen(false);
    };
    recognition.start();
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-xl shadow-sm' : 'bg-background/60 backdrop-blur-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-heading text-xl font-bold tracking-tight text-foreground">TEKNOVA</Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-full hover:bg-secondary transition-colors">
              <Search size={18} className="text-foreground" />
            </button>
            <Link href="/account" className="p-2 rounded-full hover:bg-secondary transition-colors hidden sm:block">
              <User size={18} className="text-foreground" />
            </Link>
            <Link href="/account/wishlist" className="p-2 rounded-full hover:bg-secondary transition-colors hidden sm:block">
              <Heart size={18} className="text-foreground" />
            </Link>
            <button onClick={() => setCartOpen(true)} className="p-2 rounded-full hover:bg-secondary transition-colors relative">
              <ShoppingCart size={18} className="text-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold">{totalItems}</span>
              )}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-full hover:bg-secondary transition-colors">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <form onSubmit={handleSearch} className="flex items-center gap-2 bg-secondary rounded-full px-4 py-2 border border-border focus-within:border-primary transition-colors">
              <Search size={16} className="text-muted-foreground" />
              <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..." className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground" />
              <button type="button" onClick={startVoiceSearch} className={'p-1 transition-colors ' + (isListening ? 'text-red-500 animate-pulse' : 'text-muted-foreground hover:text-foreground')}>
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </form>
          </div>
        )}

        {mobileOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="block px-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">{l.label}</Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
