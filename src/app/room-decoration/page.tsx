import type { Metadata } from 'next';
import ServicePageTemplate from '@/components/ServicePageTemplate';

export const metadata: Metadata = {
  title: 'Room Decoration in Delhi NCR | 12th Hour Events',
  description: 'Romantic & surprise room decoration in Delhi NCR. Balloon canopy, flowers, fairy lights. Book on WhatsApp!',
};

export default function Page() {
  return <ServicePageTemplate
    cat="room" name="Room Decoration" emoji="🛏️" slug="room-decoration"
    headline="Surprise Room Decoration in Delhi NCR 🛏️"
    desc="Create a magical bedroom surprise — balloon canopy, rose petals, fairy lights, and personalized touches for any occasion."
    faqs={[
      { q: 'Can you decorate a hotel room?', a: 'Yes! We coordinate with hotels across Delhi NCR for room setups. We handle entry permissions and set up while you are out.' },
      { q: 'What is included in room decoration?', a: 'Packages include balloons, flowers, fairy lights, candles, and customizable banners. See each package for exact items.' },
    ]}
  />;
}
