'use client';

import React, { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { ProductVariant } from '@/types/variant';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { validateVariant } from './variantValidation';
import { X, Plus, Sparkles, Box, Settings, Trash2 } from 'lucide-react';

import ProductSearchSelect from '@/components/ui/ProductSearchSelect';
import { Product } from '@/types/product';

interface VariantFormProps {
  initialData?: ProductVariant;
  productId?: string;
  initialProduct?: Product | null;
  onSubmit: (data: ProductVariant, imageFiles?: File[]) => void;
  loading?: boolean;
}

export default function VariantForm({ initialData, productId, initialProduct, onSubmit, loading }: VariantFormProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(initialProduct || null);

  const [formData, setFormData] = useState<ProductVariant>({
    product_id: productId || initialData?.product_id || '',
    title: initialData?.title || '',
    price: initialData?.price || 0,
    sku: initialData?.sku || '',
    stock: initialData?.stock || 0,
    is_active: initialData?.is_active ?? true,
    is_default: initialData?.is_default ?? false,
    specifications: initialData?.specifications || {},
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(
    initialData?.images && Array.isArray(initialData.images)
      ? initialData.images
      : initialData?.image_url
        ? [initialData.image_url]
        : []
  );

  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  const validate = useCallback(() => {
    const hasExistingOrNewImages = previews.length > 0;
    const newErrors = validateVariant(formData, imageFiles.length > 0 ? imageFiles : null, hasExistingOrNewImages);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, imageFiles, previews]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    if (type === 'number') finalValue = parseFloat(value);

    setFormData(prev => ({ ...prev, [name]: finalValue }));

    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }

    validate();
  };

  const handleToggle = (field: 'is_active' | 'is_default') => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
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
            <Box className="text-sky-500" />
            {initialData ? 'Refine Configuration' : 'Deploy Configuration'}
          </h2>
          <p className="text-sm text-zinc-500 mt-2 font-medium italic underline underline-offset-4 decoration-sky-500/30">Synced with updated database schema.</p>
        </div>

        <div className="flex gap-3 bg-[#0d0d14] p-1.5 rounded-2xl border border-white/5 shadow-2xl">
          <button
            type="button"
            onClick={() => handleToggle('is_default')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.is_default ? 'bg-amber-500/20 text-amber-500 shadow-lg' : 'bg-white/5 text-zinc-500'}`}
          >
            {formData.is_default ? 'Default Version' : 'Standard'}
          </button>
          <button
            type="button"
            onClick={() => handleToggle('is_active')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.is_active ? 'bg-emerald-500/20 text-emerald-500 shadow-lg' : 'bg-rose-500/10 text-rose-500'}`}
          >
            {formData.is_active ? 'Live' : 'Inactive'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-8">

          <div className="bg-[#0d0d14] border border-zinc-900 rounded-[2.5rem] p-8 space-y-4 shadow-2xl">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
              <Box size={14} className="text-zinc-500" /> Target Product Context
            </label>
            <ProductSearchSelect
              value={selectedProduct}
              onChange={(p) => {
                setSelectedProduct(p);
                setFormData(prev => ({ ...prev, product_id: p?.id || '' }));
              }}
              placeholder="Search and attach product..."
              disabled={!!productId}
            />
            {errors.product_id && <p className="text-[11px] font-medium text-rose-500 px-1">{errors.product_id}</p>}
          </div>

          <div className="bg-[#0d0d14] border border-zinc-900 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-4">
              <Sparkles size={14} className="text-sky-500" />
              <h3 className="text-[11px] font-black text-sky-500 uppercase tracking-[0.2em]">Core Identity</h3>
            </div>

            <div className="grid md:grid-cols-1 gap-6">
              <Input name="sku" placeholder="SKU-CODE" label="Unique SKU" value={formData.sku || ''} onChange={handleChange} />
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
              <Input name="price" type="number" step="0.01" label="Base Valuation (USD)" value={formData.price} onChange={handleChange} error={errors.price} />
              <Input name="stock" type="number" label="Inventory Stock" value={formData.stock} onChange={handleChange} error={errors.stock} />
            </div>
          </div>

          <div className="bg-[#0d0d14] border border-zinc-900 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-4">
              <Settings size={14} className="text-zinc-500" />
              <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">Technical Data</h3>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <Input placeholder="Technical Property" value={newSpecKey} onChange={(e) => setNewSpecKey(e.target.value)} />
                <Input placeholder="Requirement Value" value={newSpecValue} onChange={(e) => setNewSpecValue(e.target.value)} />
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
        </div>

        <div className="space-y-8">
          <div className="bg-[#0d0d14] border border-zinc-900 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
            <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">Asset Configuration</h3>
            <div className="border-2 border-dashed border-zinc-800 bg-[#0a0a10]/50 rounded-[2rem] p-8 text-center cursor-pointer group hover:border-sky-600/50 transition-all">
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="variantImages" />
              <label htmlFor="variantImages" className="cursor-pointer">
                <Plus size={24} className="mx-auto text-zinc-600 group-hover:text-sky-500 transition-colors" />
                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-2">Deploy Assets</p>
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

          <Button type="submit" full className="py-6 rounded-[2rem] shadow-[0_20px_40px_rgba(14,165,233,0.3)] bg-gradient-to-r from-sky-600 to-indigo-600" disabled={loading}>
            {loading ? 'Activating Command...' : initialData ? 'Refine Configuration' : 'Confirm Configuration'}
          </Button>
        </div>
      </div>
    </form>
  );
}
