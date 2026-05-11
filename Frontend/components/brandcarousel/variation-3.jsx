import { useTheme } from '../../context/ThemeContext';

const brands = ['Apple','Samsung','Sony','Dell','Logitech','Razer','Bose','Fujifilm'];

export default function BrandCarousel3() {
  const { variation } = useTheme();
  return (
    <section className={'py-16 ' + (variation === 2 ? 'bg-card border-y border-border' : 'bg-secondary')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs tracking-widest uppercase text-muted-foreground mb-8">Trusted Brands</p>
        <div className="flex justify-center items-center gap-8 md:gap-16 flex-wrap">
          {brands.map(brand => (
            <span key={brand} className={'font-heading text-lg md:text-xl font-bold tracking-wider transition-colors cursor-default ' + (variation === 2 ? 'text-muted-foreground hover:text-neon' : variation === 3 ? 'text-muted-foreground hover:text-primary italic' : 'text-muted-foreground hover:text-foreground')}>
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
