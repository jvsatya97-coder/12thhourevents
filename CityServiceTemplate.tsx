import type { Metadata } from 'next';
import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid';
import { SERVICES } from '@/lib/config';

interface Props {
  cat: string; serviceName: string; serviceSlug: string; emoji: string;
  citySlug: string; cityName: string;
}

export function generateCityMetadata({ serviceName, cityName }: { serviceName: string; cityName: string }): Metadata {
  return {
    title: `${serviceName} in ${cityName} | 12th Hour Events`,
    description: `Best ${serviceName.toLowerCase()} in ${cityName}. Premium packages, same-day available. Book in 2 mins on WhatsApp! 12th Hour Events.`,
  };
}

export default function CityServiceTemplate({ cat, serviceName, serviceSlug, emoji, citySlug, cityName }: Props) {
  return (
    <div>
      <section className="hero-bg text-white py-14 relative">
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="text-5xl mb-3">{emoji}</div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3">
            {serviceName} in {cityName}
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Premium {serviceName.toLowerCase()} services in {cityName}. Same-day setups, transparent pricing, WhatsApp booking!
          </p>
          <a href="https://wa.me/918073552837" target="_blank" rel="noopener noreferrer" className="btn-pink px-8 py-3">
            📲 Book in {cityName} — WhatsApp
          </a>
        </div>
      </section>

      <section className="py-14 max-w-7xl mx-auto px-4">
        <h2 className="section-title">{serviceName} <span className="grad-text">Packages</span></h2>
        <p className="section-sub">Prices shown for {cityName}</p>
        <ProductGrid cat={cat} />
      </section>

      {/* Other services */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-center mb-6">More Services in {cityName}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {SERVICES.filter(s => s.slug !== serviceSlug).map(s => (
              <Link key={s.slug} href={`/${s.slug}-${citySlug}`}
                className="px-4 py-2 bg-white border rounded-full text-sm hover:border-orange-300 hover:text-orange-600 transition">
                {s.emoji} {s.name} in {cityName}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 hero-bg text-white">
        <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-extrabold mb-3">Book {serviceName} in {cityName} {emoji}</h2>
          <p className="text-gray-300 mb-6">Same-day available. Free quote in 2 minutes.</p>
          <a href="https://wa.me/918073552837" target="_blank" rel="noopener noreferrer" className="btn-pink px-8 py-3">
            📲 WhatsApp Us Now
          </a>
        </div>
      </section>
    </div>
  );
}
