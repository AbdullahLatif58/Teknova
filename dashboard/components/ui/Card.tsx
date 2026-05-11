import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card = ({ children, className = "", onClick }: CardProps) => (
  <div onClick={onClick} className={`bg-white dark:bg-[#111118] border border-zinc-200 dark:border-white/5 rounded-xl overflow-hidden transition-all duration-200 shadow-sm dark:shadow-none ${className}`}>
    {children}
  </div>
);

export default Card;
