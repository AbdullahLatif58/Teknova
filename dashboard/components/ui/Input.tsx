import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
}

const Input = ({ icon: Icon, label, placeholder, className = "", error, ...props }: InputProps) => (
  <div className={`relative group w-full ${className}`}>
    {label && (
      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && <Icon size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-rose-500' : 'text-zinc-500 group-focus-within:text-violet-500'}`} />}
      <input
        {...props}
        placeholder={placeholder}
        className={`w-full bg-zinc-50 dark:bg-[#0d0d14] border ${error ? 'border-rose-500 focus:ring-rose-500/10' : 'border-zinc-200 dark:border-zinc-800 focus:ring-violet-600/20 focus:border-violet-600'} rounded-lg py-2.5 ${Icon ? 'pl-10' : 'px-4'} pr-4 text-sm text-zinc-900 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:ring-2 transition-all`}
      />
    </div>
    {error && (
      <p className="mt-1 text-[11px] font-medium text-rose-500 animate-in fade-in slide-in-from-top-1 px-1">
        {error}
      </p>
    )}
  </div>
);

export default Input;
