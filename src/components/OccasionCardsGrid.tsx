'use client';

// Occasion Cards Grid — large visual cards, hover reveals price + CTA
// Clean, scannable, premium feel

const OCCASIONS = [
  {
    emoji: '🎂',
    title: 'Birthday',
    sub: 'Kids · Adults · Milestone',
    price: '₹1,999',
    tag: 'Most Booked',
    tagColor: '#ff6b00',
    href: '/birthday-decoration',
    img: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=700&q=70',
    grad: 'linear-gradient(135deg, #ff6b00 0%, #ff9800 100%)',
    wa: 'Hi! I want to book a Birthday decoration. Can you help me with packages and pricing?',
  },
  {
    emoji: '🌹',
    title: 'Anniversary',
    sub: 'Romantic · Proposal · Date Night',
    price: '₹2,999',
    tag: 'Fan Favourite',
    tagColor: '#e11d48',
    href: '/anniversary-decoration',
    img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=700&q=70',
    grad: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
    wa: 'Hi! I want to book an Anniversary decoration. Can you help me with packages and pricing?',
  },
  {
    emoji: '👶',
    title: 'Baby Shower',
    sub: 'Pastel · Balloon · Theme',
    price: '₹2,499',
    tag: 'Trending',
    tagColor: '#ec4899',
    href: '/baby-shower-decoration',
    img: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=700&q=70',
    grad: 'linear-gradient(135deg, #ec4899 0%, #f9a8d4 100%)',
    wa: 'Hi! I want to book a Baby Shower decoration. Can you help me with packages and pricing?',
  },
  {
    emoji: '👰',
    title: 'Bachelorette',
    sub: 'Neon · Glam · Party',
    price: '₹3,499',
    tag: 'Reel Ready',
    tagColor: '#7c3aed',
    href: '/bachelorette-party',
    img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=700&q=70',
    grad: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    wa: 'Hi! I want to book a Bachelorette decoration. Can you help me with packages and pricing?',
  },
  {
    emoji: '🌙',
    title: 'Midnight Surprise',
    sub: 'Room · Hotel · Office',
    price: '₹2,999',
    tag: 'Most Surprising',
    tagColor: '#0ea5e9',
    href: '/midnight-surprise',
    img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=700&q=70',
    grad: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
    wa: 'Hi! I want to book a Midnight Surprise setup. Can you help me with packages and pricing?',
  },
  {
    emoji: '🎉',
    title: 'Theme Party',
    sub: 'Unicorn · Royal · Jungle',
    price: '₹3,999',
    tag: 'Instagram Worthy',
    tagColor: '#10b981',
    href: '/theme-party-decoration',
    img: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=700&q=70',
    grad: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
    wa: 'Hi! I want to book a Theme Party decoration. Can you help me with packages and pricing?',
  },
];

export default function OccasionCardsGrid() {
  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 border border-orange-200 bg-orange-50 text-orange-600 rounded-full px-4 py-1.5 text-xs font-bold mb-4 tracking-widest uppercase">
            🎊 All Occasions
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            What Are You{' '}
            <span style={{ background: 'linear-gradient(135deg, #ff6b00, #ff9800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Celebrating?
            </span>
          </h2>
          <p className="text-gray-500 mt-3 text-base max-w-xl mx-auto">
            Pick your occasion and get a custom decoration setup — delivered same day
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {OCCASIONS.map((occ) => (
            <div
              key={occ.title}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
              style={{ aspectRatio: '3/4' }}
            >
              {/* Background image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={occ.img}
                alt={occ.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Base overlay — always visible */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

              {/* Hover overlay — coloured tint */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                style={{ background: occ.grad }}
              />

              {/* Tag badge — top left */}
              <div className="absolute top-3 left-3">
                <span
                  className="text-[10px] md:text-xs font-bold text-white px-2.5 py-1 rounded-full"
                  style={{ background: occ.tagColor }}
                >
                  {occ.tag}
                </span>
              </div>

              {/* Content — bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {/* Emoji + Title always visible */}
                <div className="text-2xl mb-1">{occ.emoji}</div>
                <h3 className="text-white font-extrabold text-base md:text-lg leading-tight">{occ.title}</h3>
                <p className="text-white/60 text-xs mt-0.5 mb-3">{occ.sub}</p>

                {/* Price + CTA — slides up on hover */}
                <div className="overflow-hidden">
                  <div className="translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
                    <span
                      className="text-white font-black text-sm px-3 py-1 rounded-full"
                      style={{ background: occ.tagColor }}
                    >
                      From {occ.price}
                    </span>
                    <a
                      href={`https://wa.me/918073552837?text=${encodeURIComponent(occ.wa)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="flex-1 text-center text-xs font-bold text-white bg-white/15 backdrop-blur-sm border border-white/25 px-3 py-1.5 rounded-full hover:bg-white/25 transition"
                    >
                      Book Now →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <p className="text-gray-400 text-sm mb-4">Can&apos;t find your occasion? We do custom setups too!</p>
          <a
            href="https://wa.me/918073552837?text=Hi! I have a custom decoration request. Can you help?"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-bold text-sm px-7 py-3.5 rounded-full text-white transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #ff6b00, #ff9800)', boxShadow: '0 8px 24px rgba(255,107,0,0.25)' }}
          >
            💬 Ask for Custom Decoration
          </a>
        </div>
      </div>
    </section>
  );
}
