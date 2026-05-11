'use client';

import React, { useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const themes = [
  { name: 'Minimal Dark', tag: 'ACTIVE', desc: 'Clean, professional black & violet interface.', color: 'bg-zinc-900', accent: '#7c3aed' },
  { name: 'Vibrant Store', tag: 'POPULAR', desc: 'Bright, energetic store for youth brands.', color: 'bg-violet-900', accent: '#ec4899' },
  { name: 'Luxury Brand', tag: 'PREMIUM', desc: 'Elegant gold & obsidian layout for high-end.', color: 'bg-amber-900', accent: '#fbbf24' },
  { name: 'Tech Grid', tag: 'BETA', desc: 'Futuristic blueprint style for electronics.', color: 'bg-blue-900', accent: '#3b82f6' },
];

export default function TemplatesPage() {
  const [activeTheme, setActiveTheme] = useState('Minimal Dark');
  const [primaryColor, setPrimaryColor] = useState('#7c3aed');

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 animate-in zoom-in-95 duration-500">
      <div className="xl:col-span-3 space-y-6">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Template Manager</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {themes.map((t, i) => (
            <Card key={i} className={`group cursor-pointer ${activeTheme === t.name ? 'ring-2 ring-violet-600 shadow-[0_0_20px_rgba(124,58,237,0.2)]' : 'hover:border-white/20'}`} onClick={() => setActiveTheme(t.name)}>
              <div className={`h-40 ${t.color} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:20px_20px]" />
                <div className="w-1/2 h-1/2 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 shadow-2xl p-2 flex flex-col gap-1">
                  <div className="h-1.5 w-full bg-white/20 rounded" />
                  <div className="flex-1 grid grid-cols-3 gap-1">
                    <div className="bg-white/10 rounded"/>
                    <div className="bg-white/10 rounded"/>
                    <div className="bg-white/10 rounded"/>
                  </div>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-zinc-100">{t.name}</h4>
                    {activeTheme === t.name && <Badge variant="primary">Active</Badge>}
                  </div>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase mt-1 tracking-widest">{t.desc}</p>
                </div>
                <Button variant={activeTheme === t.name ? "outline" : "primary"} size="sm">
                  {activeTheme === t.name ? "Configure" : "Activate"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <Card className="p-6 h-fit sticky top-6">
        <h3 className="text-xs font-black uppercase text-zinc-500 tracking-[3px] mb-8">Customize Theme</h3>
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">System Primary</label>
            <div className="flex items-center gap-2">
              <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded border-0 bg-transparent cursor-pointer" />
              <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="font-mono text-xs" />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Font Family</label>
            <select className="w-full bg-[#0d0d14] border border-zinc-800 rounded-lg p-2 text-xs font-black text-zinc-300 uppercase italic">
              <option>Inter (Modern)</option>
              <option>Poppins (Vibrant)</option>
              <option>Space Grotesk (Tech)</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Layout Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-2 p-2 bg-violet-600/10 border border-violet-600 text-violet-400 rounded-lg text-[10px] font-black uppercase"><Monitor size={12}/> Grid</button>
              <button className="flex items-center justify-center gap-2 p-2 bg-zinc-800 text-zinc-500 rounded-lg text-[10px] font-black uppercase"><Smartphone size={12}/> List</button>
            </div>
          </div>
          <Button full className="mt-4">Save Global Changes</Button>
          <Button variant="ghost" full className="text-zinc-600">Reset to Defaults</Button>
        </div>
      </Card>
    </div>
  );
}
