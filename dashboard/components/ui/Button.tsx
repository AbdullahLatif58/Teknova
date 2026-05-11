import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  icon?: LucideIcon;
  full?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Button = ({ children, variant = 'primary', className = "", icon: Icon, full = false, size = 'md', ...props }: ButtonProps) => {
  const variants: Record<string, string> = {
    primary: 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/20',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200',
    ghost: 'bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white',
    outline: 'bg-transparent border border-zinc-700 hover:border-violet-600 text-zinc-300',
  };
  const sizes: Record<string, string> = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  return (
    <button
      {...props}
      className={`flex items-center justify-center gap-2 rounded-lg font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 18} />}
      {children}
    </button>
  );
};

export default Button;
