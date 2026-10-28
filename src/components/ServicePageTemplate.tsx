import type { Metadata } from 'next';
import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid';
import { CITIES } from '@/lib/config';

interface Props {
  cat: string; name: string; emoji: string; slug: string;
  headline: string; desc: string;
  faqs: { q: string; a: string }[];
}

export function generateServiceMetadata(p: Props): Metadata {
  return {
    title: `${p.name} in Delhi NCR | 12th Hour Events`,
    description: p.desc,
    openGraph: { title: `${p.name} in Delhi NCR`, description: p.desc, type: 'website' },
  };
}

export default function ServicePageTemplate({ cat, name, emoji, slug, headline, desc, faqs }: Props) {
  const schemaFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };

  return (
    <div>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }} />

      {/* Hero */}
      <section className="hero-bg text-white py-14">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="text-6xl mb-4">{emoji}</div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3">{headline}</h1>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">{desc}</p>
          <a href="https://wa.me/918073552837?text=Hi! I want to book a decoration." target="_blank" rel="noopener noreferrer" className="btn-pink px-8 py-3 text-base">
            📲 Book Now — WhatsApp
          </a>
        </div>
      </section>

      {/* Products */}
      <section className="py-14 max-w-7xl mx-auto px-4">
        <h2 className="section-title">{name} <span className="grad-text">Packages</span></h2>
        <p className="section-sub">Choose the perfect package for your celebration</p>
        <ProductGrid cat={cat} />
      </section>

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="py-14 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="section-title mb-8">Frequently Asked <span className="grad-text">Questions</span></h2>
            <div className="space-y-4">
              {faqs.map((f, i) => (
                <details key={i} className="card p-5 group">
                  <summary className="font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-center">
                    {f.q} <span className="text-pink-400 ml-2 group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* City links */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">{name} in <span className="grad-text">Your City</span></h2>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {CITIES.map(c => (
              <Link key={c.slug} href={`/${slug}-${c.slug}`}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-pink-100 hover:text-pink-700 transition">
                {name} in {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 hero-bg text-white">
        <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-extrabold mb-3">Book Your {name} Today! {emoji}</h2>
          <p className="text-gray-300 mb-6">Same-day setups available. Get a free quote in 2 minutes.</p>
          <a href="https://wa.me/918073552837" target="_blank" rel="noopener noreferrer" className="btn-pink px-8 py-3">
            📲 WhatsApp Us Now
          </a>
        </div>
      </section>
    </div>
  );
}
