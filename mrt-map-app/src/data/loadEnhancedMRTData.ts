import { Station } from './mrtData';

// Enhanced MRT station data with real MRTDown integration
export interface EnhancedStation extends Station {
  town?: string;
  town_translations?: {
    [key: string]: string;
  };
  landmarks?: string[];
  landmarks_translations?: {
    [key: string]: string[];
  };
  operatingHours?: {
    weekdays: { start: string; end: string };
    weekends: { start: string; end: string };
  };
  componentMembers?: {
    [lineId: string]: Array<{
      code: string;
      startedAt: string;
      structureType: 'underground' | 'elevated' | 'at_grade';
    }>;
  };
  lastUpdated?: string;
}

export interface EnhancedMRTLine {
  id: string;
  title: string;
  title_translations: {
    [key: string]: string;
  };
  type: string;
  color: string;
  startedAt: string;
  operatingHours: {
    weekdays: { start: string; end: string };
    weekends: { start: string; end: string };
  };
  branches: {
    [branchId: string]: {
      id: string;
      title: string;
      title_translations: {
        [key: string]: string;
      };
      stationCodes: string[];
    };
  };
}

// Enhanced station data with real MRTDown information
export const enhancedStations: { [key: string]: EnhancedStation } = {
  'ORC': {
    id: 'ORC',
    name: 'Orchard',
    name_translations: {
      'zh-Hans': '乌节',
      'ta': 'ஆர்ச்சர்ட்'
    },
    codes: ['NS22', 'TE14'],
    lines: ['NSL', 'TEL'],
    coordinates: { lat: 1.303, lng: 103.8322 },
    isInterchange: true,
    structureType: 'underground',
    town: 'Orchard',
    town_translations: {
      'zh-Hans': '乌节',
      'ms': 'Orchard',
      'ta': 'Orchard'
    },
    landmarks: [
      'Orchard Road',
      'ION Orchard',
      'Takashimaya Shopping Centre'
    ],
    landmarks_translations: {
      'zh-Hans': [
        '乌节路',
        'ION Orchard',
        '高岛屋百货'
      ],
      'ms': [
        'Orchard Road',
        'ION Orchard',
        'Pusat Beli-belah Takashimaya'
      ],
      'ta': [
        'Orchard Road',
        'ION Orchard',
        'Takashimaya Shopping Centre'
      ]
    },
    componentMembers: {
      'NSL': [{
        code: 'NS22',
        startedAt: '1987-12-12',
        structureType: 'underground'
      }],
      'TEL': [{
        code: 'TE14',
        startedAt: '2022-11-13',
        structureType: 'underground'
      }]
    }
  },
  'RFP': {
    id: 'RFP',
    name: 'Raffles Place',
    name_translations: {
      'zh-Hans': '莱佛士坊',
      'ta': 'ராஃபிள்ஸ் பிளேஸ்'
    },
    codes: ['EW14', 'NS26'],
    lines: ['EWL', 'NSL'],
    coordinates: { lat: 1.2839, lng: 103.851 },
    isInterchange: true,
    structureType: 'underground',
    town: 'Downtown Core',
    town_translations: {
      'zh-Hans': '中央商务区',
      'ms': 'Pusat Bandar',
      'ta': 'மைய நகர்மனை'
    },
    landmarks: [
      'One Raffles Place',
      'Raffles Place Park',
      'The Esplanade',
      'Singapore Exchange'
    ],
    landmarks_translations: {
      'zh-Hans': [
        '来福士广场',
        '来福士广场公园',
        '滨海艺术中心',
        '新加坡交易所'
      ],
      'ms': [
        'One Raffles Place',
        'Taman Raffles Place',
        'Esplanade',
        'Bursa Singapura'
      ],
      'ta': [
        'ஒன்றுக்கூட்டம் ராபிளஸ் இடம்',
        'ராஃபிள்ஸ் இடம் பூங்கா',
        'எஸ்புலேனேட்',
        'சிங்கப்பூர் பரிமாற்றம்'
      ]
    },
    componentMembers: {
      'EWL': [{
        code: 'EW14',
        startedAt: '1987-12-12',
        structureType: 'underground'
      }],
      'NSL': [{
        code: 'NS26',
        startedAt: '1987-12-12',
        structureType: 'underground'
      }]
    }
  },
  // Add more enhanced stations as needed
  'DBG': {
    id: 'DBG',
    name: 'Dhoby Ghaut',
    name_translations: {
      'zh-Hans': '多美歌',
      'ta': 'தோபி காட்'
    },
    codes: ['NS24', 'NE6', 'CC1'],
    lines: ['NSL', 'NEL', 'CCL'],
    coordinates: { lat: 1.2988, lng: 103.8456 },
    isInterchange: true,
    structureType: 'underground',
    town: 'Museum',
    landmarks: [
      'Plaza Singapura',
      'National Museum of Singapore',
      'Singapore Art Museum'
    ]
  }
};

// Enhanced line data
export const enhancedLines: { [key: string]: EnhancedMRTLine } = {
  'NSL': {
    id: 'NSL',
    title: 'North-South Line',
    title_translations: {
      'zh-Hans': '南北地铁线',
      'ms': 'Laluan MRT Utara Selatan',
      'ta': 'வடக்கு தெற்கு எம்ஆர்டி வழி'
    },
    type: 'mrt.high',
    color: '#d42e12',
    startedAt: '1987-11-07',
    operatingHours: {
      weekdays: { start: '04:59', end: '00:15' },
      weekends: { start: '05:23', end: '00:15' }
    },
    branches: {
      main: {
        id: 'main',
        title: 'Main Branch',
        title_translations: {
          'zh-Hans': '主干线',
          'ms': 'Cawangan Utama',
          'ta': 'முதன்மை கிளை'
        },
        stationCodes: [
          'NS1', 'NS2', 'NS3', 'NS4', 'NS5', 'NS7', 'NS8', 'NS9', 'NS10',
          'NS11', 'NS12', 'NS13', 'NS14', 'NS15', 'NS16', 'NS17', 'NS18',
          'NS19', 'NS20', 'NS21', 'NS22', 'NS23', 'NS24', 'NS25', 'NS26',
          'NS27', 'NS28'
        ]
      }
    }
  }
};

// Function to get enhanced station data
export const getEnhancedStation = (stationId: string): EnhancedStation | null => {
  return enhancedStations[stationId] || null;
};

// Function to get enhanced line data
export const getEnhancedLine = (lineId: string): EnhancedMRTLine | null => {
  return enhancedLines[lineId] || null;
};

// Function to load real-time service status (placeholder for future API integration)
export const getServiceStatus = async (lineId: string): Promise<{
  status: 'normal' | 'disrupted' | 'delayed';
  message?: string;
  lastUpdated: string;
}> => {
  // This would integrate with the MRTDown API in a real implementation
  return {
    status: 'normal',
    lastUpdated: new Date().toISOString()
  };
};

// Function to get nearby landmarks for a station
export const getNearbyLandmarks = (stationId: string, language: string = 'en'): string[] => {
  const station = getEnhancedStation(stationId);
  if (!station || !station.landmarks) return [];
  
  if (language !== 'en' && station.landmarks_translations?.[language]) {
    return station.landmarks_translations[language];
  }
  
  return station.landmarks;
};

// Function to get operating hours for a line
export const getOperatingHours = (lineId: string): {
  weekdays: { start: string; end: string };
  weekends: { start: string; end: string };
} | null => {
  const line = getEnhancedLine(lineId);
  return line?.operatingHours || null;
};

// Function to format operating hours for display
export const formatOperatingHours = (hours: { start: string; end: string }): string => {
  return `${hours.start} - ${hours.end}`;
};

// Function to check if a station is currently operational
export const isStationOperational = (stationId: string): boolean => {
  const station = getEnhancedStation(stationId);
  if (!station || !station.componentMembers) return true;
  
  // Check if any of the station's lines are operational
  return Object.values(station.componentMembers).some(members => 
    members.some(member => !member.startedAt || new Date(member.startedAt) <= new Date())
  );
};

export default {
  enhancedStations,
  enhancedLines,
  getEnhancedStation,
  getEnhancedLine,
  getServiceStatus,
  getNearbyLandmarks,
  getOperatingHours,
  formatOperatingHours,
  isStationOperational
};
