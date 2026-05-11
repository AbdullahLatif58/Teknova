import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useTheme } from '../../context/ThemeContext';
import ImageGallery1 from '../../components/imagegallery/variation-1';
import ImageGallery2 from '../../components/imagegallery/variation-2';
import ImageGallery3 from '../../components/imagegallery/variation-3';
import ProductInfo1 from '../../components/productinfo/variation-1';
import ProductInfo2 from '../../components/productinfo/variation-2';
import ProductInfo3 from '../../components/productinfo/variation-3';
import RelatedProducts1 from '../../components/relatedproducts/variation-1';
import RelatedProducts2 from '../../components/relatedproducts/variation-2';
import RelatedProducts3 from '../../components/relatedproducts/variation-3';
import ReviewsRatings from '../../components/reviewsratings/variation-1';
import AISuggestions1 from '../../components/aisuggestions/variation-1';
import AISuggestions2 from '../../components/aisuggestions/variation-2';
import AISuggestions3 from '../../components/aisuggestions/variation-3';
import ProductCard from '../../components/ui/ProductCard';
import { ChevronRight } from 'lucide-react';
import { getCategories } from '../../api/categories';
import { getProductBySlug, getProductsByCategory } from '../../api/products';

const aiMap = { 1: AISuggestions1, 2: AISuggestions2, 3: AISuggestions3 };
const galleryMap = { 1: ImageGallery1, 2: ImageGallery2, 3: ImageGallery3 };
const infoMap = { 1: ProductInfo1, 2: ProductInfo2, 3: ProductInfo3 };
const relatedMap = { 1: RelatedProducts1, 2: RelatedProducts2, 3: RelatedProducts3 };

const SPEC_TABS = ['Description', 'Specifications', 'Reviews'];

export default function ProductDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { variation } = useTheme();
  const [activeTab, setActiveTab] = useState('Description');
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Fetch categories for name mapping
        const catData = await getCategories();
        const catMap = {};
        if (catData.success && catData.data) {
          catData.data.forEach(c => { catMap[c.id] = c.name; });
        }

        const p = await getProductBySlug(slug);
        if (!p || p.message) {
          setProduct(null);
          return;
        }

        // Extract colors and sizes from variants
        const allVariants = [p.defaultVariant, ...(p.variants || [])].filter(Boolean);
        const colorsSet = new Set();
        const sizesSet = new Set();
        for (const v of allVariants) {
          const specs = v.specifications
            ? (typeof v.specifications === 'string' ? JSON.parse(v.specifications) : v.specifications)
            : {};
          if (specs.color) colorsSet.add(specs.color);
          if (specs.sizes && Array.isArray(specs.sizes)) {
            specs.sizes.forEach(s => sizesSet.add(s));
          }
        }

        const mapped = {
          id: p.id,
          slug: p.page_handle,
          name: p.title,
          brand: 'Teknova',
          category: catMap[p.category_id] || 'Other',
          price: Number(p.price),
          compareAt: null,
          rating: p.popularity ? 4.5 : 4.0,
          reviewCount: 15,
          image: p.images && p.images[0] ? (typeof p.images === 'string' ? JSON.parse(p.images)[0] : p.images[0]) : 'https://via.placeholder.com/600',
          images: p.images ? (typeof p.images === 'string' ? JSON.parse(p.images) : p.images) : [],
          stock: p.total_stock > 0 ? 'In Stock' : 'Out of Stock',
          new: false,
          featured: p.is_featured === 1,
          description: p.description || 'No description available.',
          longDescription: p.description || 'No detailed description available.',
          specs: p.defaultVariant?.specifications
            ? (typeof p.defaultVariant.specifications === 'string' ? JSON.parse(p.defaultVariant.specifications) : p.defaultVariant.specifications)
            : {},
          colors: [...colorsSet],
          sizes: [...sizesSet],
          tags: p.tags ? (typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags) : []
        };
        setProduct(mapped);

        // Fetch related by category
        if (p.category_id) {
          const relData = await getProductsByCategory(p.category_id);
          if (relData && Array.isArray(relData)) {
            const mappedCat = relData.filter(rp => rp.id !== p.id).map(rp => ({
              id: rp.id,
              slug: rp.page_handle,
              name: rp.title,
              brand: 'Teknova',
              category: catMap[rp.category_id] || 'Other',
              price: Number(rp.price),
              compareAt: null,
              rating: rp.popularity ? 4.5 : 4.0,
              reviewCount: 0,
              image: rp.images && rp.images[0] ? (typeof rp.images === 'string' ? JSON.parse(rp.images)[0] : rp.images[0]) : 'https://via.placeholder.com/600',
              images: rp.images ? (typeof rp.images === 'string' ? JSON.parse(rp.images) : rp.images) : [],
            }));
            setRelated(mappedCat);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const AI = aiMap[variation] || AISuggestions1;
  const Gallery = galleryMap[variation] || ImageGallery1;
  const Info = infoMap[variation] || ProductInfo1;
  const Related = relatedMap[variation] || RelatedProducts1;

  // Track recently viewed
  useEffect(() => {
    if (!product) return;
    const key = 'teknova-recently-viewed';
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = [product.id, ...stored.filter(id => id !== product.id)].slice(0, 5);
    localStorage.setItem(key, JSON.stringify(updated));
    // Not fetching full data for recently viewed for now, just storing ids
  }, [product]);

  if (loading) return (
    <Layout>
      <div className="pt-32 text-center text-muted-foreground">Loading product...</div>
    </Layout>
  );

  if (!product) return (
    <Layout>
      <div className="pt-32 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link href="/products" className="text-primary hover:underline mt-4 inline-block">← Back to Products</Link>
      </div>
    </Layout>
  );

  const tabCls = (t) => `px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${activeTab === t
    ? (variation === 2 ? 'border-neon text-neon' : 'border-primary text-foreground')
    : 'border-transparent text-muted-foreground hover:text-foreground'}`;

  return (
    <>
      <Head>
        <title>{product.name} — Teknova</title>
        <meta name="description" content={product.description} />
      </Head>
      <Layout>
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight size={12} />
              <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
              <ChevronRight size={12} />
              <Link href={`/products?category=${product.category}`} className="hover:text-foreground transition-colors">{product.category}</Link>
              <ChevronRight size={12} />
              <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
            </nav>

            {/* Main grid: gallery + info */}
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <Gallery images={product.images.length > 0 ? product.images : [product.image]} alt={product.name} />
              <Info product={product} />
            </div>

            {/* Tabs: Description / Specifications / Reviews */}
            <div className="border-b border-border mb-8">
              <div className="flex gap-0">
                {SPEC_TABS.map(t => (
                  <button key={t} onClick={() => setActiveTab(t)} className={tabCls(t)}>{t}</button>
                ))}
              </div>
            </div>

            <div className="mb-16 max-w-3xl">
              {activeTab === 'Description' && (
                <div>
                  <p className="text-muted-foreground leading-relaxed mb-4">{product.longDescription || product.description}</p>
                </div>
              )}
              {activeTab === 'Specifications' && product.specs && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2.5 border-b border-border text-sm">
                      <span className="text-muted-foreground font-medium">{k}</span>
                      <span className="text-foreground text-right max-w-[55%]">{v}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'Reviews' && <ReviewsRatings product={product} />}
            </div>

            {/* Related Products Section */}
            <Related products={[]} currentId={product.id} />

            {/* AI Suggestions */}
            {product && <AI product={product} />}

            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
              <section className="py-12">
                <h2 className={'font-heading text-2xl font-bold text-foreground mb-8 ' + (variation === 3 ? 'italic' : '')}>
                  {variation === 2 ? <span className="text-gradient-neon">Recently Viewed</span> : 'Recently Viewed'}
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {recentlyViewed.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              </section>
            )}

          </div>
        </div>
      </Layout>
    </>
  );
}

