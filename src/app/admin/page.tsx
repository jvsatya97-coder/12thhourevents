'use client';
import { useState, useRef, useEffect } from 'react';
import { SHEET_URL, SERVICES, CITIES } from '@/lib/config';

const CLOUDINARY_CLOUD = 'w1ficzbb';
const CLOUDINARY_PRESET = '12he_products';
const ADMIN_PIN = '12he2024';

const SUBCAT_MAP: Record<string, string[]> = {
  bday:         ['Basic', 'Standard', 'Premium', 'Luxury', 'Balloon Arch', 'Theme', 'Outdoor'],
  theme:        ['Unicorn', 'Superhero', 'Jungle', 'Mermaid', 'Princess', 'Cars', 'Frozen'],
  anniv:        ['Romantic', 'Rose Setup', 'Candle Setup', 'Flower Wall', 'Luxury'],
  room:         ['Surprise', 'LED Lights', 'Balloon Ceiling', 'Fairy Lights', 'Premium'],
  baby:         ['Blue Theme', 'Pink Theme', 'Gender Neutral', 'Boho', 'Luxury'],
  welcomebaby:  ['Basic', 'Standard', 'Premium'],
  bachelorette: ['Pink Glam', 'Boho', 'Bride Tribe', 'Outdoor'],
  corporate:    ['Basic', 'Standard', 'Premium', 'Conference'],
  'act-artists':['Basic', 'Standard', 'Premium'],
  pinterest:    ['Trending', 'Aesthetic', 'Pastel', 'Boho', 'Luxury'],
};

type ImgEntry = { url: string; uploading: boolean; error: string };
type CityPrice = { price: string; orig: string };
type HistoryItem = {
  id: string; name: string; cat: string; sub: string; emoji: string;
  price: string; img: string; savedAt: number;
};

interface FormData {
  id: string; name: string; cat: string; sub: string;
  emoji: string; price: string; orig: string; disc: string;
  inclusions: string; exclusions: string;
  images: ImgEntry[];
  cityPrices: Record<string, CityPrice>;
  enableCityPrices: boolean;
}

function makeId(name: string, cat: string) {
  return (cat.slice(0, 4) + '_' + name.replace(/\s+/g, '_').slice(0, 12) + '_' + Date.now().toString(36)).toUpperCase();
}

function saveToHistory(item: HistoryItem) {
  try {
    const raw = localStorage.getItem('12he_admin_history');
    const list: HistoryItem[] = raw ? JSON.parse(raw) : [];
    list.unshift(item);
    localStorage.setItem('12he_admin_history', JSON.stringify(list.slice(0, 50)));
  } catch { /* ignore */ }
}

function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem('12he_admin_history');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function clearHistory() {
  try { localStorage.removeItem('12he_admin_history'); } catch { /* ignore */ }
}

const emptyForm = (): FormData => ({
  id: '', name: '', cat: 'bday', sub: '', emoji: '🎉',
  price: '', orig: '', disc: '0',
  inclusions: '', exclusions: '',
  images: [],
  cityPrices: {},
  enableCityPrices: false,
});

export default function AdminPage() {
  const [pin, setPin] = useState('');
  const [authed, setAuthed] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [tab, setTab] = useState<'add' | 'history'>('add');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>(emptyForm());

  useEffect(() => {
    setHistory(loadHistory());
  }, [tab]);

  const set = (k: keyof FormData, v: string | boolean) => {
    setForm(f => ({ ...f, [k]: v }));
    if (k === 'name' && typeof v === 'string' && v) {
      setForm(f => ({ ...f, [k]: v as string, id: makeId(v as string, f.cat) }));
    }
  };

  const setCityPrice = (slug: string, field: 'price' | 'orig', val: string) => {
    setForm(f => ({
      ...f,
      cityPrices: {
        ...f.cityPrices,
        [slug]: { ...(f.cityPrices[slug] || { price: '', orig: '' }), [field]: val },
      },
    }));
  };

  // ── Upload image to Cloudinary ──────────────────────────────────────────
  const uploadFile = async (file: File, idx: number) => {
    setForm(f => {
      const imgs = [...f.images];
      imgs[idx] = { url: '', uploading: true, error: '' };
      return { ...f, images: imgs };
    });

    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', CLOUDINARY_PRESET);
    fd.append('folder', '12he_products');

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
        method: 'POST', body: fd,
      });
      const data = await res.json();
      if (data.secure_url) {
        setForm(f => {
          const imgs = [...f.images];
          imgs[idx] = { url: data.secure_url, uploading: false, error: '' };
          return { ...f, images: imgs };
        });
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Upload failed';
      setForm(f => {
        const imgs = [...f.images];
        imgs[idx] = { url: '', uploading: false, error: msg };
        return { ...f, images: imgs };
      });
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const startIdx = form.images.length;
    setForm(f => ({
      ...f,
      images: [...f.images, ...Array.from(files).map(() => ({ url: '', uploading: true, error: '' }))],
    }));
    Array.from(files).forEach((file, i) => uploadFile(file, startIdx + i));
  };

  const addUrlManually = () => {
    setForm(f => ({ ...f, images: [...f.images, { url: '', uploading: false, error: '' }] }));
  };

  const removeImg = (idx: number) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  // ── Submit to Google Sheet ──────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.cat) {
      setSaveError('Name, category and price are required.');
      return;
    }
    const goodImgs = form.images.filter(i => i.url);
    if (!goodImgs.length) {
      setSaveError('Add at least one image.');
      return;
    }

    setSaving(true);
    setSaveError('');

    const productId = form.id || makeId(form.name, form.cat);
    const params: Record<string, string> = {
      action: 'addProduct',
      id: productId,
      name: form.name,
      cat: form.cat,
      sub: form.sub,
      emoji: form.emoji,
      price: form.price,
      orig: form.orig || form.price,
      disc: form.disc || '0',
      img: goodImgs[0]?.url || '',
      img1: goodImgs[1]?.url || '',
      img2: goodImgs[2]?.url || '',
      img3: goodImgs[3]?.url || '',
      img4: goodImgs[4]?.url || '',
      Inclusions: form.inclusions,
      Exclusions: form.exclusions,
    };

    // Add city-specific prices if enabled
    if (form.enableCityPrices) {
      CITIES.forEach(city => {
        const cp = form.cityPrices[city.slug];
        if (cp?.price) params[`price_${city.slug}`] = cp.price;
        if (cp?.orig) params[`orig_${city.slug}`] = cp.orig;
      });
    }

    try {
      await fetch(`${SHEET_URL}?${new URLSearchParams(params).toString()}`, { mode: 'no-cors' });

      // Save to local history
      saveToHistory({
        id: productId,
        name: form.name,
        cat: form.cat,
        sub: form.sub,
        emoji: form.emoji,
        price: form.price,
        img: goodImgs[0]?.url || '',
        savedAt: Date.now(),
      });

      setSaved(true);
      setForm(emptyForm());
      setTimeout(() => setSaved(false), 4000);
    } catch {
      setSaveError('Failed to save. Check your internet and try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── PIN screen ──────────────────────────────────────────────────────────
  if (!authed) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">
        <div className="text-4xl mb-3">🔐</div>
        <h1 className="text-xl font-bold text-gray-800 mb-1">Admin Panel</h1>
        <p className="text-sm text-gray-500 mb-6">12th Hour Events</p>
        <input
          type="password"
          placeholder="Enter PIN"
          value={pin}
          onChange={e => { setPin(e.target.value); setPinError(false); }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              if (pin === ADMIN_PIN) setAuthed(true);
              else setPinError(true);
            }
          }}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-center text-lg tracking-widest outline-none focus:border-orange-400 mb-3"
        />
        {pinError && <p className="text-red-500 text-sm mb-3">Wrong PIN</p>}
        <button
          onClick={() => { if (pin === ADMIN_PIN) setAuthed(true); else setPinError(true); }}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition"
        >
          Enter
        </button>
      </div>
    </div>
  );

  const subcats = SUBCAT_MAP[form.cat] || [];

  // ── Main admin ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-gray-800">Admin Panel</h1>
          <p className="text-xs text-gray-400">12th Hour Events</p>
        </div>
        {tab === 'add' && (
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl transition text-sm"
          >
            {saving ? 'Saving…' : '💾 Save Product'}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 flex">
        {(['add', 'history'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-semibold transition border-b-2 ${
              tab === t
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'add' ? '➕ Add Product' : '📋 Upload History'}
          </button>
        ))}
      </div>

      {saved && (
        <div className="bg-green-500 text-white text-center py-2.5 text-sm font-semibold">
          ✅ Product saved to sheet!
        </div>
      )}
      {saveError && (
        <div className="bg-red-50 text-red-600 text-center py-2.5 text-sm font-semibold border-b border-red-200">
          ⚠️ {saveError}
        </div>
      )}

      {/* ── HISTORY TAB ──────────────────────────────────────────────────── */}
      {tab === 'history' && (
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{history.length} product{history.length !== 1 ? 's' : ''} added from this device</p>
            {history.length > 0 && (
              <button
                onClick={() => { clearHistory(); setHistory([]); }}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Clear history
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">📭</div>
              <p className="font-semibold">No uploads yet</p>
              <p className="text-sm mt-1">Products you save will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map(item => (
                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 items-center">
                  {item.img ? (
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover flex-none"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-none">
                      {item.emoji}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-800 truncate">{item.emoji} {item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {SERVICES.find(s => s.cat === item.cat)?.name || item.cat}
                      {item.sub && ` · ${item.sub}`}
                    </p>
                    <p className="text-sm font-bold text-orange-600 mt-1">₹{Number(item.price).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="text-right flex-none">
                    <p className="text-[10px] text-gray-400">
                      {new Date(item.savedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(item.savedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <span className="inline-block mt-1 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Saved ✓
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── ADD PRODUCT TAB ───────────────────────────────────────────────── */}
      {tab === 'add' && (
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

          {/* ── Images ───────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-700 mb-4">📸 Product Images</h2>

            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
              onDragOver={e => e.preventDefault()}
              className="border-2 border-dashed border-orange-300 rounded-xl p-6 text-center cursor-pointer hover:bg-orange-50 transition mb-4"
            >
              <div className="text-3xl mb-2">📁</div>
              <p className="font-semibold text-gray-700 text-sm">Tap to upload photos</p>
              <p className="text-xs text-gray-400 mt-1">Or drag & drop • JPG, PNG, WEBP</p>
              <p className="text-xs text-orange-500 mt-1 font-medium">Auto-uploaded to Cloudinary ✓</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => handleFiles(e.target.files)}
            />

            {form.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {form.images.map((img, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden bg-gray-100 aspect-square">
                    {img.uploading ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <div className="w-7 h-7 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] text-gray-500">Uploading…</span>
                      </div>
                    ) : img.error ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
                        <span className="text-xl">⚠️</span>
                        <span className="text-[10px] text-red-500 text-center">{img.error}</span>
                      </div>
                    ) : img.url ? (
                      <>
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                        {i === 0 && <span className="absolute top-1 left-1 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">MAIN</span>}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-2">
                        <input
                          type="url"
                          placeholder="Paste URL"
                          className="w-full text-[10px] border-0 outline-none text-center bg-transparent"
                          onBlur={e => {
                            if (e.target.value) {
                              setForm(f => {
                                const imgs = [...f.images];
                                imgs[i] = { ...imgs[i], url: e.target.value };
                                return { ...f, images: imgs };
                              });
                            }
                          }}
                        />
                      </div>
                    )}
                    <button
                      onClick={() => removeImg(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                    >✕</button>
                  </div>
                ))}
              </div>
            )}

            <button onClick={addUrlManually} className="text-sm text-orange-600 font-medium underline">
              + Add image by URL
            </button>
          </div>

          {/* ── Basic Info ───────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-700">📝 Product Details</h2>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Product Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="e.g. Premium Birthday Balloon Setup"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mt-1 outline-none focus:border-orange-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category *</label>
                <select
                  value={form.cat}
                  onChange={e => { set('cat', e.target.value); setForm(f => ({ ...f, sub: '' })); }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm mt-1 outline-none focus:border-orange-400 bg-white"
                >
                  {SERVICES.map(s => (
                    <option key={s.cat} value={s.cat}>{s.emoji} {s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sub-category</label>
                <select
                  value={form.sub}
                  onChange={e => set('sub', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm mt-1 outline-none focus:border-orange-400 bg-white"
                >
                  <option value="">None</option>
                  {subcats.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Emoji</label>
              <input
                type="text"
                value={form.emoji}
                onChange={e => set('emoji', e.target.value)}
                className="w-20 border border-gray-200 rounded-xl px-3 py-3 text-lg mt-1 outline-none focus:border-orange-400 text-center"
              />
            </div>
          </div>

          {/* ── Pricing ──────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-700">💰 Pricing</h2>

            {/* Base price */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sale Price *</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-3 text-gray-400 text-sm">₹</span>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => set('price', e.target.value)}
                    placeholder="2499"
                    className="w-full border border-gray-200 rounded-xl pl-7 pr-3 py-3 text-sm outline-none focus:border-orange-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Original Price</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-3 text-gray-400 text-sm">₹</span>
                  <input
                    type="number"
                    value={form.orig}
                    onChange={e => set('orig', e.target.value)}
                    placeholder="3499"
                    className="w-full border border-gray-200 rounded-xl pl-7 pr-3 py-3 text-sm outline-none focus:border-orange-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Discount %</label>
                <input
                  type="number"
                  value={form.disc}
                  onChange={e => set('disc', e.target.value)}
                  placeholder="20"
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm mt-1 outline-none focus:border-orange-400"
                />
              </div>
            </div>

            <p className="text-xs text-gray-400">
              💡 This is the default price shown when no city is selected.
            </p>

            {/* City prices toggle */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700">🏙️ City-wise Pricing</p>
                  <p className="text-xs text-gray-400 mt-0.5">Set different prices per city</p>
                </div>
                <button
                  onClick={() => set('enableCityPrices', !form.enableCityPrices)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.enableCityPrices ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    form.enableCityPrices ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {form.enableCityPrices && (
                <div className="mt-4 space-y-3">
                  <p className="text-xs text-gray-500 font-medium">Leave blank to use default price for that city.</p>
                  <div className="grid grid-cols-1 gap-3">
                    {CITIES.map(city => {
                      const cp = form.cityPrices[city.slug] || { price: '', orig: '' };
                      return (
                        <div key={city.slug} className="bg-gray-50 rounded-xl px-4 py-3">
                          <p className="text-xs font-bold text-gray-600 mb-2">{city.name}</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="relative">
                              <span className="absolute left-2.5 top-2.5 text-gray-400 text-xs">₹</span>
                              <input
                                type="number"
                                value={cp.price}
                                onChange={e => setCityPrice(city.slug, 'price', e.target.value)}
                                placeholder="Sale price"
                                className="w-full border border-gray-200 rounded-lg pl-6 pr-2 py-2 text-xs outline-none focus:border-orange-400 bg-white"
                              />
                            </div>
                            <div className="relative">
                              <span className="absolute left-2.5 top-2.5 text-gray-400 text-xs">₹</span>
                              <input
                                type="number"
                                value={cp.orig}
                                onChange={e => setCityPrice(city.slug, 'orig', e.target.value)}
                                placeholder="Original price"
                                className="w-full border border-gray-200 rounded-lg pl-6 pr-2 py-2 text-xs outline-none focus:border-orange-400 bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Inclusions / Exclusions ───────────────────────────────────── */}
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-700">📋 What&apos;s Included / Not Included</h2>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                ✅ Inclusions <span className="normal-case font-normal text-gray-400">(one per line or comma-separated)</span>
              </label>
              <textarea
                value={form.inclusions}
                onChange={e => set('inclusions', e.target.value)}
                rows={4}
                placeholder="Balloon arch setup&#10;LED fairy lights&#10;Welcome board&#10;Flower bouquet"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mt-1 outline-none focus:border-orange-400 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                ❌ Exclusions <span className="normal-case font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                value={form.exclusions}
                onChange={e => set('exclusions', e.target.value)}
                rows={3}
                placeholder="Cake&#10;Photography&#10;Venue booking"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mt-1 outline-none focus:border-orange-400 resize-none"
              />
            </div>
          </div>

          {/* ── Product ID ───────────────────────────────────────────────── */}
          <div className="bg-gray-100 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-500">
              <span className="font-semibold">Product ID:</span> {form.id || <span className="italic">auto-generated from name</span>}
            </p>
          </div>

          {/* ── Save button ───────────────────────────────────────────────── */}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition text-base shadow-lg shadow-orange-200"
          >
            {saving ? '⏳ Saving to sheet…' : '💾 Save Product to Sheet'}
          </button>

          {saveError && (
            <p className="text-red-500 text-sm text-center">{saveError}</p>
          )}

          {/* ── Setup note ────────────────────────────────────────────────── */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 space-y-1">
            <p className="font-bold">⚙️ One-time Cloudinary setup (if images fail):</p>
            <p>1. Go to <strong>cloudinary.com</strong> → Settings → Upload</p>
            <p>2. Under <strong>Upload presets</strong> → Add preset</p>
            <p>3. Set Signing mode: <strong>Unsigned</strong>, name: <strong>12he_products</strong></p>
            <p>4. Save — uploads will work from this page</p>
          </div>

        </div>
      )}
    </div>
  );
}
