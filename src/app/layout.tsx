import type { Metadata } from 'next';
import './globals.css';
import { CityProvider } from '@/context/CityContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WAFloat from '@/components/WAFloat';
import MobileBottomNav from '@/components/MobileBottomNav';

export const metadata: Metadata = {
  title: '12th Hour Events | Birthday & Party Decoration in Delhi NCR',
  description: 'Premium party decorators in Delhi NCR. Birthday, anniversary, theme, room, baby shower decorations. Book in 2 mins on WhatsApp!',
  keywords: 'birthday decoration delhi, party decorator, anniversary decoration, room decoration, baby shower',
  metadataBase: new URL('https://12thhourevents.in'),
  openGraph: {
    siteName: '12th Hour Events',
    type: 'website',
    locale: 'en_IN',
  },
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context":"https://schema.org",
          "@type":"LocalBusiness",
          "name":"12th Hour Events",
          "image":"https://12thhourevents.in/logo.png",
          "url":"https://12thhourevents.in",
          "telephone":"+918073552837",
          "address":{"@type":"PostalAddress","addressLocality":"New Delhi","addressRegion":"Delhi","addressCountry":"IN"},
          "geo":{"@type":"GeoCoordinates","latitude":28.6139,"longitude":77.2090},
          "openingHoursSpecification":{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],"opens":"08:00","closes":"22:00"},
          "priceRange":"₹₹",
          "servesCuisine":"Party Decoration"
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
