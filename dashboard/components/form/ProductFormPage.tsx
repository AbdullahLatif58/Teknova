'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Card from '@/components/ui/Card';
import ProductForm from '@/components/form/ProductForm';
import { Product } from '@/types/product';
import { createProduct, updateProduct } from '@/app/api/product/api';
import { useDialog } from '@/components/context/DialogContext';

interface ProductFormPageProps {
  initialData?: Product;
}

export default function ProductFormPage({ initialData }: ProductFormPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { showToast } = useDialog();

  const handleSubmit = async (data: Product, imageFiles?: File[]) => {
    setLoading(true);

    try {
      if (initialData?.id) {
        // Update existing product
        await updateProduct(initialData.id, data, imageFiles);
        showToast(`Product "${data.title}" updated successfully!`, 'success');
      } else {
        // Create new product
        await createProduct(data, imageFiles);
        showToast(`Product "${data.title}" deployed successfully!`, 'success');
      }

      router.push('/products');
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || 'Operation failed. Check engine logs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
          {initialData ? 'Refining Product' : 'New Deployment'}
        </h2>
        <Breadcrumb
          items={[
            { id: 'products', label: 'Products' },
            { id: 'form', label: initialData ? 'Refine' : 'Deploy' },
          ]}
        />
      </div>

      <Card className="border-none bg-transparent shadow-none p-0">
        <ProductForm
          initialData={initialData}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </Card>
    </div>
  );
}
