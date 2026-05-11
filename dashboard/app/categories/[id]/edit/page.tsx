'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CategoryFormPage from '@/components/form/ CategoryFormPage';
import { Category } from '@/types/category';
import { getCategoryBySlug } from '@/app/api/category/api';

interface EditCategoryPageProps {
  params: { id: string }; // 'id' typically contains the slug based on folder structure or path, we will use it as a slug
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        // Assuming params.id is actually the slug based on how we route to it
        const data = await getCategoryBySlug(params.id);
        if (data) {
          setCategory(data as unknown as Category);
        } else {
          router.push('/404');
        }
      } catch (error) {
        console.error(error);
        router.push('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [params.id, router]);

  if (loading) {
    return <div className="p-8 text-center text-white">Loading...</div>;
  }

  if (!category) {
    return null; // Will redirect in useEffect
  }

  return <CategoryFormPage initialData={category} />;
}