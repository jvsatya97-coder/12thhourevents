import type { Metadata } from 'next';
import ServicePageTemplate from '@/components/ServicePageTemplate';

export const metadata: Metadata = {
  title: 'Balloon Decoration | 12th Hour Events — Pan India',
  description: 'Professional balloon decoration for birthdays, anniversaries, room surprises and all events. Balloon arches, ceilings, walls, bouquets and room setups. Book on WhatsApp!',
};

export default function Page() {
  return <ServicePageTemplate
    cat="balloon" name="Balloon Decoration" emoji="🎈" slug="balloon-decoration"
    headline="Balloon Decoration for Every Occasion 🎈"
    desc="From balloon arches and ceiling setups to surprise room decorations — premium balloon decor delivered and set up pan India."
    faqs={[
      { q: 'What types of balloon decoration do you offer?', a: 'We offer balloon arches, balloon ceilings, wall decor, ring decor, balloon bouquets, surprise room setups, LED balloon setups and more. All customizable for your occasion.' },
      { q: 'Can you decorate a hotel or home room with balloons?', a: 'Yes! We set up surprise room decorations in homes and hotels across all major cities. We coordinate entry permissions and set up while you are away.' },
      { q: 'How long does balloon decoration last?', a: 'Latex balloons last 12–24 hours; foil balloons last 3–5 days. For longer-lasting setups we recommend foil and air-filled arrangements.' },
      { q: 'Do you do custom balloon arches and pillars?', a: 'Absolutely — organic arches, stuffed balloons, number balloons, letter balloons and pillars in any color combination. Share your color reference on WhatsApp.' },
    ]}
  />;
}
