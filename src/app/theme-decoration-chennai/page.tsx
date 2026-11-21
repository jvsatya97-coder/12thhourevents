import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Theme Decoration', cityName: 'Chennai', serviceSlug: 'theme-decoration', citySlug: 'chennai' });

export default function Page() {
  return <CityServiceTemplate
    cat="theme" serviceName="Theme Decoration" serviceSlug="theme-decoration" emoji="🎨"
    citySlug="chennai" cityName="Chennai"
  />;
}
