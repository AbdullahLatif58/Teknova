import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';

export default function NotFoundPage() {
  const { variation } = useTheme();
  const accentBg = variation === 2
    ? 'bg-gradient-neon text-teknova-dark font-bold glow-neon'
    : 'bg-primary text-primary-foreground';

  return (
    <>
      <Head><title>404 — Page Not Found — Teknova</title></Head>
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20">
          <p className={'font-heading text-8xl font-bold mb-4 ' + (variation === 2 ? 'text-gradient-neon' : 'text-primary')}>404</p>
          <h1 className={'font-heading text-3xl font-bold text-foreground mb-3 ' + (variation === 3 ? 'italic' : '')}>Page Not Found</h1>
          <p className="text-muted-foreground mb-8 max-w-md">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link href="/" className={'px-6 py-3 rounded-full font-medium text-sm ' + accentBg}>Go Home</Link>
            <Link href="/products" className="px-6 py-3 rounded-full font-medium text-sm border border-border text-foreground hover:bg-secondary transition-colors">Browse Products</Link>
          </div>
        </div>
      </Layout>
    </>
  );
}
