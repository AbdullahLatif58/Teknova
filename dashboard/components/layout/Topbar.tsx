'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, Menu, ChevronDown, Sun, Moon } from 'lucide-react';

interface TopbarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  isDarkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

const Topbar = ({ isSidebarOpen, setSidebarOpen, setMobileMenuOpen, isDarkMode, setDarkMode }: TopbarProps) => {
  const pathname = usePathname();
  const pageTitle = pathname.replace('/', '').replace('-', ' ') || 'dashboard';

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-zinc-400 hover:text-white transition-colors">
          <Menu size={22} />
        </button>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="hidden lg:block text-zinc-400 hover:text-white transition-colors">
          {isSidebarOpen ? <ChevronDown className="rotate-90" size={18}/> : <ChevronDown className="-rotate-90" size={18}/>}
        </button>
        <h2 className="text-lg font-black text-white capitalize hidden sm:block italic tracking-tighter">
          {pageTitle}
        </h2>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="hidden md:flex relative group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-500 transition-colors" />
          <input type="text" placeholder="Search system catalog..." className="bg-zinc-900/50 border border-zinc-800 text-[11px] font-bold py-1.5 pl-9 pr-4 rounded-full focus:outline-none focus:ring-1 focus:ring-violet-600 w-64 transition-all" />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setDarkMode(!isDarkMode)} className="p-1.5 text-zinc-500 hover:text-white transition-colors bg-zinc-900/50 rounded-lg">
            {isDarkMode ? <Sun size={18}/> : <Moon size={18}/>}
          </button>
          <button className="relative p-1.5 text-zinc-500 hover:text-white transition-colors bg-zinc-900/50 rounded-lg">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-600 rounded-full border border-[#0a0a0f]" />
          </button>
          <div className="h-6 w-px bg-zinc-800 mx-1 hidden sm:block" />
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center font-black text-xs text-white shadow-lg shadow-violet-600/20 cursor-pointer border border-white/10">
            AH
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
