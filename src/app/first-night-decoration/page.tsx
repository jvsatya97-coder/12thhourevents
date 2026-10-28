import type { Metadata } from 'next';
import ServicePageTemplate from '@/components/ServicePageTemplate';

export const metadata: Metadata = {
  title: 'First Night Decoration in Delhi NCR | 12th Hour Events',
  description: 'Romantic first night / wedding night decoration in Delhi NCR. Roses, candles, fairy lights. Book on WhatsApp!',
};

export default function Page() {
  return <ServicePageTemplate
    cat="firstnight" name="First Night Decoration" emoji="🌹" slug="first-night-decoration"
    headline="First Night Decoration in Delhi NCR 🌹"
    desc="Make the first night magical with roses, candles, fairy lights, and a romantic atmosphere specially curated for you."
    faqs={[
      { q: 'What is included in first night decoration?', a: 'Packages include rose petals, candles, fairy lights, balloons, and personalised elements. We coordinate discreetly with your hotel or home.' },
    ]}
  />;
}
