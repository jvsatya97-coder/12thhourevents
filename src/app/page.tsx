import type { Metadata } from 'next';
import Link from 'next/link';
import { SERVICES, CITIES } from '@/lib/config';
import ProductGrid from '@/components/ProductGrid';
import HomeHero from '@/components/HomeHero';

export const metadata: Metadata = {
  title: '12th Hour Events | Party & Birthday Decoration Service — Pan India',
  description: 'Book professional party decorators near you. Birthday, anniversary, theme, room & surprise setups. Same-day available. Quick WhatsApp booking. 5000+ happy customers.',
  keywords: 'party decoration, birthday decoration, anniversary decoration, room decoration, party decorator near me',
  openGraph: {
    title: '12th Hour Events — Premium Party Decoration Service',
    description: 'Same-day party decorations across India. 5000+ happy customers. Book in 2 minutes on WhatsApp!',
    type: 'website',
    url: 'https://12thhourevents.in',
  },
};

const STEPS = [
  { n: '01', emoji: '📱', title: 'Choose Your Package', desc: 'Browse packages or tell us your theme & budget on WhatsApp.' },
  { n: '02', emoji: '✅', title: 'Confirm & Pay', desc: 'Get a quote in minutes. Pay a small token to lock your slot.' },
  { n: '03', emoji: '🎊', title: 'We Setup Magic', desc: 'Our team arrives on time, transforms your space. You celebrate!' },
];

const REVIEWS = [
  { name: 'Priya S.', city: 'Delhi', stars: 5, text: 'Absolutely loved the birthday decoration! Team set it up in an hour and the photos came out stunning. Will book again!', service: 'Birthday Decoration', date: 'Oct 2024' },
  { name: 'Rahul M.', city: 'Gurgaon', stars: 5, text: 'Surprise room setup for my wife — way beyond what I imagined. Quick WhatsApp response, everything went perfectly.', service: 'Room Decoration', date: 'Sep 2024' },
  { name: 'Sneha K.', city: 'Noida', stars: 5, text: 'Best anniversary decoration I have seen! Balloons, flowers, fairy lights — it was like a fairy tale. Super affordable.', service: 'Anniversary Decoration', date: 'Aug 2024' },
  { name: 'Amit T.', city: 'Delhi', stars: 5, text: 'Kids loved the unicorn theme! Delivered on time, even helped clean up. 100% recommend 12th Hour Events.', service: 'Kids Birthday', date: 'Oct 2024' },
  { name: 'Kavya R.', city: 'Bangalore', stars: 5, text: 'Even in Bangalore they delivered perfectly. Online booking was smooth, team was punctual and decoration was gorgeous!', service: 'Baby Shower', date: 'Sep 2024' },
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
  { emoji: '💰', title: 'Transparent Pricing', desc: 'City-specific rates. Zero hidden charges, guaranteed.' },
  { emoji: '⭐', title: '5000+ Happy Clients', desc: 'Trusted across Delhi NCR and pan India.' },
  { emoji: '📸', title: 'Photo-Ready Setups', desc: 'Every setup looks stunning in photos & reels.' },
  { emoji: '🎨', title: 'Custom Themes', desc: 'Personalised to your exact vision and budget.' },
  { emoji: '📞', title: 'WhatsApp Booking', desc: 'Book in 2 minutes. No app download needed.' },
];

// Background images for service cards
const SERVICE_IMAGES: Record<string, string> = {
  'birthday-decoration':    'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=400&q=60',
  'theme-decoration':       'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=60',
  'anniversary-decoration': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=60',
  'room-decoration':        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=60',
  'baby-shower':            'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=400&q=60',
  'welcome-baby':           'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=60',
  'bachelorette-party':     'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=60',
  'corporate-events':       'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&q=60',
  'pinterest-edition':      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=60',
};

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
      {/* Hero */}
      <HomeHero />

      {/* Urgency strip */}
      <section className="bg-red-600 py-2.5 text-white text-center text-sm font-semibold">
        🔥 Weekend slots filling fast — <a href="https://wa.me/918073552837?text=Hi! I want to check slot availability." target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-red-200 transition">Check availability on WhatsApp →</a>
      </section>

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

      {/* Services */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">Our <span className="grad-text">Services</span></h2>
          <p className="section-sub">Everything you need for the perfect celebration</p>

          {/* Kids Activities highlight banner */}
          <div className="mb-4">
            <Link href="/activities"
              className="relative flex items-center justify-between rounded-2xl px-6 py-5 text-white hover:opacity-95 transition shadow-lg shadow-purple-200 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)' }}>
              <div className="absolute inset-0 opacity-25"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=60')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 to-transparent" />
              <div className="relative flex items-center gap-4">
                <span className="text-5xl">🎪</span>
                <div>
                  <div className="font-extrabold text-xl leading-tight">🌟 Kids Activities</div>
                  <div className="text-sm text-white/85 mt-0.5">Clowns · Magicians · Face Painting · Balloon Artists</div>
                  <div className="text-xs text-white/70 mt-1">Available Pan India · Same-Day Booking</div>
                </div>
              </div>
              <div className="relative flex-shrink-0 bg-white text-purple-600 font-bold text-sm px-5 py-2 rounded-full shadow-md">
                Book Now →
              </div>
            </Link>
          </div>

          {/* Pinterest Edition banner */}
          <div className="mb-5">
            <Link href="/pinterest-edition"
              className="relative flex items-center justify-between rounded-2xl px-6 py-4 text-white hover:opacity-95 transition shadow-lg overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #e60023 0%, #ad081b 100%)' }}>
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1513151233558-d860c5398176?w=900&q=60')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div className="absolute inset-0 bg-gradient-to-r from-red-900/60 to-transparent" />
              <div className="relative flex items-center gap-4">
                <span className="text-4xl">📌</span>
                <div>
                  <div className="font-extrabold text-lg leading-tight">📌 Pinterest Edition — New!</div>
                  <div className="text-sm text-white/85 mt-0.5">Trending décor styles straight from Pinterest, recreated for your event</div>
                </div>
              </div>
              <div className="relative flex-shrink-0 bg-white text-red-600 font-bold text-sm px-5 py-2 rounded-full shadow-md">
                Explore →
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {SERVICES.filter(s => s.slug !== 'activities' && s.slug !== 'pinterest-edition').map((s, i) => (
              <Link key={s.slug} href={`/${s.slug}`}
                className={`service-img-card bg-gradient-to-br ${SERVICE_COLORS[i % SERVICE_COLORS.length]}`}
                style={SERVICE_IMAGES[s.slug] ? { backgroundImage: `url('${SERVICE_IMAGES[s.slug]}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                <div className="overlay" />
                <div className="label">
                  <div className="text-xl mb-0.5">{s.emoji}</div>
                  <div className="text-xs md:text-sm">{s.name}</div>
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
          <p className="section-sub">Top picks loved by thousands of customers</p>
          <ProductGrid limit={8} />
          <div className="text-center mt-8">
            <Link href="/birthday-decoration" className="btn-pink px-8 py-3">Explore All Packages →</Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="section-title">How It <span className="grad-text">Works</span></h2>
          <p className="section-sub">Book your dream decoration in 3 simple steps</p>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6 relative">
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
            <a href="https://wa.me/918073552837?text=Hi! I want to plan a decoration. Can you help?" target="_blank" rel="noopener noreferrer"
              className="btn-wa px-8 py-3.5 text-base shadow-lg shadow-green-200">
              💬 Start on WhatsApp — It&apos;s Free
            </a>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">Why Choose <span className="grad-text">12th Hour?</span></h2>
          <p className="section-sub">The trusted name in party decoration across India</p>
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

      {/* Testimonials */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">What Customers <span className="grad-text">Say</span></h2>
          <p className="section-sub">Real reviews from real celebrations 🎊</p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-gray-800">4.9</div>
              <div className="text-orange-400 text-lg">★★★★★</div>
              <div className="text-xs text-gray-500 mt-0.5">5000+ reviews</div>
            </div>
            <div className="w-px h-16 bg-gray-200 hidden sm:block" />
            <div className="hidden sm:flex flex-col gap-1.5">
              {[5, 4, 3].map(stars => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-4">{stars}★</span>
                  <div className="w-32 bg-gray-200 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-orange-400" style={{ width: stars === 5 ? '90%' : stars === 4 ? '7%' : '3%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

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
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors font-medium">
              📲 Join 5000+ happy customers → Book on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="py-12 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">We Serve <span className="grad-text">Pan India</span></h2>
          <p className="section-sub">Available in 14+ cities. More cities being added!</p>
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

      {/* Final CTA */}
      <section className="py-14 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=1200&q=60')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/75 to-black/85" />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10 text-white">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl md:text-4xl font-extrabold mb-4 drop-shadow-lg">Ready to Create Magic?</h2>
          <p className="text-gray-300 mb-3 text-sm md:text-base">Chat with us on WhatsApp and get a FREE customised quote in under 5 minutes.</p>
          <p className="text-xs text-orange-400 font-semibold mb-8">⚡ Typical response time: under 5 minutes · 🔒 No spam, ever</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="https://wa.me/918073552837?text=Hi! I want to plan a party decoration." target="_blank" rel="noopener noreferrer"
              className="btn-pink text-base px-8 py-3.5 shadow-lg shadow-orange-500/30">
              📲 Chat on WhatsApp — Free
            </a>
            <Link href="/contact"
              className="border-2 border-white/30 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/10 transition text-base">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
