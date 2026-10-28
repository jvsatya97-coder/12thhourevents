import type { Metadata } from 'next';
import ServicePageTemplate from '@/components/ServicePageTemplate';

export const metadata: Metadata = {
  title: 'Birthday Decoration in Delhi NCR | 12th Hour Events',
  description: 'Book the best birthday decoration in Delhi NCR. Balloon setups, theme decorations, surprise setups. Same-day available. WhatsApp to book in 2 mins!',
};

const FAQS = [
  { q: 'How much does birthday decoration cost in Delhi?', a: 'Birthday decoration starts from ₹999 in Delhi NCR. We have packages for all budgets — basic balloon setups to premium theme decorations.' },
  { q: 'Can I book same-day birthday decoration?', a: 'Yes! We offer same-day birthday decoration setups across Delhi NCR. WhatsApp us and we will confirm availability.' },
  { q: 'What is included in birthday decoration?', a: 'Our packages typically include balloons, banners, foil balloons, LED lights, and more. Each package listing shows exact inclusions.' },
  { q: 'Do you set up at home?', a: 'Yes, we set up birthday decorations at home, hotels, banquet halls, and offices anywhere in Delhi NCR.' },
];

export default function Page() {
  return <ServicePageTemplate
    cat="bday" name="Birthday Decoration" emoji="🎂" slug="birthday-decoration"
    headline="Birthday Decoration in Delhi NCR 🎂"
    desc="Make every birthday unforgettable with our premium decoration setups. Same-day available, transparent pricing, WhatsApp booking in 2 minutes!"
    faqs={FAQS}
  />;
}
