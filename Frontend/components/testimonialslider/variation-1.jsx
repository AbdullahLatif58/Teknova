import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  { name: 'Alex M.', role: 'Software Engineer', rating: 5, text: "The best tech store I've ever used. Fast shipping, amazing products, and incredible customer service." },
  { name: 'Sarah K.', role: 'Designer', rating: 5, text: "Found my dream setup here. The curated selection makes it so easy to find quality products." },
  { name: 'James L.', role: 'Content Creator', rating: 4, text: "Premium products at competitive prices. The Sony headphones I bought have been life-changing." },
];

export default function TestimonialSlider1() {
  const { variation } = useTheme();
  const [active, setActive] = useState(0);

  if (variation === 2) return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-bold text-center tracking-wider uppercase mb-12"><span className="text-gradient-neon">Reviews</span></h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t,i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 hover:border-neon/30 transition-colors">
              <div className="flex gap-1 mb-4">{[...Array(5)].map((_,j) => <Star key={j} size={14} className={j < t.rating ? 'fill-neon text-neon' : 'text-muted-foreground'} />)}</div>
              <p className="text-foreground mb-4 text-sm leading-relaxed">"{t.text}"</p>
              <p className="font-heading font-semibold text-foreground text-sm">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  if (variation === 3) return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <Quote size={40} className="text-primary/30 mx-auto mb-8" />
        <p className="font-heading text-2xl md:text-3xl font-semibold text-foreground italic leading-relaxed mb-8">"{testimonials[active].text}"</p>
        <p className="font-heading font-semibold text-foreground">{testimonials[active].name}</p>
        <p className="text-sm text-muted-foreground">{testimonials[active].role}</p>
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_,i) => (
            <button key={i} onClick={() => setActive(i)} className={'w-2 h-2 rounded-full transition-all ' + (i === active ? 'bg-primary w-8' : 'bg-border')} />
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <section className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12"><h2 className="font-heading text-3xl font-bold text-foreground">What Customers Say</h2></div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t,i) => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex gap-1 mb-4">{[...Array(5)].map((_,j) => <Star key={j} size={14} className={j < t.rating ? 'fill-primary text-primary' : 'text-muted-foreground'} />)}</div>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">"{t.text}"</p>
              <p className="font-heading font-semibold text-foreground text-sm">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
