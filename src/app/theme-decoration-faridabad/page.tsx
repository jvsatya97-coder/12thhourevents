import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Theme Decoration', cityName: 'Faridabad', serviceSlug: 'theme-decoration', citySlug: 'faridabad' });

export default function Page() {
  return <CityServiceTemplate
    cat="theme" serviceName="Theme Decoration" serviceSlug="theme-decoration" emoji="🎨"
    citySlug="faridabad" cityName="Faridabad"
  />;
}
