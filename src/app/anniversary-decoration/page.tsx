import type { Metadata } from 'next';
import ServicePageTemplate from '@/components/ServicePageTemplate';

export const metadata: Metadata = {
  title: 'Anniversary Decoration in Delhi NCR | 12th Hour Events',
  description: 'Romantic anniversary decoration setups in Delhi NCR. Roses, candles, balloons, fairy lights. Book on WhatsApp in 2 minutes!',
};

const FAQS = [
  { q: 'What is the cost of anniversary decoration in Delhi?', a: 'Anniversary decoration starts from ₹1499 in Delhi NCR, including roses, candles, balloons and fairy lights.' },
  { q: 'Can you set up a surprise anniversary decoration?', a: 'Absolutely! We specialize in surprise setups. Share the venue and timing and we will handle everything secretly.' },
  { q: 'Do you do hotel room anniversary decoration?', a: 'Yes, we coordinate with hotels across Delhi NCR for in-room anniversary setups. We handle all permissions.' },
];

export default function Page() {
  return <ServicePageTemplate
    cat="anniv" name="Anniversary Decoration" emoji="❤️" slug="anniversary-decoration"
    headline="Anniversary Decoration in Delhi NCR ❤️"
    desc="Celebrate your love story with our romantic anniversary decoration setups. Roses, candles, fairy lights — same-day available!"
    faqs={FAQS}
  />;
}
