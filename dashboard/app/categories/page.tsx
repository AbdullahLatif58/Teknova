'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ArrowRight, Edit3, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { Category } from '@/types/category';
import { getCategories, deleteCategory } from '@/app/api/category/api';
import { useDialog } from '@/components/context/DialogContext';


type CategoryWithImage = Category & {
  image_url?: string;
  parentCategory?: string;
  productCount?: number;
  is_active?: number;
};

function CategoryAvatar({
  name,
  imageUrl,
}: {
  name: string;
  imageUrl?: string;
}) {
  const [hasError, setHasError] = useState(false);

  const initial = name?.charAt(0)?.toUpperCase() || 'C';

  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.04] shadow-sm">
      {imageUrl && !hasError ? (
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-600/30 to-fuchsia-500/20 text-sm font-black uppercase text-zinc-900 dark:text-white">
          {initial}
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { confirm, showToast } = useDialog();


  const getDisplayImageUrl = (url?: string) => {
    if (!url) return '';

    if (url.includes('res.cloudinary.com')) {
      return url.replace(
        '/upload/',
        '/upload/f_auto,q_auto,c_fill,g_auto,w_96,h_96/'
      );
    }

    return url;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await getCategories();
        console.log(data);

        const transformedData = data.map((category: any) => ({
          ...category,
          is_active: category.is_active ?? 1,
          image_url: getDisplayImageUrl(category.image_url),
        }));

        setCategories(transformedData);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    const isConfirmed = await confirm({
      title: 'Delete Category',
      message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
    });

    if (!isConfirmed) return;

    try {
      const success = await deleteCategory(id);
      if (success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        showToast(`Category "${name}" deleted successfully`, 'success');
      } else {
        showToast('Failed to delete category', 'error');
      }
    } catch (err) {
      console.error('Failed to delete category:', err);
      showToast('An error occurred while deleting the category', 'error');
    }
  };


  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic flex items-center gap-2">
          <LayoutGrid className="text-violet-600" />
          Categories <span className="text-violet-600">Hub</span>
        </h2>
        <Button onClick={() => router.push(`/categories/create`)} icon={Plus}>
          Add Category
        </Button>
      </div>

      <Breadcrumb items={[{ id: 'categories', label: 'Categories' }]} />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 dark:bg-[#0d0d14] text-[10px] font-black uppercase text-zinc-500 dark:text-zinc-600 border-b border-zinc-200 dark:border-white/5">
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Parent</th>
                <th className="px-6 py-4">Products</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-zinc-500">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-zinc-500">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((c, i) => (
                  <tr key={c.id} className="group hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-zinc-600">{i + 1}</td>

                    <td className="px-6 py-4">
                      <CategoryAvatar name={c.name} imageUrl={c.image_url} />
                    </td>

                    <td className="px-6 py-4">
                      <div className="min-w-0">
                        <p className="font-black text-zinc-900 dark:text-zinc-200 leading-none">{c.name}</p>
                        <p className="mt-1 text-[11px] font-medium text-zinc-500">
                          Category
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-mono text-zinc-500">{c.slug}</td>

                    <td className="px-6 py-4 text-xs font-bold text-zinc-500">
                      {c.parentCategory || 'None'}
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant="primary">{c.productCount || 0} Items</Badge>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={ArrowRight}
                          onClick={() => router.push('/products')}
                        >
                          Products
                        </Button>
                        <button
                          className="p-2 text-zinc-500 hover:text-white"
                          onClick={() => router.push(`/categories/${c.slug}/edit`)}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          className="p-2 text-zinc-500 hover:text-rose-500"
                          onClick={() => {
                            if (c.id) {
                              handleDelete(c.id, c.name);
                            } else {
                              showToast('Category ID is missing', 'error');
                            }
                          }}

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