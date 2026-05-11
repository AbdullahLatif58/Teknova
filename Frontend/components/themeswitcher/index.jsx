import { useState } from 'react';
import { Palette, X, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const THEME_INFO = {
  'theme-1': { label: 'Clean Minimal', desc: 'Light & crisp', preview: 'bg-white border border-gray-200' },
  'theme-2': { label: 'Cyberpunk Neon', desc: 'Dark & electric', preview: 'bg-gray-950 border border-cyan-500/50' },
  'theme-3': { label: 'Warm Luxury', desc: 'Earthy & refined', preview: 'bg-amber-50 border border-amber-200' },
};

export default function ThemeSwitcher() {
  const { theme, switchTheme, THEMES } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {open && (
        <div className="mb-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden w-56">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Switch Theme</span>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
          </div>
          {THEMES.map(t => {
            const info = THEME_INFO[t];
            const active = theme === t;
            return (
              <button key={t} onClick={() => { switchTheme(t); setOpen(false); }}
                className={'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary ' + (active ? 'bg-secondary' : '')}>
                <div className={'w-8 h-8 rounded-lg ' + info.preview} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{info.label}</p>
                  <p className="text-xs text-muted-foreground">{info.desc}</p>
                </div>
                {active && <Check size={14} className="text-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
      <button onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-110 transition-all">
        <Palette size={20} className="text-foreground" />
      </button>
    </div>
  );
}
