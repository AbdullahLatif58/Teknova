'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, Layers, ShoppingCart, Users, Palette,
  Activity, X, LogOut, Tag
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';

interface SidebarProps {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const menuGroups = [
  { label: 'MAIN', items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
  { label: 'CATALOG', items: [
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'variants', label: 'Variants', icon: Layers }
  ]},
  { label: 'COMMERCE', items: [{ id: 'orders', label: 'Orders', icon: ShoppingCart }] },
  { label: 'PEOPLE', items: [{ id: 'users', label: 'Users', icon: Users }] },
  { label: 'SYSTEM', items: [
    { id: 'templates', label: 'Templates', icon: Palette },
    { id: 'logs', label: 'API Logs', icon: Activity }
  ]}
];

const Sidebar = ({ isSidebarOpen, isMobileMenuOpen, setMobileMenuOpen }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (id: string) => {
    if (pathname === `/${id}`) return true;
    if (id === 'categories' && pathname === '/products') return true;
    if (id === 'products' && pathname === '/variants') return true;
    return false;
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-[#0d0d14] border-r border-white/5 z-50 transition-all duration-300 ease-in-out 
        ${isMobileMenuOpen ? 'translate-x-0 w-64 shadow-[20px_0_50px_rgba(0,0,0,0.5)]' : '-translate-x-full lg:translate-x-0'} 
        ${isSidebarOpen ? 'w-60' : 'w-20'}`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)]">
              <span className="font-black italic text-white">T</span>
            </div>
            {(isSidebarOpen || isMobileMenuOpen) && <h1 className="text-xl font-black tracking-tighter text-white italic">TEKNOVA</h1>}
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-zinc-500 hover:text-white"><X size={20}/></button>
        </div>

        <nav className="mt-6 px-3 space-y-8 overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-hide">
          {menuGroups.map((group, i) => (
            <div key={i} className="space-y-1">
              {(isSidebarOpen || isMobileMenuOpen) && <p className="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[2px] mb-2">{group.label}</p>}
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { router.push(`/${item.id}`); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all group relative
                    ${isActive(item.id)
                      ? 'bg-violet-600/10 text-violet-500 border-l-2 border-violet-600' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}
                >
                  <item.icon size={20} className={isActive(item.id) ? 'text-violet-500' : 'group-hover:text-white transition-colors'} />
                  {(isSidebarOpen || isMobileMenuOpen) && <span className="text-sm font-bold truncate uppercase italic tracking-tighter">{item.label}</span>}
                  {(!isSidebarOpen && !isMobileMenuOpen) && (
                    <div className="absolute left-14 bg-zinc-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-bold uppercase tracking-wider whitespace-nowrap z-[100] border border-white/10">
                      {item.label}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-white/5 bg-[#0d0d14]">
          <div className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group">
            <Avatar name="Ali Hassan" size="sm" />
            {(isSidebarOpen || isMobileMenuOpen) && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black truncate text-zinc-200 uppercase">Ali Hassan</p>
                <p className="text-[10px] font-black text-zinc-700 uppercase italic">Super Admin</p>
              </div>
            )}
            {(isSidebarOpen || isMobileMenuOpen) && <LogOut size={16} className="text-zinc-700 hover:text-rose-500 transition-colors" />}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
