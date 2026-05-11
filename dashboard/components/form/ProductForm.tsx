'use client';

import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { validateProduct } from './productValidation';
import { getCategories } from '@/app/api/category/api';
import { X, Plus, Sparkles, Layout, Search, Tag, Settings, Trash2 } from 'lucide-react';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Product, imageFiles?: File[]) => void;
  loading?: boolean;
}

export default function ProductForm({ initialData, onSubmit, loading }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>({
    category_id: initialData?.category_id || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    page_title: initialData?.page_title || '',
    page_handle: initialData?.page_handle || '',
    price: initialData?.price || 0,
    total_stock: initialData?.total_stock || 0,
    is_active: initialData?.is_active ?? true,
    specifications: initialData?.specifications || {},
    meta_title: initialData?.meta_title || '',
    meta_description: initialData?.meta_description || '',
    meta_keywords: initialData?.meta_keywords || [],
    tags: initialData?.tags || [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(
    initialData?.images && Array.isArray(initialData.images)
      ? initialData.images
      : initialData?.image_url
        ? [initialData.image_url]
        : []
  );

  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const validate = useCallback(() => {
    const hasExistingOrNewImages = previews.length > 0;
    const newErrors = validateProduct(formData, imageFiles.length > 0 ? imageFiles : null, hasExistingOrNewImages);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, imageFiles, previews]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? parseFloat(value) : value;

    setFormData(prev => ({ ...prev, [name]: finalValue }));

    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }

    // Trigger real-time validation for specific fields
    validate();
  };

  const handleToggleChange = () => {
    setFormData(prev => ({ ...prev, is_active: !prev.is_active }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Generic List Adder
  const handleListAdd = (field: 'tags' | 'meta_keywords', value: string, setter: (v: string) => void) => {
    if (value.trim()) {
      if (!formData[field]?.includes(value.trim())) {
        setFormData(prev => ({ ...prev, [field]: [...(prev[field] || []), value.trim()] }));
      }
      setter('');
    }
  };

  const handleListRemove = (field: 'tags' | 'meta_keywords', valueToRemove: string) => {
    setFormData(prev => ({ ...prev, [field]: (prev[field] || []).filter(v => v !== valueToRemove) }));
  };

  // Specifications
  const addSpec = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: { ...prev.specifications, [newSpecKey.trim()]: newSpecValue.trim() }
      }));
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const removeSpec = (keyToRemove: string) => {
    setFormData(prev => {
      const nextSpecs = { ...prev.specifications };
      delete nextSpecs[keyToRemove];
      return { ...prev, specifications: nextSpecs };
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData, imageFiles);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-5xl mt-10 mb-20 mx-auto space-y-10">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
            <Layout className="text-violet-500" />
            {initialData ? 'Refine Product' : 'Deploy Product'}
          </h2>
          <p className="text-sm text-zinc-500 mt-2 font-medium">Aligning with strict schema synchronization.</p>
        </div>

        <div className="flex bg-[#0d0d14] p-1.5 rounded-2xl border border-white/5 shadow-2xl">
          <button
            type="button"
            onClick={handleToggleChange}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.is_active ? 'bg-emerald-500/20 text-emerald-500 shadow-lg' : 'bg-rose-500/10 text-rose-500'}`}
          >
            {formData.is_active ? 'Live' : 'Inactive'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-8">

          <div className="bg-[#0d0d14] border border-zinc-900 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-4">
              <Sparkles size={14} className="text-violet-500" />
              <h3 className="text-[11px] font-black text-violet-500 uppercase tracking-[0.2em]">Primary Definitions</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input name="title" placeholder="Official Product Title" label="Product Title" value={formData.title} onChange={handleChange} error={errors.title} />
              <Input name="page_handle" placeholder="page-handle-slug" label="URL Handle (page_handle)" value={formData.page_handle} onChange={handleChange} error={errors.page_handle} />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Product Manifest</label>
              <textarea
                name="description"
                placeholder="Technical description..."
                value={formData.description || ''}
                onChange={handleChange}
                rows={6}
                className={`w-full bg-[#0a0a10] border ${errors.description ? 'border-rose-500' : 'border-zinc-800'} rounded-2xl px-5 py-4 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all font-medium resize-none`}
              />
              {errors.description && <p className="text-[11px] font-medium text-rose-500 px-1 mt-1">{errors.description}</p>}
            </div>
          </div>

          <div className="bg-[#0d0d14] border border-zinc-900 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-4">
              <Settings size={14} className="text-sky-500" />
              <h3 className="text-[11px] font-black text-sky-500 uppercase tracking-[0.2em]">Engineering Specifications</h3>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <Input placeholder="Property" value={newSpecKey} onChange={(e) => setNewSpecKey(e.target.value)} />
                <Input placeholder="Value" value={newSpecValue} onChange={(e) => setNewSpecValue(e.target.value)} />
                <Button type="button" variant="outline" onClick={addSpec} className="h-[46px] px-6">Add</Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(formData.specifications || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-[#0a0a10] border border-zinc-800 rounded-2xl">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter">{key}</span>
                      <span className="text-xs font-bold text-zinc-300">{String(value)}</span>
                    </div>
                    <button type="button" onClick={() => removeSpec(key)} className="p-2 text-zinc-700 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#0d0d14] border border-zinc-900 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-4">
              <Search size={14} className="text-emerald-500" />
              <h3 className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em]">Valuation & Stock</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input name="price" type="number" step="0.01" label="Base Price (USD)" value={formData.price} onChange={handleChange} error={errors.price} />
              <Input name="total_stock" type="number" label="Inventory Count" value={formData.total_stock} onChange={handleChange} error={errors.total_stock} />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Classification Link</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className={`w-full bg-[#0a0a10] border ${errors.category_id ? 'border-rose-500' : 'border-zinc-800'} rounded-2xl px-5 py-3.5 text-sm text-zinc-300 focus:outline-none appearance-none`}
              >
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[#0d0d14] border border-zinc-900 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
            <h3 className="text-[11px] font-black text-fuchsia-500 uppercase tracking-[0.2em]">Discovery & Tags</h3>

            <div className="space-y-4">
              <Input placeholder="Press Enter to add tag" label="Internal Tags" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleListAdd('tags', newTag, setNewTag))} />
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map(tag => (
                  <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-violet-600/10 border border-violet-500/20 rounded-full text-[10px] font-black text-violet-400 uppercase">
                    {tag} <X size={10} className="cursor-pointer" onClick={() => handleListRemove('tags', tag)} />
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4 border-t border-white/5 pt-6">
              <Input placeholder="Press Enter to add keyword" label="SEO Keywords" value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleListAdd('meta_keywords', newKeyword, setNewKeyword))} />
              <div className="flex flex-wrap gap-2">
                {formData.meta_keywords?.map(kw => (
                  <span key={kw} className="flex items-center gap-1.5 px-3 py-1 bg-sky-600/10 border border-sky-500/20 rounded-full text-[10px] font-black text-sky-400 uppercase">
                    {kw} <X size={10} className="cursor-pointer" onClick={() => handleListRemove('meta_keywords', kw)} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#0d0d14] border border-zinc-900 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
            <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">SEO Metadata</h3>
            <Input name="meta_title" label="Meta Title" value={formData.meta_title || ''} onChange={handleChange} />
            <textarea
              name="meta_description"
              placeholder="Meta description for search engines..."
              value={formData.meta_description || ''}
              onChange={handleChange}
              className="w-full bg-[#0a0a10] border border-zinc-800 rounded-2xl px-5 py-3 text-sm text-zinc-300 h-24 resize-none"
            />
          </div>

          <div className="bg-[#0d0d14] border border-zinc-900 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
            <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">Asset Management</h3>
            <div className="border-2 border-dashed border-zinc-800 bg-[#0a0a10]/50 rounded-[2rem] p-8 text-center cursor-pointer group hover:border-violet-600/50 transition-all">
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="productImages" />
              <label htmlFor="productImages" className="cursor-pointer">
                <Plus size={24} className="mx-auto text-zinc-600 group-hover:text-violet-500 transition-colors" />
                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-2">Add Images</p>
              </label>
            </div>
            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {previews.map((src, idx) => (
                  <div key={idx} className="relative aspect-square overflow-hidden rounded-2xl border border-white/5 group/img">
                    <img src={src} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white opacity-0 group-hover/img:opacity-100 transition-opacity">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" full className="py-6 rounded-[2rem] shadow-[0_20px_40px_rgba(124,58,237,0.3)] bg-gradient-to-r from-violet-600 to-fuchsia-600" disabled={loading}>
            {loading ? 'Executing Synchronization...' : initialData ? 'Update Record' : 'Commit Entry'}
          </Button>
        </div>
      </div>
    </form>
  );
}
