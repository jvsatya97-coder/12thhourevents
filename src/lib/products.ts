import { SHEET_URL, LEADS_URL, WA_NUM } from './config';

/**
 * Transform any image URL to a consistent, optimized version.
 * - Cloudinary: injects c_fill,w_600,h_600,g_auto (smart square crop)
 * - Google Drive: converts to uc?export=view
 * - Everything else: returned as-is
 */
export function toImgUrl(url: string): string {
  if (!url) return '';
  const u = url.trim();

  // ── Cloudinary ──────────────────────────────────────────────────────────
  if (u.includes('res.cloudinary.com')) {
    // Insert transforms right after /upload/, preserving version number (v123456/)
    return u.replace(
      /(\/image\/upload\/)((?:v\d+\/)?)(.+)/,
      (_full, prefix, version, rest) => {
        if (rest.startsWith('c_fill')) return _full; // already transformed
        return `${prefix}c_fill,w_600,h_600,g_auto,q_auto,f_auto/${version}${rest}`;
      }
    );
  }

  // ── Google Drive ────────────────────────────────────────────────────────
  const driveId = getDriveId(u);
  if (driveId) {
    return `https://drive.google.com/uc?export=view&id=${driveId}`;
  }

  // ── Everything else (direct URLs, imgbb, postimages, etc.) ──────────────
  return u;
}

/** Make a thumbnail version of a Cloudinary URL (smaller, faster for card grids) */
export function toThumbUrl(url: string): string {
  if (!url) return '';
  if (url.includes('res.cloudinary.com')) {
    // Same approach as toImgUrl but 400x400 for card grids
    return url.replace(
      /(\/image\/upload\/)((?:v\d+\/)?)(.+)/,
      (_full, prefix, version, rest) => {
        // Strip any existing transforms first, then apply thumb size
        const cleanRest = rest.startsWith('c_fill') ? rest.replace(/^[^/]+\//, '') : rest;
        return `${prefix}c_fill,w_400,h_400,g_auto,q_auto,f_auto/${version}${cleanRest}`;
      }
    );
  }
  return toImgUrl(url);
}

/** Extract Google Drive file ID from any Drive URL */
function getDriveId(url: string): string | null {
  if (!url || !url.includes('drive.google.com')) return null;
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) return idMatch[1];
  return null;
}

/**
 * Returns fallback URLs to try if the primary image fails to load.
 */
export function getImgFallbacks(url: string): string[] {
  if (!url) return [];

  // Cloudinary: try original URL without transforms as fallback
  if (url.includes('res.cloudinary.com') && url.includes('c_fill')) {
    const original = url.replace(/(\/image\/upload\/)c_fill[^/]*\//, '$1');
    return [original];
  }

  // Google Drive fallbacks
  const id = getDriveId(url);
  if (id) {
    return [
      `https://drive.google.com/thumbnail?id=${id}&sz=w600`,
      `https://lh3.googleusercontent.com/d/${id}`,
    ];
  }

  return [];
}

export interface Product {
  id: string; name: string; cat: string; sub: string;
  cats2?: string;      // optional second category slug
  sort_order?: number; // lower number = shown first; undefined = no preference
  price: string; orig: string; disc: number; emoji: string;
  img: string; imgs: string[]; incs: string[]; excs: string[];
  city_prices: Record<string, string>; city_orig: Record<string, string>;
}

// In-memory cache — products loaded once per browser session
let _cache: Product[] | null = null;
let _fetching: Promise<Product[]> | null = null;

export async function fetchProducts(): Promise<Product[]> {
  if (_cache !== null) return _cache;
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

        // Support img1 through img9 columns
        for (let i = 1; i <= 9; i++) {
          const e = toImgUrl(String(p[`img${i}`] || '').trim());
          if (e && !imgs.includes(e)) imgs.push(e);
        }
        // Support comma-separated imgs column
        if (p.imgs) String(p.imgs).split(',').forEach((u: string) => {
          const converted = toImgUrl(u.trim());
          if (converted && !imgs.includes(converted)) imgs.push(converted);
        });

        const cats2 = String(p.cats2 || '').trim();
        const sortRaw = parseInt(String(p.sort_order || '').trim());
        return {
          id: String(p.id || '').trim(),
          name: String(p.name || '').trim(),
          cat: String(p.cat || '').trim(),
          sub: String(p.sub || '').trim(),
          cats2: cats2 || undefined,
          sort_order: isNaN(sortRaw) ? undefined : sortRaw,
          price: String(p.price || '').trim().replace(/,/g, ''),
          orig: String(p.orig || '').trim().replace(/,/g, ''),
          disc: parseInt(String(p.disc || '0')) || 0,
          emoji: String(p.emoji || '🎉').trim(),
          img: main, imgs,
          incs: Array.isArray(p.incs) ? p.incs : String(p.Inclusions || p.inclusions || '').split(/[\n,]+/).map((x: string) => x.trim()).filter(Boolean),
          excs: Array.isArray(p.excs) ? p.excs : String(p.Exclusions || p.exclusions || '').split(/[\n,]+/).map((x: string) => x.trim()).filter(Boolean),
          city_prices: cp, city_orig: co,
        };
      }).filter((p: Product) => p.id && p.name);

      // Expand products that have a cats2 — add a copy under the second category
      // The copy keeps the same id so product pages still work, but has cat = cats2
      const expanded: Product[] = [];
      for (const p of products) {
        expanded.push(p);
        if (p.cats2) {
          expanded.push({ ...p, cat: p.cats2, cats2: undefined });
        }
      }

      _cache = expanded;
      return expanded;
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
