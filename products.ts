import { SHEET_URL, LEADS_URL, WA_NUM } from './config';

/** Convert Google Drive share/view URLs to a working thumbnail URL */
export function toImgUrl(url: string): string {
  if (!url) return '';
  // Handle https://drive.google.com/file/d/FILE_ID/view or /view?usp=...
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    // Use thumbnail API — this works without cookies or redirects
    return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w600`;
  }
  // Handle https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (openMatch) {
    return `https://drive.google.com/thumbnail?id=${openMatch[1]}&sz=w600`;
  }
  // Handle https://drive.google.com/uc?id=FILE_ID or uc?export=view&id=...
  const ucMatch = url.match(/drive\.google\.com\/uc\?(?:.*&)?id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) {
    return `https://drive.google.com/thumbnail?id=${ucMatch[1]}&sz=w600`;
  }
  // Already a thumbnail URL — keep as-is
  if (url.includes('drive.google.com/thumbnail')) return url;
  return url;
}

export interface Product {
  id: string; name: string; cat: string; sub: string;
  price: string; orig: string; disc: number; emoji: string;
  img: string; imgs: string[]; incs: string[]; excs: string[];
  city_prices: Record<string, string>; city_orig: Record<string, string>;
}

// In-memory cache — products loaded once per browser session
let _cache: Product[] | null = null;
let _fetching: Promise<Product[]> | null = null;

export async function fetchProducts(): Promise<Product[]> {
  // Return cached data immediately if available
  if (_cache !== null) return _cache;
  // If a fetch is already in progress, wait for it (don't double-fetch)
  if (_fetching) return _fetching;

  _fetching = (async () => {
    try {
      const res = await fetch(SHEET_URL, {
        cache: 'no-store',
        headers: { 'Accept': 'application/json' },
      });
      const data = await res.json();
      if (!data?.products?.length) { _cache = []; return []; }

      const products = data.products.map((p: Record<string, string>) => {
        const cp: Record<string, string> = {}, co: Record<string, string> = {};
        Object.keys(p).forEach(k => {
          const lk = k.toLowerCase(), v = String(p[k] || '').trim().replace(/,/g, '');
          if (!v || v === '0') return;
          if (lk.startsWith('price_')) cp[lk.slice(6)] = v;
          else if (lk.startsWith('orig_')) co[lk.slice(5)] = v;
        });
        const imgs: string[] = [];
        const main = toImgUrl(String(p.img || '').trim());
        if (main) imgs.push(main);
        for (let i = 1; i <= 5; i++) {
          const e = toImgUrl(String(p[`img${i}`] || '').trim());
          if (e && !imgs.includes(e)) imgs.push(e);
        }
        if (p.imgs) String(p.imgs).split(',').forEach((u: string) => {
          const converted = toImgUrl(u.trim());
          if (converted && !imgs.includes(converted)) imgs.push(converted);
        });
        return {
          id: String(p.id || '').trim(),
          name: String(p.name || '').trim(),
          cat: String(p.cat || '').trim(),
          sub: String(p.sub || '').trim(),
          price: String(p.price || '').trim().replace(/,/g, ''),
          orig: String(p.orig || '').trim().replace(/,/g, ''),
          disc: parseInt(String(p.disc || '0')) || 0,
          emoji: String(p.emoji || '🎉').trim(),
          img: main, imgs,
          incs: Array.isArray(p.incs) ? p.incs : String(p.Inclusions || '').split(',').map((x: string) => x.trim()).filter(Boolean),
          excs: Array.isArray(p.excs) ? p.excs : String(p.Exclusions || '').split(',').map((x: string) => x.trim()).filter(Boolean),
          city_prices: cp, city_orig: co,
        };
      }).filter((p: Product) => p.id && p.name);

      _cache = products;
      return products;
    } catch {
      _cache = [];
      return [];
    } finally {
      _fetching = null;
    }
  })();

  return _fetching;
}

export function getPrice(p: Product, city: string): string {
  const v = p.city_prices[city] || p.price || '';
  if (!v) return '';
  const n = parseFloat(v);
  return isNaN(n) ? v : '₹' + n.toLocaleString('en-IN');
}

export function getOrig(p: Product, city: string): string {
  const v = p.city_orig[city] || p.orig || '';
  if (!v) return '';
  const n = parseFloat(v);
  return isNaN(n) ? v : '₹' + n.toLocaleString('en-IN');
}

export async function submitLead(data: Record<string, string>) {
  try { await fetch(`${LEADS_URL}?${new URLSearchParams(data).toString()}&callback=_`, { mode: 'no-cors' }); } catch { }
}

export function openWhatsApp(msg: string) {
  window.open(`https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`, '_blank');
}
