'use client';
import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initWhatsAppAutoTracking } from '@/lib/tracking';

// ─────────────────────────────────────────────────────────────
// CONFIGURATION — your SEO person fills these in:
//
//   GA4_ID   : From Google Analytics → Admin → Data Streams
//              Format: G-XXXXXXXXXX
//
//   ADS_ID   : From Google Ads → Tools → Conversions
//              Format: AW-XXXXXXXXXX
//
// Until these are filled in, the script loads but events are
// sent to placeholder IDs (they'll show errors in GA debugger,
// but won't break the site).
// ─────────────────────────────────────────────────────────────
const GA4_ID = 'G-XXXXXXXXXX';   // ← replace with real GA4 Measurement ID
const ADS_ID = 'AW-XXXXXXXXXX';  // ← replace with real Google Ads ID

export default function GoogleTagManager() {
  const pathname = usePathname();

  // Fire page_view on every route change (SPA navigation)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('event', 'page_view', {
      page_path: pathname,
      page_location: window.location.href,
    });
  }, [pathname]);

  // Start global WhatsApp click auto-tracker once on mount
  useEffect(() => {
    initWhatsAppAutoTracking();
  }, []);

  return (
    <>
      {/* Load Google tag (gtag.js) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA4_ID}', {
            page_path: window.location.pathname,
            send_page_view: true,
          });
          gtag('config', '${ADS_ID}');
        `}
      </Script>
    </>
  );
}
