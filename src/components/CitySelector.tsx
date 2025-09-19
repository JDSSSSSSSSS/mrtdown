import React from 'react';
import { MapPin, Train, Building2, Globe } from 'lucide-react';

interface City {
  id: string;
  name: string;
  country: string;
  flag: string;
  lines: number;
  stations: number;
  type: 'metro' | 'subway' | 'rail' | 'light_rail';
  status: 'active' | 'planned' | 'under_construction';
}

const CITIES: City[] = [
  {
    id: 'singapore-mrt',
    name: 'Singapore MRT',
    country: 'Singapore',
    flag: '🇸🇬',
    lines: 6,
    stations: 160,
    type: 'mrt',
    status: 'active'
  },
  {
    id: 'new-york-subway',
    name: 'New York Subway',
    country: 'United States',
    flag: '🇺🇸',
    lines: 36,
    stations: 472,
    type: 'subway',
    status: 'active'
  },
  {
    id: 'tokyo-metro',
    name: 'Tokyo Metro',
    country: 'Japan',
    flag: '🇯🇵',
    lines: 13,
    stations: 286,
    type: 'metro',
    status: 'active'
  },
  {
    id: 'london-tube',
    name: 'London Underground',
    country: 'United Kingdom',
    flag: '🇬🇧',
    lines: 11,
    stations: 272,
    type: 'metro',
    status: 'active'
  },
  {
    id: 'paris-metro',
    name: 'Paris Métro',
    country: 'France',
    flag: '🇫🇷',
    lines: 16,
    stations: 308,
    type: 'metro',
    status: 'active'
  },
  {
    id: 'berlin-ubahn',
    name: 'Berlin U-Bahn',
    country: 'Germany',
    flag: '🇩🇪',
    lines: 10,
    stations: 173,
    type: 'metro',
    status: 'active'
  },
  {
    id: 'moscow-metro',
    name: 'Moscow Metro',
    country: 'Russia',
    flag: '🇷🇺',
    lines: 17,
    stations: 269,
    type: 'metro',
    status: 'active'
  },
  {
    id: 'shanghai-metro',
    name: 'Shanghai Metro',
    country: 'China',
    flag: '🇨🇳',
    lines: 20,
    stations: 396,
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

  const getCityIcon = (type: string) => {
    switch (type) {
      case 'subway':
        return <Train className="w-4 h-4" />;
      case 'metro':
        return <Building2 className="w-4 h-4" />;
      case 'rail':
        return <Train className="w-4 h-4" />;
      case 'light_rail':
        return <Train className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">Transit System:</span>
      </div>

      <select
        value={selectedCity}
        onChange={(e) => onCityChange(e.target.value)}
        className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[280px]"
      >
        {CITIES.map((city) => (
          <option key={city.id} value={city.id}>
            {city.flag} {city.name} - {city.country}
          </option>
        ))}
      </select>
    </div>
  );
};

export { CITIES, City };