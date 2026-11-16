'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCity } from '@/context/CityContext';

// ── city multipliers ─────────────────────────────────────────────────────────
const CITY_MUL: Record<string, number> = {
  mumbai: 1.2, bangalore: 1.1, delhi: 1.0, noida: 0.95,
  gurgaon: 1.05, faridabad: 0.9, ghaziabad: 0.9,
  hyderabad: 1.0, pune: 1.0, chennai: 1.0,
  kolkata: 0.9, lucknow: 0.85, ahmedabad: 0.9, thane: 1.1,
};

// ── step data ────────────────────────────────────────────────────────────────
const OCCASION_OPTIONS = [
  { id: 'bday',      label: 'Birthday Party',       emoji: '🎂', base: 0 },
  { id: 'theme',     label: 'Theme Decoration',      emoji: '🎨', base: 2000 },
  { id: 'anniv',     label: 'Anniversary',           emoji: '❤️', base: 1500 },
  { id: 'baby',      label: 'Baby Shower',           emoji: '👶', base: 1000 },
  { id: 'bach',      label: 'Bachelorette',          emoji: '💃', base: 2000 },
  { id: 'corp',      label: 'Corporate Event',       emoji: '🏢', base: 5000 },
];

const DECOR_TIERS = [
  {
    id: 'none',
    label: 'None',
    desc: 'No decoration setup',
    price: 0,
    tag: 'Free',
    tagColor: 'bg-gray-100 text-gray-500',
    icon: '🚫',
  },
  {
    id: 'standard',
    label: 'Standard',
    desc: 'Balloon arch, happy birthday banner & simple backdrop.',
    price: 4000,
    tag: null,
    icon: '🎈',
  },
  {
    id: 'deluxe',
    label: 'Deluxe',
    desc: 'Pastel balloons, premium backdrop, LED fairy lights & name board.',
    price: 10000,
    tag: 'Most Popular',
    tagColor: 'bg-orange-500 text-white',
    icon: '✨',
  },
  {
    id: 'premium',
    label: 'Premium',
    desc: 'Grand canopy, floral arrangements, light grid & drape setup.',
    price: 25000,
    tag: 'Luxury',
    tagColor: 'bg-purple-600 text-white',
    icon: '👑',
  },
];

const CAKE_OPTIONS = [
  { id: 'none',   label: 'None',              desc: 'No cake table setup',                              price: 0,     icon: '🚫' },
  { id: 'simple', label: 'Simple Table',      desc: 'Basic cloth and stand with balloon arrangement.',  price: 2000,  icon: '🎂' },
  { id: 'floral', label: 'Premium Floral Arch', desc: 'Surrounding archway with theme flowers & balloons.',price: 6000, icon: '🌸' },
  { id: 'double', label: 'Double Arch Sequin', desc: 'Luxury double arches with high-gloss sequin backdrop.',price: 12000,icon: '💎' },
];

const ENTERTAINMENT = [
  { id: 'magic',   label: 'Magic Show',          desc: '45 min live magic show for kids & adults.',     price: 4999,  icon: '🪄' },
  { id: 'puppet',  label: 'Puppet Show',          desc: '40 min interactive puppet performance.',        price: 5499,  icon: '🎭' },
  { id: 'face',    label: 'Face Painting',        desc: 'Artistic face painting & temporary tattoos.',   price: 6299,  icon: '🎨' },
  { id: 'mascot',  label: 'Mascot Character',     desc: '2 hrs costumed character for photo ops.',       price: 3499,  icon: '🦸' },
  { id: 'clown',   label: 'Clown / Joker',        desc: '1 hr balloon twisting + comedy performance.',   price: 2999,  icon: '🤡' },
  { id: 'singer',  label: 'Live Singer',          desc: '1 hr live Bollywood / pop singer performance.', price: 7999,  icon: '🎤' },
];

const PHOTOGRAPHY = [
  { id: 'none',    label: 'None',              desc: 'No media coverage',                                   price: 0,     icon: '🚫' },
  { id: 'std',     label: 'Standard Photography', desc: '4 hr professional high-res digital event coverage.',price: 6000,  icon: '📷' },
  { id: 'premium', label: 'Photo & Video Highlight', desc: 'Full coverage + 3-min cinematic highlight reel.', price: 14000, icon: '🎬' },
  { id: 'luxury',  label: 'Cinematic Shoot',    desc: 'Drone + album + full day coverage.',                 price: 28000, icon: '🚁' },
];

const ADDONS = [
  { id: 'fog',     label: 'Fog Machine',        desc: 'Dreamy entry effect.',   price: 999,  icon: '🌫️' },
  { id: 'neon',    label: 'Neon Sign (Custom)', desc: 'Personalised neon name.', price: 1500, icon: '💡' },
  { id: 'photobooth', label: 'Photo Booth Props', desc: 'Fun frame + props kit.', price: 800, icon: '📸' },
  { id: 'floral',  label: 'Fresh Flower Trail', desc: 'Entrance floral decor.',  price: 2000, icon: '🌺' },
  { id: 'candy',   label: 'Candy Cart',         desc: 'Styled candy display.',   price: 2500, icon: '🍬' },
  { id: 'steprepeat', label: 'Step & Repeat Banner', desc: 'Branded backdrop.',  price: 1800, icon: '🖼️' },
];

// ── helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

type OptionCardProps = {
  selected: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  desc: string;
  price: number;
  tag?: string | null;
  tagColor?: string;
};

function OptionCard({ selected, onClick, icon, label, desc, price, tag, tagColor }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all group relative ${
        selected
          ? 'border-orange-500 bg-orange-50 shadow-md shadow-orange-100'
          : 'border-gray-100 bg-white hover:border-orange-200 hover:bg-orange-50/40'
      }`}
    >
      {tag && (
        <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${tagColor}`}>
          {tag}
        </span>
      )}
      <div className="flex items-start gap-3">
        <div className={`text-2xl flex-shrink-0 mt-0.5 transition-transform ${selected ? 'scale-110' : 'group-hover:scale-105'}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className={`font-bold text-sm ${selected ? 'text-orange-700' : 'text-gray-800'}`}>{label}</span>
            <span className={`font-semibold text-sm ${price === 0 ? 'text-gray-400' : selected ? 'text-orange-600' : 'text-gray-600'}`}>
              {price === 0 ? 'Free' : fmt(price)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
        </div>
        <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          selected ? 'border-orange-500 bg-orange-500' : 'border-gray-200'
        }`}>
          {selected && <span className="text-white text-[10px] font-bold">✓</span>}
        </div>
      </div>
    </button>
  );
}

type MultiCardProps = { selected: boolean; onClick: () => void; icon: string; label: string; desc: string; price: number };
function MultiCard({ selected, onClick, icon, label, desc, price }: MultiCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all group relative ${
        selected
          ? 'border-orange-500 bg-orange-50 shadow-md shadow-orange-100'
          : 'border-gray-100 bg-white hover:border-orange-200 hover:bg-orange-50/40'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`text-2xl flex-shrink-0 mt-0.5 transition-transform ${selected ? 'scale-110' : 'group-hover:scale-105'}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className={`font-bold text-sm ${selected ? 'text-orange-700' : 'text-gray-800'}`}>{label}</span>
            <span className={`font-semibold text-sm ${selected ? 'text-orange-600' : 'text-gray-600'}`}>{fmt(price)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
        </div>
        <div className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
          selected ? 'border-orange-500 bg-orange-500' : 'border-gray-200'
        }`}>
          {selected && <span className="text-white text-[10px] font-bold">✓</span>}
        </div>
      </div>
    </button>
  );
}

// ── main page ────────────────────────────────────────────────────────────────
export default function BudgetEstimatorPage() {
  const { city, cityName } = useCity();
  const mul = CITY_MUL[city] ?? 1.0;

  // selections
  const [occasion, setOccasion] = useState('bday');
  const [decor, setDecor]       = useState('deluxe');
  const [cake, setCake]         = useState('floral');
  const [entertainment, setEntertainment] = useState<string[]>([]);
  const [photo, setPhoto]       = useState('none');
  const [addons, setAddons]     = useState<string[]>([]);

  const toggleEnt = (id: string) => setEntertainment(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAddon = (id: string) => setAddons(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  // compute
  const occasionBase = OCCASION_OPTIONS.find(o => o.id === occasion)?.base ?? 0;
  const decorPrice   = Math.round((DECOR_TIERS.find(d => d.id === decor)?.price ?? 0) * mul);
  const cakePrice    = Math.round((CAKE_OPTIONS.find(c => c.id === cake)?.price ?? 0) * mul);
  const entPrice     = Math.round(ENTERTAINMENT.filter(e => entertainment.includes(e.id)).reduce((s, e) => s + e.price, 0) * mul);
  const photoPrice   = Math.round((PHOTOGRAPHY.find(p => p.id === photo)?.price ?? 0) * mul);
  const addonPrice   = Math.round(ADDONS.filter(a => addons.includes(a.id)).reduce((s, a) => s + a.price, 0) * mul);
  const baseAdj      = Math.round(occasionBase * mul);

  const total = decorPrice + cakePrice + entPrice + photoPrice + addonPrice + baseAdj;
  const totalLow  = Math.round(total * 0.9 / 100) * 100;
  const totalHigh = Math.round(total * 1.12 / 100) * 100;

  const decorLabel = DECOR_TIERS.find(d => d.id === decor)?.label ?? '';
  const cakeLabel  = CAKE_OPTIONS.find(c => c.id === cake)?.label ?? '';
  const photoLabel = PHOTOGRAPHY.find(p => p.id === photo)?.label ?? '';

  const waLines = [
    `Hi! I planned my event using the Smart Budget Estimator.`,
    `Occasion: ${OCCASION_OPTIONS.find(o => o.id === occasion)?.label}`,
    `City: ${cityName}`,
    `Decoration: ${decorLabel} (${fmt(decorPrice)})`,
    `Cake Table: ${cakeLabel} (${fmt(cakePrice)})`,
    entertainment.length ? `Entertainment: ${ENTERTAINMENT.filter(e => entertainment.includes(e.id)).map(e => e.label).join(', ')} (${fmt(entPrice)})` : null,
    photo !== 'none' ? `Photography: ${photoLabel} (${fmt(photoPrice)})` : null,
    addons.length ? `Add-ons: ${ADDONS.filter(a => addons.includes(a.id)).map(a => a.label).join(', ')} (${fmt(addonPrice)})` : null,
    `Estimated Total: ${fmt(totalLow)} – ${fmt(totalHigh)}`,
    `Please help me finalise this!`,
  ].filter(Boolean).join('\n');

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* ── header ── */}
      <div className="bg-white border-b border-gray-100 px-4 pt-5 pb-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/" className="text-orange-500 text-sm font-medium inline-flex items-center gap-1">
              ← Home
            </Link>
            <h1 className="text-lg font-extrabold text-gray-900 mt-0.5">
              🧮 Smart Budget Estimator
            </h1>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 font-medium">Total Estimate</div>
            <div className="text-xl font-extrabold text-orange-600 leading-tight">
              {total === 0 ? '—' : `${fmt(totalLow)}–${fmt(totalHigh)}`}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6 grid lg:grid-cols-[1fr_320px] gap-6 items-start">

        {/* ── left: steps ── */}
        <div className="space-y-8">

          {/* Step 0 — Occasion */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
              <span className="bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">0</span>
              Select Your Occasion
            </h2>
            <p className="text-xs text-gray-400 mb-4 ml-8">What are you celebrating?</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {OCCASION_OPTIONS.map(o => (
                <button
                  key={o.id}
                  onClick={() => setOccasion(o.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                    occasion === o.id
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-100 text-gray-600 hover:border-orange-200 hover:bg-orange-50/40'
                  }`}
                >
                  <span className="text-xl">{o.emoji}</span>
                  <span className="text-xs leading-tight">{o.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Step 1 — Decoration */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
              <span className="bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">1</span>
              🎈 Decoration Tier
            </h2>
            <p className="text-xs text-gray-400 mb-4 ml-8">Choose your decoration package</p>
            <div className="space-y-2.5">
              {DECOR_TIERS.map(d => (
                <OptionCard
                  key={d.id}
                  selected={decor === d.id}
                  onClick={() => setDecor(d.id)}
                  icon={d.icon}
                  label={d.label}
                  desc={d.desc}
                  price={Math.round(d.price * mul)}
                  tag={d.tag}
                  tagColor={d.tagColor}
                />
              ))}
            </div>
          </section>

          {/* Step 2 — Cake Table */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
              <span className="bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">2</span>
              🎂 Cake Table Decor
            </h2>
            <p className="text-xs text-gray-400 mb-4 ml-8">Style your cake display</p>
            <div className="space-y-2.5">
              {CAKE_OPTIONS.map(c => (
                <OptionCard
                  key={c.id}
                  selected={cake === c.id}
                  onClick={() => setCake(c.id)}
                  icon={c.icon}
                  label={c.label}
                  desc={c.desc}
                  price={Math.round(c.price * mul)}
                />
              ))}
            </div>
          </section>

          {/* Step 3 — Entertainment */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
              <span className="bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">3</span>
              🎪 Entertainment Activities
            </h2>
            <p className="text-xs text-gray-400 mb-4 ml-8">Select multiple — all bookable together</p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {ENTERTAINMENT.map(e => (
                <MultiCard
                  key={e.id}
                  selected={entertainment.includes(e.id)}
                  onClick={() => toggleEnt(e.id)}
                  icon={e.icon}
                  label={e.label}
                  desc={e.desc}
                  price={Math.round(e.price * mul)}
                />
              ))}
            </div>
          </section>

          {/* Step 4 — Photography */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
              <span className="bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">4</span>
              📸 Photography & Videography
            </h2>
            <p className="text-xs text-gray-400 mb-4 ml-8">Capture every memory</p>
            <div className="space-y-2.5">
              {PHOTOGRAPHY.map(p => (
                <OptionCard
                  key={p.id}
                  selected={photo === p.id}
                  onClick={() => setPhoto(p.id)}
                  icon={p.icon}
                  label={p.label}
                  desc={p.desc}
                  price={Math.round(p.price * mul)}
                />
              ))}
            </div>
          </section>

          {/* Step 5 — Add-ons */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
              <span className="bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">5</span>
              ✨ Extra Add-ons
            </h2>
            <p className="text-xs text-gray-400 mb-4 ml-8">Special touches to make it unforgettable</p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {ADDONS.map(a => (
                <MultiCard
                  key={a.id}
                  selected={addons.includes(a.id)}
                  onClick={() => toggleAddon(a.id)}
                  icon={a.icon}
                  label={a.label}
                  desc={a.desc}
                  price={Math.round(a.price * mul)}
                />
              ))}
            </div>
          </section>

        </div>

        {/* ── right: sticky summary ── */}
        <div className="hidden lg:block sticky top-[80px]">
          <SummaryPanel
            city={cityName}
            decorLabel={decorLabel}
            decorPrice={decorPrice}
            cakeLabel={cakeLabel}
            cakePrice={cakePrice}
            entertainment={ENTERTAINMENT.filter(e => entertainment.includes(e.id))}
            entPrice={entPrice}
            photoLabel={photoLabel}
            photoPrice={photoPrice}
            addons={ADDONS.filter(a => addons.includes(a.id))}
            addonPrice={addonPrice}
            baseAdj={baseAdj}
            total={total}
            totalLow={totalLow}
            totalHigh={totalHigh}
            waLink={`https://wa.me/918073552837?text=${encodeURIComponent(waLines)}`}
          />
        </div>
      </div>

      {/* ── mobile bottom bar ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-2xl px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-xs text-gray-400 font-medium">Estimated Total</div>
            <div className="text-lg font-extrabold text-orange-600 leading-tight">
              {total === 0 ? '₹0' : `${fmt(totalLow)} – ${fmt(totalHigh)}`}
            </div>
          </div>
          <a
            href={`https://wa.me/918073552837?text=${encodeURIComponent(waLines)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-5 py-3 rounded-2xl transition-colors"
          >
            💬 Book on WhatsApp
          </a>
        </div>
        {/* mini breakdown */}
        {total > 0 && (
          <div className="flex gap-3 overflow-x-auto text-[10px] text-gray-500 scrollbar-hide">
            {decorPrice > 0 && <span className="whitespace-nowrap bg-gray-50 px-2 py-1 rounded-full">Decor {fmt(decorPrice)}</span>}
            {cakePrice > 0  && <span className="whitespace-nowrap bg-gray-50 px-2 py-1 rounded-full">Cake {fmt(cakePrice)}</span>}
            {entPrice > 0   && <span className="whitespace-nowrap bg-gray-50 px-2 py-1 rounded-full">Ent {fmt(entPrice)}</span>}
            {photoPrice > 0 && <span className="whitespace-nowrap bg-gray-50 px-2 py-1 rounded-full">Photo {fmt(photoPrice)}</span>}
            {addonPrice > 0 && <span className="whitespace-nowrap bg-gray-50 px-2 py-1 rounded-full">Add-ons {fmt(addonPrice)}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Summary panel component ──────────────────────────────────────────────────
type SummaryProps = {
  city: string;
  decorLabel: string; decorPrice: number;
  cakeLabel: string;  cakePrice: number;
  entertainment: { id: string; label: string; price: number }[];
  entPrice: number;
  photoLabel: string; photoPrice: number;
  addons: { id: string; label: string; price: number }[];
  addonPrice: number;
  baseAdj: number;
  total: number; totalLow: number; totalHigh: number;
  waLink: string;
};

function SummaryPanel(p: SummaryProps) {
  const hasItems = p.total > 0;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-4">
        <div className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">Estimate Summary</div>
        <div className="text-white text-3xl font-extrabold">
          {p.total === 0 ? '₹0' : fmt(p.totalLow)}
        </div>
        {p.total > 0 && (
          <div className="text-white/80 text-xs mt-0.5">up to {fmt(p.totalHigh)} · {p.city} rates</div>
        )}
      </div>

      {/* breakdown */}
      <div className="px-5 py-4 space-y-2.5 text-sm">
        {p.baseAdj > 0 && (
          <SummaryRow label="Occasion base" val={fmt(p.baseAdj)} />
        )}
        {p.decorPrice > 0 && (
          <SummaryRow label={`Decoration — ${p.decorLabel}`} val={fmt(p.decorPrice)} />
        )}
        {p.cakePrice > 0 && (
          <SummaryRow label={`Cake table — ${p.cakeLabel}`} val={fmt(p.cakePrice)} />
        )}
        {p.entPrice > 0 && (
          <div>
            <SummaryRow label="Entertainment" val={fmt(p.entPrice)} />
            <div className="ml-4 mt-1 space-y-0.5">
              {p.entertainment.map(e => (
                <div key={e.id} className="flex justify-between text-xs text-gray-400">
                  <span>· {e.label}</span>
                  <span>{fmt(e.price)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {p.photoPrice > 0 && (
          <SummaryRow label={`Photography — ${p.photoLabel}`} val={fmt(p.photoPrice)} />
        )}
        {p.addonPrice > 0 && (
          <div>
            <SummaryRow label="Add-ons" val={fmt(p.addonPrice)} />
            <div className="ml-4 mt-1 space-y-0.5">
              {p.addons.map(a => (
                <div key={a.id} className="flex justify-between text-xs text-gray-400">
                  <span>· {a.label}</span>
                  <span>{fmt(a.price)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!hasItems && (
          <div className="text-center py-6 text-gray-300 text-xs font-medium">
            Select options to see breakdown
          </div>
        )}

        {hasItems && (
          <>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-extrabold text-gray-800">
              <span>Estimated Total</span>
              <span className="text-orange-600">{fmt(p.total)}</span>
            </div>
            <p className="text-[10px] text-gray-400 text-center">Range: {fmt(p.totalLow)} – {fmt(p.totalHigh)} · ±10%</p>
          </>
        )}
      </div>

      {/* CTA */}
      <div className="px-5 pb-5 space-y-2">
        <a
          href={p.waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm py-3.5 rounded-2xl transition-colors"
        >
          💬 Proceed to Booking →
        </a>
        <Link href="/browse"
          className="w-full flex items-center justify-center gap-1 text-xs text-orange-500 hover:text-orange-700 font-semibold py-2 rounded-xl hover:bg-orange-50 transition">
          🗂️ Browse all packages →
        </Link>
        <p className="text-center text-[10px] text-gray-400">Prices are estimates · Exact quote within 5 min on WhatsApp</p>
      </div>
    </div>
  );
}

function SummaryRow({ label, val }: { label: string; val: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600 truncate pr-2">{label}</span>
      <span className="font-semibold text-gray-800 flex-shrink-0">{val}</span>
    </div>
  );
}
