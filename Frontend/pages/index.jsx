import Head from 'next/head';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import HeroV1 from '../components/hero/variation-1';
import HeroV2 from '../components/hero/variation-2';
import HeroV3 from '../components/hero/variation-3';
import FeaturedCategories1 from '../components/featuredcategories/variation-1';
import FeaturedCategories2 from '../components/featuredcategories/variation-2';
import FeaturedCategories3 from '../components/featuredcategories/variation-3';
import ProductCarousel1 from '../components/productcarousel/variation-1';
import ProductCarousel2 from '../components/productcarousel/variation-2';
import ProductCarousel3 from '../components/productcarousel/variation-3';
import PromotionalBanner1 from '../components/promotionalbanner/variation-1';
import PromotionalBanner2 from '../components/promotionalbanner/variation-2';
import PromotionalBanner3 from '../components/promotionalbanner/variation-3';
import TestimonialSlider1 from '../components/testimonialslider/variation-1';
import TestimonialSlider2 from '../components/testimonialslider/variation-2';
import TestimonialSlider3 from '../components/testimonialslider/variation-3';
import BrandCarousel1 from '../components/brandcarousel/variation-1';
import BrandCarousel2 from '../components/brandcarousel/variation-2';
import BrandCarousel3 from '../components/brandcarousel/variation-3';
import Newsletter1 from '../components/newsletter/variation-1';
import Newsletter2 from '../components/newsletter/variation-2';
import Newsletter3 from '../components/newsletter/variation-3';
import AISuggestions1 from '../components/aisuggestions/variation-1';
import AISuggestions2 from '../components/aisuggestions/variation-2';
import AISuggestions3 from '../components/aisuggestions/variation-3';

const heroes = { 1: HeroV1, 2: HeroV2, 3: HeroV3 };
const categories = { 1: FeaturedCategories1, 2: FeaturedCategories2, 3: FeaturedCategories3 };
const carousels = { 1: ProductCarousel1, 2: ProductCarousel2, 3: ProductCarousel3 };
const banners = { 1: PromotionalBanner1, 2: PromotionalBanner2, 3: PromotionalBanner3 };
const testimonials = { 1: TestimonialSlider1, 2: TestimonialSlider2, 3: TestimonialSlider3 };
const brands = { 1: BrandCarousel1, 2: BrandCarousel2, 3: BrandCarousel3 };
const newsletters = { 1: Newsletter1, 2: Newsletter2, 3: Newsletter3 };
const suggestions = { 1: AISuggestions1, 2: AISuggestions2, 3: AISuggestions3 };

export default function HomePage() {
  const { variation } = useTheme();
  const Hero = heroes[variation] || HeroV1;
  const Categories = categories[variation] || FeaturedCategories1;
  const Carousel = carousels[variation] || ProductCarousel1;
  const Banner = banners[variation] || PromotionalBanner1;
  const Testimonials = testimonials[variation] || TestimonialSlider1;
  const Brands = brands[variation] || BrandCarousel1;
  const Newsletter = newsletters[variation] || Newsletter1;
  const AI = suggestions[variation] || AISuggestions1;

  return (
    <>
      <Head>
        <title>Teknova — Premium Tech Store</title>
        <meta name="description" content="Discover the latest in technology — premium devices for those who demand excellence." />
      </Head>
      <Layout>
        <Hero />
        <Categories />
        <Carousel />
        <Banner />
        <AI />
        <Testimonials />
        <Brands />
        <Newsletter />
      </Layout>
    </>
  );
}
