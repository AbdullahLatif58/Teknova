'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X, Box } from 'lucide-react';
import { Product } from '@/types/product';
import { searchProducts, getProducts } from '@/app/api/product/api';

interface ProductSearchSelectProps {
  value: Product | null;
  onChange: (product: Product | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function ProductSearchSelect({ value, onChange, placeholder = "Search for a product...", disabled }: ProductSearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      try {
        const res = await getProducts(1, 20);
        setResults(res.products || res.data || []);
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && !searchTerm && results.length === 0) {
      fetchInitial();
    }
  }, [isOpen, searchTerm, results.length]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        setLoading(true);
        try {
          const res = await searchProducts(searchTerm);
          setResults(res.products || res.data || []);
        } catch (err) {
          // ignore error
        } finally {
          setLoading(false);
        }
      } else if (searchTerm.length === 0) {
        // Reload initial if empty
        const res = await getProducts(1, 20);
        setResults(res.products || res.data || []);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSelect = (product: Product) => {
    onChange(product);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setSearchTerm('');
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div 
        className={`w-full p-4 bg-zinc-50 dark:bg-[#0a0a10] border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-900 dark:text-zinc-200 text-sm focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500 transition-all flex items-center justify-between cursor-text ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
        onClick={() => !disabled && setIsOpen(true)}
      >
        {value && !isOpen ? (
          <div className="flex items-center gap-3 w-full">
            <span className="font-black truncate">{value.title}</span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">({value.page_handle})</span>
          </div>
        ) : (
          <input
            type="text"
            className="w-full bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-200 font-black placeholder:text-zinc-400 dark:placeholder:text-zinc-600 placeholder:font-medium"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={disabled}
          />
        )}
        
        <div className="flex items-center gap-2 pl-2">
          {value && !isOpen && (
            <button onClick={handleClear} className="text-zinc-400 hover:text-rose-500 transition-colors p-1">
              <X size={14} />
            </button>
          )}
          {loading && isOpen ? (
            <Loader2 size={16} className="animate-spin text-sky-500" />
          ) : (
            <Search size={16} className="text-zinc-400 dark:text-zinc-600" />
          )}
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#0d0d14] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl max-h-64 overflow-y-auto overflow-x-hidden">
          {results.length > 0 ? (
            <ul className="py-2">
              {results.map((product) => (
                <li
                  key={product.id}
                  className="px-4 py-3 hover:bg-zinc-100 dark:hover:bg-white/5 cursor-pointer flex items-center gap-3 transition-colors border-b border-zinc-100 dark:border-white/5 last:border-0"
                  onClick={() => handleSelect(product)}
                >
                  <div className="w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img src={product.images[0]} className="w-full h-full object-cover" />
                    ) : product.image_url ? (
                      <img src={product.image_url} className="w-full h-full object-cover" />
                    ) : (
                      <Box size={14} className="text-zinc-400 dark:text-zinc-500" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-black text-xs text-zinc-900 dark:text-white truncate">{product.title}</span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono truncate">{product.page_handle}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-zinc-500 text-xs font-bold italic">
              {loading ? 'Searching...' : 'No products found'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
