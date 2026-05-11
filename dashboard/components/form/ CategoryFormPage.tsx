'use client';

import React, { useState } from 'react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Card from '@/components/ui/Card';
import CategoryForm from '@/components/form/CategoryForm';
import { Category } from '@/types/category';
import { useRouter } from 'next/navigation';
import { createCategory, updateCategory } from '@/app/api/category/api'; // ✅ import API
import { useDialog } from '@/components/context/DialogContext';


interface CategoryFormPageProps {
  initialData?: Category;
}

export default function CategoryFormPage({ initialData }: CategoryFormPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { showToast } = useDialog();


  const handleSubmit = async (data: Category, imageFile?: File) => {
    setLoading(true);

    try {
      if (initialData?.id) {
        // Update existing category
        await updateCategory(initialData.id, data, imageFile ? [imageFile] : undefined);
      } else {
        // Create new category
        await createCategory(data, imageFile);
      }

      showToast(`Category ${initialData ? 'updated' : 'created'} successfully!`, 'success');
      router.push('/categories');
    } catch (err) {
      console.error(err);
      showToast('Something went wrong. Check console for details.', 'error');
    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4">
      <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
        {initialData ? 'Edit Category' : 'Create Category'}
      </h2>
      <Breadcrumb
        items={[
          { id: 'categories', label: 'Categories' },
          { id: 'form', label: initialData ? 'Edit' : 'Create' },
        ]}
      />
      <Card>
        <CategoryForm
          initialData={initialData}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </Card>
    </div>
  );
}