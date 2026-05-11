'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Category } from '@/types/category';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { validateCategory } from './categoryValidation';

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: Category, imageFile?: File) => void;
  loading?: boolean;
}

export default function CategoryForm({ initialData, onSubmit, loading }: CategoryFormProps) {
  const [formData, setFormData] = useState<Category>({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    is_active: initialData?.is_active ?? 1,
    meta_title: initialData?.meta_title || '',
    meta_description: initialData?.meta_description || '',
    meta_keywords: initialData?.meta_keywords || '',
    image_url: initialData?.image_url || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);

  const validate = () => {
    const newErrors = validateCategory(formData, imageFile, !!initialData?.image_url);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time error clearing
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setFormData(prev => ({ ...prev, image_url: URL.createObjectURL(file) }));
      
      // Clear image error
      if (errors.image) {
        setErrors(prev => {
          const next = { ...prev };
          delete next.image;
          return next;
        });
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData, imageFile || undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-4xl mt-10 mb-10 mx-auto space-y-8">

      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
          {initialData ? 'Edit Category' : 'Create Category'}
        </h2>
        <p className="text-sm text-zinc-500 mt-1 font-medium">
          Manage your category details and SEO settings with precision.
        </p>
      </div>

      {/* Basic Information */}
      <div className="bg-[#0d0d14] border border-zinc-900 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        <h3 className="text-[11px] font-black text-violet-500 uppercase tracking-[0.2em]">Basic Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <Input 
            name="name" 
            placeholder="Category Name" 
            value={formData.name} 
            onChange={handleChange} 
            error={errors.name}
          />
          <Input 
            name="slug" 
            placeholder="category-slug" 
            value={formData.slug} 
            onChange={handleChange} 
            error={errors.slug}
          />
        </div>
        <div className="space-y-1">
          <textarea
            name="description"
            placeholder="Short description..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full bg-[#0a0a10] border ${errors.description ? 'border-rose-500 focus:ring-rose-500/10' : 'border-zinc-800 focus:border-violet-600 focus:ring-violet-600/20'} rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:ring-2 transition-all resize-none font-medium`}
          />
          {errors.description && (
            <p className="mt-1 text-[11px] font-medium text-rose-500 animate-in fade-in slide-in-from-top-1 px-1">
              {errors.description}
            </p>
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-[#0d0d14] border border-zinc-900 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        <h3 className="text-[11px] font-black text-fuchsia-500 uppercase tracking-[0.2em]">Settings</h3>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Status</label>
            <select
              name="is_active"
              value={formData.is_active}
              onChange={handleChange}
              className="w-full bg-[#0a0a10] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all font-medium appearance-none"
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Category Image</label>
            <div className={`relative border-2 border-dashed ${errors.image ? 'border-rose-500 bg-rose-500/[0.02]' : 'border-zinc-800 bg-[#0a0a10]/50'} rounded-2xl p-6 text-center hover:border-violet-600/50 transition-all cursor-pointer group/upload`}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="imageUpload"
              />
              <label htmlFor="imageUpload" className="cursor-pointer">
                <div className="space-y-2">
                  <p className={`text-xs font-bold ${errors.image ? 'text-rose-400' : 'text-zinc-400'} group-hover/upload:text-white transition-colors`}>
                    Click to upload or drag image
                  </p>
                  <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-tight">PNG, JPG up to 10MB</p>
                </div>
              </label>
              {formData.image_url && (
                <div className="mt-4 relative inline-block">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-xl mx-auto border-4 border-[#0d0d14] shadow-2xl"
                  />
                  <div className="absolute -top-2 -right-2 bg-violet-600 rounded-full p-1 shadow-lg ring-4 ring-[#0d0d14]">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                </div>
              )}
            </div>
            {errors.image && (
              <p className="mt-1 text-[11px] font-medium text-rose-500 animate-in fade-in slide-in-from-top-1 px-1">
                {errors.image}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-[#0d0d14] border border-zinc-900 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        <h3 className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em]">SEO Optimizer</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <Input 
            name="meta_title" 
            placeholder="Meta Title" 
            value={formData.meta_title} 
            onChange={handleChange} 
            error={errors.meta_title}
          />
          <Input 
            name="meta_description" 
            placeholder="Meta Description" 
            value={formData.meta_description} 
            onChange={handleChange} 
            error={errors.meta_description}
          />
          <Input 
            name="meta_keywords" 
            placeholder="keyword1, keyword2" 
            value={formData.meta_keywords} 
            onChange={handleChange} 
            error={errors.meta_keywords}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          className="px-10 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.3)] font-black text-xs uppercase tracking-[0.2em]"
          disabled={loading}
        >
          {loading ? 'Processing...' : initialData ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
}