'use client';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// ─────────────────────────────────────────────────────────────
// CONFIGURATION — fill in your Meta Pixel ID:
//
//   META_PIXEL_ID : From Meta Business Suite → Events Manager
//                  Format: 15–16 digit number e.g. "1234567890123456"
//
// Leave blank ('') to disable the pixel entirely (no script loads).
// ─────────────────────────────────────────────────────────────
const META_PIXEL_ID = '';  // ← paste your Pixel ID here

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export default function MetaPixel() {
  const pathname = usePathname();

  // Fire PageView on every SPA route change
  useEffect(() => {
    if (typeof window === 'undefined' || !window.fbq || !META_PIXEL_ID) return;
    window.fbq('track', 'PageView');
  }, [pathname]);

  if (!META_PIXEL_ID) return null; // disabled until ID is set

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1" width="1" style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
