'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { SHEET_URL, SERVICES, CITIES } from '@/lib/config';

const CLOUDINARY_CLOUD = 'w1ficzbb';
const CLOUDINARY_PRESET = '12he_products';
const ADMIN_PIN = '12he2024';

const SUBCAT_MAP: Record<string, string[]> = {
  bday:         ['Basic', 'Standard', 'Premium', 'Luxury', 'Wall Decor', 'Ring Decor', 'Balloon Arch', 'Balloon Ceiling', 'Table Setup', 'Theme', 'Outdoor', 'Balloon Bouquet'],
  theme:        [
    // Girl themes
    'Unicorn', 'Mermaid', 'Butterfly', 'Rainbow', 'Barbie', 'Princess', 'Hello Kitty',
    'Frozen', 'Moana', 'Candyland', 'Hot Air Balloon', 'Ocean', 'Kuromi', "Gabby's Dollhouse",
    'K-Pop',
    // Boy themes
    'Cars', 'Superhero', 'Spider-Man', 'Batman', 'Hulk', 'Space', 'Football',
    'Mickey Mouse', 'Minions', 'Jungle', 'Peppa Pig', 'PAW Patrol', 'Doraemon',
    'Baby Shark', 'LEGO', 'Minecraft', 'Pokémon', 'Sonic', 'Bluey', 'Beyblade',
    'SpongeBob', 'Shin-Chan', 'Tom & Jerry', 'Winnie the Pooh', 'Boss Baby',
    'Construction',
    // Classic / All
    '1st Birthday', 'Harry Potter', 'Carnival', 'Donut', 'Disney Princess',
  ],
  anniv:        ['Romantic', 'Rose Setup', 'Candle Setup', 'Flower Wall', 'Luxury'],
  balloon:      ['Basic', 'Wall Decor', 'Ring Decor', 'Balloon Arch', 'Balloon Ceiling', 'Balloon Bouquet', 'Room Decoration', 'Surprise Room', 'LED Lights', 'Fairy Lights', 'Premium', 'Luxury'],
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
  price: string; img: string; savedAt: number; active?: boolean;
};
// Metadata stored locally per product id
type ProductMeta = {
  uploadedAt: number;   // first save timestamp
  editedAt?: number;    // last edit timestamp
  editCount: number;    // how many times edited
};
// Raw product row from sheet
type SheetProduct = Record<string, string>;

interface FormData {
  id: string; name: string; cat: string; sub: string;
  cats2: string;      // optional second category slug
  sort_order: string; // '' = none, '1' = top, '2' = second, etc.
  emoji: string; price: string; orig: string; disc: string;
  inclusions: string; exclusions: string;
  images: ImgEntry[];
  cityPrices: Record<string, CityPrice>;
  enableCityPrices: boolean;
  isEdit: boolean; // true when editing existing product
}

function makeId(name: string, cat: string) {
  return (cat.slice(0, 4) + '_' + name.replace(/\s+/g, '_').slice(0, 12) + '_' + Date.now().toString(36)).toUpperCase();
}

function saveToHistory(item: HistoryItem) {
  try {
    const raw = localStorage.getItem('12he_admin_history');
    const list: HistoryItem[] = raw ? JSON.parse(raw) : [];
    // Replace if same id already exists
    const filtered = list.filter(i => i.id !== item.id);
    filtered.unshift(item);
    localStorage.setItem('12he_admin_history', JSON.stringify(filtered.slice(0, 50)));
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

function updateHistoryItem(id: string, patch: Partial<HistoryItem>) {
  try {
    const raw = localStorage.getItem('12he_admin_history');
    const list: HistoryItem[] = raw ? JSON.parse(raw) : [];
    const updated = list.map(item => item.id === id ? { ...item, ...patch } : item);
    localStorage.setItem('12he_admin_history', JSON.stringify(updated));
    return updated;
  } catch { return []; }
}

// ── Product metadata (upload time, edit history) ──────────────────────────
function loadMeta(): Record<string, ProductMeta> {
  try { return JSON.parse(localStorage.getItem('12he_product_meta') || '{}'); } catch { return {}; }
}
function saveMeta(meta: Record<string, ProductMeta>) {
  try { localStorage.setItem('12he_product_meta', JSON.stringify(meta)); } catch { /* ignore */ }
}
function recordUpload(id: string) {
  const meta = loadMeta();
  meta[id] = { uploadedAt: Date.now(), editCount: 0 };
  saveMeta(meta);
}
function recordEdit(id: string) {
  const meta = loadMeta();
  const existing = meta[id] || { uploadedAt: Date.now(), editCount: 0 };
  meta[id] = { ...existing, editedAt: Date.now(), editCount: (existing.editCount || 0) + 1 };
  saveMeta(meta);
}
function getMetaFor(id: string): ProductMeta | null {
  return loadMeta()[id] || null;
}

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function fmtTime(ts: number) {
  return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}
function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

/**
 * Parse a date string saved by Apps Script v5, e.g.:
 *   "08 Nov 2026, 09:15 am"  or  "08-Nov-2026 09:15"
 * Falls back gracefully — returns 0 if unparseable.
 */
function parseSheetDate(str: string): number {
  if (!str) return 0;
  try {
    // Apps Script toLocaleString en-IN returns e.g. "08/11/2026, 09:15:00"
    // But we format it ourselves as "08 Nov 2026, 09:15 am"
    const ts = Date.parse(str);
    if (!isNaN(ts)) return ts;
    // try replacing comma
    const ts2 = Date.parse(str.replace(',', ''));
    if (!isNaN(ts2)) return ts2;
    return 0;
  } catch { return 0; }
}

const emptyForm = (): FormData => ({
  id: '', name: '', cat: 'bday', sub: '', cats2: '', sort_order: '', emoji: '🎉',
  price: '', orig: '', disc: '0',
  inclusions: '', exclusions: '',
  images: [],
  cityPrices: {},
  enableCityPrices: false,
  isEdit: false,
});

// Convert a sheet product row into FormData for editing
function productToForm(p: SheetProduct): FormData {
  const cityPrices: Record<string, CityPrice> = {};
  let hasCityPrices = false;
  CITIES.forEach(city => {
    const cp = p[`price_${city.slug}`] || '';
    const co = p[`orig_${city.slug}`] || '';
    if (cp || co) { cityPrices[city.slug] = { price: cp, orig: co }; hasCityPrices = true; }
  });

  // Collect all images
  const images: ImgEntry[] = [];
  ['img', 'img1', 'img2', 'img3', 'img4', 'img5'].forEach(key => {
    if (p[key]) images.push({ url: p[key], uploading: false, error: '' });
  });

  return {
    id: p.id || '',
    name: p.name || '',
    cat: p.cat || 'bday',
    sub: p.sub || '',
    cats2: p.cats2 || '',
    sort_order: p.sort_order || '',
    emoji: p.emoji || '🎉',
    price: p.price || '',
    orig: p.orig || '',
    disc: p.disc || '0',
    inclusions: p.inclusions || p.Inclusions || '',
    exclusions: p.exclusions || p.Exclusions || '',
    images,
    cityPrices,
    enableCityPrices: hasCityPrices,
    isEdit: true,
  };
}

export default function AdminPage() {
  const [pin, setPin] = useState('');
  const [authed, setAuthed] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [tab, setTab] = useState<'add' | 'edit' | 'history' | 'dashboard'>('add');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Edit tab state
  const [allProducts, setAllProducts] = useState<SheetProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'live' | 'hidden'>('all');
  const [editingProduct, setEditingProduct] = useState<SheetProduct | null>(null);
  const [productMeta, setProductMeta] = useState<Record<string, ProductMeta>>({});
  const [showMore, setShowMore] = useState<Record<string, boolean>>({});
  const toggleMore = (key: string) => setShowMore(prev => ({ ...prev, [key]: !prev[key] }));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormData>(emptyForm());

  // Load all products when edit tab opens
  const loadAllProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductMeta(loadMeta());
    try {
      const res = await fetch(`${SHEET_URL}?showAll=true&_=${Date.now()}`);
      const data = await res.json();
      setAllProducts(data.products || []);
      // Also populate history from sheet (all-device view)
      // Sort by uploaded_at desc, fall back to savedAt in localStorage
      const sheetItems: HistoryItem[] = (data.products || [])
        .filter((p: SheetProduct) => p.id && p.name)
        .map((p: SheetProduct) => ({
          id: p.id, name: p.name, cat: p.cat, sub: p.sub,
          emoji: p.emoji || '🎉', price: p.price, img: p.img || '',
          savedAt: p.uploaded_at ? parseSheetDate(p.uploaded_at) : 0,
          active: p.active !== 'false',
        }))
        .filter((i: HistoryItem) => i.savedAt > 0)
        .sort((a: HistoryItem, b: HistoryItem) => b.savedAt - a.savedAt);
      if (sheetItems.length > 0) setHistory(sheetItems);
    } catch {
      setAllProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'history') {
      // Load localStorage history as a quick initial view, then refresh from sheet
      setHistory(loadHistory());
      loadAllProducts();
    }
  }, [tab, loadAllProducts]);

  useEffect(() => {
    if (tab === 'edit' && !editingProduct) loadAllProducts();
  }, [tab, editingProduct, loadAllProducts]);

  useEffect(() => {
    if (tab === 'dashboard') loadAllProducts();
  }, [tab, loadAllProducts]);

  const set = (k: keyof FormData, v: string | boolean) => {
    setForm(f => {
      const updated = { ...f, [k]: v };
      // Auto-calculate discount % when price or orig changes
      if (k === 'price' || k === 'orig') {
        const sale = parseFloat(k === 'price' ? String(v) : f.price);
        const orig = parseFloat(k === 'orig'  ? String(v) : f.orig);
        if (orig > sale && sale > 0) {
          updated.disc = String(Math.round((orig - sale) / orig * 100));
        }
      }
      // Auto-generate ID from name on add
      if (k === 'name' && typeof v === 'string' && v && !f.isEdit) {
        updated.id = makeId(v as string, f.cat);
      }
      return updated;
    });
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

  // ── Upload image to Cloudinary ─────────────────────────────────────────
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
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.secure_url) {
        setForm(f => { const imgs = [...f.images]; imgs[idx] = { url: data.secure_url, uploading: false, error: '' }; return { ...f, images: imgs }; });
      } else { throw new Error(data.error?.message || 'Upload failed'); }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Upload failed';
      setForm(f => { const imgs = [...f.images]; imgs[idx] = { url: '', uploading: false, error: msg }; return { ...f, images: imgs }; });
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const startIdx = form.images.length;
    setForm(f => ({ ...f, images: [...f.images, ...Array.from(files).map(() => ({ url: '', uploading: true, error: '' }))] }));
    Array.from(files).forEach((file, i) => uploadFile(file, startIdx + i));
  };

  const removeImg = (idx: number) => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  // ── Submit (add or edit) ───────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.cat) { setSaveError('Name, category and price are required.'); return; }
    const goodImgs = form.images.filter(i => i.url);
    if (!goodImgs.length) { setSaveError('Add at least one image.'); return; }

    setSaving(true); setSaveError('');

    const productId = form.id || makeId(form.name, form.cat);
    const params: Record<string, string> = {
      action: form.isEdit ? 'editProduct' : 'addProduct',
      id: productId, name: form.name, cat: form.cat, sub: form.sub,
      cats2: form.cats2 || '',
      sort_order: form.sort_order || '',
      emoji: form.emoji, price: form.price, orig: form.orig || form.price,
      disc: form.disc || '0',
      img:  goodImgs[0]?.url || '', img1: goodImgs[1]?.url || '',
      img2: goodImgs[2]?.url || '', img3: goodImgs[3]?.url || '',
      img4: goodImgs[4]?.url || '', img5: goodImgs[5]?.url || '',
      Inclusions: form.inclusions, Exclusions: form.exclusions,
    };

    if (form.enableCityPrices) {
      CITIES.forEach(city => {
        const cp = form.cityPrices[city.slug];
        if (cp?.price) params[`price_${city.slug}`] = cp.price;
        if (cp?.orig)  params[`orig_${city.slug}`]  = cp.orig;
      });
    }

    try {
      await fetch(`${SHEET_URL}?${new URLSearchParams(params).toString()}`, { mode: 'no-cors' });
      if (form.isEdit) { recordEdit(productId); } else { recordUpload(productId); }
      saveToHistory({
        id: productId, name: form.name, cat: form.cat, sub: form.sub,
        emoji: form.emoji, price: form.price, img: goodImgs[0]?.url || '',
        savedAt: Date.now(), active: true,
      });
      setSaved(true);
      setForm(emptyForm());
      setEditingProduct(null);
      setTimeout(() => setSaved(false), 4000);
    } catch {
      setSaveError('Failed to save. Check your internet and try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (item: HistoryItem) => {
    try {
      await fetch(`${SHEET_URL}?action=toggleActive&id=${encodeURIComponent(item.id)}`, { mode: 'no-cors' });
      const updated = updateHistoryItem(item.id, { active: !item.active });
      setHistory(updated);
    } catch { alert('Could not toggle. Check your internet connection.'); }
  };

  // Set sort_order directly from Edit tab product card (without opening form)
  // Uses action=setPinOrder so Apps Script only touches the sort_order column
  const setPinOrder = async (id: string, order: string, prevOrder: string) => {
    // Send to sheet — use a dedicated lightweight action
    // We pass name+cat too so editProduct can find the row even if only id differs
    try {
      const params = new URLSearchParams({ action: 'setPinOrder', id, sort_order: order });
      await fetch(`${SHEET_URL}?${params.toString()}`, { mode: 'no-cors' });
    } catch {
      // Revert UI on failure
      setAllProducts(prev => prev.map(x => x.id === id ? { ...x, sort_order: prevOrder } : x));
      alert('Could not update pin order.');
    }
  };

  // Toggle active directly from Edit tab product card
  const toggleActiveEdit = async (p: SheetProduct, e: React.MouseEvent) => {
    e.stopPropagation(); // don't open the edit form
    const isCurrentlyLive = p.active !== 'false';
    // Optimistically update UI
    setAllProducts(prev => prev.map(x => x.id === p.id ? { ...x, active: isCurrentlyLive ? 'false' : 'true' } : x));
    try {
      await fetch(`${SHEET_URL}?action=toggleActive&id=${encodeURIComponent(p.id)}`, { mode: 'no-cors' });
    } catch {
      // Revert on failure
      setAllProducts(prev => prev.map(x => x.id === p.id ? { ...x, active: p.active } : x));
      alert('Could not toggle. Check your internet connection.');
    }
  };

  // Start editing a product from the product list
  const startEdit = (p: SheetProduct) => {
    setEditingProduct(p);
    setForm(productToForm(p));
    setSaved(false); setSaveError('');
  };

  // ── PIN screen ─────────────────────────────────────────────────────────
  if (!authed) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">
        <div className="text-4xl mb-3">🔐</div>
        <h1 className="text-xl font-bold text-gray-800 mb-1">Admin Panel</h1>
        <p className="text-sm text-gray-500 mb-6">12th Hour Events</p>
        <input type="password" placeholder="Enter PIN" value={pin}
          onChange={e => { setPin(e.target.value); setPinError(false); }}
          onKeyDown={e => { if (e.key === 'Enter') { if (pin === ADMIN_PIN) setAuthed(true); else setPinError(true); } }}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-center text-lg tracking-widest outline-none focus:border-orange-400 mb-3"
        />
        {pinError && <p className="text-red-500 text-sm mb-3">Wrong PIN</p>}
        <button onClick={() => { if (pin === ADMIN_PIN) setAuthed(true); else setPinError(true); }}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition">
          Enter
        </button>
      </div>
    </div>
  );

  const subcats = SUBCAT_MAP[form.cat] || [];
  const filteredProducts = allProducts.filter(p => {
    if (filterCat !== 'all' && p.cat !== filterCat) return false;
    if (filterStatus === 'live' && p.active === 'false') return false;
    if (filterStatus === 'hidden' && p.active !== 'false') return false;
    if (searchQ) {
      const q = searchQ.toLowerCase();
      return p.name?.toLowerCase().includes(q) || p.cat?.toLowerCase().includes(q) || p.sub?.toLowerCase().includes(q);
    }
    return true;
  });

  // ── Main admin ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-3 flex items-center justify-between">
        <div>
          {editingProduct ? (
            <div className="flex items-center gap-2">
              <button onClick={() => { setEditingProduct(null); setForm(emptyForm()); }} className="text-orange-500 font-bold text-lg">‹</button>
              <div>
                <h1 className="font-bold text-gray-800 text-sm">Editing Product</h1>
                <p className="text-xs text-gray-400 truncate max-w-[180px]">{editingProduct.name}</p>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="font-bold text-gray-800">Admin Panel</h1>
              <p className="text-xs text-gray-400">12th Hour Events</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <a href="/admin/leads"
            className="text-xs font-bold px-3 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-200">
            📊 Leads CRM
          </a>
          {(tab === 'add' || editingProduct) && (
            <button onClick={handleSubmit} disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl transition text-sm">
              {saving ? 'Saving…' : form.isEdit ? '✏️ Update' : '💾 Save'}
            </button>
          )}
        </div>
      </div>

      {/* Tabs — hide when editing */}
      {!editingProduct && (
        <div className="bg-white border-b border-gray-200 flex">
          {(['add', 'edit', 'history', 'dashboard'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-3 text-xs font-semibold transition border-b-2 ${
                tab === t ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {t === 'add' ? '➕ Add' : t === 'edit' ? '✏️ Edit' : t === 'history' ? '📋 History' : '📊 Dashboard'}
            </button>
          ))}
        </div>
      )}

      {saved && <div className="bg-green-500 text-white text-center py-2.5 text-sm font-semibold">✅ {form.isEdit ? 'Product updated!' : 'Product saved!'}</div>}
      {saveError && <div className="bg-red-50 text-red-600 text-center py-2.5 text-sm font-semibold border-b border-red-200">⚠️ {saveError}</div>}

      {/* ── EDIT TAB — product list ──────────────────────────────────────── */}
      {tab === 'edit' && !editingProduct && (
        <div className="max-w-2xl mx-auto px-4 py-5">

          {/* Search */}
          <div className="relative mb-3">
            <span className="absolute left-3 top-3 text-gray-400">🔍</span>
            <input type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)}
              placeholder="Search by name, category…"
              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:border-orange-400 bg-white"
            />
          </div>

          {/* Filters row */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {/* Status filter */}
            {(['all', 'live', 'hidden'] as const).map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`flex-none px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                  filterStatus === s ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-gray-200 text-gray-600'
                }`}>
                {s === 'all' ? 'All Status' : s === 'live' ? '● Live' : '○ Hidden'}
              </button>
            ))}
            <div className="w-px bg-gray-200 flex-none mx-1" />
            {/* Category filter */}
            <button onClick={() => setFilterCat('all')}
              className={`flex-none px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                filterCat === 'all' ? 'bg-gray-800 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-600'
              }`}>All Cats</button>
            {SERVICES.map(s => (
              <button key={s.cat} onClick={() => setFilterCat(s.cat)}
                className={`flex-none px-3 py-1.5 rounded-full text-xs font-semibold border transition whitespace-nowrap ${
                  filterCat === s.cat ? 'bg-gray-800 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-600'
                }`}>
                {s.emoji} {s.name.replace(' Decoration', '').replace(' Party', '').replace(' Events', '')}
              </button>
            ))}
          </div>

          {productsLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm flex gap-3 animate-pulse">
                  <div className="w-14 h-14 bg-gray-200 rounded-xl flex-none" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">📭</div>
              <p className="font-semibold">{searchQ || filterCat !== 'all' || filterStatus !== 'all' ? 'No products match filters' : 'No products found'}</p>
              <button onClick={loadAllProducts} className="mt-3 text-sm text-orange-500 underline">Refresh</button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-gray-400 mb-1">{filteredProducts.length} of {allProducts.length} products</p>
              {filteredProducts.map(p => {
                // Prefer sheet-stored timestamps (v5+); fall back to localStorage for older products
                const sheetUploadTs = parseSheetDate(p.uploaded_at || '');
                const sheetEditTs   = parseSheetDate(p.edited_at || '');
                const sheetEditCount = parseInt(p.edit_count || '0') || 0;
                const localMeta = productMeta[p.id];
                const uploadTs  = sheetUploadTs || localMeta?.uploadedAt || 0;
                const editTs    = sheetEditTs   || localMeta?.editedAt   || 0;
                const editCount = sheetEditTs ? sheetEditCount : (localMeta?.editCount || 0);
                const fromSheet = sheetUploadTs > 0;

                return (
                  <button key={p.id} onClick={() => startEdit(p)}
                    className="w-full bg-white rounded-2xl p-4 shadow-sm flex gap-3 items-start text-left hover:shadow-md hover:border-orange-200 border border-transparent transition">
                    {p.img ? (
                      <img src={p.img} alt={p.name} className="w-14 h-14 rounded-xl object-cover flex-none" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center text-2xl flex-none">{p.emoji || '🎉'}</div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-800 text-sm truncate">{p.emoji} {p.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {SERVICES.find(s => s.cat === p.cat)?.name || p.cat}
                        {p.sub && ` · ${p.sub}`}
                      </p>
                      <p className="text-sm font-bold text-orange-600 mt-1">₹{Number(p.price || 0).toLocaleString('en-IN')}</p>
                      {/* Meta: upload & edit times — from sheet (all devices) or localStorage fallback */}
                      {uploadTs > 0 ? (
                        <div className="mt-1.5 space-y-0.5">
                          <p className="text-[10px] text-gray-400">
                            📤 Uploaded {fmtDate(uploadTs)} at {fmtTime(uploadTs)}
                            <span className="text-gray-300 mx-1">·</span>
                            <span className="text-gray-400">{timeAgo(uploadTs)}</span>
                            {fromSheet && <span className="text-gray-300 ml-1">🌐</span>}
                          </p>
                          {editTs > 0 && (
                            <p className="text-[10px] text-blue-500">
                              ✏️ Last edited {fmtDate(editTs)} at {fmtTime(editTs)}
                              <span className="text-blue-300 mx-1">·</span>
                              {editCount} edit{editCount !== 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-[10px] text-gray-300 mt-1">No timestamp yet — will show after next edit</p>
                      )}
                    </div>
                    <div className="flex-none flex flex-col items-end gap-2">
                      <button
                        onClick={(e) => toggleActiveEdit(p, e)}
                        title={p.active === 'false' ? 'Click to make Live' : 'Click to Hide'}
                        className={`text-[10px] font-bold px-2.5 py-1.5 rounded-full border transition active:scale-95 ${
                          p.active === 'false'
                            ? 'bg-red-50 text-red-600 border-red-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200'
                            : 'bg-green-50 text-green-700 border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                        }`}>
                        {p.active === 'false' ? '○ Hidden' : '● Live'}
                      </button>
                      {/* Pin / sort order */}
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <span className="text-[10px] text-gray-400">📌</span>
                        <input
                          type="number"
                          min="1"
                          placeholder="—"
                          value={p.sort_order || ''}
                          onChange={e => {
                            const val = e.target.value;
                            setAllProducts(prev => prev.map(x => x.id === p.id ? { ...x, sort_order: val } : x));
                          }}
                          onBlur={e => {
                            const newVal = e.target.value;
                            const prevVal = p.sort_order || '';
                            if (newVal !== prevVal) setPinOrder(p.id, newVal, prevVal);
                          }}
                          onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                          className="w-10 text-center text-[10px] font-bold border border-gray-200 rounded-lg px-1 py-1 outline-none focus:border-orange-400 bg-white"
                          title="Pin position (1 = top of page). Leave blank to remove pin."
                        />
                      </div>
                      <p className="text-xs text-orange-500 font-medium">Edit →</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── HISTORY TAB ─────────────────────────────────────────────────── */}
      {tab === 'history' && (
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-700 font-semibold">{history.length} product{history.length !== 1 ? 's' : ''} uploaded</p>
              <p className="text-xs text-gray-400 mt-0.5">🌐 All devices · synced from sheet</p>
            </div>
            <button onClick={loadAllProducts} className="text-xs text-orange-500 font-medium border border-orange-200 px-3 py-1.5 rounded-full hover:bg-orange-50 transition">↻ Refresh</button>
          </div>
          {history.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">📭</div>
              <p className="font-semibold">No uploads yet</p>
              <p className="text-xs mt-2">Timestamps will appear after saving products with the new Apps Script v5</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map(item => (
                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 items-center">
                  {item.img ? (
                    <img src={item.img} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-none" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-none">{item.emoji}</div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-800 truncate">{item.emoji} {item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {SERVICES.find(s => s.cat === item.cat)?.name || item.cat}
                      {item.sub && ` · ${item.sub}`}
                    </p>
                    <p className="text-sm font-bold text-orange-600 mt-1">₹{Number(item.price).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="text-right flex-none space-y-1">
                    <p className="text-[10px] text-gray-400">{new Date(item.savedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    <p className="text-[10px] text-gray-400">{new Date(item.savedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                    <button onClick={() => toggleActive(item)}
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full transition ${
                        item.active !== false ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600' : 'bg-red-100 text-red-600 hover:bg-green-100 hover:text-green-700'
                      }`}>
                      {item.active !== false ? '● Live' : '○ Hidden'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── DASHBOARD TAB ───────────────────────────────────────────────── */}
      {tab === 'dashboard' && !editingProduct && (() => {
        if (productsLoading) return (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm">Loading dashboard…</p>
          </div>
        );

        // Separate add-ons from main products — addons are not counted in product stats
        const addonsAll = allProducts.filter(p => p.cat === 'addons');
        const all = allProducts.filter(p => p.cat !== 'addons');
        const live = all.filter(p => p.active !== 'false');
        const hidden = all.filter(p => p.active === 'false');
        const addonsLive = addonsAll.filter(p => p.active !== 'false');
        const addonsHidden = addonsAll.filter(p => p.active === 'false');

        // Category counts
        const catCounts: Record<string, number> = {};
        all.forEach(p => { catCounts[p.cat] = (catCounts[p.cat] || 0) + 1; });
        const knownCats = new Set(SERVICES.map(s => s.cat));
        const catList = SERVICES.map(s => ({ ...s, count: catCounts[s.cat] || 0 }))
          .filter(s => s.count > 0)
          .sort((a, b) => b.count - a.count);
        // Unknown cats — products whose cat doesn't match any SERVICES entry
        const unknownCats: { cat: string; count: number; products: SheetProduct[] }[] = [];
        Object.entries(catCounts).forEach(([cat, count]) => {
          if (!knownCats.has(cat)) {
            unknownCats.push({ cat, count, products: all.filter(p => p.cat === cat) });
          }
        });

        // Image health — per-product classification
        const imgKeys = ['img', 'img1', 'img2', 'img3', 'img4', 'img5'];
        let imgOk = 0, imgWrongCloud = 0, imgDrive = 0, imgMissing = 0, multiImg = 0;
        const wrongCloudProducts: SheetProduct[] = [];
        const driveProducts: SheetProduct[] = [];
        const missingImgProducts: SheetProduct[] = [];
        all.forEach(p => {
          const imgs = imgKeys.map(k => p[k]).filter(Boolean);
          if (imgs.length === 0) { imgMissing++; missingImgProducts.push(p); return; }
          if (imgs.length > 1) multiImg++;
          const main = imgs[0];
          if (main.includes('res.cloudinary.com/w1ficzbb')) imgOk++;
          else if (main.includes('res.cloudinary.com')) { imgWrongCloud++; wrongCloudProducts.push(p); }
          else if (main.includes('drive.google.com') || main.includes('lh3.googleusercontent.com')) { imgDrive++; driveProducts.push(p); }
          else { imgMissing++; missingImgProducts.push(p); }
        });

        // Pricing
        const prices = all.map(p => parseFloat(p.price)).filter(n => !isNaN(n) && n > 0);
        const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
        const minPrice = prices.length ? Math.min(...prices) : 0;
        const maxPrice = prices.length ? Math.max(...prices) : 0;
        const medianPrice = prices.length ? [...prices].sort((a,b)=>a-b)[Math.floor(prices.length/2)] : 0;

        // Price range buckets
        const priceBuckets = [
          { label: 'Under ₹1k', min: 0, max: 1000 },
          { label: '₹1k–3k', min: 1000, max: 3000 },
          { label: '₹3k–5k', min: 3000, max: 5000 },
          { label: '₹5k–10k', min: 5000, max: 10000 },
          { label: 'Above ₹10k', min: 10000, max: Infinity },
        ].map(b => ({
          ...b,
          count: all.filter(p => { const pr = parseFloat(p.price); return !isNaN(pr) && pr >= b.min && pr < b.max; }).length,
        }));

        // Discount buckets
        const discBuckets = { none: 0, low: 0, mid: 0, high: 0 };
        all.forEach(p => {
          const d = parseInt(p.disc || '0') || 0;
          if (d === 0) discBuckets.none++;
          else if (d <= 15) discBuckets.low++;
          else if (d <= 30) discBuckets.mid++;
          else discBuckets.high++;
        });

        // City coverage — count products with city-specific prices
        const cityCoverage: Record<string, number> = {};
        all.forEach(p => {
          CITIES.forEach(city => {
            if (p[`price_${city.slug}`]) cityCoverage[city.slug] = (cityCoverage[city.slug] || 0) + 1;
          });
        });
        const coveredCities = CITIES.filter(c => cityCoverage[c.slug] > 0).length;
        const uncoveredCities = CITIES.filter(c => !cityCoverage[c.slug]);

        // Pinned products
        const pinnedProducts = all.filter(p => p.sort_order && parseInt(p.sort_order) > 0)
          .sort((a, b) => parseInt(a.sort_order) - parseInt(b.sort_order));

        // Top 5 by price, bottom 5 by price
        const top5 = [...all].filter(p => parseFloat(p.price) > 0)
          .sort((a, b) => parseFloat(b.price) - parseFloat(a.price)).slice(0, 5);
        const bottom5 = [...all].filter(p => parseFloat(p.price) > 0)
          .sort((a, b) => parseFloat(a.price) - parseFloat(b.price)).slice(0, 5);

        // Recently added/edited (last 7 days)
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const recentlyAdded = all.filter(p => {
          const ts = parseSheetDate(p.uploaded_at || '');
          return ts > sevenDaysAgo;
        }).sort((a, b) => parseSheetDate(b.uploaded_at || '') - parseSheetDate(a.uploaded_at || ''));
        const recentlyEdited = all.filter(p => {
          const ts = parseSheetDate(p.edited_at || '');
          return ts > sevenDaysAgo;
        }).sort((a, b) => parseSheetDate(b.edited_at || '') - parseSheetDate(a.edited_at || ''));

        // No-discount products
        const noDiscountCount = all.filter(p => { const d = parseInt(p.disc || '0') || 0; return d === 0 && parseFloat(p.orig || '0') > parseFloat(p.price || '0'); }).length;

        // Missing / zero price
        const missingPriceProducts = all.filter(p => { const pr = parseFloat(p.price || '0'); return isNaN(pr) || pr <= 0; });

        // Missing sub-category
        const missingSubProducts = all.filter(p => !p.sub || !p.sub.trim());

        // Missing name or very short name (< 5 chars)
        const badNameProducts = all.filter(p => !p.name || p.name.trim().length < 5);

        // No description
        const noDescProducts = all.filter(p => !p.desc || p.desc.trim().length < 10);

        // ── CROSS-CATEGORY PRODUCTS (cats2) ─────────────────────────────
        // Products intentionally listed in a second category via cats2 field
        const crossCatProducts = all.filter(p => p.cats2 && p.cats2.trim());
        // Build a set of "intentional cross-cat pairs" so we can exclude them from dup warnings
        // Key = sorted pair of ids for same product showing in two cats (same name + cats2 relationship)
        const intentionalCrossPairs = new Set<string>();
        crossCatProducts.forEach(p => {
          // Any other product with same name whose cat === this product's cats2 is intentional
          const name = (p.name || '').toLowerCase().trim();
          all.forEach(q => {
            if (p.id !== q.id && (q.name || '').toLowerCase().trim() === name && q.cat === p.cats2) {
              intentionalCrossPairs.add([p.id, q.id].sort().join('|'));
            }
          });
        });

        // ── DUPLICATE DETECTION ──────────────────────────────────────────
        // Normalize name for comparison
        const normName = (n: string) => n.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();

        // 1. Exact same name (case-insensitive) in the SAME category = real duplicate
        const nameMap: Record<string, SheetProduct[]> = {};
        all.forEach(p => {
          const key = normName(p.name || '') + '||' + (p.cat || '');
          if (!key) return;
          if (!nameMap[key]) nameMap[key] = [];
          nameMap[key].push(p);
        });
        const exactNameDups = Object.values(nameMap).filter(group => group.length > 1);

        // 2. Same name in DIFFERENT categories — but only flag if NOT an intentional cats2 pair
        const diffCatNameMap: Record<string, SheetProduct[]> = {};
        all.forEach(p => {
          const key = normName(p.name || '');
          if (!key) return;
          if (!diffCatNameMap[key]) diffCatNameMap[key] = [];
          diffCatNameMap[key].push(p);
        });
        const diffCatDups = Object.values(diffCatNameMap)
          .filter(group => {
            const cats = new Set(group.map(p => p.cat));
            if (cats.size <= 1) return false; // same cat already caught above
            // Check if every pair in this group is an intentional cats2 cross-listing
            for (let i = 0; i < group.length; i++) {
              for (let j = i + 1; j < group.length; j++) {
                const pairKey = [group[i].id, group[j].id].sort().join('|');
                if (!intentionalCrossPairs.has(pairKey)) return true; // at least one non-intentional pair
              }
            }
            return false;
          });

        // 3. Similar name (word overlap ≥75%) — skip exact matches and intentional cross pairs
        const similarDups: Array<[SheetProduct, SheetProduct, number]> = [];
        const checked = new Set<string>();
        for (let i = 0; i < all.length; i++) {
          for (let j = i + 1; j < all.length; j++) {
            const a = all[i], b = all[j];
            const pairKey = [a.id, b.id].sort().join('|');
            if (checked.has(pairKey)) continue;
            checked.add(pairKey);
            if (normName(a.name || '') === normName(b.name || '')) continue; // exact — handled above
            if (intentionalCrossPairs.has(pairKey)) continue; // intentional cats2 — skip
            const wa = new Set(normName(a.name || '').split(' ').filter(w => w.length > 2));
            const wb = new Set(normName(b.name || '').split(' ').filter(w => w.length > 2));
            if (wa.size === 0 || wb.size === 0) continue;
            const intersection = [...wa].filter(w => wb.has(w)).length;
            const union = new Set([...wa, ...wb]).size;
            const similarity = intersection / union;
            if (similarity >= 0.75) similarDups.push([a, b, Math.round(similarity * 100)]);
          }
        }

        // 4. Same main image URL used by multiple products (skip intentional cross pairs)
        const imgUrlMap: Record<string, SheetProduct[]> = {};
        all.forEach(p => {
          const url = (p.img || '').trim();
          if (!url) return;
          if (!imgUrlMap[url]) imgUrlMap[url] = [];
          imgUrlMap[url].push(p);
        });
        const sameImgDups = Object.values(imgUrlMap)
          .filter(group => {
            if (group.length <= 1) return false;
            // Only flag if at least one pair is NOT an intentional cats2 pair
            for (let i = 0; i < group.length; i++) {
              for (let j = i + 1; j < group.length; j++) {
                const pk = [group[i].id, group[j].id].sort().join('|');
                if (!intentionalCrossPairs.has(pk)) return true;
              }
            }
            return false;
          });

        const totalDupIssues = exactNameDups.length + diffCatDups.length + similarDups.length + sameImgDups.length;

        // Health score (0–100) — penalties for each issue
        const totalIssues =
          missingImgProducts.length +
          wrongCloudProducts.length +
          driveProducts.length +
          missingPriceProducts.length +
          missingSubProducts.length +
          badNameProducts.length +
          totalDupIssues +
          unknownCats.length * 3; // unknown cat is a bigger problem
        const healthPct = all.length > 0 ? Math.max(0, Math.round(100 - (totalIssues / all.length) * 100)) : 100;
        const healthGrade = healthPct >= 90 ? 'A' : healthPct >= 75 ? 'B' : healthPct >= 60 ? 'C' : healthPct >= 40 ? 'D' : 'F';
        const healthColor = healthPct >= 90 ? 'text-green-600' : healthPct >= 75 ? 'text-blue-600' : healthPct >= 60 ? 'text-amber-600' : 'text-red-600';
        const healthBg = healthPct >= 90 ? 'bg-green-50 border-green-200' : healthPct >= 75 ? 'bg-blue-50 border-blue-200' : healthPct >= 60 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';

        // Sub-category breakdown
        const subCounts: Record<string, { count: number; cat: string }> = {};
        all.forEach(p => { if (p.sub) { subCounts[p.sub] = { count: (subCounts[p.sub]?.count || 0) + 1, cat: p.cat }; } });
        const subList = Object.entries(subCounts).sort((a, b) => b[1].count - a[1].count).slice(0, 12);

        const maxCatCount = Math.max(...catList.map(c => c.count), 1);
        const maxPriceBucket = Math.max(...priceBuckets.map(b => b.count), 1);

        // Helper: jump to Edit tab with filter preset
        const goToEdit = (cat?: string, status?: 'live' | 'hidden' | 'all') => {
          if (cat) setFilterCat(cat); else setFilterCat('all');
          if (status) setFilterStatus(status); else setFilterStatus('all');
          setSearchQ('');
          setTab('edit');
        };
        const goToEditProduct = (p: SheetProduct) => {
          setFilterCat('all'); setFilterStatus('all'); setSearchQ('');
          setTab('edit');
          setTimeout(() => startEdit(p), 50);
        };

        return (
          <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-700">📊 Dashboard</h2>
              <button onClick={loadAllProducts} className="text-xs text-orange-500 font-medium border border-orange-200 px-3 py-1.5 rounded-full hover:bg-orange-50 transition active:scale-95">↻ Refresh</button>
            </div>

            {/* ── KPI TILES ─────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => goToEdit()} className="bg-white rounded-2xl p-4 shadow-sm text-left hover:shadow-md hover:border-orange-200 border border-transparent transition active:scale-95">
                <p className="text-xs text-gray-400 mb-1">📦 Total Products</p>
                <p className="text-3xl font-extrabold text-gray-800">{all.length}</p>
                <p className="text-[10px] text-orange-500 mt-1">View all →</p>
              </button>
              <div className="bg-white rounded-2xl p-4 shadow-sm grid grid-rows-2 gap-2">
                <button onClick={() => goToEdit('all', 'live')} className="flex items-center justify-between bg-green-50 rounded-xl px-3 py-1.5 hover:bg-green-100 transition active:scale-95">
                  <span className="text-xs font-semibold text-green-700">● Live</span>
                  <span className="text-lg font-extrabold text-green-700">{live.length}</span>
                </button>
                <button onClick={() => goToEdit('all', 'hidden')} className="flex items-center justify-between bg-red-50 rounded-xl px-3 py-1.5 hover:bg-red-100 transition active:scale-95">
                  <span className="text-xs font-semibold text-red-600">○ Hidden</span>
                  <span className="text-lg font-extrabold text-red-600">{hidden.length}</span>
                </button>
              </div>
              <button onClick={() => { setFilterCat('all'); setFilterStatus('all'); setSearchQ(''); setTab('edit'); }} className="bg-white rounded-2xl p-4 shadow-sm text-left hover:shadow-md hover:border-blue-200 border border-transparent transition active:scale-95">
                <p className="text-xs text-gray-400 mb-1">🖼️ Multi-Photo</p>
                <p className="text-3xl font-extrabold text-blue-600">{multiImg}</p>
                <p className="text-[10px] text-gray-400 mt-1">products with 2+ images</p>
              </button>
              <button onClick={() => { setFilterCat('all'); setFilterStatus('all'); setSearchQ(''); setTab('edit'); }} className="bg-white rounded-2xl p-4 shadow-sm text-left hover:shadow-md hover:border-orange-200 border border-transparent transition active:scale-95">
                <p className="text-xs text-gray-400 mb-1">📌 Pinned</p>
                <p className="text-3xl font-extrabold text-orange-600">{pinnedProducts.length}</p>
                <p className="text-[10px] text-gray-400 mt-1">featured on top</p>
              </button>
              <button
                onClick={() => { const el = document.getElementById('dup-panel'); el?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                className={`rounded-2xl p-4 shadow-sm text-left border transition active:scale-95 ${
                  totalDupIssues > 0
                    ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 hover:shadow-md'
                    : 'bg-green-50 border-green-200'
                }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">🔍 Dup Issues</p>
                    <p className={`text-3xl font-extrabold ${totalDupIssues > 0 ? 'text-amber-600' : 'text-green-600'}`}>{totalDupIssues}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{totalDupIssues > 0 ? `${exactNameDups.length + diffCatDups.length} name · ${similarDups.length} similar · ${sameImgDups.length} img` : 'All clean ✓'}</p>
                  </div>
                  {totalDupIssues > 0 && <span className="text-2xl">⚠️</span>}
                  {totalDupIssues === 0 && <span className="text-2xl">✅</span>}
                </div>
              </button>
              <button
                onClick={() => { const el = document.getElementById('crosscat-panel'); el?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                className="rounded-2xl p-4 shadow-sm text-left border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition active:scale-95 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">🔀 2 Categories</p>
                    <p className="text-3xl font-extrabold text-indigo-600">{crossCatProducts.length}</p>
                    <p className="text-[10px] text-gray-400 mt-1">Cross-listed products</p>
                  </div>
                  <span className="text-2xl">{crossCatProducts.length > 0 ? '🔀' : '—'}</span>
                </div>
              </button>
              {/* Add-ons — separate tile, not counted in products */}
              <button onClick={() => goToEdit('addons')} className="bg-white rounded-2xl p-4 shadow-sm text-left hover:shadow-md hover:border-purple-200 border border-purple-100 transition active:scale-95">
                <p className="text-xs text-gray-400 mb-1">✨ Add-ons</p>
                <p className="text-3xl font-extrabold text-purple-600">{addonsAll.length}</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-[10px] font-semibold text-green-600">● {addonsLive.length} live</span>
                  {addonsHidden.length > 0 && <span className="text-[10px] font-semibold text-red-500">○ {addonsHidden.length} hidden</span>}
                </div>
              </button>
              {/* Health Score */}
              <button
                onClick={() => { const el = document.getElementById('health-panel'); el?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                className={`rounded-2xl p-4 shadow-sm text-left border transition active:scale-95 hover:shadow-md ${healthBg}`}>
                <p className="text-xs text-gray-500 mb-1">🏥 Health Score</p>
                <p className={`text-3xl font-extrabold ${healthColor}`}>{healthGrade} <span className="text-lg">{healthPct}%</span></p>
                <p className="text-[10px] text-gray-400 mt-1">{totalIssues} issue{totalIssues !== 1 ? 's' : ''} to fix</p>
              </button>
              {/* Missing Data */}
              <button
                onClick={() => { const el = document.getElementById('missing-panel'); el?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                className={`rounded-2xl p-4 shadow-sm text-left border transition active:scale-95 hover:shadow-md ${
                  (missingPriceProducts.length + missingSubProducts.length + badNameProducts.length) > 0
                    ? 'bg-orange-50 border-orange-200 hover:bg-orange-100'
                    : 'bg-green-50 border-green-200'
                }`}>
                <p className="text-xs text-gray-500 mb-1">📋 Missing Data</p>
                <p className={`text-3xl font-extrabold ${(missingPriceProducts.length + missingSubProducts.length) > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {missingPriceProducts.length + missingSubProducts.length + badNameProducts.length}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  {missingPriceProducts.length > 0 ? `${missingPriceProducts.length} no price · ` : ''}
                  {missingSubProducts.length > 0 ? `${missingSubProducts.length} no sub` : ''}
                  {missingPriceProducts.length === 0 && missingSubProducts.length === 0 ? 'All complete ✓' : ''}
                </p>
              </button>
              {/* Unknown cats */}
              {unknownCats.length > 0 && (
                <button
                  onClick={() => { const el = document.getElementById('unknowncats-panel'); el?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                  className="rounded-2xl p-4 shadow-sm text-left border border-red-200 bg-red-50 hover:bg-red-100 transition active:scale-95 hover:shadow-md">
                  <p className="text-xs text-gray-500 mb-1">❓ Unknown Cats</p>
                  <p className="text-3xl font-extrabold text-red-600">{unknownCats.reduce((s, c) => s + c.count, 0)}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{unknownCats.length} unmapped categor{unknownCats.length !== 1 ? 'ies' : 'y'}</p>
                </button>
              )}
            </div>

            {/* ── RECENT ACTIVITY ───────────────────────────── */}
            {(recentlyAdded.length > 0 || recentlyEdited.length > 0) && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">🕐 Last 7 Days</p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-extrabold text-blue-600">{recentlyAdded.length}</p>
                    <p className="text-[10px] text-blue-500 font-semibold mt-0.5">New products</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-extrabold text-purple-600">{recentlyEdited.length}</p>
                    <p className="text-[10px] text-purple-500 font-semibold mt-0.5">Edited</p>
                  </div>
                </div>
                {(showMore['recent'] ? recentlyAdded : recentlyAdded.slice(0, 3)).map(p => (
                  <button key={p.id} onClick={() => goToEditProduct(p)} className="w-full flex items-center gap-2 py-1.5 hover:bg-orange-50 rounded-xl px-2 transition active:scale-95">
                    {p.img ? <img src={p.img} alt={p.name} className="w-8 h-8 rounded-lg object-cover flex-none" /> : <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-sm flex-none">{p.emoji || '🎉'}</div>}
                    <div className="min-w-0 flex-1 text-left">
                      <p className="text-xs font-semibold text-gray-800 truncate">{p.name}</p>
                      <p className="text-[10px] text-gray-400">{timeAgo(parseSheetDate(p.uploaded_at || ''))}</p>
                    </div>
                    <span className="text-[10px] text-orange-500 font-medium flex-none">Edit →</span>
                  </button>
                ))}
                {recentlyAdded.length > 3 && (
                  <button onClick={() => toggleMore('recent')}
                    className="mt-1 w-full text-xs font-semibold text-orange-400 hover:text-orange-600 py-1.5 rounded-xl hover:bg-orange-50 transition">
                    {showMore['recent'] ? '▲ Show less' : `▼ Show ${recentlyAdded.length - 3} more`}
                  </button>
                )}
              </div>
            )}

            {/* ── DUPLICATES PANEL ──────────────────────────── */}
            <div id="dup-panel" className={`rounded-2xl p-4 shadow-sm ${totalDupIssues > 0 ? 'bg-white border-2 border-amber-200' : 'bg-green-50 border border-green-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">🔍 Duplicate Checker</p>
                {totalDupIssues === 0 && <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">All Clean ✓</span>}
                {totalDupIssues > 0 && <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">{totalDupIssues} issue{totalDupIssues !== 1 ? 's' : ''}</span>}
              </div>

              {totalDupIssues === 0 && (
                <p className="text-xs text-green-600 text-center py-2">No duplicate names, similar names, or shared images found 🎉</p>
              )}

              {/* ── Exact same name ── */}
              {exactNameDups.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 flex-none" />
                    <p className="text-xs font-bold text-red-600">Exact Same Name ({exactNameDups.length} group{exactNameDups.length !== 1 ? 's' : ''})</p>
                  </div>
                  <div className="space-y-3">
                    {exactNameDups.map((group, gi) => (
                      <div key={gi} className="bg-red-50 border border-red-100 rounded-xl p-3">
                        <p className="text-[11px] font-bold text-red-700 mb-2 truncate">
                          &ldquo;{group[0].name}&rdquo;
                          {new Set(group.map(p => p.cat)).size > 1
                            ? <span className="ml-1 text-purple-600 font-normal">· different categories</span>
                            : <span className="ml-1 text-red-400 font-normal">· same category</span>
                          }
                        </p>
                        {group.map(p => (
                          <button key={p.id} onClick={() => goToEditProduct(p)}
                            className="w-full flex items-center gap-2 bg-white hover:bg-red-50 rounded-lg px-2 py-2 mb-1 transition active:scale-95">
                            {p.img
                              ? <img src={p.img} alt="" className="w-9 h-9 rounded-lg object-cover flex-none" />
                              : <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center text-base flex-none">{p.emoji || '🎉'}</div>
                            }
                            <div className="min-w-0 flex-1 text-left">
                              <p className="text-xs font-semibold text-gray-800 truncate">{p.name}</p>
                              <p className="text-[10px] text-gray-500">
                                {SERVICES.find(s => s.cat === p.cat)?.emoji} {SERVICES.find(s => s.cat === p.cat)?.name || p.cat}
                                {p.sub && ` · ${p.sub}`}
                                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${p.active === 'false' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-600'}`}>
                                  {p.active === 'false' ? 'Hidden' : 'Live'}
                                </span>
                              </p>
                            </div>
                            <div className="text-right flex-none">
                              <p className="text-xs font-bold text-orange-600">₹{Number(p.price).toLocaleString('en-IN')}</p>
                              <p className="text-[9px] text-orange-400">Edit →</p>
                            </div>
                          </button>
                        ))}
                        <p className="text-[9px] text-red-400 mt-1 px-1">
                          {new Set(group.map(p => p.cat)).size > 1
                            ? '💡 Same name in different categories — intentional cross-listing or accidental duplicate?'
                            : '⚠️ Same name in same category — likely an accidental duplicate'
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Similar names ── */}
              {similarDups.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 flex-none" />
                    <p className="text-xs font-bold text-amber-600">Similar Names ({similarDups.length} pair{similarDups.length !== 1 ? 's' : ''})</p>
                  </div>
                  <div className="space-y-2">
                    {(showMore['similardups'] ? similarDups : similarDups.slice(0, 8)).map(([a, b, pct], i) => (
                      <div key={i} className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-200 px-1.5 py-0.5 rounded-full">{pct}% match</span>
                        </div>
                        {[a, b].map(p => (
                          <button key={p.id} onClick={() => goToEditProduct(p)}
                            className="w-full flex items-center gap-2 bg-white hover:bg-amber-50 rounded-lg px-2 py-2 mb-1 transition active:scale-95">
                            {p.img
                              ? <img src={p.img} alt="" className="w-8 h-8 rounded-lg object-cover flex-none" />
                              : <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-sm flex-none">{p.emoji || '🎉'}</div>
                            }
                            <div className="min-w-0 flex-1 text-left">
                              <p className="text-xs font-semibold text-gray-800 truncate">{p.name}</p>
                              <p className="text-[10px] text-gray-500">
                                {SERVICES.find(s => s.cat === p.cat)?.emoji} {SERVICES.find(s => s.cat === p.cat)?.name || p.cat}
                              </p>
                            </div>
                            <p className="text-xs font-bold text-orange-600 flex-none">₹{Number(p.price).toLocaleString('en-IN')}</p>
                          </button>
                        ))}
                      </div>
                    ))}
                    {similarDups.length > 8 && (
                      <button onClick={() => toggleMore('similardups')}
                        className="mt-1 w-full text-xs font-semibold text-amber-500 hover:text-amber-700 py-1.5 rounded-xl hover:bg-amber-50 transition">
                        {showMore['similardups'] ? '▲ Show less' : `▼ Show ${similarDups.length - 8} more similar pairs`}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ── Same image ── */}
              {sameImgDups.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 flex-none" />
                    <p className="text-xs font-bold text-blue-600">Same Main Image ({sameImgDups.length} group{sameImgDups.length !== 1 ? 's' : ''})</p>
                  </div>
                  <div className="space-y-3">
                    {sameImgDups.map((group, gi) => (
                      <div key={gi} className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                        <div className="flex gap-3 mb-2">
                          <img src={group[0].img} alt="" className="w-12 h-12 rounded-xl object-cover flex-none" />
                          <p className="text-[10px] text-blue-700 font-medium leading-tight pt-1">
                            Same photo used by {group.length} products — tap each to fix
                          </p>
                        </div>
                        {group.map(p => (
                          <button key={p.id} onClick={() => goToEditProduct(p)}
                            className="w-full flex items-center gap-2 bg-white hover:bg-blue-50 rounded-lg px-2 py-2 mb-1 transition active:scale-95">
                            <div className="min-w-0 flex-1 text-left">
                              <p className="text-xs font-semibold text-gray-800 truncate">{p.emoji} {p.name}</p>
                              <p className="text-[10px] text-gray-500">{SERVICES.find(s => s.cat === p.cat)?.name || p.cat}</p>
                            </div>
                            <p className="text-[9px] text-blue-500 font-medium flex-none">Fix →</p>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── CROSS-CATEGORY PRODUCTS (cats2) ──────────── */}
            {crossCatProducts.length > 0 && (
              <div id="crosscat-panel" className="bg-white rounded-2xl p-4 shadow-sm border-2 border-indigo-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide">🔀 Listed in 2 Categories</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">These products appear in two places on the site via cats2</p>
                  </div>
                  <span className="text-sm font-extrabold text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-full">{crossCatProducts.length}</span>
                </div>
                <div className="space-y-2">
                  {(showMore['crosscat'] ? crossCatProducts : crossCatProducts.slice(0, 2)).map(p => {
                    const svc1 = SERVICES.find(s => s.cat === p.cat);
                    const svc2 = SERVICES.find(s => s.cat === p.cats2);
                    return (
                      <button key={p.id} onClick={() => goToEditProduct(p)}
                        className="w-full flex items-center gap-2 hover:bg-indigo-50 rounded-xl px-2 py-2 transition active:scale-95">
                        {p.img
                          ? <img src={p.img} alt="" className="w-10 h-10 rounded-xl object-cover flex-none" />
                          : <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-lg flex-none">{p.emoji || '🎉'}</div>
                        }
                        <div className="min-w-0 flex-1 text-left">
                          <p className="text-xs font-semibold text-gray-800 truncate">{p.name}</p>
                          <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                            <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium">
                              {svc1?.emoji} {svc1?.name || p.cat}
                            </span>
                            <span className="text-[10px] text-gray-400">+</span>
                            <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-medium">
                              {svc2?.emoji} {svc2?.name || p.cats2}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-none">
                          <p className="text-xs font-bold text-orange-600">₹{Number(p.price).toLocaleString('en-IN')}</p>
                          <p className="text-[9px] text-indigo-400 font-medium">Edit →</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {crossCatProducts.length > 2 && (
                  <button onClick={() => toggleMore('crosscat')}
                    className="mt-2 w-full text-xs font-semibold text-indigo-500 hover:text-indigo-700 py-2 rounded-xl hover:bg-indigo-50 transition">
                    {showMore['crosscat'] ? '▲ Show less' : `▼ Show ${crossCatProducts.length - 2} more`}
                  </button>
                )}
                <p className="text-[10px] text-gray-400 mt-1 px-1">
                  💡 These are intentional — each product is cross-listed into a second category. Remove cats2 from a product to unlist it.
                </p>
              </div>
            )}

            {/* ── IMAGE HEALTH ──────────────────────────────── */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">🖼 Image Health <span className="text-gray-400 font-normal normal-case">— tap to fix</span></p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Cloudinary ✓', value: imgOk, color: 'bg-green-100 text-green-700', border: 'border-green-200', products: [] as SheetProduct[] },
                  { label: 'Wrong Cloud ⚠️', value: imgWrongCloud, color: 'bg-purple-100 text-purple-700', border: 'border-purple-200', products: wrongCloudProducts },
                  { label: 'Google Drive', value: imgDrive, color: 'bg-yellow-100 text-yellow-700', border: 'border-yellow-200', products: driveProducts },
                  { label: 'Missing / Other', value: imgMissing, color: 'bg-red-100 text-red-600', border: 'border-red-200', products: missingImgProducts },
                ].map(item => (
                  <button key={item.label}
                    onClick={() => { if (item.products.length > 0) { setTab('edit'); setFilterCat('all'); setFilterStatus('all'); setSearchQ(item.label.includes('Wrong') ? 'thksowin' : item.label.includes('Drive') ? 'lh3.google' : ''); } }}
                    disabled={item.value === 0}
                    className={`rounded-xl p-3 border ${item.border} ${item.color} text-left transition active:scale-95 ${item.value > 0 ? 'hover:opacity-80 cursor-pointer' : 'opacity-60 cursor-default'}`}>
                    <p className="text-[11px] font-semibold leading-tight">{item.label}</p>
                    <p className="text-xl font-extrabold mt-0.5">{item.value}</p>
                    {item.value > 0 && item.products.length > 0 && <p className="text-[9px] mt-1 opacity-70">Tap to view →</p>}
                  </button>
                ))}
              </div>
              {imgWrongCloud > 0 && (
                <div className="mt-3 bg-purple-50 border border-purple-100 rounded-xl p-3">
                  <p className="text-[11px] text-purple-700 font-semibold mb-2">⚠️ {imgWrongCloud} products on old Cloudinary (thksowin)</p>
                  <div className="space-y-1">
                    {(showMore['wrongcloud'] ? wrongCloudProducts : wrongCloudProducts.slice(0, 3)).map(p => (
                      <button key={p.id} onClick={() => goToEditProduct(p)} className="w-full flex items-center gap-2 bg-white rounded-lg px-2 py-1.5 hover:bg-purple-50 transition active:scale-95">
                        {p.img ? <img src={p.img} alt="" className="w-6 h-6 rounded object-cover flex-none" /> : <span className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center text-xs flex-none">{p.emoji}</span>}
                        <span className="text-[11px] text-gray-700 truncate flex-1 text-left">{p.name}</span>
                        <span className="text-[10px] text-purple-500 font-medium flex-none">Fix →</span>
                      </button>
                    ))}
                    {wrongCloudProducts.length > 3 && (
                      <button onClick={() => toggleMore('wrongcloud')}
                        className="mt-1 w-full text-xs font-semibold text-purple-400 hover:text-purple-600 py-1.5 rounded-xl hover:bg-purple-50 transition">
                        {showMore['wrongcloud'] ? '▲ Show less' : `▼ Show ${wrongCloudProducts.length - 3} more`}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── CATEGORIES ────────────────────────────────── */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">📂 Products by Category <span className="text-gray-400 font-normal normal-case">— tap to filter</span></p>
              <div className="space-y-2">
                {catList.map(cat => (
                  <button key={cat.cat} onClick={() => goToEdit(cat.cat)} className="w-full flex items-center gap-2 group hover:bg-orange-50 rounded-xl px-1 py-1 transition active:scale-95">
                    <span className="text-sm w-5 flex-none">{cat.emoji}</span>
                    <span className="text-xs text-gray-600 w-28 flex-none truncate group-hover:text-orange-700 transition">{cat.name.replace(' Decoration', '').replace(' Party', '')}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 relative overflow-hidden">
                      <div className="h-full rounded-full bg-orange-400 group-hover:bg-orange-500 transition-all" style={{ width: `${(cat.count / maxCatCount) * 100}%` }} />
                      <span className="absolute right-2 top-0 h-full flex items-center text-[10px] font-bold text-gray-600">{cat.count}</span>
                    </div>
                    <span className="text-[10px] text-orange-400 opacity-0 group-hover:opacity-100 transition flex-none">→</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── PINNED PRODUCTS ───────────────────────────── */}
            {pinnedProducts.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">📌 Pinned Products</p>
                  <button onClick={() => goToEdit()} className="text-[10px] text-orange-500 font-medium">Manage →</button>
                </div>
                <div className="space-y-1">
                  {(showMore['pinned'] ? pinnedProducts : pinnedProducts.slice(0, 6)).map(p => (
                    <button key={p.id} onClick={() => goToEditProduct(p)} className="w-full flex items-center gap-3 hover:bg-orange-50 rounded-xl px-2 py-2 transition active:scale-95">
                      <span className="text-xs font-bold text-orange-400 w-5 flex-none">#{p.sort_order}</span>
                      {p.img ? <img src={p.img} alt={p.name} className="w-8 h-8 rounded-lg object-cover flex-none" /> : <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-sm flex-none">{p.emoji}</div>}
                      <div className="min-w-0 flex-1 text-left">
                        <p className="text-xs font-semibold text-gray-800 truncate">{p.name}</p>
                        <p className="text-[10px] text-gray-400">{SERVICES.find(s => s.cat === p.cat)?.name || p.cat}</p>
                      </div>
                      <span className="text-xs font-bold text-orange-600 flex-none">₹{Number(p.price).toLocaleString('en-IN')}</span>
                    </button>
                  ))}
                  {pinnedProducts.length > 6 && (
                    <button onClick={() => toggleMore('pinned')}
                      className="mt-1 w-full text-xs font-semibold text-orange-400 hover:text-orange-600 py-1.5 rounded-xl hover:bg-orange-50 transition">
                      {showMore['pinned'] ? '▲ Show less' : `▼ Show ${pinnedProducts.length - 6} more`}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── PRICING STATS ─────────────────────────────── */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">💰 Pricing Overview</p>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { label: 'Avg', value: `₹${avgPrice.toLocaleString('en-IN')}` },
                  { label: 'Median', value: `₹${medianPrice.toLocaleString('en-IN')}` },
                  { label: 'Min', value: `₹${minPrice.toLocaleString('en-IN')}` },
                  { label: 'Max', value: `₹${maxPrice.toLocaleString('en-IN')}` },
                ].map(stat => (
                  <div key={stat.label} className="bg-gray-50 rounded-xl p-2 text-center">
                    <p className="text-[9px] text-gray-400 mb-0.5">{stat.label}</p>
                    <p className="text-xs font-bold text-orange-600 leading-tight">{stat.value}</p>
                  </div>
                ))}
              </div>
              {/* Price range distribution */}
              <p className="text-[11px] font-semibold text-gray-500 mb-2">Price range distribution</p>
              <div className="space-y-1.5">
                {priceBuckets.map(b => (
                  <div key={b.label} className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 w-20 flex-none">{b.label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 relative overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-orange-300 to-orange-500 transition-all" style={{ width: `${(b.count / maxPriceBucket) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 w-5 text-right flex-none">{b.count}</span>
                  </div>
                ))}
              </div>
              {/* Discount buckets */}
              <p className="text-[11px] font-semibold text-gray-500 mt-4 mb-2">Discount distribution</p>
              <div className="flex gap-2">
                {[
                  { label: 'No disc', value: discBuckets.none, color: 'bg-gray-100 text-gray-700' },
                  { label: '1–15%', value: discBuckets.low, color: 'bg-green-100 text-green-700' },
                  { label: '16–30%', value: discBuckets.mid, color: 'bg-yellow-100 text-yellow-700' },
                  { label: '31%+', value: discBuckets.high, color: 'bg-orange-100 text-orange-700' },
                ].map(b => (
                  <div key={b.label} className={`flex-1 rounded-xl p-2 text-center ${b.color}`}>
                    <p className="text-lg font-extrabold">{b.value}</p>
                    <p className="text-[9px] font-semibold leading-tight mt-0.5">{b.label}</p>
                  </div>
                ))}
              </div>
              {noDiscountCount > 0 && (
                <p className="mt-2 text-[10px] text-amber-600 bg-amber-50 rounded-lg px-3 py-1.5">
                  💡 {noDiscountCount} products have a higher original price but 0% discount set — check in Edit tab.
                </p>
              )}
            </div>

            {/* ── TOP & BOTTOM BY PRICE ─────────────────────── */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">🏆 Price Leaderboard</p>
              <p className="text-[11px] text-gray-400 font-semibold mb-2">Most expensive</p>
              <div className="space-y-1 mb-4">
                {top5.map((p, i) => (
                  <button key={p.id} onClick={() => goToEditProduct(p)} className="w-full flex items-center gap-3 hover:bg-orange-50 rounded-xl px-2 py-1.5 transition active:scale-95">
                    <span className="text-xs font-bold text-orange-400 w-5 flex-none">#{i + 1}</span>
                    {p.img ? <img src={p.img} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-none" /> : <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center text-base flex-none">{p.emoji || '🎉'}</div>}
                    <div className="min-w-0 flex-1 text-left">
                      <p className="text-xs font-semibold text-gray-800 truncate">{p.name}</p>
                      <p className="text-[10px] text-gray-400">{SERVICES.find(s => s.cat === p.cat)?.name || p.cat}</p>
                    </div>
                    <span className="text-sm font-bold text-orange-600 flex-none">₹{Number(p.price).toLocaleString('en-IN')}</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 font-semibold mb-2">Most affordable</p>
              <div className="space-y-1">
                {bottom5.map((p, i) => (
                  <button key={p.id} onClick={() => goToEditProduct(p)} className="w-full flex items-center gap-3 hover:bg-green-50 rounded-xl px-2 py-1.5 transition active:scale-95">
                    <span className="text-xs font-bold text-green-500 w-5 flex-none">#{i + 1}</span>
                    {p.img ? <img src={p.img} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-none" /> : <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-base flex-none">{p.emoji || '🎉'}</div>}
                    <div className="min-w-0 flex-1 text-left">
                      <p className="text-xs font-semibold text-gray-800 truncate">{p.name}</p>
                      <p className="text-[10px] text-gray-400">{SERVICES.find(s => s.cat === p.cat)?.name || p.cat}</p>
                    </div>
                    <span className="text-sm font-bold text-green-600 flex-none">₹{Number(p.price).toLocaleString('en-IN')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── CITY COVERAGE ─────────────────────────────── */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">🏙️ City Coverage</p>
                <span className="text-xs font-bold text-orange-600">{coveredCities}/{CITIES.length} cities</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {CITIES.map(city => {
                  const count = cityCoverage[city.slug] || 0;
                  return (
                    <button key={city.slug}
                      onClick={() => count > 0 ? goToEdit() : undefined}
                      disabled={count === 0}
                      className={`rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1 transition active:scale-95 ${
                        count > 0
                          ? 'bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 cursor-pointer'
                          : 'bg-gray-50 border border-gray-200 text-gray-400 cursor-default opacity-60'
                      }`}>
                      {city.name}
                      {count > 0 && <span className="bg-orange-200 text-orange-800 rounded-full px-1.5 py-0.5 text-[10px] font-bold">{count}</span>}
                    </button>
                  );
                })}
              </div>
              {uncoveredCities.length > 0 && (
                <p className="text-[10px] text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
                  📍 {uncoveredCities.length} cities with no custom pricing: {uncoveredCities.map(c => c.name).join(', ')}
                </p>
              )}
            </div>

            {/* ── SUB-CATEGORIES ────────────────────────────── */}
            {subList.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">🏷️ Sub-categories <span className="text-gray-400 font-normal normal-case">— tap to filter</span></p>
                <div className="flex flex-wrap gap-2">
                  {subList.map(([sub, info]) => (
                    <button key={sub} onClick={() => { setFilterCat(info.cat); setFilterStatus('all'); setSearchQ(sub); setTab('edit'); }}
                      className="bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-800 rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5 transition active:scale-95">
                      {sub}
                      <span className="bg-gray-300 hover:bg-orange-200 text-gray-700 rounded-full px-1.5 text-[10px] font-bold">{info.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── UNKNOWN CATEGORIES ────────────────────────── */}
            {unknownCats.length > 0 && (
              <div id="unknowncats-panel" className="bg-red-50 rounded-2xl p-4 shadow-sm border-2 border-red-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wide">❓ Unknown Categories</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">These cat values don't match any known service — check for typos</p>
                  </div>
                  <span className="text-sm font-extrabold text-red-600 bg-red-100 px-2.5 py-1 rounded-full">{unknownCats.reduce((s,c)=>s+c.count,0)}</span>
                </div>
                <div className="space-y-3">
                  {unknownCats.map(uc => (
                    <div key={uc.cat} className="bg-white rounded-xl p-3 border border-red-100">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">{uc.cat || '(empty)'}</code>
                        <span className="text-xs text-gray-500">{uc.count} product{uc.count !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="text-[10px] text-gray-500 mb-2">
                        Known cats: {SERVICES.map(s => s.cat).join(', ')}
                      </div>
                      {(showMore[`unknowncat_${uc.cat}`] ? uc.products : uc.products.slice(0, 3)).map(p => (
                        <button key={p.id} onClick={() => goToEditProduct(p)}
                          className="w-full flex items-center gap-2 bg-red-50 hover:bg-red-100 rounded-lg px-2 py-1.5 mb-1 transition active:scale-95">
                          <span className="text-sm flex-none">{p.emoji || '📦'}</span>
                          <span className="text-xs text-gray-700 truncate flex-1 text-left">{p.name}</span>
                          <span className="text-[10px] text-red-500 font-medium flex-none">Fix cat →</span>
                        </button>
                      ))}
                      {uc.products.length > 3 && (
                        <button onClick={() => toggleMore(`unknowncat_${uc.cat}`)}
                          className="mt-0.5 w-full text-xs font-semibold text-red-400 hover:text-red-600 py-1.5 rounded-xl hover:bg-red-50 transition">
                          {showMore[`unknowncat_${uc.cat}`] ? '▲ Show less' : `▼ Show ${uc.products.length - 3} more`}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── MISSING DATA PANEL ────────────────────────── */}
            {(missingPriceProducts.length + missingSubProducts.length + badNameProducts.length + noDescProducts.length) > 0 && (
              <div id="missing-panel" className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">📋 Incomplete Products</p>
                  <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">
                    {missingPriceProducts.length + missingSubProducts.length + badNameProducts.length + noDescProducts.length} issues
                  </span>
                </div>

                {/* Stat row */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { label: 'No Price', count: missingPriceProducts.length, color: 'text-red-600 bg-red-50' },
                    { label: 'No Sub', count: missingSubProducts.length, color: 'text-amber-600 bg-amber-50' },
                    { label: 'Bad Name', count: badNameProducts.length, color: 'text-orange-600 bg-orange-50' },
                    { label: 'No Desc', count: noDescProducts.length, color: 'text-gray-500 bg-gray-50' },
                  ].map(item => (
                    <div key={item.label} className={`rounded-xl p-2 text-center ${item.color}`}>
                      <p className="text-lg font-extrabold">{item.count}</p>
                      <p className="text-[9px] font-semibold mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>

                {/* Missing price */}
                {missingPriceProducts.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[11px] font-bold text-red-600 mb-1.5">💰 No / Zero Price ({missingPriceProducts.length})</p>
                    <div className="space-y-1">
                      {(showMore['missingprice'] ? missingPriceProducts : missingPriceProducts.slice(0, 5)).map(p => (
                        <button key={p.id} onClick={() => goToEditProduct(p)}
                          className="w-full flex items-center gap-2 bg-red-50 hover:bg-red-100 rounded-lg px-3 py-2 transition active:scale-95">
                          {p.img ? <img src={p.img} alt="" className="w-7 h-7 rounded-lg object-cover flex-none" /> : <span className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center text-xs flex-none">{p.emoji || '📦'}</span>}
                          <span className="text-xs text-gray-700 truncate flex-1 text-left">{p.name}</span>
                          <span className="text-[10px] font-bold text-red-500 flex-none">Add price →</span>
                        </button>
                      ))}
                      {missingPriceProducts.length > 5 && (
                        <button onClick={() => toggleMore('missingprice')}
                          className="mt-1 w-full text-xs font-semibold text-red-400 hover:text-red-600 py-1.5 rounded-xl hover:bg-red-50 transition">
                          {showMore['missingprice'] ? '▲ Show less' : `▼ Show ${missingPriceProducts.length - 5} more`}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Missing sub */}
                {missingSubProducts.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[11px] font-bold text-amber-600 mb-1.5">🏷️ No Sub-category ({missingSubProducts.length})</p>
                    <div className="space-y-1">
                      {(showMore['missingsub'] ? missingSubProducts : missingSubProducts.slice(0, 5)).map(p => (
                        <button key={p.id} onClick={() => goToEditProduct(p)}
                          className="w-full flex items-center gap-2 bg-amber-50 hover:bg-amber-100 rounded-lg px-3 py-2 transition active:scale-95">
                          {p.img ? <img src={p.img} alt="" className="w-7 h-7 rounded-lg object-cover flex-none" /> : <span className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-xs flex-none">{p.emoji || '📦'}</span>}
                          <div className="min-w-0 flex-1 text-left">
                            <p className="text-xs text-gray-700 truncate">{p.name}</p>
                            <p className="text-[10px] text-gray-400">{SERVICES.find(s=>s.cat===p.cat)?.name || p.cat}</p>
                          </div>
                          <span className="text-[10px] font-bold text-amber-500 flex-none">Add sub →</span>
                        </button>
                      ))}
                      {missingSubProducts.length > 5 && (
                        <button onClick={() => toggleMore('missingsub')}
                          className="mt-1 w-full text-xs font-semibold text-amber-400 hover:text-amber-600 py-1.5 rounded-xl hover:bg-amber-50 transition">
                          {showMore['missingsub'] ? '▲ Show less' : `▼ Show ${missingSubProducts.length - 5} more`}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Bad names */}
                {badNameProducts.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold text-orange-600 mb-1.5">✏️ Short / Missing Name ({badNameProducts.length})</p>
                    <div className="space-y-1">
                      {(showMore['badname'] ? badNameProducts : badNameProducts.slice(0, 4)).map(p => (
                        <button key={p.id} onClick={() => goToEditProduct(p)}
                          className="w-full flex items-center gap-2 bg-orange-50 hover:bg-orange-100 rounded-lg px-3 py-2 transition active:scale-95">
                          <span className="text-xs font-mono text-orange-700 bg-orange-100 px-2 py-0.5 rounded flex-none truncate max-w-[140px]">&ldquo;{p.name || '(empty)'}&rdquo;</span>
                          <span className="text-[10px] font-bold text-orange-500 flex-none ml-auto">Fix →</span>
                        </button>
                      ))}
                      {badNameProducts.length > 4 && (
                        <button onClick={() => toggleMore('badname')}
                          className="mt-1 w-full text-xs font-semibold text-orange-400 hover:text-orange-600 py-1.5 rounded-xl hover:bg-orange-50 transition">
                          {showMore['badname'] ? '▲ Show less' : `▼ Show ${badNameProducts.length - 4} more`}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── HEALTH SCORE ──────────────────────────────── */}
            <div id="health-panel" className={`rounded-2xl p-4 shadow-sm border ${healthBg}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">🏥 Catalog Health Score</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Based on images, prices, names and duplicates</p>
                </div>
                <div className="text-right">
                  <p className={`text-4xl font-extrabold ${healthColor}`}>{healthGrade}</p>
                  <p className={`text-sm font-bold ${healthColor}`}>{healthPct}%</p>
                </div>
              </div>
              {/* Score bar */}
              <div className="h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
                <div className={`h-full rounded-full transition-all ${healthPct >= 90 ? 'bg-green-500' : healthPct >= 75 ? 'bg-blue-500' : healthPct >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${healthPct}%` }} />
              </div>
              {/* Issue breakdown */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '📸 Missing Image', count: missingImgProducts.length, bad: missingImgProducts.length > 0 },
                  { label: '☁️ Wrong Cloud', count: wrongCloudProducts.length, bad: wrongCloudProducts.length > 0 },
                  { label: '💰 No Price', count: missingPriceProducts.length, bad: missingPriceProducts.length > 0 },
                  { label: '🏷️ No Sub-cat', count: missingSubProducts.length, bad: missingSubProducts.length > 0 },
                  { label: '🔍 Duplicates', count: totalDupIssues, bad: totalDupIssues > 0 },
                  { label: '❓ Unknown Cat', count: unknownCats.reduce((s,c)=>s+c.count,0), bad: unknownCats.length > 0 },
                ].map(item => (
                  <div key={item.label} className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs ${item.bad ? 'bg-white/70' : 'bg-green-50'}`}>
                    <span className={item.bad ? 'text-gray-600' : 'text-green-600'}>{item.label}</span>
                    <span className={`font-bold ${item.bad ? 'text-red-500' : 'text-green-600'}`}>{item.count === 0 ? '✓' : item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── QUICK ACTIONS ─────────────────────────────── */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">⚡ Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '➕ Add New Product', action: () => { setForm(emptyForm()); setTab('add'); }, color: 'bg-orange-500 text-white hover:bg-orange-600' },
                  { label: '✏️ Edit All Products', action: () => goToEdit(), color: 'bg-gray-800 text-white hover:bg-gray-900' },
                  { label: '○ View Hidden', action: () => goToEdit('all', 'hidden'), color: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' },
                  { label: '● View Live', action: () => goToEdit('all', 'live'), color: 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200' },
                  { label: '💰 Fix No-Price', action: () => { setFilterCat('all'); setFilterStatus('all'); setSearchQ(''); setTab('edit'); }, color: missingPriceProducts.length > 0 ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' : 'bg-gray-50 text-gray-400 border border-gray-100 cursor-default opacity-50' },
                  { label: '🏷️ Fix No-Sub', action: () => { setFilterCat('all'); setFilterStatus('all'); setSearchQ(''); setTab('edit'); }, color: missingSubProducts.length > 0 ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200' : 'bg-gray-50 text-gray-400 border border-gray-100 cursor-default opacity-50' },
                  { label: '📋 Upload History', action: () => setTab('history'), color: 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200' },
                  { label: '↻ Refresh Data', action: loadAllProducts, color: 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200' },
                ].map(action => (
                  <button key={action.label} onClick={action.action}
                    className={`rounded-xl px-4 py-3 text-xs font-semibold transition active:scale-95 text-center ${action.color}`}>
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        );
      })()}

      {/* ── ADD / EDIT FORM ─────────────────────────────────────────────── */}
      {(tab === 'add' || editingProduct) && (
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

          {/* Images */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-700 mb-4">📸 Product Images</h2>
            <div onClick={() => fileInputRef.current?.click()}
              onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
              onDragOver={e => e.preventDefault()}
              className="border-2 border-dashed border-orange-300 rounded-xl p-5 text-center cursor-pointer hover:bg-orange-50 transition mb-4">
              <div className="text-3xl mb-1">📁</div>
              <p className="font-semibold text-gray-700 text-sm">Tap to upload photos</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP • Auto-uploaded to Cloudinary ✓</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />

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
                        <input type="url" placeholder="Paste URL"
                          className="w-full text-[10px] border-0 outline-none text-center bg-transparent"
                          onBlur={e => {
                            if (e.target.value) {
                              setForm(f => { const imgs = [...f.images]; imgs[i] = { ...imgs[i], url: e.target.value }; return { ...f, images: imgs }; });
                            }
                          }}
                        />
                      </div>
                    )}
                    <button onClick={() => removeImg(i)} className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">✕</button>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setForm(f => ({ ...f, images: [...f.images, { url: '', uploading: false, error: '' }] }))}
              className="text-sm text-orange-600 font-medium underline">+ Add image by URL</button>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-700">📝 Product Details</h2>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Product Name *</label>
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="e.g. Premium Birthday Balloon Setup"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mt-1 outline-none focus:border-orange-400" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category *</label>
                <select value={form.cat} onChange={e => { set('cat', e.target.value); setForm(f => ({ ...f, sub: '', cats2: f.cats2 === e.target.value ? '' : f.cats2 })); }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm mt-1 outline-none focus:border-orange-400 bg-white">
                  {SERVICES.map(s => <option key={s.cat} value={s.cat}>{s.emoji} {s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sub-category</label>
                <select value={form.sub} onChange={e => set('sub', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm mt-1 outline-none focus:border-orange-400 bg-white">
                  <option value="">None</option>
                  {subcats.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Also Show In <span className="text-gray-400 font-normal normal-case">(optional — 2nd category)</span></label>
              <select value={form.cats2} onChange={e => set('cats2', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm mt-1 outline-none focus:border-orange-400 bg-white">
                <option value="">— None —</option>
                {SERVICES.filter(s => s.cat !== form.cat).map(s => <option key={s.cat} value={s.cat}>{s.emoji} {s.name}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Emoji</label>
                <input type="text" value={form.emoji} onChange={e => set('emoji', e.target.value)}
                  className="w-20 border border-gray-200 rounded-xl px-3 py-3 text-lg mt-1 outline-none focus:border-orange-400 text-center" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">📌 Pin Position <span className="text-gray-400 font-normal normal-case">(1 = top)</span></label>
                <input type="number" min="1" value={form.sort_order} onChange={e => set('sort_order', e.target.value)}
                  placeholder="Leave blank = no pin"
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm mt-1 outline-none focus:border-orange-400" />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-700">💰 Pricing</h2>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sale Price *</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-3 text-gray-400 text-sm">₹</span>
                  <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="2499"
                    className="w-full border border-gray-200 rounded-xl pl-7 pr-3 py-3 text-sm outline-none focus:border-orange-400" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Original Price</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-3 text-gray-400 text-sm">₹</span>
                  <input type="number" value={form.orig} onChange={e => set('orig', e.target.value)} placeholder="3499"
                    className="w-full border border-gray-200 rounded-xl pl-7 pr-3 py-3 text-sm outline-none focus:border-orange-400" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Discount %</label>
                {(() => {
                  const sale = parseFloat(form.price);
                  const orig = parseFloat(form.orig);
                  const auto = (orig > sale && sale > 0)
                    ? Math.round((orig - sale) / orig * 100)
                    : null;
                  return (
                    <div className="relative mt-1">
                      <input
                        type="number"
                        value={form.disc}
                        onChange={e => set('disc', e.target.value)}
                        placeholder={auto !== null ? String(auto) : '0'}
                        className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-orange-400"
                      />
                      {auto !== null && (
                        <button
                          type="button"
                          onClick={() => set('disc', String(auto))}
                          className="absolute right-2 top-2 text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded-lg hover:bg-green-200 transition"
                          title="Click to use auto-calculated discount"
                        >
                          ={auto}%
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
            <p className="text-xs text-gray-400">💡 Discount % is auto-calculated from prices — click the green badge to apply it.</p>

            {/* City prices toggle */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700">🏙️ City-wise Pricing</p>
                  <p className="text-xs text-gray-400 mt-0.5">Set different prices per city</p>
                </div>
                <button onClick={() => set('enableCityPrices', !form.enableCityPrices)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.enableCityPrices ? 'bg-orange-500' : 'bg-gray-200'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.enableCityPrices ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              {form.enableCityPrices && (
                <div className="mt-4 space-y-3">
                  <p className="text-xs text-gray-500 font-medium">Leave blank to use default price for that city.</p>
                  {CITIES.map(city => {
                    const cp = form.cityPrices[city.slug] || { price: '', orig: '' };
                    return (
                      <div key={city.slug} className="bg-gray-50 rounded-xl px-4 py-3">
                        <p className="text-xs font-bold text-gray-600 mb-2">{city.name}</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="relative">
                            <span className="absolute left-2.5 top-2.5 text-gray-400 text-xs">₹</span>
                            <input type="number" value={cp.price} onChange={e => setCityPrice(city.slug, 'price', e.target.value)} placeholder="Sale price"
                              className="w-full border border-gray-200 rounded-lg pl-6 pr-2 py-2 text-xs outline-none focus:border-orange-400 bg-white" />
                          </div>
                          <div className="relative">
                            <span className="absolute left-2.5 top-2.5 text-gray-400 text-xs">₹</span>
                            <input type="number" value={cp.orig} onChange={e => setCityPrice(city.slug, 'orig', e.target.value)} placeholder="Original price"
                              className="w-full border border-gray-200 rounded-lg pl-6 pr-2 py-2 text-xs outline-none focus:border-orange-400 bg-white" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Inclusions / Exclusions */}
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-700">📋 What&apos;s Included / Not Included</h2>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                ✅ Inclusions <span className="normal-case font-normal text-gray-400">(one per line)</span>
              </label>
              <textarea value={form.inclusions} onChange={e => set('inclusions', e.target.value)} rows={4}
                placeholder="Balloon arch setup&#10;LED fairy lights&#10;Welcome board"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mt-1 outline-none focus:border-orange-400 resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                ❌ Exclusions <span className="normal-case font-normal text-gray-400">(optional)</span>
              </label>
              <textarea value={form.exclusions} onChange={e => set('exclusions', e.target.value)} rows={3}
                placeholder="Cake&#10;Photography"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mt-1 outline-none focus:border-orange-400 resize-none" />
            </div>
          </div>

          {/* Product ID */}
          <div className="bg-gray-100 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-500">
              <span className="font-semibold">Product ID:</span> {form.id || <span className="italic">auto-generated</span>}
            </p>
          </div>

          {/* Save button */}
          <button onClick={handleSubmit} disabled={saving}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition text-base shadow-lg shadow-orange-200">
            {saving ? '⏳ Saving…' : form.isEdit ? '✏️ Update Product' : '💾 Save Product to Sheet'}
          </button>

          {saveError && <p className="text-red-500 text-sm text-center">{saveError}</p>}
        </div>
      )}
    </div>
  );
}
