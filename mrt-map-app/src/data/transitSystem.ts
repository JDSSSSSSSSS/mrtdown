// Universal Transit System Interface
// Supports Singapore MRT, NYC Subway, Tokyo Metro, London Tube, etc.

export interface TransitStation {
  id: string;
  name: string;
  name_translations?: {
    [languageCode: string]: string;
  };
  codes: string[];
  lines: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  isInterchange: boolean;
  structureType?: 'underground' | 'elevated' | 'at_grade' | 'in_building';
  position?: {
    x: number;
    y: number;
  };
  style?: string;
  accessibility?: {
    wheelchairAccessible: boolean;
    elevators: boolean;
    escalators: boolean;
  };
  amenities?: string[];
}

export interface TransitLine {
  id: string;
  name: string;
  name_translations?: {
    [languageCode: string]: string;
  };
  color: string;
  type: 'subway' | 'metro' | 'rail' | 'light_rail' | 'bus_rapid_transit' | 'tram';
  stations: string[];
  branches?: {
    [key: string]: {
      name: string;
      stations: string[];
    };
  };
  status?: 'operational' | 'construction' | 'planned' | 'maintenance';
}

export interface TransitConnection {
  from: string;
  to: string;
  line: string;
  travelTime?: number; // in minutes
  distance?: number; // in meters
}

export interface TransitSystem {
  id: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
  currency: string;
  languages: string[];
  operator: string;
  website: string;
  coordinates: {
    lat: number;
    lng: number;
    zoom: number;
  };
  stations: TransitStation[];
  lines: TransitLine[];
  connections: TransitConnection[];
  colors: { [lineId: string]: string };
  metadata: {
    totalStations: number;
    totalLines: number;
    totalLength: number; // in km
    dailyRidership: number;
    yearOpened: number;
    lastUpdated: string;
  };
}

// Predefined transit system configurations
export const TRANSIT_SYSTEMS: { [key: string]: Partial<TransitSystem> } = {
  singapore: {
    id: 'singapore-mrt',
    name: 'Singapore MRT & LRT Network',
    city: 'Singapore',
    country: 'Singapore',
    timezone: 'Asia/Singapore',
    currency: 'SGD',
    languages: ['en', 'zh-Hans', 'ms', 'ta'],
    operator: 'SMRT Corporation & SBS Transit',
    website: 'https://www.lta.gov.sg',
    coordinates: { lat: 1.3521, lng: 103.8198, zoom: 11 },
  },
  
  nyc: {
    id: 'nyc-subway',
    name: 'New York City Subway',
    city: 'New York City',
    country: 'United States',
    timezone: 'America/New_York',
    currency: 'USD',
    languages: ['en', 'es'],
    operator: 'Metropolitan Transportation Authority',
    website: 'https://www.mta.info',
    coordinates: { lat: 40.7128, lng: -74.0060, zoom: 10 },
  },
  
  tokyo: {
    id: 'tokyo-metro',
    name: 'Tokyo Metro & JR East',
    city: 'Tokyo',
    country: 'Japan',
    timezone: 'Asia/Tokyo',
    currency: 'JPY',
    languages: ['ja', 'en'],
    operator: 'Tokyo Metro Co. & JR East',
    website: 'https://www.tokyometro.jp',
    coordinates: { lat: 35.6762, lng: 139.6503, zoom: 10 },
  },
  
  london: {
    id: 'london-tube',
    name: 'London Underground',
    city: 'London',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    currency: 'GBP',
    languages: ['en'],
    operator: 'Transport for London',
    website: 'https://tfl.gov.uk',
    coordinates: { lat: 51.5074, lng: -0.1278, zoom: 10 },
  },
  
  paris: {
    id: 'paris-metro',
    name: 'Paris Métro',
    city: 'Paris',
    country: 'France',
    timezone: 'Europe/Paris',
    currency: 'EUR',
    languages: ['fr', 'en'],
    operator: 'RATP',
    website: 'https://www.ratp.fr',
    coordinates: { lat: 48.8566, lng: 2.3522, zoom: 11 },
  },
  
  berlin: {
    id: 'berlin-ubahn',
    name: 'Berlin U-Bahn & S-Bahn',
    city: 'Berlin',
    country: 'Germany',
    timezone: 'Europe/Berlin',
    currency: 'EUR',
    languages: ['de', 'en'],
    operator: 'BVG & S-Bahn Berlin',
    website: 'https://www.bvg.de',
    coordinates: { lat: 52.5200, lng: 13.4050, zoom: 10 },
  },
  
  shanghai: {
    id: 'shanghai-metro',
    name: 'Shanghai Metro',
    city: 'Shanghai',
    country: 'China',
    timezone: 'Asia/Shanghai',
    currency: 'CNY',
    languages: ['zh-Hans', 'en'],
    operator: 'Shanghai Shentong Metro Group',
    website: 'http://www.shmetro.com',
    coordinates: { lat: 31.2304, lng: 121.4737, zoom: 10 },
  }
};

// Transit system factory
export class TransitSystemFactory {
  static async loadSystem(systemId: string): Promise<TransitSystem> {
    const config = TRANSIT_SYSTEMS[systemId];
    if (!config) {
      throw new Error(`Transit system '${systemId}' not found`);
    }

    // Load system-specific data
    switch (systemId) {
      case 'singapore':
        return await this.loadSingaporeSystem(config);
      case 'nyc':
        return await this.loadNYCSystem(config);
      case 'tokyo':
        return await this.loadTokyoSystem(config);
      case 'shanghai':
        return await this.loadShanghaiSystem(config);
      default:
        throw new Error(`Data loader for '${systemId}' not implemented yet`);
    }
  }

  private static async loadSingaporeSystem(config: Partial<TransitSystem>): Promise<TransitSystem> {
    // Use existing Singapore MRT data loader
    const { loadOfficialMRTData } = await import('./aggregateOfficialData');
    const data = await loadOfficialMRTData();
    
    return {
      ...config,
      stations: data.stations as TransitStation[],
      lines: data.lines as TransitLine[],
      connections: data.connections,
      colors: {
        NSL: '#D71920', EWL: '#009739', CCL: '#FA9E0D', NEL: '#9900AA',
        DTL: '#005EC4', TEL: '#9D5B25', JRL: '#0099AA', CRL: '#97C616',
        BPLRT: '#748477', SKLRT: '#748477', PGLRT: '#748477'
      },
      metadata: {
        totalStations: data.stations.length,
        totalLines: data.lines.length,
        totalLength: 240, // km
        dailyRidership: 3000000,
        yearOpened: 1987,
        lastUpdated: new Date().toISOString()
      }
    } as TransitSystem;
  }

  private static async loadNYCSystem(config: Partial<TransitSystem>): Promise<TransitSystem> {
    // Load static NYC Subway data (will be replaced with GTFS feed later)
    const { importNYCSubwayData } = await import('./importRealtimeData');
    const systemData = await importNYCSubwayData();
    
    return {
      ...config,
      ...systemData,
      colors: {
        '1': '#EE352E', '2': '#EE352E', '3': '#EE352E', // Red
        '4': '#00933C', '5': '#00933C', '6': '#00933C', // Green
        '7': '#B933AD', // Purple
        'N': '#FCCC0A', 'Q': '#FCCC0A', 'R': '#FCCC0A', 'W': '#FCCC0A', // Yellow
        'B': '#FF6319', 'D': '#FF6319', 'F': '#FF6319', 'M': '#FF6319', // Orange
        'A': '#0039A6', 'C': '#0039A6', 'E': '#0039A6', // Blue
        'G': '#6CBE45', // Light Green
        'J': '#996633', 'Z': '#996633', // Brown
        'L': '#A7A9AC', // Gray
        'S': '#808183' // Shuttle Gray
      },
      metadata: {
        totalStations: systemData.stations?.length || 472,
        totalLines: systemData.lines?.length || 26,
        totalLength: 394, // km
        dailyRidership: 5500000,
        yearOpened: 1904,
        lastUpdated: new Date().toISOString()
      }
    } as TransitSystem;
  }

  private static async loadTokyoSystem(config: Partial<TransitSystem>): Promise<TransitSystem> {
    // Load static Tokyo Metro data (will be replaced with API data later)
    const { importTokyoMetroData } = await import('./importRealtimeData');
    const systemData = await importTokyoMetroData();
    
    return {
      ...config,
      ...systemData,
      colors: {
        'G': '#FF9500', // Ginza Line (Orange)
        'M': '#E60012', // Marunouchi Line (Red)
        'H': '#A5A5A5', // Hibiya Line (Silver)
        'T': '#00A7DB', // Tozai Line (Light Blue)
        'C': '#00BB85', // Chiyoda Line (Green)
        'Y': '#C1A470', // Yurakucho Line (Gold)
        'N': '#00ADA9', // Namboku Line (Emerald)
        'Z': '#B6007A', // Hanzomon Line (Purple)
        'F': '#9C5E31', // Fukutoshin Line (Brown)
      },
      metadata: {
        totalStations: systemData.stations?.length || 285,
        totalLines: systemData.lines?.length || 13,
        totalLength: 304, // km
        dailyRidership: 6840000,
        yearOpened: 1927,
        lastUpdated: new Date().toISOString()
      }
    } as TransitSystem;
  }
  
  private static async loadShanghaiSystem(config: Partial<TransitSystem>): Promise<TransitSystem> {
    // Placeholder for Shanghai Metro data
    // Data Source: No official open data portal found, may require scraping or community data.
    return {
      ...config,
      stations: [],
      lines: [],
      connections: [],
      colors: {
        '1': '#EE1F25', '2': '#00A859', '3': '#FCD500', '4': '#4B0082',
        '5': '#800080', '6': '#D60B61', '7': '#F58220', '8': '#0085C7',
        '9': '#8CC63F', '10': '#C6A1DC', '11': '#990000', '12': '#007A5E',
        '13': '#F5A6C4', '16': '#00A79D', '17': '#A5A5A5', '18': '#DAA520'
      },
      metadata: {
        totalStations: 508,
        totalLines: 20,
        totalLength: 831, // km
        dailyRidership: 10000000,
        yearOpened: 1993,
        lastUpdated: new Date().toISOString()
      }
    } as TransitSystem;
  }
}

// Transit system context for React
export interface TransitSystemContextType {
  currentSystem: TransitSystem | null;
  availableSystems: string[];
  switchSystem: (systemId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}
