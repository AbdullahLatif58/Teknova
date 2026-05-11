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

// Helper to extract a single clean URL from any image field
function optimizeImage(images) {
  if (!images) return 'https://placehold.co/600x600';
  try {
    const parsed = typeof images === 'string' ? JSON.parse(images) : images;
    const url = Array.isArray(parsed) ? parsed[0] : (typeof parsed === 'string' ? parsed : null);
    if (!url) return 'https://placehold.co/600x600';
    return url;
  } catch (e) {
    if (typeof images === 'string') return images;
    if (Array.isArray(images) && images[0]) return images[0];
    return 'https://placehold.co/600x600';
  }
}

export default function ProductDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { variation } = useTheme();
  const [activeTab, setActiveTab] = useState('Description');
  const [product, setProduct] = useState(null);
  const [activeVariant, setActiveVariant] = useState(null);
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
        // catData is now the array due to unwrapping
        const cats = Array.isArray(catData) ? catData : (catData.data || []);
        cats.forEach(c => { catMap[c.id] = c.name; });

        const p = await getProductBySlug(slug);
        if (!p || p.message) {
          setProduct(null);
          return;
        }

        // Extract colors and sizes from ALL variants
        const allVariants = [p.defaultVariant, ...(p.variants || [])].filter(Boolean);
        const colorsSet = new Set();
        const sizesSet = new Set();
        
        allVariants.forEach(v => {
           const specs = v.specifications ? (typeof v.specifications === 'string' ? JSON.parse(v.specifications) : v.specifications) : {};
           if (specs.color) colorsSet.add(specs.color);
           if (specs.size) sizesSet.add(specs.size);
           if (specs.sizes && Array.isArray(specs.sizes)) specs.sizes.forEach(s => sizesSet.add(s));
        });

        const mapped = {
          ...p,
          categoryName: catMap[p.category_id] || 'Other',
          allColors: [...colorsSet],
          allSizes: [...sizesSet],
          allVariants: allVariants
        };
        
        setProduct(mapped);
        setActiveVariant(p.defaultVariant || allVariants[0]);

        // Fetch related by category
        if (p.category_id) {
          const relData = await getProductsByCategory(p.category_id);
          if (relData && Array.isArray(relData)) {
            const mappedRel = relData.filter(rp => rp.id !== p.id).map(rp => ({
              id: rp.id,
              slug: rp.page_handle,
              name: rp.title,
              brand: 'Teknova',
              category: catMap[rp.category_id] || 'Other',
              price: Number(rp.price),
              image: optimizeImage(rp.images),
            }));
            setRelated(mappedRel);
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

  if (loading) return (
    <Layout><div className="pt-32 text-center text-muted-foreground">Loading product...</div></Layout>
  );

  if (!product) return (
    <Layout><div className="pt-32 text-center"><p className="text-muted-foreground">Product not found.</p></div></Layout>
  );

  const AI = aiMap[variation] || AISuggestions1;
  const Gallery = galleryMap[variation] || ImageGallery1;
  const Info = infoMap[variation] || ProductInfo1;
  const Related = relatedMap[variation] || RelatedProducts1;

  // Prepare display product merged with active variant
  const displayProduct = {
    id: product.id,
    name: product.title,
    brand: 'Teknova',
    category: product.categoryName,
    price: Number(activeVariant?.price || product.price),
    rating: 4.5,
    reviewCount: 15,
    image: (() => {
      // Try variant image_url first (it can be a JSON array or plain string)
      if (activeVariant?.image_url) {
        return optimizeImage(activeVariant.image_url);
      }
      // Fall back to product images array
      return optimizeImage(product.images);
    })(),
    images: (() => {
      if (!product.images) return [];
      try {
        const parsed = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
        return Array.isArray(parsed) ? parsed : [product.images];
      } catch (e) {
        return [product.images];
      }
    })(),
    stock: (activeVariant?.stock_quantity || product.total_stock) > 0 ? 'In Stock' : 'Out of Stock',
    description: product.description,
    colors: product.allColors,
    sizes: product.allSizes,
    specs: activeVariant?.specifications ? (typeof activeVariant.specifications === 'string' ? JSON.parse(activeVariant.specifications) : activeVariant.specifications) : {},
    variants: product.allVariants
  };

  const handleVariantChange = (color, size) => {
    const found = product.allVariants.find(v => {
      const vSpecs = v.specifications ? (typeof v.specifications === 'string' ? JSON.parse(v.specifications) : v.specifications) : {};
      const matchColor = !color || vSpecs.color === color;
      const matchSize = !size || vSpecs.size === size || (vSpecs.sizes && vSpecs.sizes.includes(size));
      return matchColor && matchSize;
    });
    if (found) setActiveVariant(found);
  };

  const tabCls = (t) => `px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${activeTab === t
    ? (variation === 2 ? 'border-neon text-neon' : 'border-primary text-foreground')
    : 'border-transparent text-muted-foreground hover:text-foreground'}`;

  return (
    <>
      <Head>
        <title>{displayProduct.name} — Teknova</title>
      </Head>
      <Layout>
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
              <Link href="/">Home</Link><ChevronRight size={12} />
              <Link href="/products">Products</Link><ChevronRight size={12} />
              <span className="text-foreground truncate">{displayProduct.name}</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <Gallery images={displayProduct.images.length > 0 ? displayProduct.images : [displayProduct.image]} alt={displayProduct.name} />
              <Info product={displayProduct} onVariantChange={handleVariantChange} />
            </div>

            <div className="border-b border-border mb-8">
              <div className="flex gap-0">
                {SPEC_TABS.map(t => <button key={t} onClick={() => setActiveTab(t)} className={tabCls(t)}>{t}</button>)}
              </div>
            </div>

            <div className="mb-16 max-w-3xl">
              {activeTab === 'Description' && <p className="text-muted-foreground leading-relaxed">{displayProduct.description}</p>}
              {activeTab === 'Specifications' && displayProduct.specs && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {Object.entries(displayProduct.specs).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2.5 border-b border-border text-sm">
                      <span className="text-muted-foreground font-medium">{k}</span>
                      <span className="text-foreground text-right">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'Reviews' && <ReviewsRatings product={displayProduct} />}
            </div>

            <Related products={related} currentId={displayProduct.id} />
            <AI product={displayProduct} />
          </div>
        </div>
      </Layout>
    </>
  );
}
