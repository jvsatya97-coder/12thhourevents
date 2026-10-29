import type { Metadata } from 'next';
import ServicePageTemplate from '@/components/ServicePageTemplate';

export const metadata: Metadata = {
  title: 'Anniversary Decoration | 12th Hour Events — Pan India',
  description: 'Romantic anniversary decoration setups across India. Roses, candles, balloons, fairy lights. Book on WhatsApp in 2 minutes!',
};

const FAQS = [
  { q: 'What is the cost of anniversary decoration?', a: 'Anniversary decoration starts from ₹1499, including roses, candles, balloons and fairy lights. Price may vary by city.' },
  { q: 'Can you set up a surprise anniversary decoration?', a: 'Absolutely! We specialize in surprise setups. Share the venue and timing and we will handle everything secretly.' },
  { q: 'Do you do hotel room anniversary decoration?', a: 'Yes, we coordinate with hotels pan India for in-room anniversary setups. We handle all permissions.' },
];

export default function Page() {
  return <ServicePageTemplate
    cat="anniv" name="Anniversary Decoration" emoji="❤️" slug="anniversary-decoration"
    headline="Anniversary Decoration ❤️"
    desc="Celebrate your love story with our romantic anniversary decoration setups. Roses, candles, fairy lights — same-day available!"
    faqs={FAQS}
  />;
}
