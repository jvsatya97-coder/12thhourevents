// WhatsApp conversion tracking utility
// Fires to Google Analytics 4 (GA4) and Google Ads on every WA click
//
// HOW TO USE:
//   import { trackWhatsApp } from '@/lib/tracking';
//   trackWhatsApp({ label: 'Hero Book Now', page: 'homepage' });
//
// Or just use the global auto-listener in GoogleTagManager — it catches
// ALL wa.me links automatically even without calling this directly.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export interface WATrackParams {
  label?: string;      // e.g. "Hero CTA", "Product Card", "Floating Button"
  page?: string;       // e.g. "homepage", "birthday-decoration", "product"
  productName?: string;// e.g. "Fairy Light Room Decoration"
  city?: string;       // e.g. "Delhi", "Mumbai"
  source?: string;     // e.g. "navbar", "footer", "product-card"
}

export function trackWhatsApp(params: WATrackParams = {}) {
  if (typeof window === 'undefined' || !window.gtag) return;

  const eventData = {
    event_category: 'WhatsApp',
    event_label: params.label ?? 'WhatsApp Click',
    page_location: typeof window !== 'undefined' ? window.location.href : '',
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
    product_name: params.productName ?? '',
    city: params.city ?? '',
    source: params.source ?? '',
    // Value for Google Ads bidding — treat each WA click as ₹50 lead value
    value: 50,
    currency: 'INR',
  };

  // Fire to GA4
  window.gtag('event', 'whatsapp_click', eventData);

  // Fire as Google Ads conversion (replace AW-XXXXXXXXX/XXXXXXXXXXXXXXXX with real IDs)
  window.gtag('event', 'conversion', {
    send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // ← SEO person fills this in
    value: 50,
    currency: 'INR',
    transaction_id: `wa_${Date.now()}`,
  });
}

// Auto-track all wa.me link clicks on the page
// Called once from GoogleTagManager component on mount
export function initWhatsAppAutoTracking() {
  if (typeof document === 'undefined') return;

  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('a');
    if (!target) return;

    const href = target.getAttribute('href') ?? '';
    if (!href.includes('wa.me')) return;

    // Extract label from button text or aria-label
    const label = target.innerText?.trim().slice(0, 60)
      || target.getAttribute('aria-label')
      || 'WhatsApp Link';

    trackWhatsApp({
      label,
      page: window.location.pathname,
      source: 'auto-tracked',
    });
  });
}
