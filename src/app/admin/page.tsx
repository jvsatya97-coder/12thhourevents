'use client';
import { useState, useRef } from 'react';
import { SHEET_URL, SERVICES, CITIES } from '@/lib/config';

// ── Config ────────────────────────────────────────────────────────────────
// Your Cloudinary cloud name (from res.cloudinary.com/thksowin/...)
const CLOUDINARY_CLOUD = 'thksowin';
// Create a free unsigned upload preset in Cloudinary dashboard:
// Settings → Upload → Upload presets → Add preset → Signing mode: Unsigned
// Name it "12he_products" (or change this constant to match)
const CLOUDINARY_PRESET = '12he_products';
// Admin PIN — change this to something only you know
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

interface FormData {
  id: string; name: string; cat: string; sub: string;
  emoji: string; price: string; orig: string; disc: string;
  inclusions: string; exclusions: string;
  images: ImgEntry[];
}

function makeId(name: string, cat: string) {
  return (cat.slice(0, 4) + '_' + name.replace(/\s+/g, '_').slice(0, 12) + '_' + Date.now().toString(36)).toUpperCase();
}

export default function AdminPage() {
  const [pin, setPin] = useState('');
  const [authed, setAuthed] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    id: '', name: '', cat: 'bday', sub: '', emoji: '🎉',
    price: '', orig: '', disc: '0',
    inclusions: '', exclusions: '',
    images: [],
  });

  const set = (k: keyof FormData, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    if (k === 'name' && v) setForm(f => ({ ...f, [k]: v, id: makeId(v, f.cat) }));
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
    Array.from(files).forEach(file => {
      const idx = form.images.length;
      setForm(f => ({ ...f, images: [...f.images, { url: '', uploading: true, error: '' }] }));
      uploadFile(file, idx);
    });
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

    const params = new URLSearchParams({
      action: 'addProduct',
      id: form.id || makeId(form.name, form.cat),
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
    });

    try {
      await fetch(`${SHEET_URL}?${params.toString()}`, { mode: 'no-cors' });
      setSaved(true);
      // Reset form
      setForm({
        id: '', name: '', cat: 'bday', sub: '', emoji: '🎉',
        price: '', orig: '', disc: '0',
        inclusions: '', exclusions: '',
        images: [],
      });
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

  const service = SERVICES.find(s => s.cat === form.cat);
  const subcats = SUBCAT_MAP[form.cat] || [];

  // ── Main admin form ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-gray-800">Add Product</h1>
          <p className="text-xs text-gray-400">12th Hour Events Admin</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl transition text-sm"
        >
          {saving ? 'Saving…' : '💾 Save Product'}
        </button>
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

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* ── Images ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-700 mb-4">📸 Product Images</h2>

          {/* Upload zone */}
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

          {/* Image slots */}
          {form.images.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {form.images.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden bg-gray-100 aspect-square">
                  {img.uploading ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <div className="w-8 h-8 border-3 border-orange-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-gray-500">Uploading…</span>
                    </div>
                  ) : img.error ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
                      <span className="text-2xl">⚠️</span>
                      <span className="text-xs text-red-500 text-center">{img.error}</span>
                    </div>
                  ) : img.url ? (
                    <>
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      {i === 0 && <span className="absolute top-1 left-1 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">MAIN</span>}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <input
                        type="url"
                        placeholder="Paste image URL"
                        className="w-full text-xs border-0 outline-none text-center px-2"
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
                    className="absolute top-1 right-1 bg-black/60 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  >✕</button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={addUrlManually}
            className="text-sm text-orange-600 font-medium underline"
          >
            + Add image by URL instead
          </button>
        </div>

        {/* ── Basic Info ──────────────────────────────────────────────── */}
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

        {/* ── Pricing ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-700">💰 Pricing</h2>

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
            💡 Leave original price blank to auto-use sale price. Discount badge shows only if % &gt; 0.
          </p>
        </div>

        {/* ── Inclusions / Exclusions ──────────────────────────────────── */}
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

        {/* ── Product ID (auto-generated) ──────────────────────────────── */}
        <div className="bg-gray-100 rounded-xl px-4 py-3">
          <p className="text-xs text-gray-500">
            <span className="font-semibold">Product ID:</span> {form.id || <span className="italic">auto-generated from name</span>}
          </p>
        </div>

        {/* ── Save button ──────────────────────────────────────────────── */}
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

        {/* ── Setup note ───────────────────────────────────────────────── */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 space-y-1">
          <p className="font-bold">⚙️ One-time Cloudinary setup needed:</p>
          <p>1. Go to <strong>cloudinary.com</strong> → Settings → Upload</p>
          <p>2. Under <strong>Upload presets</strong> → Add preset</p>
          <p>3. Set Signing mode: <strong>Unsigned</strong></p>
          <p>4. Set preset name: <strong>12he_products</strong></p>
          <p>5. Save — image uploads will then work from this page</p>
        </div>

      </div>
    </div>
  );
}
