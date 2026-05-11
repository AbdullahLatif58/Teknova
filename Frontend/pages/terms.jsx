import Head from 'next/head';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';

export default function TermsPage() {
  const { variation } = useTheme();
  const accentCls = variation === 2 ? 'text-neon' : 'text-primary';

  return (
    <>
      <Head><title>Terms of Service — Teknova</title></Head>
      <Layout>
        <div className="pt-28 pb-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className={'font-heading text-4xl font-bold text-foreground mb-2 ' + (variation === 3 ? 'italic' : '')}>
              {variation === 2 ? <span className="text-gradient-neon">Terms of Service</span> : 'Terms of Service'}
            </h1>
            <p className="text-muted-foreground mb-10">Last updated: April 2026</p>
            {[
              ['1. Acceptance of Terms', 'By accessing and using Teknova, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.'],
              ['2. Use of Service', 'You may use Teknova for lawful purposes only. You must not misuse our services, attempt unauthorized access, or engage in any activity that disrupts or harms the platform.'],
              ['3. Account Responsibility', 'You are responsible for maintaining the confidentiality of your account credentials. Any activity under your account is your responsibility.'],
              ['4. Orders & Payments', 'All prices are in USD. We reserve the right to cancel orders at our discretion. Payment is processed securely through our payment partners.'],
              ['5. Returns & Refunds', 'Products may be returned within 30 days of delivery if unused and in original packaging. Refunds are processed within 5–10 business days.'],
              ['6. Intellectual Property', 'All content on Teknova — including logos, text, images, and code — is owned by Teknova or its licensors and protected by applicable IP laws.'],
              ['7. Limitation of Liability', 'Teknova is not liable for indirect, incidental, or consequential damages arising from the use of our platform or products purchased through it.'],
              ['8. Changes to Terms', 'We may update these terms at any time. Continued use of Teknova after changes constitutes acceptance of the new terms.'],
              ['9. Contact', 'For questions about these terms, contact legal@teknova.com.'],
            ].map(([title, content]) => (
              <div key={title} className="mb-8">
                <h2 className={'font-heading text-lg font-bold text-foreground mb-2 ' + (variation === 3 ? 'italic' : '')}>{title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
}
