import React from 'react';
import { MapPin, Train, Building2, Globe } from 'lucide-react';

interface City {
  id: string;
  name: string;
  country: string;
  flag: string;
  lines: number;
  stations: number;
  type: 'metro' | 'subway' | 'rail' | 'light_rail' | 'mrt';
  status: 'active' | 'planned' | 'under_construction';
}

const CITIES: City[] = [
  {
    id: 'singapore',
    name: 'Singapore MRT',
    country: 'Singapore',
    flag: '🇸🇬',
    lines: 6,
    stations: 160,
    type: 'mrt',
    status: 'active'
  },
  {
    id: 'nyc',
    name: 'New York Subway',
    country: 'United States',
    flag: '🇺🇸',
    lines: 26,
    stations: 472,
    type: 'subway',
    status: 'active'
  },
  {
    id: 'tokyo',
    name: 'Tokyo Metro',
    country: 'Japan',
    flag: '🇯🇵',
    lines: 13,
    stations: 285,
    type: 'metro',
    status: 'active'
  }
];

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (cityId: string) => void;
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  selectedCity,
  onCityChange
}) => {
  const selectedCityData = CITIES.find(city => city.id === selectedCity);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">Transit System:</span>
      </div>

      <select
        value={selectedCity}
        onChange={(e) => onCityChange(e.target.value)}
        className="px-3 py-2 bg-background text-foreground border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[280px] dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:focus:ring-primary"
      >
        {CITIES.map((city) => (
          <option key={city.id} value={city.id} className="dark:bg-gray-800 dark:text-gray-100">
            {city.flag} {city.name} - {city.country}
          </option>
        ))}
      </select>
    </div>
  );
};

export { CITIES };
export type { City };
