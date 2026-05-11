'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import VariantForm from '@/components/form/VariantForm';
import { createVariant } from '@/app/api/variant/api';
import { getProductBySlug } from '@/app/api/product/api';
import { ProductVariant } from '@/types/variant';
import { Product } from '@/types/product';
import { useDialog } from '@/components/context/DialogContext';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function CreateVariantPage() {
  const router = useRouter();
  const params = useParams();
  const handle = params.slug as string;
  const { showToast } = useDialog();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const prod = await getProductBySlug(handle);
        if (!prod) {
          showToast('Product context not found', 'error');
          router.push('/products');
          return;
        }
        setProduct(prod);
      } catch (err) {
        showToast('Failed to load product context', 'error');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProduct();
  }, [handle, router, showToast]);

  const handleSubmit = async (data: ProductVariant, imageFiles?: File[]) => {
    setLoading(true);
    try {
      await createVariant(data, imageFiles);
      showToast('Configuration deployed successfully', 'success');
      router.push(`/products/${handle}/variants`);
    } catch (err: any) {
      console.error('Variant creation error:', err);
      showToast(err.response?.data?.error?.message || 'Failed to deploy variant', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="p-10 text-center animate-pulse text-zinc-500 uppercase font-black text-xs tracking-widest italic">Synchronizing context...</div>;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[
        { id: 'products', label: 'Products', href: '/products' },
        { id: 'variants', label: `${product?.title || 'Product'} Variants`, href: `/products/${handle}/variants` },
        { id: 'create', label: 'New Configuration' }
      ]} />
      
      {product && (
        <VariantForm 
          productId={product.id!}
          initialProduct={product}
          onSubmit={handleSubmit} 
          loading={loading}
        />
      )}
    </div>
  );
}
