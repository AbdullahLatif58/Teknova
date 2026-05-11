import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { Shield, ChevronDown, ChevronUp } from 'lucide-react';

const SECTIONS = [
  { title: '1. Information We Collect', content: 'We collect information you provide directly — name, email, address, and payment details when you create an account or make a purchase. We also collect browsing data and voice search queries (processed locally via Web Speech API and never stored) to improve AI recommendations.' },
  { title: '2. How We Use Your Information', content: 'We use your information to process orders, send transactional emails, provide AI-powered product recommendations, improve our platform, detect fraud, and comply with legal obligations. We never sell your personal data.' },
  { title: '3. AI & Voice Data', content: 'Voice search is processed locally through the Web Speech API. Audio is not transmitted to our servers. AI recommendation data is anonymized. You can opt out of personalized recommendations in your account settings at any time.' },
  { title: '4. Cookies & Tracking', content: 'We use cookies to keep you signed in, remember your theme preference and cart, analyze site usage, and improve performance. You can manage cookie preferences through your browser settings.' },
  { title: '5. Data Sharing', content: 'We share data only with payment processors (to handle transactions), shipping providers (to fulfill orders), and analytics services (anonymized data only). All partners are bound by strict data processing agreements.' },
  { title: '6. Data Security', content: 'We implement 256-bit SSL encryption, regular security audits, secure storage with access controls, and multi-factor authentication options. Despite best efforts, no internet transmission is 100% secure.' },
  { title: '7. Your Rights', content: 'You have the right to access, correct, delete, or export your personal data. You may also object to certain processing or withdraw consent at any time. To exercise these rights, contact privacy@teknova.com.' },
  { title: '8. Changes to This Policy', content: 'We may update this policy from time to time. We will notify you of material changes by posting the new policy and updating the date below. We encourage periodic review.' },
  { title: '9. Contact', content: 'Questions about this policy? Email privacy@teknova.com — we aim to respond within 48 business hours. Address: Teknova HQ, Lahore, Punjab, Pakistan.' },
];

export default function PrivacyPage() {
  const { variation } = useTheme();
  const [open, setOpen] = useState(null);
  const accentCls = variation === 2 ? 'text-neon' : 'text-primary';

  return (
    <>
      <Head><title>Privacy Policy — Teknova</title></Head>
      <Layout>
        <div className="pt-28 pb-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className={'w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5'}>
                <Shield size={26} className={accentCls} />
              </div>
              <h1 className={'font-heading text-4xl font-bold text-foreground mb-3 ' + (variation === 3 ? 'italic' : '')}>
                {variation === 2 ? <span className="text-gradient-neon">Privacy Policy</span> : 'Privacy Policy'}
              </h1>
              <p className="text-muted-foreground">Last updated: April 2026</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-10">
              {[['🔒','SSL Encrypted','All data secured'],['🚫','Never Sold','Your data stays yours'],['✋','Your Control','Edit or delete anytime']].map(([ico,title,sub]) => (
                <div key={title} className="bg-card border border-border rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-2">{ico}</div>
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {SECTIONS.map((s, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
                  <button onClick={() => setOpen(open === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-secondary transition-colors">
                    <span className="text-sm font-semibold text-foreground">{s.title}</span>
                    {open === i ? <ChevronUp size={16} className={accentCls} /> : <ChevronDown size={16} className="text-muted-foreground" />}
                  </button>
                  {open === i && (
                    <div className="px-6 pb-5 border-t border-border">
                      <p className="text-sm text-muted-foreground leading-relaxed mt-4">{s.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 bg-card border border-border rounded-2xl p-8 text-center">
              <Shield size={28} className={'mx-auto mb-3 ' + accentCls} />
              <h3 className="font-heading font-bold text-foreground mb-2">Questions?</h3>
              <p className="text-sm text-muted-foreground mb-4">Our privacy team is here to help.</p>
              <a href="mailto:privacy@teknova.com" className={'inline-block px-6 py-2.5 rounded-full text-sm font-medium ' + (variation === 2 ? 'bg-gradient-neon text-teknova-dark font-bold' : 'bg-primary text-primary-foreground')}>
                privacy@teknova.com
              </a>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
