import type { Metadata } from 'next';
import ServicePageTemplate from '@/components/ServicePageTemplate';

export const metadata: Metadata = {
  title: 'Bachelorette Party Decoration in Delhi NCR | 12th Hour Events',
  description: 'Fun bachelorette party decoration in Delhi NCR. Bride tribe, neon, disco themes. Book on WhatsApp!',
};

export default function Page() {
  return <ServicePageTemplate
    cat="bachelorette" name="Bachelorette Party" emoji="💃" slug="bachelorette-party"
    headline="Bachelorette Party Decoration in Delhi NCR 💃"
    desc="Send off the bride in style! Neon, disco, bride tribe themes — fun, vibrant, Instagram-worthy setups."
    faqs={[
      { q: 'What themes are popular for bachelorette parties?', a: 'Top themes include bride tribe, neon glow, disco, garden party, and luxury pink. We customize to match your vibe.' },
    ]}
  />;
}
