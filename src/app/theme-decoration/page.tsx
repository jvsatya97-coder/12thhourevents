import type { Metadata } from 'next';
import ServicePageTemplate from '@/components/ServicePageTemplate';

export const metadata: Metadata = {
  title: 'Theme Decoration in Delhi NCR | 12th Hour Events',
  description: 'Custom theme party decorations in Delhi NCR. Princess, superhero, Bollywood, retro and more. Book on WhatsApp!',
};

export default function Page() {
  return <ServicePageTemplate
    cat="theme" name="Theme Decoration" emoji="🎨" slug="theme-decoration"
    headline="Theme Party Decoration in Delhi NCR 🎨"
    desc="Bring any theme to life! Princess, superhero, Bollywood, vintage — we create immersive setups that wow your guests."
    faqs={[
      { q: 'What themes do you offer?', a: 'We offer 50+ themes — princess, superhero, Bollywood, Hollywood, retro, unicorn, tropical, and more. Custom themes on request.' },
      { q: 'How far in advance should I book a theme decoration?', a: 'We recommend 2-3 days for elaborate theme setups, but we also take last-minute orders based on availability.' },
    ]}
  />;
}
