import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { Users, Zap, Globe, Shield, ArrowRight, Sparkles, Mic } from 'lucide-react';

const team = [
  { name: 'Ahmed Hassan', role: 'CEO & Co-Founder', initials: 'AH' },
  { name: 'Sara Malik',   role: 'CTO',              initials: 'SM' },
  { name: 'Omar Farooq',  role: 'Head of AI',       initials: 'OF' },
  { name: 'Fatima Zahra', role: 'Lead Designer',    initials: 'FZ' },
  { name: 'Ali Raza',     role: 'Backend Engineer', initials: 'AR' },
  { name: 'Zara Khan',    role: 'Product Manager',  initials: 'ZK' },
];

const values = [
  { icon: Zap,      title: 'Performance First', desc: 'Every product chosen for best-in-class performance.' },
  { icon: Globe,    title: 'Global Access',      desc: 'Delivering premium tech worldwide with ease.' },
  { icon: Shield,   title: 'Trusted Quality',    desc: 'Every item verified, backed by manufacturer warranty.' },
  { icon: Sparkles, title: 'AI-Powered',         desc: 'Smart recommendations tailored just for you.' },
  { icon: Mic,      title: 'Voice Search',       desc: 'Find products hands-free with voice assistant.' },
  { icon: Users,    title: 'Community Driven',   desc: 'Built by and for tech enthusiasts.' },
];

const stats = [
  { num: '50K+',  label: 'Products' },
  { num: '2M+',   label: 'Customers' },
  { num: '99.9%', label: 'Uptime' },
  { num: '4.9★',  label: 'Rating' },
];

export default function AboutPage() {
  const { variation } = useTheme();

  return (
    <>
      <Head>
        <title>About Us — Teknova</title>
        <meta name="description" content="Learn about Teknova — the AI-powered tech store." />
      </Head>
      <Layout>
        {variation === 1 && <AboutTheme1 />}
        {variation === 2 && <AboutTheme2 />}
        {variation === 3 && <AboutTheme3 />}
      </Layout>
    </>
  );
}

/* ══════════════════════════════════════════════
   THEME 1 — Clean Minimal
   Full-width dark hero → horizontal stat strip
   → 2-col mission → 3-col values grid → team grid
══════════════════════════════════════════════ */
function AboutTheme1() {
  return (
    <div>
      {/* Hero — full dark banner */}
      <section className="bg-foreground pt-32 pb-24 text-center">
        <p className="text-background/50 text-xs tracking-[0.3em] uppercase mb-4">Our Story</p>
        <h1 className="font-heading text-5xl md:text-7xl font-bold text-background mb-6">We Are Teknova</h1>
        <p className="text-background/70 text-lg max-w-xl mx-auto leading-relaxed">
          Building the future of tech retail — one product at a time.
        </p>
      </section>

      {/* Stat strip */}
      <section className="bg-secondary border-y border-border">
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <p className="font-heading text-4xl font-bold text-foreground mb-1">{s.num}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission — 2 col with image */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Mission</p>
            <h2 className="font-heading text-4xl font-bold text-foreground mb-6">Redefining Tech Retail</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We combine AI, voice technology, and smart design to create a shopping experience that genuinely understands you.</p>
            <p className="text-muted-foreground leading-relaxed mb-8">Founded in Lahore, Pakistan — a team of engineers and designers building the world's most intelligent e-commerce platform.</p>
            <Link href="/products" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium text-sm hover:opacity-90 transition-opacity">
              Explore Store <ArrowRight size={16} />
            </Link>
          </div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary">
            <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop" alt="Technology" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Values — 3 col grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Values</p>
            <h2 className="font-heading text-3xl font-bold text-foreground">What We Stand For</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map(v => (
              <div key={v.title} className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-all">
                <v.icon size={22} className="text-primary mb-4" />
                <h3 className="font-heading font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team — grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">People</p>
            <h2 className="font-heading text-3xl font-bold text-foreground">Meet The Team</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {team.map(m => (
              <div key={m.name} className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-white shrink-0">{m.initials}</div>
                <div>
                  <p className="font-heading font-semibold text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-foreground rounded-3xl p-12 text-center">
            <h2 className="font-heading text-3xl font-bold text-background mb-3">Start Shopping Today</h2>
            <p className="text-background/70 mb-8">Join 2M+ customers discovering products they love.</p>
            <Link href="/products" className="inline-block bg-background text-foreground px-8 py-3 rounded-full font-medium text-sm hover:opacity-90 transition-opacity">
              Explore Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ══════════════════════════════════════════════
   THEME 2 — Cyberpunk Neon
   Split hero with glowing stats → neon timeline
   → glowing cards → horizontal team scroll
══════════════════════════════════════════════ */
function AboutTheme2() {
  return (
    <div className="bg-background">
      {/* Hero — left text, right glowing image */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-neon/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-neon/10 border border-neon/30 rounded-full px-3 py-1 mb-6">
              <Zap size={12} className="text-neon" />
              <span className="text-xs font-bold text-neon tracking-widest uppercase">About Teknova</span>
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-bold leading-tight mb-6">
              <span className="text-foreground">WE ARE </span>
              <span className="text-gradient-neon">TEKNOVA</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-8">
              A supercharged tech store built with AI, voice technology, and neon-lit ambition. We ship the future right to your door.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {stats.map(s => (
                <div key={s.label} className="bg-card border border-border rounded-xl p-4 hover:border-neon/30 transition-colors">
                  <p className="font-heading text-3xl font-bold text-gradient-neon">{s.num}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden border border-neon/20 glow-neon">
              <img src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop" alt="Tech" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Values — neon border cards, 2-col */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-wider uppercase text-center mb-12">
            <span className="text-gradient-neon">Our Core Values</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map(v => (
              <div key={v.title} className="bg-card border border-border rounded-xl p-6 hover:border-neon/40 transition-all group">
                <div className="w-10 h-10 rounded-lg bg-neon/10 flex items-center justify-center mb-4 group-hover:bg-neon/20 transition-colors">
                  <v.icon size={20} className="text-neon" />
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2 tracking-wide">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team — horizontal scroll cards */}
      <section className="py-20 bg-secondary border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-wider uppercase text-center mb-12">
            <span className="text-gradient-neon">The Crew</span>
          </h2>
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
            {team.map(m => (
              <div key={m.name} className="shrink-0 w-48 bg-card border border-border rounded-xl p-5 text-center hover:border-neon/40 transition-all">
                <div className="w-14 h-14 rounded-xl bg-gradient-neon flex items-center justify-center font-bold text-teknova-dark text-lg mx-auto mb-3">{m.initials}</div>
                <p className="font-heading font-bold text-foreground text-sm tracking-wide">{m.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-heading text-4xl font-bold tracking-wider uppercase mb-4">
            <span className="text-gradient-neon">Ready to Shop?</span>
          </h2>
          <p className="text-muted-foreground mb-8">Experience the most advanced tech store on the planet.</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-gradient-neon text-teknova-dark px-8 py-3.5 rounded-lg font-bold tracking-wide glow-neon hover:opacity-90 transition-opacity">
            SHOP NOW <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ══════════════════════════════════════════════
   THEME 3 — Warm Luxury / Editorial
   Full-bleed image hero → large italic quote
   → alternating text+image rows → team portraits
   → minimal CTA
══════════════════════════════════════════════ */
function AboutTheme3() {
  return (
    <div className="bg-background">
      {/* Hero — full bleed image with overlay text */}
      <section className="relative h-[80vh] flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1400&h=800&fit=crop"
          alt="About" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-20 w-full">
          <span className="text-sm tracking-[0.3em] uppercase text-muted-foreground block mb-4">Our Story</span>
          <h1 className="font-heading text-5xl md:text-7xl font-semibold text-foreground italic leading-tight max-w-2xl">
            Elegance Meets Innovation
          </h1>
        </div>
      </section>

      {/* Large editorial quote */}
      <section className="py-24 border-b border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="font-heading text-2xl md:text-3xl font-semibold text-foreground italic leading-relaxed">
            &ldquo;We believe technology should be beautiful, intelligent, and deeply personal. That&rsquo;s why we built Teknova.&rdquo;
          </p>
          <div className="flex justify-center gap-3 mt-8">
            <div className="w-px h-8 bg-border" />
            <p className="text-sm text-muted-foreground self-center">Ahmed Hassan, CEO</p>
          </div>
        </div>
      </section>

      {/* Stats — large numbers, editorial style */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((s, i) => (
              <div key={s.label} className="text-center">
                <p className="font-heading text-5xl font-semibold text-foreground mb-2">{s.num}</p>
                <div className="w-8 h-px bg-primary mx-auto mb-2" />
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alternating rows: Mission + Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-24">
          {/* Row 1 — text left, image right */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm tracking-[0.3em] uppercase text-muted-foreground block mb-4">Our Mission</span>
              <h2 className="font-heading text-4xl font-semibold text-foreground italic mb-6">Crafted for the Discerning</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">We handpick every product in our catalog against a strict standard of craftsmanship, innovation, and longevity. No compromises.</p>
              <p className="text-muted-foreground leading-relaxed">Founded in Lahore, Pakistan — a team of engineers and designers building a platform as refined as the products it sells.</p>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden glow-warm">
              <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop" alt="Mission" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Row 2 — image left, values right */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden glow-warm order-2 md:order-1">
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop" alt="Values" className="w-full h-full object-cover" />
            </div>
            <div className="order-1 md:order-2">
              <span className="text-sm tracking-[0.3em] uppercase text-muted-foreground block mb-4">Our Values</span>
              <h2 className="font-heading text-4xl font-semibold text-foreground italic mb-6">What We Believe In</h2>
              <div className="space-y-5">
                {values.slice(0, 4).map(v => (
                  <div key={v.title} className="flex gap-4 items-start">
                    <v.icon size={18} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-heading font-semibold text-foreground text-sm mb-0.5">{v.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team — portrait style with elegant borders */}
      <section className="py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <span className="text-sm tracking-[0.3em] uppercase text-muted-foreground">The Makers</span>
            <h2 className="font-heading text-4xl font-semibold text-foreground mt-2 italic">Our Team</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {team.map(m => (
              <div key={m.name} className="group">
                <div className="aspect-square rounded-xl bg-secondary flex items-center justify-center mb-4 overflow-hidden group-hover:shadow-md transition-all glow-warm">
                  <span className="font-heading text-4xl font-semibold text-muted-foreground/40 italic">{m.initials}</span>
                </div>
                <p className="font-heading font-semibold text-foreground italic">{m.name}</p>
                <p className="text-xs text-muted-foreground tracking-wide mt-0.5">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — minimal editorial */}
      <section className="py-24 border-t border-border">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl font-semibold text-foreground italic mb-4">Begin Your Journey</h2>
          <p className="text-muted-foreground mb-10 leading-relaxed">Discover technology that inspires — curated for those who appreciate the finer details.</p>
          <Link href="/products" className="inline-flex items-center gap-3 text-foreground font-heading text-lg border-b-2 border-primary pb-1 hover:gap-5 transition-all">
            Explore the Collection <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
