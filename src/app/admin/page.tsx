'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { SHEET_URL, SERVICES, CITIES } from '@/lib/config';

const CLOUDINARY_CLOUD = 'w1ficzbb';
const CLOUDINARY_PRESET = '12he_products';
const ADMIN_PIN = '12he2024';

const SUBCAT_MAP: Record<string, string[]> = {
  bday:         ['Basic', 'Standard', 'Premium', 'Luxury', 'Wall Decor', 'Ring Decor', 'Balloon Arch', 'Balloon Ceiling', 'Table Setup', 'Theme', 'Outdoor', 'Balloon Bouquet'],
  theme:        ['Mermaid', 'Cars', 'Superhero', 'Butterfly', 'Jungle', '1st Birthday', 'Peppa Pig', 'Hello Kitty', 'Rainbow', 'Barbie', 'K-Pop', 'Space', 'Unicorn', 'Princess', 'Dinosaur', 'Frozen', 'Harry Potter', 'Minions', 'Disney Princess', 'Mickey Mouse'],
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
  const [tab, setTab] = useState<'add' | 'edit' | 'history'>('add');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Edit tab state
  const [allProducts, setAllProducts] = useState<SheetProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'live' | 'hidden'>('all');
  const [editingProduct, setEditingProduct] = useState<SheetProduct | null>(null);
  const [productMeta, setProductMeta] = useState<Record<string, ProductMeta>>({});

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
        {(tab === 'add' || editingProduct) && (
          <button onClick={handleSubmit} disabled={saving}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl transition text-sm">
            {saving ? 'Saving…' : form.isEdit ? '✏️ Update' : '💾 Save'}
          </button>
        )}
      </div>

      {/* Tabs — hide when editing */}
      {!editingProduct && (
        <div className="bg-white border-b border-gray-200 flex">
          {(['add', 'edit', 'history'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-3 text-xs font-semibold transition border-b-2 ${
                tab === t ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {t === 'add' ? '➕ Add' : t === 'edit' ? '✏️ Edit Products' : '📋 History'}
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
