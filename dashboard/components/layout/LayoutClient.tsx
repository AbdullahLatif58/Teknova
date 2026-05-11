'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setDarkMode] = useState(true);

  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];
  const isAuthRoute = authRoutes.includes(pathname);

  return (
    <>
      {!isAuthRoute && (
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          isMobileMenuOpen={isMobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      )}

      <main className={`transition-all duration-300 flex-1 flex flex-col min-h-screen ${!isAuthRoute ? (isSidebarOpen ? 'lg:ml-60' : 'lg:ml-20') : ''}`}>
        {!isAuthRoute && (
          <Topbar
            isSidebarOpen={isSidebarOpen}
            setSidebarOpen={setSidebarOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            isDarkMode={isDarkMode}
            setDarkMode={setDarkMode}
          />
        )}

        <div className={isAuthRoute ? 'flex-1 flex flex-col justify-center items-center w-full min-h-screen p-4' : 'p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto flex-1 w-full'}>
          {children}
        </div>

        {!isAuthRoute && (
          <footer className="p-10 text-center text-[10px] font-black uppercase tracking-[4px] text-zinc-800 border-t border-white/5 italic">
            Teknova Intel Core Engine • V4.5.1 Stable Build
          </footer>
        )}
      </main>
    </>
  );
}
