import type { Metadata } from 'next';
import Link from 'next/link';
import { SERVICES, CITIES } from '@/lib/config';
import ProductGrid from '@/components/ProductGrid';
import HomeHero from '@/components/HomeHero';
import OccasionBar from '@/components/OccasionBar';
import ScrollReveal from '@/components/ScrollReveal';
import TransformationGallery from '@/components/TransformationGallery';
import SameDayCountdown from '@/components/SameDayCountdown';
import TrendingSection from '@/components/TrendingSection';
import EventCountdown from '@/components/EventCountdown';
import BudgetEstimator from '@/components/BudgetEstimator';
import InspirationGallery from '@/components/InspirationGallery';
import ReferralCard from '@/components/ReferralCard';
import MidnightSetup from '@/components/MidnightSetup';
import ThemeStylePicker from '@/components/ThemeStylePicker';
import TrustBar from '@/components/TrustBar';
import CinematicGrid from '@/components/CinematicGrid';

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

      {/* Premium Stats bar */}
      <section className="bg-[#0c0c0c] py-6 md:py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-3 md:gap-6">
            {STATS.map((s, i) => (
              <div key={i} className="text-center py-2 px-1 relative group">
                {/* Subtle separator */}
                {i > 0 && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-10 bg-white/[0.08] hidden md:block" />
                )}
                <div className="text-2xl mb-1.5">{s.icon}</div>
                <div
                  className="text-xl md:text-3xl font-black leading-none mb-1"
                  style={{ background: 'linear-gradient(135deg, #ff9800, #ff6b00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                >
                  {s.val}
                </div>
                <div className="text-[10px] md:text-xs text-gray-500 font-semibold tracking-wide uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / Partner marquee */}
      <TrustBar />

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

      {/* Theme Style Picker */}
      <ThemeStylePicker />

      {/* Popular packages */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="section-title">Popular <span className="grad-text">Packages</span></h2>
            <p className="section-sub">Top picks loved by thousands of customers</p>
          </ScrollReveal>
          {/* Quick occasion filter */}
          <ScrollReveal delay={100} className="mb-6">
            <OccasionBar />
          </ScrollReveal>
          {/* Same-day countdown + Event countdown side by side */}
          <ScrollReveal delay={150} className="mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <SameDayCountdown />
              <EventCountdown />
            </div>
          </ScrollReveal>
          <ProductGrid limit={8} />
          <div className="text-center mt-8">
            <Link href="/birthday-decoration" className="btn-pink px-8 py-3">Explore All Packages →</Link>
          </div>
        </div>
      </section>

      {/* Photo Inspiration Gallery */}
      <InspirationGallery />

      {/* Cinematic Bento Grid */}
      <CinematicGrid />

      {/* Midnight / Secret Setup */}
      <MidnightSetup />

      {/* Trending packages section */}
      <TrendingSection />

      {/* How It Works */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="section-title">How It <span className="grad-text">Works</span></h2>
            <p className="section-sub">Book your dream decoration in 3 simple steps</p>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6 relative">
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-0.5 bg-orange-200 z-0" />
            {STEPS.map((step, i) => (
              <ScrollReveal key={i} delay={i * 120}>
              <div className="card p-6 text-center relative z-10 h-full">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white text-sm font-bold flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200">
                  {step.n}
                </div>
                <div className="text-4xl mb-3">{step.emoji}</div>
                <h3 className="font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
              </ScrollReveal>
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

      {/* Why Us — Premium dark */}
      <section className="py-14 md:py-20 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 border border-orange-500/30 bg-orange-500/10 text-orange-300 rounded-full px-4 py-1.5 text-xs font-bold mb-4 tracking-widest uppercase">
              🏆 Why 12th Hour
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-3">
              The Difference That<br />
              <span style={{ background: 'linear-gradient(135deg, #ff9800, #ff6b00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Makes Memories
              </span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
              Thousands of families trust us to make their most important moments perfect.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {WHY.map((w, i) => (
              <div
                key={i}
                className="group flex flex-col gap-3 p-5 md:p-6 rounded-2xl border border-white/[0.06] hover:border-orange-500/30 transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                }}
              >
                <div className="text-3xl">{w.emoji}</div>
                <div>
                  <h3 className="font-bold text-white mb-1 text-sm md:text-base group-hover:text-orange-300 transition-colors">{w.title}</h3>
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Budget Estimator */}
      <BudgetEstimator />

      {/* Before/After Transformation Gallery */}
      <TransformationGallery />

      {/* Testimonials — Premium */}
      <section className="py-14 md:py-20 bg-[#0c0c0c]">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header with Google badge */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 border border-orange-500/30 bg-orange-500/10 text-orange-300 rounded-full px-4 py-1.5 text-xs font-bold mb-4 tracking-widest uppercase">
                💬 Customer Stories
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                5000+ Celebrations,<br />
                <span style={{ background: 'linear-gradient(135deg, #ff9800, #ff6b00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  5000+ Smiles
                </span>
              </h2>
            </div>

            {/* Google rating block */}
            <div className="flex-shrink-0 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex items-center gap-4 md:min-w-[220px]">
              <div className="flex flex-col items-center">
                <svg width="28" height="28" viewBox="0 0 48 48" className="mb-1" aria-label="Google">
                  <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.3 9 3.4l6.8-6.8C35.7 2.3 30.3 0 24 0 14.9 0 7.1 5.4 3.3 13.2l7.9 6.1C13.1 13.3 18.1 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17z"/>
                  <path fill="#FBBC05" d="M11.2 28.8A14.6 14.6 0 0 1 9.5 24c0-1.7.3-3.3.8-4.8L2.4 13.2A23.9 23.9 0 0 0 0 24c0 3.8.9 7.4 2.4 10.6l8.8-5.8z"/>
                  <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.5-4.9 2.4-8.4 2.4-5.9 0-10.9-3.9-12.7-9.2L3.3 35.5C7.1 42.6 14.9 48 24 48z"/>
                </svg>
                <div className="text-3xl font-black text-white leading-none">4.9</div>
                <div className="text-yellow-400 text-sm mt-0.5">★★★★★</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-white/80 font-semibold text-sm">Google Reviews</div>
                <div className="text-gray-500 text-xs">5,000+ verified ratings</div>
                <div className="mt-1 flex flex-col gap-1">
                  {[5, 4, 3].map(s => (
                    <div key={s} className="flex items-center gap-1.5">
                      <span className="text-[10px] text-gray-600 w-3">{s}</span>
                      <div className="w-20 bg-white/8 rounded-full h-1">
                        <div className="h-1 rounded-full bg-yellow-400" style={{ width: s === 5 ? '90%' : s === 4 ? '7%' : '3%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Review cards — premium scrolling */}
          <div className="testimonials-scroll pb-3">
            {REVIEWS.map((r, i) => (
              <div key={i} className="testimonial-card flex flex-col rounded-2xl border border-white/8 p-5"
                style={{ background: 'rgba(255,255,255,0.03)', minWidth: 280 }}>
                {/* Top: avatar + name + verified */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-base flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${i % 2 === 0 ? '#ff6b00, #ff3c78' : '#f97316, #fb923c'})` }}
                    >
                      {r.name[0]}
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm flex items-center gap-1.5">
                        {r.name}
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="#34d399" aria-label="Verified">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </div>
                      <div className="text-gray-500 text-xs">{r.city} · {r.date}</div>
                    </div>
                  </div>
                  <div className="text-yellow-400 text-sm font-bold">{'★'.repeat(r.stars)}</div>
                </div>

                {/* Quote */}
                <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-4">
                  &ldquo;{r.text}&rdquo;
                </p>

                {/* Footer: service tag */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1">
                    {r.service}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 48 48" aria-label="Google" className="opacity-40">
                    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.3 9 3.4l6.8-6.8C35.7 2.3 30.3 0 24 0 14.9 0 7.1 5.4 3.3 13.2l7.9 6.1C13.1 13.3 18.1 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17z"/>
                    <path fill="#FBBC05" d="M11.2 28.8A14.6 14.6 0 0 1 9.5 24c0-1.7.3-3.3.8-4.8L2.4 13.2A23.9 23.9 0 0 0 0 24c0 3.8.9 7.4 2.4 10.6l8.8-5.8z"/>
                    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.5-4.9 2.4-8.4 2.4-5.9 0-10.9-3.9-12.7-9.2L3.3 35.5C7.1 42.6 14.9 48 24 48z"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a href="https://wa.me/918073552837" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold text-sm px-7 py-3.5 rounded-full text-white transition hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #ff6b00, #ff3c78)', boxShadow: '0 8px 24px rgba(255,107,0,0.3)' }}
            >
              📲 Join 5000+ Happy Customers →
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

      {/* Referral / Tell a Friend */}
      <ReferralCard />

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
