'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, Menu, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

interface TopbarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  isDarkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

const Topbar = ({ isSidebarOpen, setSidebarOpen, setMobileMenuOpen, isDarkMode, setDarkMode }: TopbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const pageTitle = pathname.split('/').filter(Boolean).pop()?.replace('-', ' ') || 'dashboard';
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = React.useState(false);
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'A';

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-zinc-200 dark:border-white/5 px-6 py-4 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-4">
        <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-zinc-400 hover:text-white transition-colors">
          <Menu size={22} />
        </button>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="hidden lg:block text-zinc-400 hover:text-white transition-colors">
          {isSidebarOpen ? <ChevronDown className="rotate-90" size={18} /> : <ChevronDown className="-rotate-90" size={18} />}
        </button>
        <h2 className="text-lg font-black text-zinc-900 dark:text-white capitalize hidden sm:block italic tracking-tighter">
          {pageTitle}
        </h2>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="hidden md:flex relative group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600 group-focus-within:text-violet-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search system catalog..." 
            className="bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-[11px] font-bold py-1.5 pl-9 pr-4 rounded-full focus:outline-none focus:ring-1 focus:ring-violet-600 w-64 transition-all" 
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!isDarkMode)}
            className="p-1.5 text-zinc-500 hover:text-white transition-colors bg-zinc-900/50 rounded-lg"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="h-6 w-px bg-zinc-800 mx-1 hidden sm:block" />

          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center font-black text-xs text-white shadow-lg shadow-violet-600/20 cursor-pointer border border-white/10 uppercase">
                {initials}
              </div>
              <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-300 ${showProfile ? 'rotate-180' : ''}`} />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#0d0d14] border border-zinc-200 dark:border-white/5 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-zinc-100 dark:border-white/5 mb-1">
                  <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Authenticated As</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{user?.name || "Administrator"}</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-600 font-medium truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => { setShowProfile(false); router.push('/users'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-all uppercase tracking-wider"
                >
                  User Management
                </button>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => { setShowProfile(false); router.push('/logs'); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-violet-600 dark:text-violet-400 hover:bg-violet-600/10 rounded-xl transition-all uppercase tracking-wider"
                  >
                    System Logs (Admin)
                  </button>
                )}
                <button
                  onClick={() => { setShowProfile(false); logout(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all uppercase tracking-wider"
                >
                  Terminate Session (Logout)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
