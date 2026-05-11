'use client';

import React, { useEffect, useState } from 'react';
import ProductFormPage from '@/components/form/ProductFormPage';
import { getProductBySlug } from '@/app/api/product/api';
import { Product } from '@/types/product';
import { useParams } from 'next/navigation';

export default function EditProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (typeof slug === 'string') {
        const data = await getProductBySlug(slug);
        setProduct(data);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
          <p className="text-xs font-black uppercase tracking-widest text-zinc-500 animate-pulse">Syncing Engine...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-6">
        <h2 className="text-3xl font-black text-rose-500 uppercase italic tracking-tighter">Product Not Found</h2>
        <p className="text-zinc-500 font-medium">The requested unit does not exist in the dashboard index.</p>
      </div>
    );
  }

  return <ProductFormPage initialData={product} />;
}
