'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCity } from '@/context/CityContext';
import { SERVICES, CITIES } from '@/lib/config';
import ServiceHero from '@/components/ServiceHero';
import CategoryBar from '@/components/CategoryBar';
import ProductCard from '@/components/ProductCard';
import { fetchProducts, Product } from '@/lib/products';

// All themes with emoji + display name + search keywords
const THEMES = [
  { slug: 'all',         emoji: '🎨', name: 'All Themes',       keywords: [] },
  { slug: 'mermaid',     emoji: '🧜‍♀️', name: 'Mermaid',         keywords: ['mermaid', 'ocean', 'under the sea'] },
  { slug: 'cars',        emoji: '🚗', name: 'Cars',              keywords: ['cars', 'racing', 'wheels', 'mcqueen'] },
  { slug: 'superhero',   emoji: '🦸', name: 'Superheroes',       keywords: ['superhero', 'superman', 'batman', 'avengers', 'spider', 'marvel'] },
  { slug: 'butterfly',   emoji: '🦋', name: 'Butterfly',         keywords: ['butterfly', 'garden', 'floral'] },
  { slug: 'jungle',      emoji: '🌿', name: 'Jungle',            keywords: ['jungle', 'safari', 'animal', 'forest'] },
  { slug: 'firstbday',   emoji: '🎂', name: '1st Birthday',      keywords: ['first birthday', '1st birthday', 'one year', '1 year'] },
  { slug: 'peppapig',    emoji: '🐷', name: 'Peppa Pig',         keywords: ['peppa', 'peppa pig'] },
  { slug: 'hellokitty',  emoji: '🐱', name: 'Hello Kitty',       keywords: ['hello kitty', 'kitty'] },
  { slug: 'rainbow',     emoji: '🌈', name: 'Rainbow',           keywords: ['rainbow', 'colorful', 'pastel'] },
  { slug: 'barbie',      emoji: '👛', name: 'Barbie',            keywords: ['barbie', 'pink glam', 'doll'] },
  { slug: 'kpop',        emoji: '🎤', name: 'K-Pop',             keywords: ['kpop', 'k-pop', 'korean', 'bts', 'blackpink'] },
  { slug: 'space',       emoji: '🚀', name: 'Space',             keywords: ['space', 'galaxy', 'astronaut', 'stars', 'universe'] },
  { slug: 'unicorn',     emoji: '🦄', name: 'Unicorn',           keywords: ['unicorn', 'magical', 'fantasy'] },
  { slug: 'princess',    emoji: '👑', name: 'Princess',          keywords: ['princess', 'cinderella', 'fairy tale', 'crown'] },
  { slug: 'football',    emoji: '⚽', name: 'Football',           keywords: ['football', 'soccer', 'sport', 'fifa', 'cricket', 'ipl'] },
];

const TRUST = [
  { emoji: '⚡', label: 'Same-Day Setup' },
  { emoji: '✅', label: '5000+ Events Done' },
  { emoji: '💰', label: 'No Hidden Charges' },
  { emoji: '📸', label: 'Photo-Ready Setups' },
  { emoji: '🛡️', label: '100% Satisfaction' },
];

const FAQS = [
  { q: 'Which themes are most popular?', a: 'Mermaid, Superhero, Cars, Barbie, Unicorn and K-Pop are our most booked themes right now. First birthday setups and Peppa Pig are also very popular for toddlers.' },
  { q: 'Can I request a custom theme?', a: 'Yes! We do fully custom themes. Just WhatsApp us with the reference images and we\'ll quote you within 2 hours.' },
  { q: 'Do you have theme packages for girls and boys separately?', a: 'Absolutely — we have boy-favourite themes (Cars, Football, Space, Superheroes) and girl-favourite themes (Mermaid, Princess, Barbie, Butterfly), plus unisex themes like Rainbow and Jungle.' },
  { q: 'How far in advance should I book a theme decoration?', a: 'We recommend 2–3 days for elaborate theme setups, but we also take last-minute bookings (even same day) based on availability. The sooner the better!' },
  { q: 'What is included in a theme decoration package?', a: 'Most packages include balloons, banners, a backdrop or photo wall, table setup, and theme-matching props. Premium packages also add floor decorations, light strings, and welcome boards. Check each package for exact inclusions.' },
];

function matchesTheme(product: Product, theme: typeof THEMES[0]): boolean {
  if (theme.slug === 'all') return true;
  const haystack = `${product.name} ${product.sub} ${product.id}`.toLowerCase();
  return theme.keywords.some(kw => haystack.includes(kw));
}

export default function ThemeDecorationClient() {
  const { cityName } = useCity();
  const router = useRouter();
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts().then(prods => {
      const themed = prods.filter(p => p.cat === 'theme');
      // Sort pinned first
      const sorted = [...themed].sort((a, b) => (a.sort_order ?? Infinity) - (b.sort_order ?? Infinity));
      setAllProducts(sorted);
      setLoading(false);
    });
  }, []);

  const filtered = activeTheme.slug === 'all'
    ? allProducts
    : allProducts.filter(p => matchesTheme(p, activeTheme));

  // If theme filter returns 0 results (no products uploaded for that theme yet),
  // show a WhatsApp CTA instead of empty grid
  const showEmpty = !loading && filtered.length === 0 && activeTheme.slug !== 'all';

  return (
    <div className="pb-mobile">
      {/* Category chips + hero */}
      <ServiceHero
        name="Theme Decoration"
        emoji="🎨"
        desc="Bring any theme to life — Mermaid, Superhero, Barbie, K-Pop, Space and 50+ more. Immersive setups that wow your guests."
        bgImage="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=70"
      />

      {/* All-categories sticky nav bar */}
      <CategoryBar />

      {/* Trust banner */}
      <section className="bg-emerald-500 py-2.5 overflow-hidden">
        <div className="flex gap-0 overflow-x-auto px-4 max-w-7xl mx-auto" style={{ scrollbarWidth: 'none' }}>
          {TRUST.map((t, i) => (
            <div key={i} className="flex-none flex items-center gap-1.5 text-sm text-white font-semibold whitespace-nowrap px-4 border-r border-emerald-400 last:border-r-0">
              <span>{t.emoji}</span> <span>{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Theme picker ── */}
      <section className="py-10 max-w-7xl mx-auto px-4">
        <h2 className="section-title mb-1">Browse by <span className="grad-text">Theme</span></h2>
        <p className="section-sub mb-6">Tap a theme to see matching packages</p>

        {/* Theme chips grid */}
        <div className="theme-chips-grid mb-8">
          {THEMES.map(theme => (
            <button
              key={theme.slug}
              onClick={() => setActiveTheme(theme)}
              className={`theme-chip ${activeTheme.slug === theme.slug ? 'theme-chip--active' : ''}`}
            >
              <span className="theme-chip-emoji">{theme.emoji}</span>
              <span className="theme-chip-name">{theme.name}</span>
            </button>
          ))}
        </div>

        <style>{`
          .theme-chips-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 10px;
          }
          @media (max-width: 480px) {
            .theme-chips-grid {
              grid-template-columns: repeat(4, 1fr);
              gap: 8px;
            }
          }
          .theme-chip {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            padding: 12px 8px 10px;
            border-radius: 16px;
            border: 2px solid #e5e7eb;
            background: white;
            cursor: pointer;
            transition: all 0.18s ease;
            font-family: inherit;
          }
          .theme-chip:hover {
            border-color: #fb923c;
            background: #fff7ed;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255,107,0,0.12);
          }
          .theme-chip--active {
            border-color: #ff6b00;
            background: linear-gradient(135deg, #fff7ed, #fff);
            box-shadow: 0 4px 16px rgba(255,107,0,0.2);
            transform: translateY(-2px);
          }
          .theme-chip-emoji {
            font-size: 28px;
            line-height: 1;
          }
          .theme-chip-name {
            font-size: 11px;
            font-weight: 600;
            color: #374151;
            text-align: center;
            line-height: 1.3;
          }
          .theme-chip--active .theme-chip-name {
            color: #ff6b00;
          }
        `}</style>

        {/* Active theme label */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-extrabold text-gray-800">
              {activeTheme.emoji} {activeTheme.name === 'All Themes' ? 'All Theme Packages' : `${activeTheme.name} Theme Packages`}
              {!loading && <span className="ml-2 text-sm font-normal text-gray-400">({filtered.length})</span>}
            </h3>
            {activeTheme.slug !== 'all' && (
              <button onClick={() => setActiveTheme(THEMES[0])} className="text-xs text-orange-500 hover:underline mt-0.5">
                ← Browse all themes
              </button>
            )}
          </div>
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="product-grid py-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="bg-gray-200" style={{ aspectRatio: '1/1' }} />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-9 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : showEmpty ? (
          <div className="text-center py-14 bg-orange-50 rounded-2xl border border-orange-100">
            <div className="text-5xl mb-3">{activeTheme.emoji}</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{activeTheme.name} Theme</h3>
            <p className="text-gray-500 text-sm mb-5 max-w-sm mx-auto">
              We do {activeTheme.name} theme setups! Chat with us on WhatsApp for a custom quote and photos of previous work.
            </p>
            <a
              href={`https://wa.me/918073552837?text=Hi! I want to book a ${activeTheme.name} theme decoration in ${cityName}. Can you share pricing and photos?`}
              target="_blank" rel="noopener noreferrer"
              className="btn-wa inline-flex px-6 py-2.5"
            >
              📲 Ask for {activeTheme.name} Theme
            </a>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </section>

      {/* Reviews */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="section-title mb-2">Customer <span className="grad-text">Reviews</span></h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { name: 'Riya M.', city: 'Delhi', text: 'Got the mermaid theme for my daughter\'s 5th birthday — she was speechless! Every detail was so beautiful. 10/10!' },
              { name: 'Arjun K.', city: 'Noida', text: 'Booked a superhero theme for my son. The backdrop and props were top quality, kids went crazy. Super professional team.' },
              { name: 'Sneha P.', city: 'Bangalore', text: 'Did a Barbie theme for my niece. The whole setup was pink and gorgeous. Everyone kept asking who did the decorations!' },
            ].map((r, i) => (
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
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="section-title mb-8">Frequently Asked <span className="grad-text">Questions</span></h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className="card p-5">
                <button
                  className="font-semibold text-gray-800 cursor-pointer w-full flex justify-between items-start gap-3 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{f.q}</span>
                  <span className={`text-orange-400 mt-0.5 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>▾</span>
                </button>
                {openFaq === i && (
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed">{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* City links */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">Theme Decoration in <span className="grad-text">Your City</span></h2>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {CITIES.map(c => (
              <Link key={c.slug} href={`/theme-decoration-${c.slug}`}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition">
                Theme Decoration in {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 hero-bg text-white">
        <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-extrabold mb-3">Book Your Theme Party Today! 🎨</h2>
          <p className="text-gray-300 mb-6">Same-day setups available. 50+ themes. Get a free quote in 2 minutes.</p>
          <a href="https://wa.me/918073552837" target="_blank" rel="noopener noreferrer" className="btn-pink px-8 py-3">
            📲 WhatsApp Us Now
          </a>
        </div>
      </section>
    </div>
  );
}
