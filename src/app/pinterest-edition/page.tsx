import type { Metadata } from 'next';
import ServicePageTemplate, { generateServiceMetadata } from '@/components/ServicePageTemplate';

const props = {
  cat: 'pinterest',
  name: 'Pinterest Edition',
  emoji: '📌',
  slug: 'pinterest-edition',
  headline: 'Pinterest Edition Decoration 📌',
  desc: 'Trending decoration ideas straight from Pinterest — aesthetic, photo-ready setups that are totally on-trend. Show us a pin, we recreate it!',
  faqs: [
    {
      q: 'How does Pinterest Edition work?',
      a: 'Simply share your favourite Pinterest decoration photos with us on WhatsApp and we will recreate the look at your venue. We source all the materials and set it up for you.',
    },
    {
      q: 'Can you match any Pinterest style exactly?',
      a: 'We do our best to recreate the look and feel. Some props may vary based on local availability, but we always match the theme, colours and vibe closely.',
    },
    {
      q: 'What are the most popular Pinterest decoration trends you offer?',
      a: 'Currently trending: pastel balloon arches, dried flower setups, neon sign backdrops, boho-style draping, fairy light canopies, and minimalist table setups.',
    },
    {
      q: 'Is there a minimum budget for Pinterest Edition?',
      a: 'Pinterest Edition setups start from ₹2499. Premium multi-element setups are priced based on complexity — we will send you a quote after you share your reference photos.',
    },
    {
      q: 'How far in advance should I share my Pinterest references?',
      a: 'Share your pins at least 2–3 days before the event so we can arrange all the materials. For elaborate setups, 5–7 days is ideal.',
    },
  ],
};

export const metadata: Metadata = generateServiceMetadata(props);

export default function Page() {
  return <ServicePageTemplate {...props} />;
}
