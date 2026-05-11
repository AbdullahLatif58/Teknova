import Head from 'next/head';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { Check, Palette, Zap, Sun, Sparkles } from 'lucide-react';

const THEMES = [
  {
    id:      'theme-1',
    name:    'Clean Minimal',
    desc:    'Crisp white surfaces, black accents, and impeccable typography. Less is more.',
    icon:    Sun,
    preview: {
      bg:     '#fafafa',
      header: '#f5f5f5',
      card:   '#ffffff',
      accent: '#111111',
      text:   '#333333',
    },
    tags: ['Light', 'Minimal', 'Professional'],
  },
  {
    id:      'theme-2',
    name:    'Cyberpunk Neon',
    desc:    'Dark backgrounds, electric neon gradients, and futuristic typography for the bold.',
    icon:    Zap,
    preview: {
      bg:     '#0a0a0f',
      header: '#111118',
      card:   '#12121d',
      accent: '#00ffa3',
      text:   '#e0e0f0',
    },
    tags: ['Dark', 'Neon', 'Gaming'],
  },
  {
    id:      'theme-3',
    name:    'Warm Luxury',
    desc:    'Earthy tones, serif typography, and editorial layouts for a premium feel.',
    icon:    Sparkles,
    preview: {
      bg:     '#faf8f5',
      header: '#f2ede8',
      card:   '#ffffff',
      accent: '#c2621e',
      text:   '#2a1f18',
    },
    tags: ['Light', 'Warm', 'Luxury'],
  },
];

export default function TemplatesPage() {
  const { theme, switchTheme, variation } = useTheme();

  const accentCls = variation === 2 ? 'text-neon' : 'text-primary';
  const activeBorder = variation === 2 ? 'border-neon shadow-neon/20' : 'border-primary shadow-primary/10';

  return (
    <>
      <Head>
        <title>Themes — Teknova</title>
        <meta name="description" content="Switch between Teknova's three stunning themes — Clean Minimal, Cyberpunk Neon, and Warm Luxury." />
      </Head>
      <Layout>
        <div className="pt-28 pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="text-center mb-16">
              <div className={'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 border ' + (variation === 2 ? 'bg-neon/10 border-neon/30 text-neon' : 'bg-primary/10 border-primary/20 text-primary')}>
                <Palette size={12} /> THEME SWITCHER
              </div>
              <h1 className={'font-heading text-4xl md:text-5xl font-bold text-foreground mb-4 ' + (variation === 3 ? 'italic' : '')}>
                {variation === 2 ? <span className="text-gradient-neon">Choose Your Theme</span> : 'Choose Your Theme'}
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Instantly switch the entire storefront — layout, typography, colors, and every component changes.
                No page reload. No redirect. Just seamless transformation.
              </p>
            </div>

            {/* Live indicator */}
            <div className="flex items-center justify-center gap-2 mb-10">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">
                You&apos;re currently viewing <span className={'font-semibold ' + accentCls}>{THEMES.find(t => t.id === theme)?.name}</span>
              </span>
            </div>

            {/* Theme cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {THEMES.map(t => {
                const isActive = theme === t.id;
                const Icon = t.icon;
                return (
                  <div key={t.id}
                    className={'rounded-2xl border-2 overflow-hidden transition-all duration-300 cursor-pointer ' +
                      (isActive
                        ? 'border-primary shadow-xl ' + activeBorder
                        : 'border-border hover:border-foreground/30 hover:shadow-lg')}
                    onClick={() => switchTheme(t.id)}>

                    {/* Visual preview */}
                    <div className="h-44 p-4 relative overflow-hidden" style={{ background: t.preview.bg }}>
                      {/* Mock header */}
                      <div className="h-8 rounded-lg mb-3 flex items-center px-3 gap-2" style={{ background: t.preview.header }}>
                        <div className="w-12 h-2 rounded" style={{ background: t.preview.accent }} />
                        <div className="flex-1" />
                        <div className="w-4 h-4 rounded-full" style={{ background: t.preview.accent, opacity: 0.7 }} />
                      </div>
                      {/* Mock cards */}
                      <div className="grid grid-cols-3 gap-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="rounded-lg p-2" style={{ background: t.preview.card, border: `1px solid ${t.preview.accent}22` }}>
                            <div className="h-8 rounded mb-1.5" style={{ background: t.preview.accent, opacity: 0.15 }} />
                            <div className="h-1.5 rounded mb-1" style={{ background: t.preview.text, opacity: 0.5, width: '80%' }} />
                            <div className="h-1.5 rounded" style={{ background: t.preview.accent, opacity: 0.7, width: '50%' }} />
                          </div>
                        ))}
                      </div>
                      {/* Active overlay */}
                      {isActive && (
                        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-lg">
                          <Check size={14} className="text-primary-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5 bg-card border-t border-border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon size={16} className={isActive ? accentCls : 'text-muted-foreground'} />
                          <h3 className="font-heading font-bold text-foreground">{t.name}</h3>
                        </div>
                        {isActive && (
                          <span className={'text-[10px] font-bold px-2 py-0.5 rounded-full ' + (variation === 2 ? 'bg-neon/10 text-neon' : 'bg-primary/10 text-primary')}>LIVE</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{t.desc}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {t.tags.map(tag => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">{tag}</span>
                        ))}
                      </div>
                      <button
                        onClick={() => switchTheme(t.id)}
                        className={'w-full mt-4 py-2.5 rounded-xl text-sm font-medium transition-all ' +
                          (isActive
                            ? (variation === 2 ? 'bg-gradient-neon text-teknova-dark font-bold' : 'bg-primary text-primary-foreground')
                            : 'border border-border text-foreground hover:bg-secondary')}>
                        {isActive ? 'Currently Active' : 'Apply Theme'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Note */}
            <div className={'rounded-2xl p-6 text-center border ' + (variation === 2 ? 'bg-card border-border' : 'bg-secondary border-border')}>
              <p className="text-sm text-muted-foreground">
                <span className={'font-semibold ' + accentCls}>Theme preference is saved automatically.</span>
                {' '}Your choice persists across sessions and page navigations — no redirects, no reloads.
              </p>
            </div>

          </div>
        </div>
      </Layout>
    </>
  );
}
