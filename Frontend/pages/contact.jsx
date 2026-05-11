import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { submitContact } from '../api/contacts';

const CONTACT_INFO = [
  { icon: Mail,    label: 'Email',    value: 'support@teknova.com',    sub: 'We reply within 24 hours' },
  { icon: Phone,   label: 'Phone',    value: '+92 (300) 123-4567',     sub: 'Mon–Fri, 9am–6pm PKT' },
  { icon: MapPin,  label: 'Office',   value: 'Lahore, Punjab, Pakistan', sub: 'Visit us by appointment' },
  { icon: Clock,   label: 'Hours',    value: 'Mon – Fri: 9am – 6pm',   sub: 'Sat: 10am – 4pm' },
];

const TOPICS = ['Order Support', 'Product Inquiry', 'Returns & Refunds', 'Technical Support', 'Business / B2B', 'Other'];

export default function ContactPage() {
  const { variation } = useTheme();
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const accentCls = variation === 2 ? 'text-neon' : 'text-primary';
  const accentBg  = variation === 2
    ? 'bg-gradient-neon text-teknova-dark font-bold glow-neon'
    : 'bg-primary text-primary-foreground';
  const inputCls  = 'w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!form.name || !form.email || !form.message) return;
    
    try {
      setLoading(true);
      const res = await submitContact({
        name: form.name,
        email: form.email,
        subject: form.topic,
        message: form.message
      });
      
      if (res.success) {
        setSent(true);
      } else {
        setError(res.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Connection failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us — Teknova</title>
        <meta name="description" content="Get in touch with Teknova support. We're here to help with orders, products, and anything else." />
      </Head>
      <Layout>
        <div className="pt-28 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="text-center mb-16">
              <div className={'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 border ' + (variation === 2 ? 'bg-neon/10 border-neon/30 text-neon' : 'bg-primary/10 border-primary/20 text-primary')}>
                <MessageSquare size={12} /> GET IN TOUCH
              </div>
              <h1 className={'font-heading text-4xl md:text-5xl font-bold text-foreground mb-4 ' + (variation === 3 ? 'italic' : '')}>
                {variation === 2 ? <span className="text-gradient-neon">Contact Us</span> : 'Contact Us'}
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Have a question or need help? Our team is ready to assist you.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">

              {/* Contact Info */}
              <div className="space-y-4">
                {CONTACT_INFO.map(({ icon: Icon, label, value, sub }) => (
                  <div key={label} className={'rounded-2xl border border-border p-5 ' + (variation === 2 ? 'bg-card hover:border-neon/30' : 'bg-card hover:shadow-md') + ' transition-all'}>
                    <div className="flex items-start gap-4">
                      <div className={'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ' + (variation === 2 ? 'bg-neon/10' : 'bg-primary/10')}>
                        <Icon size={18} className={accentCls} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">{label}</p>
                        <p className="text-sm font-semibold text-foreground">{value}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                {sent ? (
                  <div className="bg-card border border-border rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-green-500" />
                    </div>
                    <h3 className={'font-heading text-2xl font-bold text-foreground mb-2 ' + (variation === 3 ? 'italic' : '')}>Message Sent!</h3>
                    <p className="text-muted-foreground mb-2">Thank you for reaching out, {form.name}.</p>
                    <p className="text-sm text-muted-foreground">We&apos;ll get back to you at <span className="text-foreground font-medium">{form.email}</span> within 24 hours.</p>
                    <button onClick={() => { setSent(false); setForm({ name: '', email: '', topic: '', message: '' }); }}
                      className={'mt-6 px-6 py-2.5 rounded-xl text-sm font-medium ' + accentBg}>
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-5">
                    <h2 className={'font-heading text-xl font-bold text-foreground mb-2 ' + (variation === 3 ? 'italic' : '')}>Send a Message</h2>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Name *</label>
                        <input value={form.name} onChange={e => setF('name', e.target.value)} required placeholder="John Doe" className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email Address *</label>
                        <input type="email" value={form.email} onChange={e => setF('email', e.target.value)} required placeholder="john@example.com" className={inputCls} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Topic</label>
                      <select value={form.topic} onChange={e => setF('topic', e.target.value)} className={inputCls}>
                        <option value="">Select a topic...</option>
                        {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Message *</label>
                      <textarea value={form.message} onChange={e => setF('message', e.target.value)} required rows={5}
                        placeholder="Tell us how we can help..." className={inputCls + ' resize-none'} />
                    </div>

                    {error && (
                      <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-sm font-medium">
                        {error}
                      </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={loading}
                      className={'w-full py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ' + accentBg + (loading ? ' opacity-70 cursor-not-allowed' : '')}
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} 
                      {loading ? 'Sending...' : 'Send Message'}
                    </button>

                    <p className="text-xs text-muted-foreground text-center">
                      By submitting, you agree to our{' '}
                      <a href="/privacy" className={'hover:underline ' + accentCls}>Privacy Policy</a>.
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* FAQ teaser */}
            <div className={'mt-16 rounded-2xl p-8 text-center ' + (variation === 2 ? 'bg-card border border-border' : 'bg-secondary')}>
              <h3 className={'font-heading text-xl font-bold text-foreground mb-2 ' + (variation === 3 ? 'italic' : '')}>Looking for quick answers?</h3>
              <p className="text-muted-foreground text-sm mb-4">Check our FAQ for instant help on orders, shipping, returns, and more.</p>
              <div className="flex flex-wrap justify-center gap-3">
                {['Order Tracking', 'Return Policy', 'Shipping Info', 'Payment Methods'].map(q => (
                  <span key={q} className="text-xs px-4 py-2 rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground transition-colors cursor-pointer">{q}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </Layout>
    </>
  );
}
