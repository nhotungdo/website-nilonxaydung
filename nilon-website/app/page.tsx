import Hero from '@/sections/Hero';
import FeaturedProducts from '@/sections/FeaturedProducts';
import WhyChooseUs from '@/sections/WhyChooseUs';
import CloudCursorTrail from '@/components/CloudCursorTrail';

export default function Home() {
  return (
    <>
      <CloudCursorTrail />
      <Hero />
      <FeaturedProducts />
      <WhyChooseUs />
    </>
  );
}
