'use client';
import { useCompare } from '@/context/CompareContext';
import { useCity } from '@/context/CityContext';
import { getPrice, getOrig } from '@/lib/products';
import Link from 'next/link';

const ROWS = [
  { label: 'Price',    key: 'price'  },
  { label: 'Orig.',    key: 'orig'   },
  { label: 'Discount', key: 'disc'   },
  { label: 'Rating',   key: 'rating' },
  { label: 'Category', key: 'cat'    },
  { label: 'Includes', key: 'incs'   },
];

export default function CompareDrawer() {
  const { items, remove, clear, drawerOpen, setDrawerOpen } = useCompare();
  const { city, cityName } = useCity();

  if (items.length === 0) return null;

  const waText = items.map(p => `• ${p.name} (${getPrice(p, city)})`).join('\n');

  return (
    <>
      {/* Floating pill trigger */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[130] flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-xl transition-all"
        style={{ display: drawerOpen ? 'none' : 'flex' }}
      >
        ⚖️ Compare {items.length} package{items.length > 1 ? 's' : ''}
        <span className="bg-white/25 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {items.length}
        </span>
      </button>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative bg-white w-full rounded-t-3xl shadow-2xl overflow-hidden"
            style={{ maxHeight: '85vh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <div>
                <h2 className="font-extrabold text-gray-800 text-lg">⚖️ Compare Packages</h2>
                <p className="text-xs text-gray-400">{items.length} of 3 added · for {cityName}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={clear} className="text-xs text-red-400 hover:text-red-600 font-semibold border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-full transition">
                  Clear all
                </button>
                <button onClick={() => setDrawerOpen(false)} className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-lg">
                  ✕
                </button>
              </div>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 120px)' }}>
              {/* Package columns header */}
              <div
                className="grid gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100"
                style={{ gridTemplateColumns: `120px repeat(${items.length}, 1fr)` }}
              >
                <div />
                {items.map(p => (
                  <div key={p.id} className="relative">
                    <div className="rounded-xl overflow-hidden bg-orange-100 aspect-square mb-1.5">
                      {p.imgs[0] ? (
                        <img src={p.imgs[0]} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">{p.emoji}</div>
                      )}
                    </div>
                    <p className="text-xs font-bold text-gray-800 leading-tight line-clamp-2">{p.name}</p>
                    <button
                      onClick={() => remove(p.id)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-gray-200 hover:bg-red-400 hover:text-white text-gray-500 rounded-full text-[10px] flex items-center justify-center transition"
                    >✕</button>
                  </div>
                ))}
              </div>

              {/* Comparison rows */}
              <table className="w-full text-sm">
                <tbody>
                  {ROWS.map(row => (
                    <tr key={row.key} className="border-b border-gray-50 hover:bg-orange-50/40 transition">
                      <td className="py-3 px-4 text-xs font-bold text-gray-500 w-[120px] flex-shrink-0">
                        {row.label}
                      </td>
                      {items.map(p => {
                        let val: React.ReactNode = '—';
                        if (row.key === 'price') val = <span className="text-orange-600 font-extrabold">{getPrice(p, city) || '—'}</span>;
                        else if (row.key === 'orig') {
                          const o = getOrig(p, city);
                          val = o && o !== getPrice(p, city) ? <span className="text-gray-400 line-through">{o}</span> : '—';
                        }
                        else if (row.key === 'disc') val = p.disc > 0 ? <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{p.disc}% OFF</span> : '—';
                        else if (row.key === 'rating') val = <span className="text-orange-500">★★★★★ 4.9</span>;
                        else if (row.key === 'cat') val = <span className="capitalize text-gray-600">{p.cat?.replace(/-/g,' ')}</span>;
                        else if (row.key === 'incs') val = p.incs.length > 0
                          ? <ul className="space-y-0.5">{p.incs.slice(0,3).map((inc,i) => <li key={i} className="text-[11px] text-gray-600 flex gap-1"><span className="text-green-500 flex-shrink-0">✓</span>{inc}</li>)}{p.incs.length > 3 && <li className="text-[11px] text-gray-400">+{p.incs.length - 3} more</li>}</ul>
                          : '—';
                        return (
                          <td key={p.id} className="py-3 px-3 align-top" style={{ width: `${80 / items.length}%` }}>
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* CTA row */}
              <div
                className="grid gap-2 px-4 py-4 bg-gray-50"
                style={{ gridTemplateColumns: `120px repeat(${items.length}, 1fr)` }}
              >
                <div className="text-xs font-bold text-gray-500 self-center">Book Now</div>
                {items.map(p => (
                  <div key={p.id} className="flex flex-col gap-1.5">
                    <a
                      href={`https://wa.me/918073552837?text=Hi! I want to book: ${p.name} (${getPrice(p, city)}) for ${cityName}.`}
                      target="_blank" rel="noopener noreferrer"
                      className="w-full text-xs font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 rounded-xl text-center"
                    >
                      📋 Book
                    </a>
                    <Link
                      href={`/product/${encodeURIComponent(p.id)}`}
                      onClick={() => setDrawerOpen(false)}
                      className="w-full text-xs font-semibold text-orange-500 border border-orange-200 py-1.5 rounded-xl text-center hover:bg-orange-50 transition"
                    >
                      View →
                    </Link>
                  </div>
                ))}
              </div>

              {/* WhatsApp all */}
              <div className="px-4 pb-5">
                <a
                  href={`https://wa.me/918073552837?text=Hi! I'm comparing these packages in ${cityName}:\n${waText}\n\nCan you help me pick the best one?`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl text-sm transition"
                >
                  💬 Ask Us to Help Pick the Best One
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
