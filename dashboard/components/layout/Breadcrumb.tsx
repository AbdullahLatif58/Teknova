'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 mb-6 uppercase tracking-[0.1em]">
      <button onClick={() => router.push('/dashboard')} className="hover:text-violet-500 transition-colors">Dashboard</button>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <ChevronRight size={12} className="text-zinc-300 dark:text-zinc-800" />
          <button
            onClick={() => router.push(item.href ? item.href : `/${item.id}`)}
            className={`transition-colors ${i === items.length - 1 ? 'text-zinc-900 dark:text-zinc-200' : 'hover:text-violet-500'}`}
          >
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
