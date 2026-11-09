import type { Metadata } from 'next';
import CityServiceTemplate, { generateCityMetadata } from '@/components/CityServiceTemplate';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Balloon Decorations', cityName: 'Faridabad' });

export default function Page() {
  return <CityServiceTemplate
    cat="balloon" serviceName="Balloon Decorations" serviceSlug="balloon-decoration" emoji="🎈"
    citySlug="faridabad" cityName="Faridabad"
  />;
}
