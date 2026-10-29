import type { Metadata } from 'next';
import ServicePageTemplate, { generateServiceMetadata } from '@/components/ServicePageTemplate';

const props = {
  cat: 'welcomebaby',
  name: 'Welcome Baby',
  emoji: '🍼',
  slug: 'welcome-baby',
  headline: 'Welcome Baby Decoration 🍼',
  desc: 'Celebrate the newest member of your family with a warm and beautiful welcome baby setup. Balloons, banners, flowers and photo-ready décor to make the homecoming unforgettable!',
  faqs: [
    { q: 'What is included in a Welcome Baby decoration?', a: 'Typically includes balloons, banners ("Welcome Home Baby"), flowers, and a themed backdrop. We customise to your preference.' },
    { q: 'Can you do it at the hospital or at home?', a: 'Yes! We set up at home, hospital rooms, or any venue. Just let us know the location on WhatsApp.' },
    { q: 'Do you offer same-day setups?', a: 'Absolutely — we are available 365 days a year including same-day bookings.' },
    { q: 'Can I get a custom name or message on the decoration?', a: 'Yes, we can add custom name banners and personalised messages to any welcome baby package.' },
  ],
};

export const metadata: Metadata = generateServiceMetadata(props);

export default function Page() {
  return <ServicePageTemplate {...props} />;
}
