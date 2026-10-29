'use client';
import Link from 'next/link';
import { useCity } from '@/context/CityContext';

export default function HomeHero() {
  const { cityName } = useCity();

  return (
    <section className="hero-bg text-white py-16 md:py-24 relative">
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-6">
          🌟 {cityName}&apos;s Most Trusted Party Decorators
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
          Make Every Moment<br />
          <span className="grad-text">Unforgettable ✨</span>
        </h1>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Premium birthday, anniversary &amp; party decorations in {cityName}. Same-day setups. Book in 2 minutes on WhatsApp!
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="https://wa.me/918073552837?text=Hi! I want to book a decoration." target="_blank" rel="noopener noreferrer" className="btn-pink text-base px-8 py-3">
            📲 Book Now — Free
          </a>
          <Link href="/birthday-decoration" className="border border-white/30 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition">
            View Packages →
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-gray-300">
          <span>✅ 5000+ Events Done</span>
          <span>✅ Same Day Available</span>
          <span>✅ Pan India</span>
        </div>
      </div>
    </section>
  );
}
