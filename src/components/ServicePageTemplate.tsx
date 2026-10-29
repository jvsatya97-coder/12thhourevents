import type { Metadata } from 'next';
import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid';
import { CITIES } from '@/lib/config';

interface Props {
  cat: string; name: string; emoji: string; slug: string;
  headline: string; desc: string;
  faqs: { q: string; a: string }[];
}

const TRUST = [
  { emoji: '⚡', label: 'Same-Day Setup' },
  { emoji: '✅', label: '5000+ Events Done' },
  { emoji: '💰', label: 'No Hidden Charges' },
  { emoji: '📸', label: 'Photo-Ready Setups' },
  { emoji: '🛡️', label: '100% Satisfaction' },
];

const SERVICE_REVIEWS: Record<string, { name: string; city: string; text: string }[]> = {};
const DEFAULT_REVIEWS = [
  { name: 'Anjali R.', city: 'Delhi', text: 'The team was professional and transformed our space beautifully. Everything looked exactly as discussed. Highly recommend!' },
  { name: 'Karan S.', city: 'Gurgaon', text: 'Quick response, affordable pricing and amazing setup. Booked through WhatsApp and the whole process was effortless.' },
  { name: 'Meera P.', city: 'Noida', text: 'Very impressed! They arrived on time, set up everything perfectly, and even the cleanup was neat. Will book again.' },
];

export function generateServiceMetadata(p: Props): Metadata {
  return {
    title: `${p.name} in Delhi NCR | 12th Hour Events`,
    description: p.desc,
    openGraph: { title: `${p.name} in Delhi NCR`, description: p.desc, type: 'website' },
  };
}

export default function ServicePageTemplate({ cat, name, emoji, slug, headline, desc, faqs }: Props) {
  const reviews = SERVICE_REVIEWS[cat] || DEFAULT_REVIEWS;

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
    <div className="pb-mobile">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }} />

      {/* Hero */}
      <section className="hero-bg text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="text-5xl md:text-6xl mb-4">{emoji}</div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3">{headline}</h1>
          <p className="text-gray-300 text-base md:text-lg mb-8 max-w-2xl mx-auto">{desc}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="https://wa.me/918073552837?text=Hi! I want to book a decoration." target="_blank" rel="noopener noreferrer" className="btn-pink px-7 py-3 text-base">
              📲 Book Now — WhatsApp
            </a>
            <a href="tel:+918073552837" className="border border-white/30 text-white px-7 py-3 rounded-full font-semibold hover:bg-white/10 transition text-base">
              📞 Call Us
            </a>
          </div>
          {/* Trust mini-badges in hero */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm text-gray-300">
            <span>✅ Same-Day Available</span>
            <span>⭐ 4.9 Rated</span>
            <span>🎉 5000+ Events</span>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-white border-b border-gray-100 py-3 overflow-hidden">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide px-4 max-w-7xl mx-auto" style={{ scrollbarWidth: 'none' }}>
          {TRUST.map((t, i) => (
            <div key={i} className="flex-none flex items-center gap-1.5 text-sm text-gray-600 whitespace-nowrap">
              <span>{t.emoji}</span> <span className="font-medium">{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Products with filters */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <h2 className="section-title">{name} <span className="grad-text">Packages</span></h2>
        <p className="section-sub">Choose the perfect package for your celebration</p>
        <ProductGrid cat={cat} showFilters={true} />
      </section>

      {/* Reviews */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="section-title mb-2">Customer <span className="grad-text">Reviews</span></h2>
          <p className="section-sub">What people say about our {name.toLowerCase()}</p>
          <div className="grid sm:grid-cols-3 gap-5">
            {reviews.map((r, i) => (
              <div key={i} className="card p-5">
                <div className="text-orange-400 text-sm mb-2">★★★★★</div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">&ldquo;{r.text}&rdquo;</p>
                <div className="text-sm font-semibold text-gray-800">{r.name} <span className="text-orange-500 font-normal">· {r.city}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="section-title mb-8">Frequently Asked <span className="grad-text">Questions</span></h2>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <details key={i} className="card p-5 group">
                  <summary className="font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-start gap-3">
                    <span>{f.q}</span>
                    <span className="text-orange-400 mt-0.5 shrink-0 group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* City links */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">{name} in <span className="grad-text">Your City</span></h2>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {CITIES.map(c => (
              <Link key={c.slug} href={`/${slug}-${c.slug}`}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition">
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
          <p className="text-gray-300 mb-6">Same-day setups available. Get a free quote in 2 minutes on WhatsApp.</p>
          <a href="https://wa.me/918073552837" target="_blank" rel="noopener noreferrer" className="btn-pink px-8 py-3">
            📲 WhatsApp Us Now
          </a>
        </div>
      </section>
    </div>
  );
}
