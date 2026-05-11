'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit3, Trash2, Box, ArrowRight, Search, Loader2, Star, Layers } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { ProductVariant } from '@/types/variant';
import { Product } from '@/types/product';
import { getVariants, deleteVariant, updateVariant } from '@/app/api/variant/api';
import { getProducts } from '@/app/api/product/api';
import { useDialog } from '@/components/context/DialogContext';
import ProductSearchSelect from '@/components/ui/ProductSearchSelect';

export default function GlobalVariantsPage() {
  const router = useRouter();
  const { confirm, showToast } = useDialog();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingVariants, setLoadingVariants] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  // No need for initial global fetch of all products since ProductSearchSelect does it internally
  useEffect(() => {
    setLoadingProducts(false);
  }, []);

  // Load variants when a product is selected
  useEffect(() => {
    if (!selectedProduct) {
      setVariants([]);
      setSearchTerm('');
      return;
    }

    const fetchProductVariants = async () => {
      setLoadingVariants(true);
      try {
        const res = await getVariants(selectedProduct.id!);
        setVariants(res.variants || res.data || []);
      } catch (err) {
        showToast(`Failed to load variants for ${selectedProduct.title}`, 'error');
      } finally {
        setLoadingVariants(false);
      }
    };
    fetchProductVariants();
  }, [selectedProduct, showToast]);

  const handleProductSelect = (product: Product | null) => {
    setSelectedProduct(product);
    setSearchTerm('');
  };

  const handleDelete = async (id: string, name: string) => {
    const isConfirmed = await confirm({
      title: 'Delete Variant',
      message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      confirmLabel: 'Delete',
      variant: 'danger',
    });

    if (!isConfirmed) return;

    try {
      const success = await deleteVariant(id);
      if (success) {
        setVariants(prev => prev.filter(v => v.id !== id));
        showToast(`Variant "${name}" deleted successfully`, 'success');
      } else {
        showToast('Failed to delete variant', 'error');
      }
    } catch (err) {
      console.error('Delete variant error:', err);
      showToast('An error occurred during decommissioning', 'error');
    }
  };

  const handleSetDefault = async (variant: ProductVariant) => {
    if (variant.is_default) return;

    try {
      setVariants(prev => prev.map(v => ({
        ...v,
        is_default: v.id === variant.id ? 1 : 0
      })));

      await updateVariant(variant.id!, { ...variant, is_default: true });
      showToast(`${variant.title} is now the default configuration`, 'success');
    } catch (err) {
      showToast('Failed to update default variant', 'error');
      // Refresh to revert optimisitic update on failure
      const res = await getVariants(selectedProduct!.id!);
      setVariants(res.variants || res.data || []);
    }
  };

  const navigateToCreate = () => {
    if (selectedProduct) {
      router.push(`/products/${selectedProduct.page_handle}/variants/create`);
    } else {
      showToast('Select a product context first', 'warning');
    }
  };

  const navigateToEdit = (variantId: string) => {
    router.push(`/products/${selectedProduct!.page_handle}/variants/${variantId}/edit`);
  };

  const filteredVariants = variants.filter(v =>
    v.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.sku && v.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
            Global <span className="text-sky-500 font-black">Variants</span>
          </h2>
          <p className="text-sm text-zinc-500 mt-1 font-medium italic">Select a product context to manage its specific configurations.</p>
        </div>

        <Button
          onClick={navigateToCreate}
          icon={Plus}
          className="bg-sky-600 hover:bg-sky-500 shadow-[0_10px_30px_rgba(14,165,233,0.3)] transition-all"
          disabled={!selectedProduct}
        >
          Add Configuration
        </Button>
      </div>

      <Breadcrumb items={[
        { id: 'variants', label: 'Global Variants', href: '/variants' }
      ]} />

      <Card className="bg-[#0d0d14] border-zinc-800">
        <div className="p-6 border-b border-white/5 space-y-4">
          <label className="text-[10px] font-black uppercase text-sky-500 tracking-widest flex items-center gap-2">
            <Layers size={14} /> Active Product Context
          </label>
          <div className="flex flex-col md:flex-row items-center gap-4">
            {loadingProducts ? (
              <div className="flex items-center gap-2 text-zinc-500 text-sm italic font-medium">
                <Loader2 size={16} className="animate-spin text-sky-500" /> Synchronizing product catalog...
              </div>
            ) : (
              <div className="w-full md:w-1/2">
                <ProductSearchSelect
                  value={selectedProduct}
                  onChange={handleProductSelect}
                  placeholder="Type to search for a product..."
                />
              </div>
            )}

            {selectedProduct && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  icon={ArrowRight}
                  onClick={() => router.push(`/products/${selectedProduct.page_handle}/edit`)}
                >
                  View Product
                </Button>
              </>
            )}
          </div>

          {selectedProduct && (
            <div className="pt-2">
              <div className="relative w-full md:w-1/2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={16} className="text-zinc-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search variants by title or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#0a0a10] border border-zinc-800 rounded-xl text-zinc-300 text-sm focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          {!selectedProduct ? (
            <div className="p-16 text-center">
              <Box size={48} className="mx-auto text-zinc-800 mb-4" />
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs italic">Awaiting Context Selection</p>
              <p className="text-zinc-600 text-[10px] mt-2 max-w-sm mx-auto">Variants cannot exist independently. Please select a product from the dropdown above to view or deploy configurations.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-[#0a0a10] text-[10px] font-black uppercase text-zinc-600 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Configuration</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Pricing</th>
                  <th className="px-6 py-4 text-center">Stock</th>
                  <th className="px-6 py-4 text-center">Default</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loadingVariants ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Loader2 className="animate-spin text-sky-500 mx-auto" />
                    </td>
                  </tr>
                ) : filteredVariants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 font-medium italic">
                      No active configurations found for {selectedProduct.title}.
                    </td>
                  </tr>
                ) : (
                  filteredVariants.map(v => (
                    <tr key={v.id} className="group hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center">
                            {v.images && v.images.length > 0 ? (
                              <img src={v.images[0]} className="w-full h-full object-cover" />
                            ) : v.image_url ? (
                              <img src={v.image_url} className="w-full h-full object-cover" />
                            ) : (
                              <Box size={18} className="text-zinc-500" />
                            )}
                          </div>

                        </div>
                      </td>
                      <td className="px-6 py-4 text-[10px] font-mono font-bold text-zinc-500 uppercase">{v.sku || 'N/A'}</td>
                      <td className="px-6 py-4 font-black text-sky-400 text-xs italic">${Number(v.price).toFixed(2)}</td>
                      <td className="px-6 py-4 text-center text-xs font-black text-zinc-500 italic">
                        {v.stock} <span className="text-[10px] opacity-50 uppercase">Units</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleSetDefault(v)}
                          className={`transition-all ${v.is_default ? 'text-amber-500' : 'text-zinc-800 hover:text-zinc-600'}`}
                        >
                          <Star size={18} fill={v.is_default ? 'currentColor' : 'none'} />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center text-[10px]">
                        <Badge variant={v.is_active ? 'success' : 'default'}>{v.is_active ? 'ONLINE' : 'ARCHIVED'}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => navigateToEdit(v.id!)}
                            className="p-2 text-zinc-500 hover:text-white transition-colors"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => v.id && handleDelete(v.id, v.title)}
                            className="p-2 text-zinc-500 hover:text-rose-500 transition-colors"
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
          )}
        </div>
      </Card>
    </div>
  );
}
