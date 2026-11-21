import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Theme Decoration', cityName: 'Bangalore', serviceSlug: 'theme-decoration', citySlug: 'bangalore' });

export default function Page() {
  return <CityServiceTemplate
    cat="theme" serviceName="Theme Decoration" serviceSlug="theme-decoration" emoji="🎨"
    citySlug="bangalore" cityName="Bangalore"
  />;
}
