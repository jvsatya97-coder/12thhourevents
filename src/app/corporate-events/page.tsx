import type { Metadata } from 'next';
import ServicePageTemplate from '@/components/ServicePageTemplate';

export const metadata: Metadata = {
  title: 'Corporate Event Decoration in Delhi NCR | 12th Hour Events',
  description: 'Professional corporate event decoration in Delhi NCR. Product launches, office parties, award nights. Book on WhatsApp!',
};

export default function Page() {
  return <ServicePageTemplate
    cat="corporate" name="Corporate Events" emoji="🏢" slug="corporate-events"
    headline="Corporate Event Decoration in Delhi NCR 🏢"
    desc="Professional, brand-aligned corporate event setups — product launches, award nights, office parties, team celebrations."
    faqs={[
      { q: 'Do you handle large corporate events?', a: 'Yes! We handle events of all sizes from small office parties to large conferences and award nights across Delhi NCR.' },
      { q: 'Can you incorporate our brand colors?', a: 'Absolutely! We customize all decorations to match your brand identity and color palette.' },
    ]}
  />;
}
