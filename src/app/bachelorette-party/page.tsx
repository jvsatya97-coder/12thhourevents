import type { Metadata } from 'next';
import ServicePageTemplate from '@/components/ServicePageTemplate';
import { fetchProductsServer } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Bachelorette Party Decoration in Delhi NCR | 12th Hour Events',
  description: 'Fun bachelorette party decoration in Delhi NCR. Bride tribe, neon, disco themes. Book on WhatsApp!',
  alternates: { canonical: 'https://12thhourevents.in/bachelorette-party' },
};

export default async function Page() {
  const allProducts = await fetchProductsServer();
  const initialProducts = allProducts.filter(p => p.cat.toLowerCase().trim() === 'bachelorette');
  return <ServicePageTemplate
    cat="bachelorette" name="Bachelorette Party" emoji="💃" slug="bachelorette-party"
    headline="Bachelorette Party Decoration in Delhi NCR 💃"
    desc="Send off the bride in style! Neon, disco, bride tribe themes — fun, vibrant, Instagram-worthy setups."
    faqs={[
      { q: 'What themes are popular for bachelorette parties?', a: 'Top themes include bride tribe, neon glow, disco, garden party, and luxury pink. We customize to match your vibe.' },
    ]}
  />;
}
