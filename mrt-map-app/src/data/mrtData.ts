// Singapore MRT Network Data - Based on official LTA data and mrtdown database

export interface Station {
  id: string;
  name: string;
  name_translations?: {
    'zh-Hans'?: string;
    'ms'?: string;
    'ta'?: string;
  };
  codes: string[];
  lines: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  isInterchange: boolean;
  structureType?: 'underground' | 'elevated' | 'at_grade' | 'in_building';
}

export interface MRTLine {
  id: string;
  name: string;
  name_translations?: {
    'zh-Hans'?: string;
    'ms'?: string;
    'ta'?: string;
  };
  color: string;
  type: 'mrt.high' | 'mrt.medium' | 'lrt';
  stations: string[];
  branches?: {
    [key: string]: {
      name: string;
      stations: string[];
    };
  };
}

// Official LTA MRT Line Colors and Data
export const mrtLines: MRTLine[] = [
  {
    id: 'NSL',
    name: 'North-South Line',
    name_translations: {
      'zh-Hans': '南北地铁线',
      'ms': 'Laluan MRT Utara Selatan',
      'ta': 'வடக்கு தெற்கு எம்ஆர்டி வழி'
    },
    color: '#d42e12',
    type: 'mrt.high',
    stations: ['JUR', 'BBT', 'BGK', 'CCK', 'YWT', 'KRJ', 'MSL', 'WDL', 'ADM', 'SBW', 'CBR', 'YIS', 'KTB', 'YCK', 'AMK', 'BSH', 'BDL', 'TPY', 'NOV', 'NEW', 'ORC', 'SOM', 'DBG', 'CTH', 'RFP', 'MRB', 'MSP']
  },
  {
    id: 'EWL',
    name: 'East-West Line',
    name_translations: {
      'zh-Hans': '东西地铁线',
      'ms': 'Laluan MRT Timur Barat',
      'ta': 'கிழக்கு மேற்கு எம்ஆர்டி வழி'
    },
    color: '#009645',
    type: 'mrt.high',
    stations: ['PSR', 'TAM', 'SIM', 'TNM', 'BDK', 'KEM', 'EUN', 'PYL', 'ALJ', 'KAL', 'LVR', 'BGS', 'CTH', 'RFP', 'TGP', 'OTP', 'TIB', 'RDH', 'QUE', 'COM', 'BNV', 'DVR', 'CLE', 'JUR', 'CGN', 'LKS', 'BLY', 'PNR', 'JKN', 'GUL', 'TCR', 'TWR', 'TLK'],
    branches: {
      main: {
        name: 'Main Branch',
        stations: ['PSR', 'TAM', 'SIM', 'TNM', 'BDK', 'KEM', 'EUN', 'PYL', 'ALJ', 'KAL', 'LVR', 'BGS', 'CTH', 'RFP', 'TGP', 'OTP', 'TIB', 'RDH', 'QUE', 'COM', 'BNV', 'DVR', 'CLE', 'JUR', 'CGN', 'LKS', 'BLY', 'PNR', 'JKN', 'GUL', 'TCR', 'TWR', 'TLK']
      },
      changi_airport: {
        name: 'Changi Airport Branch',
        stations: ['TNM', 'EXP', 'CG1', 'CG2']
      }
    }
  },
  {
    id: 'CCL',
    name: 'Circle Line',
    name_translations: {
      'zh-Hans': '地铁环线',
      'ms': 'Laluan MRT Circle',
      'ta': 'இணைப்பு எம்ஆர்டி வழி'
    },
    color: '#fa9e0d',
    type: 'mrt.medium',
    stations: ['DBG', 'BBS', 'EPN', 'PMN', 'NCH', 'SDM', 'MBT', 'DKT', 'PYL', 'MPS', 'TSG', 'BTL', 'SER', 'LRC', 'BSH', 'MRM', 'CDT', 'UTM', 'WDL', 'PTR', 'NOV', 'NEW', 'ORC', 'GWD', 'HVL', 'OTP', 'MXW', 'STW', 'MRB']
  },
  {
    id: 'NEL',
    name: 'North East Line',
    name_translations: {
      'zh-Hans': '东北地铁线',
      'ms': 'Laluan MRT Timur Laut',
      'ta': 'வடக்கு கிழக்கு எம்ஆர்டி வழி'
    },
    color: '#9900aa',
    type: 'mrt.high',
    stations: ['HBF', 'OTP', 'CTN', 'CQY', 'DBG', 'LTI', 'FRP', 'BKG', 'PTR', 'WDL', 'SER', 'KVN', 'HGN', 'BGK', 'SKG', 'PGL', 'STC']
  },
  {
    id: 'DTL',
    name: 'Downtown Line',
    name_translations: {
      'zh-Hans': '滨海市区地铁线',
      'ms': 'Laluan MRT Pusat Bandar',
      'ta': 'டவுன்டவுன் எம்ஆர்டி வழி'
    },
    color: '#005ec4',
    type: 'mrt.medium',
    stations: ['BPJ', 'CSW', 'HLV', 'HME', 'BTW', 'KAP', 'STH', 'TKK', 'BTG', 'STV', 'NEW', 'LTI', 'RCR', 'BGS', 'PMN', 'BYF', 'DTN', 'TLA', 'CTN', 'FCN', 'BCL', 'JLB', 'BDM', 'GBH', 'MTR', 'MPS', 'UBI', 'KKB', 'BDN', 'BDR', 'TPW', 'TAM', 'TPE', 'UPC', 'EXP']
  },
  {
    id: 'TEL',
    name: 'Thomson–East Coast Line',
    name_translations: {
      'zh-Hans': '汤申-东海岸地铁线',
      'ms': 'Laluan MRT Thomson-Pantai Timur',
      'ta': 'தாம்சன் - ஈஸ்ட் கோஸ்ட் எம்ஆர்டி வழி'
    },
    color: '#9D5B25',
    type: 'mrt.medium',
    stations: ['WDN', 'WDL', 'WDS', 'SPL', 'LTR', 'MFL', 'BRH', 'UTM', 'CDT', 'MPL', 'STV', 'NPR', 'OBV', 'ORC', 'GWD', 'HVL', 'OTP', 'MXW', 'STW', 'MRB', 'MRS', 'GBB', 'TSG', 'MTC', 'KTN', 'TGH', 'BDR', 'SIM', 'EXP']
  }
];

// Station data with accurate coordinates and interchange information
export const stations: Station[] = [
  {
    id: 'JUR',
    name: 'Jurong East',
    name_translations: {
      'zh-Hans': '裕廊东',
      'ta': 'ஜூரோங் கிழக்கு'
    },
    codes: ['NS1', 'EW24'],
    lines: ['NSL', 'EWL'],
    coordinates: { lat: 1.3352, lng: 103.7438 },
    isInterchange: true,
    structureType: 'elevated'
  },
  {
    id: 'DBG',
    name: 'Dhoby Ghaut',
    name_translations: {
      'zh-Hans': '多美歌',
      'ta': 'டோபி காட்'
    },
    codes: ['NS24', 'NE6', 'CC1'],
    lines: ['NSL', 'NEL', 'CCL'],
    coordinates: { lat: 1.300419, lng: 103.849283 },
    isInterchange: true,
    structureType: 'underground'
  },
  {
    id: 'ORC',
    name: 'Orchard',
    name_translations: {
      'zh-Hans': '乌节',
      'ta': 'ஆர்ச்சர்ட்'
    },
    codes: ['NS22', 'TE14'],
    lines: ['NSL', 'TEL'],
    coordinates: { lat: 1.304138, lng: 103.831550 },
    isInterchange: true,
    structureType: 'underground'
  },
  {
    id: 'CTH',
    name: 'City Hall',
    name_translations: {
      'zh-Hans': '政府大厦',
      'ta': 'சிட்டி ஹால்'
    },
    codes: ['NS25', 'EW13'],
    lines: ['NSL', 'EWL'],
    coordinates: { lat: 1.293239, lng: 103.852219 },
    isInterchange: true,
    structureType: 'underground'
  },
  {
    id: 'RFP',
    name: 'Raffles Place',
    name_translations: {
      'zh-Hans': '莱佛士坊',
      'ta': 'ராஃபிள்ஸ் பிளேஸ்'
    },
    codes: ['NS26', 'EW14'],
    lines: ['NSL', 'EWL'],
    coordinates: { lat: 1.283666, lng: 103.851959 },
    isInterchange: true,
    structureType: 'underground'
  },
  {
    id: 'MRB',
    name: 'Marina Bay',
    name_translations: {
      'zh-Hans': '滨海湾',
      'ta': 'மரீனா பே'
    },
    codes: ['NS27', 'CC29', 'TE20'],
    lines: ['NSL', 'CCL', 'TEL'],
    coordinates: { lat: 1.276094, lng: 103.854675 },
    isInterchange: true,
    structureType: 'underground'
  },
  {
    id: 'OTP',
    name: 'Outram Park',
    name_translations: {
      'zh-Hans': '欧南园',
      'ta': 'அவுட்ராம் பார்க்'
    },
    codes: ['NE3', 'EW16', 'TE17'],
    lines: ['NEL', 'EWL', 'TEL'],
    coordinates: { lat: 1.280225, lng: 103.839486 },
    isInterchange: true,
    structureType: 'underground'
  },
  {
    id: 'BGS',
    name: 'Bugis',
    name_translations: {
      'zh-Hans': '武吉士',
      'ta': 'பூகிஸ்'
    },
    codes: ['EW12', 'DT14'],
    lines: ['EWL', 'DTL'],
    coordinates: { lat: 1.300418, lng: 103.856056 },
    isInterchange: true,
    structureType: 'underground'
  },
  {
    id: 'PMN',
    name: 'Promenade',
    name_translations: {
      'zh-Hans': '宝门廊',
      'ta': 'ப்ரோமனேட்'
    },
    codes: ['CC4', 'DT15'],
    lines: ['CCL', 'DTL'],
    coordinates: { lat: 1.293667, lng: 103.861306 },
    isInterchange: true,
    structureType: 'underground'
  },
  {
    id: 'BSH',
    name: 'Bishan',
    name_translations: {
      'zh-Hans': '碧山',
      'ta': 'பிஷான்'
    },
    codes: ['NS17', 'CC15'],
    lines: ['NSL', 'CCL'],
    coordinates: { lat: 1.351236, lng: 103.848456 },
    isInterchange: true,
    structureType: 'elevated'
  },
  {
    id: 'SER',
    name: 'Serangoon',
    name_translations: {
      'zh-Hans': '实龙岗',
      'ta': 'சேராங்கூன்'
    },
    codes: ['NE12', 'CC13'],
    lines: ['NEL', 'CCL'],
    coordinates: { lat: 1.349775, lng: 103.873056 },
    isInterchange: true,
    structureType: 'elevated'
  },
  {
    id: 'NEW',
    name: 'Newton',
    name_translations: {
      'zh-Hans': '牛顿',
      'ta': 'நியூட்டன்'
    },
    codes: ['NS21', 'DT11'],
    lines: ['NSL', 'DTL'],
    coordinates: { lat: 1.313250, lng: 103.838361 },
    isInterchange: true,
    structureType: 'underground'
  },
  {
    id: 'LTI',
    name: 'Little India',
    name_translations: {
      'zh-Hans': '小印度',
      'ta': 'லிட்டில் இந்தியா'
    },
    codes: ['NE7', 'DT12'],
    lines: ['NEL', 'DTL'],
    coordinates: { lat: 1.306583, lng: 103.849000 },
    isInterchange: true,
    structureType: 'underground'
  },
  {
    id: 'BNV',
    name: 'Buona Vista',
    name_translations: {
      'zh-Hans': '波那维斯达',
      'ta': 'புவோனா விஸ்தா'
    },
    codes: ['EW21', 'CC22'],
    lines: ['EWL', 'CCL'],
    coordinates: { lat: 1.307044, lng: 103.790317 },
    isInterchange: true,
    structureType: 'elevated'
  },
  {
    id: 'HBF',
    name: 'HarbourFront',
    name_translations: {
      'zh-Hans': '港湾',
      'ta': 'ஹார்பர்ஃபிரண்ட்'
    },
    codes: ['NE1', 'CC29'],
    lines: ['NEL', 'CCL'],
    coordinates: { lat: 1.265297, lng: 103.822206 },
    isInterchange: true,
    structureType: 'elevated'
  },
  // Add more key stations...
  {
    id: 'TAM',
    name: 'Tampines',
    name_translations: {
      'zh-Hans': '淡滨尼',
      'ta': 'தம்பினஸ்'
    },
    codes: ['EW2', 'DT32'],
    lines: ['EWL', 'DTL'],
    coordinates: { lat: 1.353281, lng: 103.945267 },
    isInterchange: true,
    structureType: 'elevated'
  },
  {
    id: 'PYL',
    name: 'Paya Lebar',
    name_translations: {
      'zh-Hans': '巴耶利峇',
      'ta': 'பாயா லேபார்'
    },
    codes: ['EW8', 'CC9'],
    lines: ['EWL', 'CCL'],
    coordinates: { lat: 1.318125, lng: 103.892486 },
    isInterchange: true,
    structureType: 'elevated'
  }
];

// Connection data for drawing lines between stations
export interface Connection {
  from: string;
  to: string;
  line: string;
}

export const connections: Connection[] = [
  // NSL connections
  { from: 'JUR', to: 'BBT', line: 'NSL' },
  { from: 'BBT', to: 'BGK', line: 'NSL' },
  { from: 'BGK', to: 'CCK', line: 'NSL' },
  // ... (continue with all connections)
  
  // EWL connections
  { from: 'PSR', to: 'TAM', line: 'EWL' },
  { from: 'TAM', to: 'SIM', line: 'EWL' },
  // ... (continue with all connections)
  
  // CCL connections (circular)
  { from: 'DBG', to: 'BBS', line: 'CCL' },
  { from: 'BBS', to: 'EPN', line: 'CCL' },
  // ... (continue with all connections)
];
