import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import ProductCard from '../components/ui/ProductCard';
import { getProducts } from '../api/products';
import { searchAmazon } from '../api/amazon';
import { Mic, MicOff } from 'lucide-react';

const POPULAR = ['iPhone 15 Pro', 'MacBook Pro', 'Sony Headphones', 'Gaming Keyboard', 'iPad Pro'];

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const { variation } = useTheme();
  const [allProducts, setAllProducts] = useState([]);
  const [aiResults, setAiResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const data = await getProducts(100);
        if (data && data.products) {
          const mapped = data.products.map(p => ({
            id: p.id,
            slug: p.page_handle,
            name: p.title,
            brand: 'Teknova',
            category: p.category_id || 'Other',
            price: Number(p.price),
            rating: 4.5,
            reviewCount: 12,
            image: p.images && p.images[0] ? (typeof p.images === 'string' ? JSON.parse(p.images)[0] : p.images[0]) : 'https://via.placeholder.com/600',
            new: false,
            featured: p.is_featured === 1,
            tags: p.tags ? (typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags) : []
          }));
          setAllProducts(mapped);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (!q) return;
    const fetchAI = async () => {
      try {
        setAiLoading(true);
        const result = await searchAmazon(q, 4);
        if (result.success && result.data) {
          const mapped = result.data.map(p => ({
            id: p.asin,
            slug: `https://amazon.com/dp/${p.asin}`,
            name: p.title,
            price: parseFloat(p.price) || 0,
            image: p.image_url || 'https://via.placeholder.com/600',
            brand: 'Amazon AI Pick',
            rating: 4.5,
            reviewCount: 100,
            category: 'AI Suggestion'
          }));
          setAiResults(mapped);
        } else {
          setAiResults([]);
        }
      } catch (err) {
        console.error('AI search failed', err);
      } finally {
        setAiLoading(false);
      }
    };
    fetchAI();
  }, [q]);

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
      router.push(`/search?q=${encodeURIComponent(transcript)}`);
    };
    recognition.start();
  };

  const query = q?.toString().trim().toLowerCase() || '';

  const results = useMemo(() => {
    if (!query) return [];
    return allProducts.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      (p.tags || []).some(t => t.toLowerCase().includes(query))
    );
  }, [query, allProducts]);

  const aiPicks = useMemo(() => allProducts.filter(p => p.featured).slice(0, 4), [allProducts]);

  const accentCls = variation === 2 ? 'text-neon' : 'text-primary';
  const tagActiveCls = variation === 2
    ? 'bg-neon/10 border-neon/50 text-neon'
    : 'bg-primary/10 border-primary/50 text-primary';
  const tagCls = 'text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:border-foreground transition-colors';

  return (
    <>
      <Head>
        <title>{query ? `Search: "${q}" — Teknova` : 'Search — Teknova'}</title>
      </Head>
      <Layout>
        <div className="pt-28 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Search bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <form onSubmit={e => { e.preventDefault(); const v = e.target.elements.q.value.trim(); if (v) router.push(`/search?q=${encodeURIComponent(v)}`); }}>
                <div className={'flex items-center border rounded-2xl overflow-hidden bg-card ' + (variation === 2 ? 'border-border focus-within:border-neon' : 'border-border focus-within:border-primary') + ' transition-colors'}>
                  <Search size={18} className="ml-5 text-muted-foreground shrink-0" />
                  <input
                    name="q"
                    defaultValue={q}
                    placeholder="Search products, brands, categories..."
                    autoFocus
                    className="flex-1 bg-transparent px-4 py-4 text-foreground placeholder:text-muted-foreground outline-none text-base"
                  />
                  <button type="button" onClick={startVoiceSearch} className={'p-4 transition-colors ' + (isListening ? 'text-red-500 animate-pulse' : 'text-muted-foreground hover:text-foreground')}>
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                  <button type="submit" className={'px-6 py-4 font-medium text-sm transition-colors ' + (variation === 2 ? 'bg-gradient-neon text-teknova-dark font-bold' : 'bg-primary text-primary-foreground')}>
                    Search
                  </button>
                </div>
              </form>

              {/* Popular searches */}
              {!query && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Popular searches</p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR.map(term => (
                      <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} className={tagCls}>{term}</Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Results */}
            {query && (
              <div className="mb-16">
                <div className="flex items-center justify-between mb-6">
                  <h2 className={'font-heading text-2xl font-bold text-foreground ' + (variation === 3 ? 'italic' : '')}>
                    {results.length > 0
                      ? <>{variation === 2 ? <span className="text-gradient-neon">{results.length} Results</span> : `${results.length} Results`} for &ldquo;{q}&rdquo;</>
                      : <>No results for &ldquo;{q}&rdquo;</>}
                  </h2>
                </div>

                {results.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {results.map(p => <ProductCard key={p.id} product={p} />)}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-secondary rounded-2xl">
                    <Search size={48} className="text-muted-foreground mx-auto mb-4" />
                    <p className="font-heading text-lg font-semibold text-foreground mb-2">Nothing found</p>
                    <p className="text-muted-foreground text-sm mb-6">Try different keywords or browse our categories</p>
                    <Link href="/products" className={'inline-block px-6 py-2.5 rounded-full font-medium text-sm ' + (variation === 2 ? 'bg-gradient-neon text-teknova-dark' : 'bg-primary text-primary-foreground')}>
                      Browse All Products
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* AI Results Section */}
            {query && (
              <div className="aipicls mb-16 rounded-2xl p-8 bg-secondary/50 border border-border/50">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles size={18} className={accentCls} />
                  <h3 className={'font-heading text-xl font-bold text-foreground ' + (variation === 3 ? 'italic' : '')}>
                    {variation === 2 ? <span className="text-gradient-neon">AI Global Results</span> : 'AI Global Results'}
                  </h3>
                  {aiLoading && <div className="ml-2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>}
                </div>
                {aiResults.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {aiResults.map(p => <ProductCard key={p.id} product={p} />)}
                  </div>
                ) : !aiLoading && (
                  <p className="text-sm text-muted-foreground italic">No global AI results found for this query.</p>
                )}
              </div>
            )}

            {/* AI Picks Section (Static/Featured) */}
            <section className={'rounded-2xl p-8 ' + (variation === 2 ? 'bg-secondary border border-border' : variation === 3 ? 'bg-secondary' : 'bg-secondary')}>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles size={18} className={accentCls} />
                <h3 className={'font-heading text-xl font-bold text-foreground ' + (variation === 3 ? 'italic' : '')}>
                  {variation === 2 ? <span className="text-gradient-neon">AI Picks For You</span> : 'AI Picks For You'}
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {aiPicks.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>

          </div>
        </div>
      </Layout>
    </>
  );
}
