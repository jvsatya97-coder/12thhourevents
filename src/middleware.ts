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

  // Only handle /product/[city]/[id] where city is 'delhi' (the redirect default)
  // AND the request came from a redirect (Referer is empty or same-site /product/ID)
  // We re-detect city from geo and redirect to the right city.
  const productDefaultMatch = pathname.match(/^\/product\/delhi\/(.+)$/);
  if (productDefaultMatch) {
    const id = productDefaultMatch[1];

    // Check if there's a saved city cookie (set by CityContext on first visit)
    const savedCity = request.cookies.get('12he_city')?.value;
    if (savedCity && VALID_CITY_SLUGS.has(savedCity) && savedCity !== 'delhi') {
      const url = request.nextUrl.clone();
      url.pathname = `/product/${savedCity}/${id}`;
      return NextResponse.redirect(url, { status: 302 });
    }

    // Fall back to geo detection
    const geoCity = detectGeoCity(request);
    if (geoCity !== 'delhi') {
      const url = request.nextUrl.clone();
      url.pathname = `/product/${geoCity}/${id}`;
      return NextResponse.redirect(url, { status: 302 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/product/delhi/:path*'],
};
