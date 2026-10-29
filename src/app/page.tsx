import type { Metadata } from 'next';
import Link from 'next/link';
import { SERVICES, CITIES } from '@/lib/config';
import ProductGrid from '@/components/ProductGrid';
import HomeHero from '@/components/HomeHero';

export const metadata: Metadata = {
  title: '12th Hour Events | #1 Party & Birthday Decorators in Delhi NCR',
  description: 'Book premium party decorators in Delhi NCR. Birthday, anniversary, theme, room & more. Same-day setups. WhatsApp booking in 2 minutes!',
};

const STEPS = [
  { n: '01', emoji: '📱', title: 'Choose Your Package', desc: 'Browse our packages or tell us your theme & budget on WhatsApp.' },
  { n: '02', emoji: '✅', title: 'Confirm & Pay', desc: 'We send you a quote in minutes. Pay a small token to book your slot.' },
  { n: '03', emoji: '🎊', title: 'We Setup Magic', desc: 'Our team arrives on time and transforms your space. You just celebrate!' },
];

const REVIEWS = [
  { name: 'Priya S.', city: 'Delhi', stars: 5, text: 'Absolutely loved the birthday decoration! The team set it up in an hour and the photos came out stunning. Will definitely book again for our anniversary.', service: 'Birthday Decoration', date: 'Oct 2024' },
  { name: 'Rahul M.', city: 'Gurgaon', stars: 5, text: 'Booked a surprise setup for my wife — the room decoration was beyond what I imagined. Quick response on WhatsApp, everything went smoothly.', service: 'Room Decoration', date: 'Sep 2024' },
  { name: 'Sneha K.', city: 'Noida', stars: 5, text: 'Best anniversary decoration in Noida! Balloons, flowers, fairy lights — it was a fairy tale. Very professional team and super affordable.', service: 'Anniversary Decoration', date: 'Aug 2024' },
  { name: 'Amit T.', city: 'Delhi', stars: 5, text: 'Kids loved the unicorn theme! Exactly what we wanted. Delivered on time and even helped clean up. 100% recommend 12th Hour Events.', service: 'Kids Birthday', date: 'Oct 2024' },
  { name: 'Kavya R.', city: 'Bangalore', stars: 5, text: 'Even in Bangalore they delivered perfectly. Online booking was smooth, team was punctual and the decoration was gorgeous!', service: 'Baby Shower', date: 'Sep 2024' },
  { name: 'Arjun P.', city: 'Mumbai', stars: 5, text: 'Bachelorette setup was beyond expectations. My friend was completely surprised. Very creative team!', service: 'Bachelorette Party', date: 'Aug 2024' },
];

const STATS = [
  { val: '5000+', label: 'Happy Events', icon: '🎉' },
  { val: '4.9★', label: 'Google Rating', icon: '⭐' },
  { val: '14+', label: 'Cities', icon: '📍' },
  { val: '365', label: 'Days/Year', icon: '📅' },
];

const WHY = [
  { emoji: '⚡', title: 'Same-Day Setup', desc: 'Book today, celebrate today. No waiting, ever.' },
  { emoji: '💰', title: 'Transparent Pricing', desc: 'City-specific rates. Zero hidden charges.' },
  { emoji: '⭐', title: '5000+ Happy Clients', desc: 'Trusted across Delhi NCR and pan India.' },
  { emoji: '📸', title: 'Photo-Ready Setups', desc: 'Every setup looks stunning in photos and videos.' },
  { emoji: '🎨', title: 'Custom Themes', desc: 'Personalised to your exact vision and budget.' },
  { emoji: '📞', title: 'WhatsApp Booking', desc: 'Book in 2 minutes, no app needed.' },
];

// Service card backgrounds (gradient pairs)
const SERVICE_COLORS = [
  'from-purple-600 to-pink-500',
  'from-orange-500 to-red-500',
  'from-rose-500 to-pink-600',
  'from-blue-600 to-cyan-500',
  'from-green-500 to-teal-500',
  'from-amber-500 to-orange-600',
  'from-red-600 to-rose-500',
  'from-indigo-600 to-purple-500',
  'from-teal-500 to-green-600',
];

export default function Home() {
  return (
    <div className="pb-mobile">
      {/* Hero — city-aware client component */}
      <HomeHero />

      {/* Stats bar */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-500 py-4">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-2 text-white text-center">
            {STATS.map((s, i) => (
              <div key={i} className="py-1.5">
                <div className="text-lg md:text-3xl font-extrabold leading-none">{s.val}</div>
                <div className="text-[10px] md:text-sm opacity-90 font-medium mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services — image card grid */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">Our <span className="grad-text">Services</span></h2>
          <p className="section-sub">Everything you need for the perfect celebration</p>

          {/* Kids Activities highlight banner */}
          <div className="mb-4">
            <Link href="/activities"
              className="flex items-center justify-between bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl px-5 py-4 text-white hover:opacity-95 transition shadow-md shadow-purple-200">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🎪</span>
                <div>
                  <div className="font-extrabold text-lg leading-tight">🌟 Kids Activities</div>
                  <div className="text-sm text-white/80">Clowns · Magicians · Face Painting · Balloon Artists & more</div>
                </div>
              </div>
              <div className="flex-shrink-0 bg-white text-purple-600 font-bold text-sm px-4 py-1.5 rounded-full">
                Book Now →
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {SERVICES.filter(s => s.slug !== 'activities').map((s, i) => (
              <Link key={s.slug} href={`/${s.slug}`}
                className={`service-img-card bg-gradient-to-br ${SERVICE_COLORS[i % SERVICE_COLORS.length]}`}>
                <div className="overlay" />
                <div className="emoji-bg opacity-30 text-6xl">{s.emoji}</div>
                <div className="label">
                  <div className="text-xl mb-1">{s.emoji}</div>
                  <div>{s.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular packages */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">Popular <span className="grad-text">Packages</span></h2>
          <p className="section-sub">Top picks loved by our customers</p>
          <ProductGrid limit={8} />
          <div className="text-center mt-8">
            <Link href="/birthday-decoration" className="btn-pink">Explore All Packages →</Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="section-title">How It <span className="grad-text">Works</span></h2>
          <p className="section-sub">Book your dream decoration in 3 simple steps</p>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6 relative">
            {/* Connector line on desktop */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-0.5 bg-orange-200 z-0" />
            {STEPS.map((step, i) => (
              <div key={i} className="card p-6 text-center relative z-10">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white text-sm font-bold flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200">
                  {step.n}
                </div>
                <div className="text-4xl mb-3">{step.emoji}</div>
                <h3 className="font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="https://wa.me/918073552837?text=Hi! I want to plan a decoration. Can you help?" target="_blank" rel="noopener noreferrer" className="btn-wa">
              💬 Start on WhatsApp — It&apos;s Free
            </a>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">Why Choose <span className="grad-text">12th Hour?</span></h2>
          <p className="section-sub">The trusted name in party decoration</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {WHY.map((w, i) => (
              <div key={i} className="flex items-start gap-3 p-4 md:p-5 rounded-2xl bg-gray-50 hover:bg-orange-50 transition-colors border border-transparent hover:border-orange-100">
                <div className="text-2xl md:text-3xl flex-shrink-0 mt-0.5">{w.emoji}</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-0.5 text-sm md:text-base">{w.title}</h3>
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — horizontal scroll on mobile */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">What Customers <span className="grad-text">Say</span></h2>
          <p className="section-sub">Real reviews from real celebrations 🎊</p>

          {/* Rating summary bar */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-gray-800">4.9</div>
              <div className="text-orange-400 text-lg">★★★★★</div>
              <div className="text-xs text-gray-500 mt-0.5">5000+ reviews</div>
            </div>
            <div className="w-px h-16 bg-gray-200 hidden sm:block" />
            <div className="hidden sm:flex flex-col gap-1.5">
              {[5,4,3].map(stars => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-4">{stars}★</span>
                  <div className="w-32 bg-gray-200 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-orange-400" style={{ width: stars === 5 ? '90%' : stars === 4 ? '7%' : '3%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable testimonials */}
          <div className="testimonials-scroll pb-2">
            {REVIEWS.map((r, i) => (
              <div key={i} className="testimonial-card card p-5 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {r.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{r.name}</div>
                      <div className="text-xs text-gray-400">{r.city} · {r.date}</div>
                    </div>
                  </div>
                  <div className="text-orange-400 text-sm">{'★'.repeat(r.stars)}</div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-3">&ldquo;{r.text}&rdquo;</p>
                <div className="text-xs text-orange-500 font-medium bg-orange-50 rounded-full px-2.5 py-0.5 self-start">{r.service}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <a href="https://wa.me/918073552837" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors">
              📲 Join 5000+ happy customers → Book on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="py-12 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">We Serve <span className="grad-text">Pan India</span></h2>
          <p className="section-sub">Available in 14+ cities across India</p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {CITIES.map(c => (
              <Link key={c.slug} href={`/birthday-decoration-${c.slug}`}
                className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-100 text-gray-700 rounded-full text-xs md:text-sm font-medium hover:bg-orange-100 hover:text-orange-700 transition">
                📍 {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20 hero-bg text-white">
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl md:text-4xl font-extrabold mb-4">Ready to Create Magic?</h2>
          <p className="text-gray-300 mb-8 text-sm md:text-base">Chat with us on WhatsApp and get a free customised quote in minutes.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="https://wa.me/918073552837?text=Hi! I want to plan a party decoration." target="_blank" rel="noopener noreferrer" className="btn-pink text-base px-8 py-3.5">
              📲 Chat on WhatsApp — Free
            </a>
            <Link href="/contact" className="border border-white/30 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/10 transition text-base">
              Contact Us
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-6">⚡ Typical response time: under 5 minutes</p>
        </div>
      </section>
    </div>
  );
}
