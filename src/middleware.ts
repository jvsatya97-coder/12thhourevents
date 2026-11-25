import { NextRequest, NextResponse } from 'next/server';

/**
 * Map Vercel/Cloudflare geo city names → our city slugs.
 * Covers the top Indian cities we serve.
 */
const GEO_CITY_MAP: Record<string, string> = {
  'Delhi':        'delhi',
  'New Delhi':    'delhi',
  'Noida':        'noida',
  'Gurgaon':      'gurgaon',
  'Gurugram':     'gurgaon',
  'Faridabad':    'faridabad',
  'Ghaziabad':    'ghaziabad',
  'Bangalore':    'bangalore',
  'Bengaluru':    'bangalore',
  'Mumbai':       'mumbai',
  'Navi Mumbai':  'mumbai',
  'Hyderabad':    'hyderabad',
  'Secunderabad': 'hyderabad',
  'Pune':         'pune',
  'Chennai':      'chennai',
  'Kolkata':      'kolkata',
  'Lucknow':      'lucknow',
  'Ahmedabad':    'ahmedabad',
  'Thane':        'thane',
};

const VALID_CITY_SLUGS = new Set(Object.values(GEO_CITY_MAP));

function detectGeoCity(request: NextRequest): string {
  // Vercel adds x-vercel-ip-city header (URL-encoded)
  const vercelCity = request.headers.get('x-vercel-ip-city');
  if (vercelCity) {
    const decoded = decodeURIComponent(vercelCity);
    const slug = GEO_CITY_MAP[decoded];
    if (slug) return slug;
  }

  // Cloudflare adds cf-ipcity
  const cfCity = request.headers.get('cf-ipcity');
  if (cfCity) {
    const slug = GEO_CITY_MAP[cfCity];
    if (slug) return slug;
  }

  return 'delhi'; // fallback
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Legacy: /product/[id] (single segment, no city) ──────────────────────
  // Old URLs like /product/BDAY_RACING_CAR_T_MWJ7P44D — redirect to city URL.
  // A valid city-segment URL has the form /product/[city]/[id] (two segments).
  // Single-segment means: exactly one path segment after /product/.
  const legacyMatch = pathname.match(/^\/product\/([^/]+)$/);
  if (legacyMatch) {
    const id = legacyMatch[1];
    // If the segment is itself a valid city slug, it's not a product ID — skip
    if (!VALID_CITY_SLUGS.has(id)) {
      const city = resolveCity(request);
      const url = request.nextUrl.clone();
      url.pathname = `/product/${city}/${id}`;
      return NextResponse.redirect(url, { status: 301 }); // permanent — old URL
    }
  }

  // ── /product/delhi/[id] — geo-redirect away from default city if possible ─
  const delhiMatch = pathname.match(/^\/product\/delhi\/(.+)$/);
  if (delhiMatch) {
    const id = delhiMatch[1];
    const city = resolveCity(request);
    if (city !== 'delhi') {
      const url = request.nextUrl.clone();
      url.pathname = `/product/${city}/${id}`;
      return NextResponse.redirect(url, { status: 302 }); // temporary — city may change
    }
  }

  return NextResponse.next();
}

/** Pick city: saved cookie → geo headers → 'delhi' */
function resolveCity(request: NextRequest): string {
  const savedCity = request.cookies.get('12he_city')?.value;
  if (savedCity && VALID_CITY_SLUGS.has(savedCity)) return savedCity;
  return detectGeoCity(request);
}

export const config = {
  matcher: ['/product/:path*'],
};
