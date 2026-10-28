import type { Metadata } from 'next';
import ServicePageTemplate from '@/components/ServicePageTemplate';

export const metadata: Metadata = {
  title: 'Baby Shower Decoration in Delhi NCR | 12th Hour Events',
  description: 'Beautiful baby shower decoration in Delhi NCR. It\'s a boy, it\'s a girl, gender neutral themes. Book on WhatsApp!',
};

export default function Page() {
  return <ServicePageTemplate
    cat="baby" name="Baby Shower" emoji="👶" slug="baby-shower"
    headline="Baby Shower Decoration in Delhi NCR 👶"
    desc="Celebrate the new arrival with a beautifully decorated baby shower. Boy, girl, or gender-neutral — every package is photo-ready!"
    faqs={[
      { q: 'Do you have gender reveal decoration?', a: 'Yes! We offer gender reveal setups with balloon boxes, confetti pops, and themed decorations.' },
      { q: 'Can you do baby shower at home?', a: 'Yes, we set up baby shower decorations at home, community halls, hotels — any venue in Delhi NCR.' },
    ]}
  />;
}
