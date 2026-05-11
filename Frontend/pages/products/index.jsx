import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { useTheme } from '../../context/ThemeContext';
import FiltersSidebar1 from '../../components/filterssidebar/variation-1';
import FiltersSidebar2 from '../../components/filterssidebar/variation-2';
import FiltersSidebar3 from '../../components/filterssidebar/variation-3';
import ProductGrid1 from '../../components/productgrid/variation-1';
import ProductGrid2 from '../../components/productgrid/variation-2';
import ProductGrid3 from '../../components/productgrid/variation-3';
import { SlidersHorizontal } from 'lucide-react';
import { getCategories } from '../../api/categories';
import { getProducts, getFeaturedProducts, getNewProducts, getProductsByCategory } from '../../api/products';

const sidebars = { 1: FiltersSidebar1, 2: FiltersSidebar2, 3: FiltersSidebar3 };
const grids = { 1: ProductGrid1, 2: ProductGrid2, 3: ProductGrid3 };

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rating' },
  { value: 'newest', label: 'Newest' },
];

export default function ProductsPage() {
  const { variation } = useTheme();
  const router = useRouter();
  const { category: qCat, q } = router.query;

  const [filters, setFilters] = useState({ category: qCat || '', brands: [], priceMin: null, priceMax: null });
  const [sort, setSort] = useState('featured');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [catList, setCatList] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        // data is now the array due to our API helper unwrapping
        if (Array.isArray(data)) {
          setCatList(data);
        } else if (data && data.success && data.data) {
          setCatList(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCats();
  }, []);

  const catMap = useMemo(() => {
    const map = {};
    catList.forEach(c => { map[c.id] = c.name; });
    return map;
  }, [catList]);

  const catIdMap = useMemo(() => {
    const map = {};
    catList.forEach(c => { map[c.name] = c.id; });
    return map;
  }, [catList]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        let data;
        const categoryId = filters.category ? catIdMap[filters.category] : undefined;

        if (categoryId) {
          data = await getProductsByCategory(categoryId);
        } else if (sort === 'featured') {
          data = await getFeaturedProducts();
        } else if (sort === 'newest') {
          data = await getNewProducts();
        } else {
          data = await getProducts(100);
        }

        if (data) {
          const productsArray = Array.isArray(data) ? data : data.products || [];
          const mapped = productsArray.map(p => ({
            id: p.id,
            slug: p.page_handle,
            name: p.title,
            brand: 'Teknova',
            category: catMap[p.category_id] || 'Other',
            category_id: p.category_id,
            price: Number(p.price),
            compareAt: null,
            rating: p.popularity ? 4.5 : 4.0,
            reviewCount: 0,
            image: p.images && p.images[0] ? (typeof p.images === 'string' ? JSON.parse(p.images)[0] : p.images[0]) : 'https://placehold.co/600x600',
            images: p.images ? (typeof p.images === 'string' ? JSON.parse(p.images) : p.images) : [],
            stock: p.total_stock > 0 ? 'In Stock' : 'Out of Stock',
            new: false,
            featured: p.is_featured === 1,
            description: p.description,
            longDescription: p.description,
            specs: {},
            colors: [],
            sizes: [],
            tags: []
          }));
          setAllProducts(mapped);
        } else {
          setAllProducts([]);
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters.category, sort, q, catIdMap]);

  const Sidebar = sidebars[variation] || FiltersSidebar1;
  const Grid = grids[variation] || ProductGrid1;

  const handleFilter = (key, value) => {
    if (key === 'price') setFilters(p => ({ ...p, priceMin: value?.min ?? null, priceMax: value?.max ?? null }));
    else setFilters(p => ({ ...p, [key]: value }));
  };
  const clearFilters = () => setFilters({ category: '', brands: [], priceMin: null, priceMax: null });

  const filtered = useMemo(() => {
    let list = [...allProducts];
    const search = q?.toString().toLowerCase();
    if (search) list = list.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.brand.toLowerCase().includes(search) ||
      p.category.toLowerCase().includes(search));
    
    // Sidebar filters
    if (filters.brands?.length) list = list.filter(p => filters.brands.includes(p.brand));
    if (filters.priceMin != null) list = list.filter(p => p.price >= filters.priceMin);
    if (filters.priceMax != null && filters.priceMax !== Infinity) list = list.filter(p => p.price <= filters.priceMax);
    
    // Manual sorting for price if not handled by API
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    
    return list;
  }, [allProducts, filters.brands, filters.priceMin, filters.priceMax, sort, q]);

  const selectCls = variation === 2
    ? 'bg-secondary border border-border text-foreground text-sm px-3 py-2 rounded-lg outline-none'
    : 'bg-card border border-border text-foreground text-sm px-3 py-2 rounded-xl outline-none';

  return (
    <>
      <Head><title>{filters.category ? `${filters.category} — Teknova` : 'All Products — Teknova'}</title></Head>
      <Layout>
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <h1 className={'font-heading text-3xl font-bold text-foreground ' + (variation === 3 ? 'italic' : '')}>
                  {variation === 2
                    ? <span className="text-gradient-neon">{filters.category || 'All Products'}</span>
                    : (filters.category || 'All Products')}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">{loading ? 'Loading...' : `${filtered.length} products`}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <SlidersHorizontal size={16} /> {sidebarOpen ? 'Hide' : 'Show'} Filters
                </button>
                <select value={sort} onChange={e => setSort(e.target.value)} className={selectCls}>
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-8">
              {sidebarOpen && <Sidebar filters={filters} onFilterChange={handleFilter} onClear={clearFilters} categories={catList} />}
              <div className="flex-1 min-w-0">
                {loading ? (
                  <div className="py-20 text-center text-muted-foreground">Loading products...</div>
                ) : (
                  <Grid products={filtered} />
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
