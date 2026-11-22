'use client';
import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid';
import ProductGridServer from '@/components/ProductGridServer';
import CategoryBar from '@/components/CategoryBar';
import { SERVICES, DOMAIN } from '@/lib/config';
import type { Product } from '@/lib/products';

interface Props {
  cat: string; serviceName: string; serviceSlug: string; emoji: string;
  citySlug: string; cityName: string;
  initialProducts?: Product[];
}

const CITY_FAQS: Record<string, { q: string; a: string }[]> = {
  default: [
    { q: 'How much does decoration cost?', a: 'Packages start from ₹999. Prices vary by package and city. All prices shown are inclusive of setup charges — no hidden fees.' },
    { q: 'Can I book same-day decoration?', a: 'Yes! We offer same-day setup subject to slot availability. WhatsApp us and we confirm within minutes.' },
    { q: 'Do you set up at home?', a: 'Yes, we set up at homes, hotels, banquet halls, offices and any venue across all our service cities.' },
    { q: 'What is the booking process?', a: 'Browse packages → WhatsApp us your preferred package and date → Confirm payment → We set up at your venue. Done in under 10 minutes.' },
  ],
};

export default function CityServiceTemplate({ cat, serviceName, serviceSlug, emoji, citySlug, cityName, initialProducts }: Props) {
  const faqs = CITY_FAQS[`${serviceSlug}-${citySlug}`] || CITY_FAQS.default;
  const pageUrl = `${DOMAIN}/${serviceSlug}-${citySlug}`;

  const schemaLocalBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `12th Hour Events — ${serviceName} in ${cityName}`,
    "@id": pageUrl,
    "url": pageUrl,
    "telephone": "+918073552837",
    "description": `Professional ${serviceName.toLowerCase()} services in ${cityName}. Same-day setup available, transparent pricing, 5000+ happy customers.`,
    "areaServed": { "@type": "City", "name": cityName },
    "priceRange": "₹999 - ₹25000",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      "opens": "08:00",
      "closes": "22:00"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "5247",
      "bestRating": "5"
    }
  };

  const schemaFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": DOMAIN },
      { "@type": "ListItem", "position": 2, "name": serviceName, "item": `${DOMAIN}/${serviceSlug}` },
      { "@type": "ListItem", "position": 3, "name": `${serviceName} in ${cityName}`, "item": pageUrl },
    ]
  };

  return (
    <div>
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaLocalBusiness) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />

      {/* Hero */}
      <section className="hero-bg text-white py-14 relative">
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          {/* Breadcrumb visible */}
          <nav className="text-xs text-gray-400 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-1">›</span>
            <Link href={`/${serviceSlug}`} className="hover:text-white">{serviceName}</Link>
            <span className="mx-1">›</span>
            <span className="text-gray-200">{cityName}</span>
          </nav>
          <div className="text-5xl mb-3">{emoji}</div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3">
            {serviceName} in {cityName}
          </h1>
          <p className="text-gray-300 text-lg mb-2">
            Premium {serviceName.toLowerCase()} in {cityName} — same-day setup, transparent pricing, WhatsApp booking!
          </p>
          <p className="text-orange-300 text-sm font-semibold mb-6">⚡ Packages from ₹999 · 5000+ events done · 4.9★ rated</p>
          <a href="https://wa.me/918073552837" target="_blank" rel="noopener noreferrer" className="btn-pink px-8 py-3">
            📲 Book in {cityName} — WhatsApp
          </a>
        </div>
      </section>

      <CategoryBar />

      {/* Products — server-rendered for SEO + interactive client grid for users */}
      <section className="py-14 max-w-screen-2xl mx-auto px-4">
        <h2 className="section-title">{serviceName} <span className="grad-text">Packages in {cityName}</span></h2>
        <p className="section-sub">All prices shown for {cityName} · inclusive of setup</p>
        {/* Server grid: indexed by Google, hidden once JS loads */}
        {initialProducts && initialProducts.length > 0 && (
          <ProductGridServer products={initialProducts} city={citySlug} />
        )}
        {/* Interactive grid: sorting, filtering, city prices */}
        <ProductGrid cat={cat} showFilters={true} initialProducts={initialProducts} />
      </section>

      {/* FAQ — great for SEO */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">
            FAQs — {serviceName} in {cityName}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm group">
                <summary className="px-5 py-4 font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-orange-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Internal linking — other services in city */}
      <section className="py-10 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4">
          <h2 className="text-xl font-bold text-center mb-2 text-gray-800">More Services in {cityName}</h2>
          <p className="text-center text-sm text-gray-500 mb-5">We do it all — explore our full range</p>
          <div className="flex flex-wrap justify-center gap-3">
            {SERVICES.filter(s => s.slug !== serviceSlug && s.slug !== 'addons').map(s => (
              <Link key={s.slug} href={`/${s.slug}-${citySlug}`}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-orange-300 hover:text-orange-600 transition text-gray-700">
                {s.emoji} {s.name} in {cityName}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 hero-bg text-white">
        <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-extrabold mb-3">Ready to Book {serviceName} in {cityName}? {emoji}</h2>
          <p className="text-gray-300 mb-6">Same-day slots available. Free quote in 2 minutes via WhatsApp.</p>
          <a href="https://wa.me/918073552837" target="_blank" rel="noopener noreferrer" className="btn-pink px-8 py-3">
            📲 WhatsApp Us Now
          </a>
        </div>
      </section>
    </div>
  );
}
