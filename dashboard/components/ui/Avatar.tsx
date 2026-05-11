import React from 'react';

interface AvatarProps {
  name: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar = ({ name, color = "bg-violet-600", size = "md" }: AvatarProps) => {
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  const sizes: Record<string, string> = { sm: 'w-8 h-8 text-[11px]', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-xl' };
  return (
    <div className={`${color} ${sizes[size]} rounded-full flex items-center justify-center font-black text-white shadow-inner`}>
      {initials}
    </div>
  );
};

export default Avatar;
