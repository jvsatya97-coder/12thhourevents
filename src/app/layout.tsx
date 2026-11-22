import type { Metadata } from 'next';
import './globals.css';
import { Suspense } from 'react';
import { CityProvider } from '@/context/CityContext';
import { CompareProvider } from '@/context/CompareContext';
import Navbar from '@/components/Navbar';
import StickyCategories from '@/components/StickyCategories';
import Footer from '@/components/Footer';
import WAChat from '@/components/WAChat';
import CityDealsBanner from '@/components/CityDealsBanner';
import MobileBottomNav from '@/components/MobileBottomNav';
import BackToTop from '@/components/BackToTop';
import CompareDrawer from '@/components/CompareDrawer';
import GoogleTagManager from '@/components/GoogleTagManager';
import UtmCapture from '@/components/UtmCapture';

export const metadata: Metadata = {
  title: '12th Hour Events | #1 Party & Birthday Decoration — Pan India',
  description: 'India\'s top party decorators. Birthday, anniversary, theme, baby shower, room decorations. Same-day setup. 5000+ happy customers. Book in 2 mins!',
  keywords: 'birthday decoration, birthday decoration near me, party decorator near me, anniversary decoration, room decoration, baby shower decoration, theme decoration, birthday decoration delhi, birthday decoration bangalore, birthday decoration mumbai, birthday decoration hyderabad, birthday decoration pune, party decoration india',
  metadataBase: new URL('https://12thhourevents.in'),
  alternates: {
    canonical: 'https://12thhourevents.in',
  },
  openGraph: {
    siteName: '12th Hour Events',
    type: 'website',
    locale: 'en_IN',
    url: 'https://12thhourevents.in',
    title: '12th Hour Events | #1 Party & Birthday Decoration — Pan India',
    description: 'India\'s top party decorators. Birthday, anniversary, theme, baby shower, room decorations. Same-day setup. 5000+ happy customers. Book in 2 mins!',
    images: [{ url: 'https://12thhourevents.in/og-image.jpg', width: 1200, height: 630, alt: '12th Hour Events — Party & Birthday Decoration across India' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '12th Hour Events — #1 Party & Birthday Decoration India',
    description: 'Same-day party decorations across India. 5000+ happy customers. Book on WhatsApp in 2 mins!',
    images: ['https://12thhourevents.in/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Critical preconnects for fast image loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://lh3.googleusercontent.com" />
        <link rel="dns-prefetch" href="https://drive.google.com" />
        <link rel="dns-prefetch" href="https://script.google.com" />
        {/* Font: preload critical weights */}
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@600;700;800&display=swap" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="64x64" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <meta name="theme-color" content="#ff6b00" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5" />
        <meta name="format-detection" content="telephone=yes" />
        {/* Mark <html> as js-ready once JS executes — used to hide SEO-only server grid */}
        <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.classList.add("js-ready")' }} />
        {/* Google Ads / Facebook Pixel friendly — no blocking scripts */}
        {/* Organization Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "12th Hour Events",
          "url": "https://12thhourevents.in",
          "logo": "https://12thhourevents.in/logo.png",
          "image": "https://12thhourevents.in/og-image.jpg",
          "description": "India's leading party decoration company. Professional birthday, anniversary, theme, room and baby shower decorations with same-day setup across India.",
          "telephone": "+918073552837",
          "email": "hello@12thhourevents.in",
          "foundingDate": "2020",
          "numberOfEmployees": { "@type": "QuantitativeValue", "value": 50 },
          "sameAs": [
            "https://www.instagram.com/12thhourevents",
            "https://www.facebook.com/12thhourevents"
          ],
          "contactPoint": [{
            "@type": "ContactPoint",
            "telephone": "+918073552837",
            "contactType": "customer service",
            "areaServed": "IN",
            "availableLanguage": ["English", "Hindi"],
            "contactOption": "TollFree"
          }]
        })}} />
        {/* WebSite Schema with Sitelinks Searchbox */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "12th Hour Events",
          "url": "https://12thhourevents.in",
          "potentialAction": {
            "@type": "SearchAction",
            "target": { "@type": "EntryPoint", "urlTemplate": "https://12thhourevents.in/search?q={search_term_string}" },
            "query-input": "required name=search_term_string"
          }
        })}} />
        {/* LocalBusiness Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": "https://12thhourevents.in/#business",
          "name": "12th Hour Events",
          "image": ["https://12thhourevents.in/og-image.jpg", "https://12thhourevents.in/logo.png"],
          "url": "https://12thhourevents.in",
          "telephone": "+918073552837",
          "priceRange": "₹999 - ₹25000",
          "description": "Professional party decoration company in India. Birthday, anniversary, theme, room, baby shower decorations. Same-day setup available across India.",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "New Delhi",
            "addressRegion": "Delhi",
            "postalCode": "110001",
            "addressCountry": "IN"
          },
          "geo": { "@type": "GeoCoordinates", "latitude": 28.6139, "longitude": 77.2090 },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            "opens": "08:00",
            "closes": "22:00"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "5247",
            "bestRating": "5",
            "worstRating": "1"
          },
          "areaServed": [
            { "@type": "City", "name": "Delhi" },
            { "@type": "City", "name": "Noida" },
            { "@type": "City", "name": "Gurgaon" },
            { "@type": "City", "name": "Faridabad" },
            { "@type": "City", "name": "Ghaziabad" },
            { "@type": "City", "name": "Bangalore" },
            { "@type": "City", "name": "Mumbai" },
            { "@type": "City", "name": "Hyderabad" },
            { "@type": "City", "name": "Pune" },
            { "@type": "City", "name": "Chennai" },
            { "@type": "City", "name": "Kolkata" },
            { "@type": "City", "name": "Lucknow" },
            { "@type": "City", "name": "Ahmedabad" },
            { "@type": "City", "name": "Thane" }
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Party Decoration Services",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Birthday Decoration", "url": "https://12thhourevents.in/birthday-decoration" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Anniversary Decoration", "url": "https://12thhourevents.in/anniversary-decoration" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Theme Decoration", "url": "https://12thhourevents.in/theme-decoration" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Baby Shower Decoration", "url": "https://12thhourevents.in/baby-shower" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Room Decoration", "url": "https://12thhourevents.in/room-decoration" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Balloon Decoration", "url": "https://12thhourevents.in/balloon-decoration" } }
            ]
          }
        })}} />
      </head>
      <body>
        <CompareProvider>
          <CityProvider>
            <GoogleTagManager />
            <Suspense fallback={null}><UtmCapture /></Suspense>
            <Navbar />
            <StickyCategories />
            <CityDealsBanner />
            <main>{children}</main>
            <Footer />
            <WAChat />
            <MobileBottomNav />
            <BackToTop />
            <CompareDrawer />
          </CityProvider>
        </CompareProvider>
      </body>
    </html>
  );
}
