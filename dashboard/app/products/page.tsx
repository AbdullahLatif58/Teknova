'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, Download, Package, Edit3, Layers, LayoutGrid, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { getProducts, deleteProduct, searchProducts } from '@/app/api/product/api';
import { getCategories } from '@/app/api/category/api';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import { useDialog } from '@/components/context/DialogContext';

export default function ProductsPage() {
  const router = useRouter();
  const { confirm, showToast } = useDialog();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0 });

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodData, catData] = await Promise.all([
        getProducts(1, 100), // Get first 100 for now
        getCategories()
      ]);
      setProducts(prodData?.products || prodData?.data || []);
      setStats({ total: prodData?.total || 0 });
      setCategories(catData || []);
    } catch (err) {
      console.error('Failed to sync engine data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleSearch = async (val: string) => {
    setSearchTerm(val);
    if (val.trim().length > 2) {
      setLoading(true);
      try {
        const results = await searchProducts(val);
        setProducts(results.products || results.data || []);
      } catch (err) {
        console.error('Search failure:', err);
      } finally {
        setLoading(false);
      }
    } else if (val.trim().length === 0) {
      fetchInitialData();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const isConfirmed = await confirm({
      title: 'Delete Product',
      message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
    });

    if (!isConfirmed) return;

    try {
      const success = await deleteProduct(id);
      if (success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast(`Product "${name}" decommissioned successfully`, 'success');
      }
    } catch (err) {
      showToast('Failed to decommission product unit.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic flex items-center gap-2">
            <LayoutGrid className="text-violet-600" />
            Products <span className="text-violet-600">Inventory</span>
          </h2>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
            Managing {stats.total} total units in the system.
          </p>
        </div>
        <Button icon={Plus} onClick={() => router.push('/products/create')}>Add Product</Button>
      </div>

      <Breadcrumb items={[{ id: 'categories', label: 'Categories' }, { id: 'products', label: 'Products' }]} />
      
      <div className="flex flex-col md:flex-row gap-4">
        <Input 
          icon={Search} 
          placeholder="Search products..." 
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className="flex gap-4">
          <Button variant="outline" icon={Filter} className="whitespace-nowrap">Filter</Button>
          <Button variant="outline" icon={Download} className="whitespace-nowrap">Export</Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0d0d14] text-[10px] font-black uppercase text-zinc-600 border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Product Unit</th>
                <th className="px-6 py-4">Handle</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Pricing</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-center">Deploy</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-zinc-500 font-medium italic">Synchronizing assets...</td>
                </tr>
              ) : products?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-zinc-500 font-medium">No units found in search index.</td>
                </tr>
              ) : (
                products.map(p => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center text-zinc-500">
                          {p.images && p.images.length > 0 ? (
                            <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                          ) : p.image_url ? (
                            <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={18} />
                          )}
                        </div>
                        <span className="font-black text-zinc-200 text-xs">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-mono font-bold text-zinc-500">{p.page_handle}</td>
                    <td className="px-6 py-4">
                      <Badge variant="info">
                        {categories.find(c => String(c.id) === String(p.category_id))?.name || 'Segment'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-black text-emerald-400 text-xs">
                      ${typeof p.price === 'string' ? parseFloat(p.price).toFixed(2) : p.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center text-xs font-black text-zinc-500">
                      {p.total_stock} <span className="text-[10px] opacity-50 uppercase">Units</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={p.is_active ? 'success' : 'default'}>{p.is_active ? 'Active' : 'Offline'}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" icon={Layers} onClick={() => router.push(`/products/${p.page_handle}/variants`)}>Variants</Button>
                        <button 
                          className="p-2 text-zinc-500 hover:text-white transition-colors"
                          onClick={() => router.push(`/products/${p.page_handle}/edit`)}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          className="p-2 text-zinc-500 hover:text-rose-500 transition-colors"
                          onClick={() => p.id && handleDelete(p.id, p.title)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
