import type { Metadata } from 'next';
import './globals.css';
import { CityProvider } from '@/context/CityContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WAFloat from '@/components/WAFloat';
import MobileBottomNav from '@/components/MobileBottomNav';

export const metadata: Metadata = {
  title: '12th Hour Events | Birthday & Party Decoration — Pan India',
  description: 'Professional party decorators across India. Birthday, anniversary, theme, room, baby shower decorations. Same-day setup. Book in 2 mins on WhatsApp!',
  keywords: 'birthday decoration, party decorator near me, anniversary decoration, room decoration, baby shower decoration, party decoration delhi, bangalore, mumbai',
  metadataBase: new URL('https://12thhourevents.in'),
  openGraph: {
    siteName: '12th Hour Events',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: 'https://12thhourevents.in/og-image.jpg', width: 1200, height: 630, alt: '12th Hour Events — Party Decoration' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '12th Hour Events — Party & Birthday Decoration',
    description: 'Same-day party decorations across India. 5000+ happy customers. Book on WhatsApp!',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#ff6b00" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="format-detection" content="telephone=yes" />
        {/* Google Ads / Facebook Pixel friendly — no blocking scripts */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "12th Hour Events",
          "image": "https://12thhourevents.in/logo.png",
          "url": "https://12thhourevents.in",
          "telephone": "+918073552837",
          "description": "Professional party decoration service across India. Birthday, anniversary, theme, room and more. Same-day setup available.",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "New Delhi",
            "addressRegion": "Delhi",
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
            "reviewCount": "5000",
            "bestRating": "5"
          },
          "priceRange": "₹₹",
          "areaServed": [
            "Delhi", "Noida", "Gurgaon", "Faridabad", "Ghaziabad",
            "Bangalore", "Mumbai", "Hyderabad", "Pune", "Chennai", "Kolkata"
          ],
          "serviceType": [
            "Birthday Decoration", "Anniversary Decoration", "Theme Decoration",
            "Room Decoration", "Baby Shower Decoration", "Bachelorette Party",
            "Corporate Events", "Kids Activities"
          ]
        })}} />
      </head>
      <body>
        <CityProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WAFloat />
          <MobileBottomNav />
        </CityProvider>
      </body>
    </html>
  );
}
