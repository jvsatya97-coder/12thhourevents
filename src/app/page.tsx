import type { Metadata } from 'next';
import Link from 'next/link';
import { SERVICES, CITIES } from '@/lib/config';
import ProductGrid from '@/components/ProductGrid';

export const metadata: Metadata = {
  title: '12th Hour Events | #1 Party & Birthday Decorators in Delhi NCR',
  description: 'Book premium party decorators in Delhi NCR. Birthday, anniversary, theme, room & more. Same-day setups. WhatsApp booking in 2 minutes!',
};

const WHY = [
  { emoji: '⚡', title: 'Same-Day Setup', desc: 'Book today, decorate today. Available 365 days a year.' },
  { emoji: '💰', title: 'Best Prices', desc: 'Transparent pricing with no hidden charges. City-specific rates.' },
  { emoji: '⭐', title: '5000+ Happy Clients', desc: 'Trusted across Delhi NCR and pan India.' },
  { emoji: '📸', title: 'Photo-Ready', desc: 'Every setup is designed to look stunning in photos.' },
  { emoji: '🎨', title: 'Custom Themes', desc: 'Personalised setups to match your vision.' },
  { emoji: '📞', title: 'WhatsApp Easy', desc: 'Book in 2 minutes directly on WhatsApp.' },
];

export default function Home() {
  return (
    <div className="pb-mobile">
      {/* Hero */}
      <section className="hero-bg text-white py-16 md:py-24 relative">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-6">
            🌟 Delhi's Most Trusted Party Decorators
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Make Every Moment<br />
            <span className="grad-text">Unforgettable ✨</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Premium birthday, anniversary & party decorations across Delhi NCR. Same-day setups. Book in 2 minutes on WhatsApp!
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

      {/* Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">Our <span className="grad-text">Services</span></h2>
          <p className="section-sub">Everything you need for the perfect celebration</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {SERVICES.map(s => (
              <Link key={s.slug} href={`/${s.slug}`}
                className="card p-4 text-center hover:border-orange-200 border border-transparent">
                <div className="text-4xl mb-2">{s.emoji}</div>
                <div className="font-semibold text-sm text-gray-700">{s.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular packages */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">Popular <span className="grad-text">Packages</span></h2>
          <p className="section-sub">Top picks loved by our customers</p>
          <ProductGrid limit={8} />
          <div className="text-center mt-8">
            <Link href="/birthday-decoration" className="btn-pink">View All Packages →</Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">Why Choose <span className="grad-text">12th Hour?</span></h2>
          <p className="section-sub">The trusted name in party decoration</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {WHY.map((w, i) => (
              <div key={i} className="card p-6 text-center">
                <div className="text-4xl mb-3">{w.emoji}</div>
                <h3 className="font-bold text-gray-800 mb-1">{w.title}</h3>
                <p className="text-sm text-gray-500">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">We Serve <span className="grad-text">Pan India</span></h2>
          <p className="section-sub">Available in 14+ cities across India</p>
          <div className="flex flex-wrap justify-center gap-3">
            {CITIES.map(c => (
              <Link key={c.slug} href={`/birthday-decoration-${c.slug}`}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-orange-100 hover:text-orange-700 transition">
                📍 {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 hero-bg text-white">
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to Create Magic? 🎉</h2>
          <p className="text-gray-300 mb-8">Chat with us on WhatsApp and get a free customized quote in minutes.</p>
          <a href="https://wa.me/918073552837?text=Hi! I want to plan a party decoration." target="_blank" rel="noopener noreferrer" className="btn-pink text-lg px-10 py-4">
            📲 Chat on WhatsApp — Free Quote
          </a>
        </div>
      </section>
    </div>
  );
}
