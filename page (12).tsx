import type { Metadata } from 'next';
import ServicePageTemplate from '@/components/ServicePageTemplate';

export const metadata: Metadata = {
  title: 'Kids Activities & Entertainment | 12th Hour Events — Pan India',
  description: 'Fun kids party activities and entertainment across India. Clowns, magicians, face painting, games. Book on WhatsApp!',
};

export default function Page() {
  return <ServicePageTemplate
    cat="act-artists" name="Kids Activities" emoji="🎪" slug="activities"
    headline="Kids Party Activities & Entertainment 🎪"
    desc="Keep the kids entertained! Magicians, clowns, face painting, balloon artists, games — perfect for birthday parties."
    faqs={[
      { q: 'What activities do you offer for kids parties?', a: 'We offer magicians, clowns, face painting, balloon twisting, puppet shows, games anchors, and more.' },
      { q: 'How far in advance should I book?', a: 'Book at least 2-3 days in advance to ensure artist availability, though we can often accommodate last-minute requests.' },
    ]}
  />;
}
