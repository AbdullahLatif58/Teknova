'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import VariantForm from '@/components/form/VariantForm';
import { updateVariant, getVariants } from '@/app/api/variant/api';
import { getProductBySlug } from '@/app/api/product/api';
import { ProductVariant } from '@/types/variant';
import { Product } from '@/types/product';
import { useDialog } from '@/components/context/DialogContext';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function EditVariantPage() {
  const router = useRouter();
  const params = useParams();
  const handle = params.slug as string;
  const variantId = params.variantId as string;
  const { showToast } = useDialog();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [initialData, setInitialData] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const prod = await getProductBySlug(handle);
        if (!prod) {
          showToast('Product context not found', 'error');
          router.push('/products');
          return;
        }
        setProduct(prod);

        const res = await getVariants(prod.id!);
        const list = res.variants || res.data || [];
        const variant = list.find((v: ProductVariant) => v.id === variantId);
        
        if (!variant) {
          showToast('Configuration not found', 'error');
          router.push(`/products/${handle}/variants`);
          return;
        }
        setInitialData(variant);
      } catch (err) {
        showToast('Failed to load configuration context', 'error');
      } finally {
        setInitialLoading(false);
      }
    };
    loadData();
  }, [handle, variantId, router, showToast]);

  const handleSubmit = async (data: ProductVariant, imageFiles?: File[]) => {
    setLoading(true);
    try {
      await updateVariant(variantId, data, imageFiles);
      showToast('Configuration updated successfully', 'success');
      router.push(`/products/${handle}/variants`);
    } catch (err: any) {
      console.error('Variant update error:', err);
      showToast(err.response?.data?.error?.message || 'Failed to update configuration', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="p-10 text-center animate-pulse text-zinc-500 uppercase font-black text-xs tracking-widest italic">Synchronizing configuration...</div>;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[
        { id: 'products', label: 'Products', href: '/products' },
        { id: 'variants', label: `${product?.title || 'Product'} Variants`, href: `/products/${handle}/variants` },
        { id: 'edit', label: `Refine ${initialData?.title || 'Configuration'}` }
      ]} />
      
      {product && initialData && (
        <VariantForm 
          productId={product.id!}
          initialProduct={product}
          initialData={initialData}
          onSubmit={handleSubmit} 
          loading={loading}
        />
      )}
    </div>
  );
}
