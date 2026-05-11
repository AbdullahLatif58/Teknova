'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plus, Edit3, Trash2, Box, ArrowLeft, Loader2, Star } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { ProductVariant } from '@/types/variant';
import { getVariants, deleteVariant, updateVariant } from '@/app/api/variant/api';
import { getProductBySlug } from '@/app/api/product/api';
import { useDialog } from '@/components/context/DialogContext';
import { Product } from '@/types/product';

export default function VariantsPage() {
  const router = useRouter();
  const params = useParams();
  const handle = params.slug as string;
  const { confirm, showToast } = useDialog();

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const prod = await getProductBySlug(handle);
        if (!prod) {
          showToast('Product not found', 'error');
          router.push('/products');
          return;
        }
        setProduct(prod);
        
        const res = await getVariants(prod.id!);
        // Backend returns variants in .data or .variants
        setVariants(res.variants || res.data || []);
      } catch (err) {
        console.error('Failed to load variants:', err);
        showToast('Failed to load variants', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [handle, router, showToast]);

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
      // Logic for setting default: update local first for speed
      setVariants(prev => prev.map(v => ({
        ...v,
        is_default: v.id === variant.id ? 1 : 0
      })));

      await updateVariant(variant.id!, { ...variant, is_default: true });
      showToast(`${variant.title} is now the default configuration`, 'success');
    } catch (err) {
      showToast('Failed to update default variant', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/products')}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
              Variants: <span className="text-sky-500 font-black">{product?.title || 'Loading...'}</span>
            </h2>
          </div>
        </div>
        <Button 
          onClick={() => router.push(`/products/${handle}/variants/create`)} 
          icon={Plus}
          className="bg-sky-600 hover:bg-sky-500 shadow-[0_10px_30px_rgba(14,165,233,0.3)]"
          disabled={!product}
        >
          Add Configuration
        </Button>
      </div>

      <Breadcrumb items={[
        { id: 'products', label: 'Products', href: '/products' },
        { id: 'product', label: product?.title || 'Product', href: `/products/${handle}/edit` },
        { id: 'variants', label: 'Variants' }
      ]} />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0d0d14] text-[10px] font-black uppercase text-zinc-600 border-b border-white/5">
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center">
                    <Loader2 className="animate-spin text-sky-500 mx-auto" />
                  </td>
                </tr>
              ) : variants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-zinc-500 font-medium italic">
                    No active configurations found for this unit.
                  </td>
                </tr>
              ) : (
                variants.map(v => (
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
                        <span className="font-black text-zinc-200 text-xs italic">{v.title}</span>
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
                          onClick={() => router.push(`/products/${handle}/variants/${v.id}/edit`)}
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
        </div>
      </Card>
    </div>
  );
}
