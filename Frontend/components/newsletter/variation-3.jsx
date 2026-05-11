import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Send } from 'lucide-react';

export default function Newsletter3() {
  const { variation } = useTheme();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => { e.preventDefault(); if (email) setSubscribed(true); };

  if (subscribed) return (
    <section className="py-20 bg-primary">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h3 className="font-heading text-2xl font-bold text-primary-foreground mb-2">Thank you!</h3>
        <p className="text-primary-foreground/80">You'll be the first to know about new drops.</p>
      </div>
    </section>
  );

  if (variation === 2) return (
    <section className="py-20 bg-card border-y border-border">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="font-heading text-3xl font-bold tracking-wider uppercase mb-3"><span className="text-gradient-neon">Stay Charged</span></h3>
        <p className="text-muted-foreground mb-8">Get early access to drops, deals, and tech news.</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="your@email.com"
            className="flex-1 bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-neon transition-colors" />
          <button type="submit" className="bg-gradient-neon text-teknova-dark px-6 py-3 rounded-lg font-bold tracking-wide glow-neon flex items-center justify-center gap-2">
            <Send size={16} /> Subscribe
          </button>
        </form>
      </div>
    </section>
  );

  if (variation === 3) return (
    <section className="py-24 bg-background">
      <div className="max-w-xl mx-auto px-6 lg:px-8 text-center">
        <h3 className="font-heading text-3xl font-semibold text-foreground italic mb-3">Join the List</h3>
        <p className="text-muted-foreground mb-8 leading-relaxed">Be first to discover new arrivals and exclusive offers.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="Enter your email"
            className="w-full bg-transparent border-b border-border px-0 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors text-center font-heading" />
          <button type="submit" className="text-foreground font-heading border-b-2 border-primary pb-1 hover:gap-4 transition-all inline-flex items-center gap-2">
            Subscribe <Send size={16} />
          </button>
        </form>
      </div>
    </section>
  );

  return (
    <section className="py-20 bg-primary">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="font-heading text-3xl font-bold text-primary-foreground mb-3">Stay in the Loop</h3>
        <p className="text-primary-foreground/80 mb-8">New arrivals, exclusive deals, and tech news delivered to your inbox.</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="your@email.com"
            className="flex-1 bg-primary-foreground/10 border border-primary-foreground/20 rounded-full px-6 py-3 text-primary-foreground placeholder:text-primary-foreground/60 outline-none" />
          <button type="submit" className="bg-primary-foreground text-primary px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <Send size={16} /> Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
