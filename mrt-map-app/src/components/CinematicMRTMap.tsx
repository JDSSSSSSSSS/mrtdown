import React, { useMemo, useState, useEffect } from 'react';
import { Station } from '../data/mrtData';

interface CinematicMRTMapProps {
  onStationClick?: (station: Station) => void;
  showLabels?: boolean;
  selectedLines?: string[];
  className?: string;
}

// Official LTA Colors with enhanced contrast
const OFFICIAL_COLORS = {
  NSL: '#d42e12', // North-South Line - Red
  EWL: '#009645', // East-West Line - Green  
  CCL: '#fa9e0d', // Circle Line - Orange
  NEL: '#9900aa', // North East Line - Purple
  DTL: '#005ec4', // Downtown Line - Blue
  TEL: '#9D5B25', // Thomson-East Coast Line - Brown
} as const;

// Optimized schematic positions for cinematic view
const STATION_POSITIONS = {
  // Central spine - North-South Line (vertical)
  'JUR': { x: 200, y: 700 }, // NS1/EW24 - Jurong East (Major interchange)
  'BBT': { x: 200, y: 680 }, // NS2 - Bukit Batok
  'BGK': { x: 200, y: 660 }, // NS3 - Bukit Gombak
  'CCK': { x: 200, y: 640 }, // NS4 - Choa Chu Kang
  'YWT': { x: 200, y: 620 }, // NS5 - Yew Tee
  'KRJ': { x: 200, y: 600 }, // NS7 - Kranji
  'MSL': { x: 200, y: 580 }, // NS8 - Marsiling
  'WDL': { x: 200, y: 560 }, // NS9 - Woodlands
  'ADM': { x: 200, y: 540 }, // NS10 - Admiralty
  'SBW': { x: 200, y: 520 }, // NS11 - Sembawang
  'CBR': { x: 200, y: 500 }, // NS12 - Canberra
  'YIS': { x: 200, y: 480 }, // NS13 - Yishun
  'KTB': { x: 200, y: 460 }, // NS14 - Khatib
  'YCK': { x: 200, y: 440 }, // NS15 - Yio Chu Kang
  'AMK': { x: 200, y: 420 }, // NS16 - Ang Mo Kio
  'BSH': { x: 200, y: 400 }, // NS17/CC15 - Bishan (Major interchange)
  'BDL': { x: 200, y: 380 }, // NS18 - Braddell
  'TPY': { x: 200, y: 360 }, // NS19 - Toa Payoh
  'NOV': { x: 200, y: 340 }, // NS20 - Novena
  'NEW': { x: 200, y: 320 }, // NS21/DT11 - Newton (Major interchange)
  'ORC': { x: 200, y: 300 }, // NS22/TE14 - Orchard (Major interchange)
  'SOM': { x: 200, y: 280 }, // NS23 - Somerset
  'DBG': { x: 200, y: 260 }, // NS24/NE6/CC1 - Dhoby Ghaut (Triple interchange)
  'CTH': { x: 200, y: 240 }, // NS25/EW13 - City Hall (Major interchange)
  'RFP': { x: 200, y: 220 }, // NS26/EW14 - Raffles Place (Major interchange)
  'MRB': { x: 200, y: 200 }, // NS27/CC29/TE20 - Marina Bay (Triple interchange)
  'MSP': { x: 200, y: 180 }, // NS28 - Marina South Pier

  // East-West Line (horizontal main trunk)
  'PSR': { x: 700, y: 240 }, // EW1 - Pasir Ris (Eastern terminus)
  'TAM': { x: 680, y: 240 }, // EW2/DT32 - Tampines (Major interchange)
  'SIM': { x: 660, y: 240 }, // EW3 - Simei
  'TNM': { x: 640, y: 240 }, // EW4 - Tanah Merah
  'BDK': { x: 620, y: 240 }, // EW5 - Bedok
  'KEM': { x: 600, y: 240 }, // EW6 - Kembangan
  'EUN': { x: 580, y: 240 }, // EW7 - Eunos
  'PYL': { x: 560, y: 240 }, // EW8/CC9 - Paya Lebar (Major interchange)
  'ALJ': { x: 540, y: 240 }, // EW9 - Aljunied
  'KAL': { x: 520, y: 240 }, // EW10 - Kallang
  'LVR': { x: 500, y: 240 }, // EW11 - Lavender
  'BGS': { x: 480, y: 240 }, // EW12/DT14 - Bugis (Major interchange)
  // CTH and RFP already positioned on NSL
  'TGP': { x: 160, y: 240 }, // EW15 - Tanjong Pagar
  'OTP': { x: 140, y: 240 }, // EW16/NE3/TE17 - Outram Park (Triple interchange)
  'TIB': { x: 120, y: 240 }, // EW17 - Tiong Bahru
  'RDH': { x: 100, y: 240 }, // EW18 - Redhill
  'QUE': { x: 80, y: 240 }, // EW19 - Queenstown
  'COM': { x: 60, y: 240 }, // EW20 - Commonwealth
  'BNV': { x: 40, y: 240 }, // EW21/CC22 - Buona Vista (Major interchange)
  'DVR': { x: 20, y: 240 }, // EW22 - Dover
  'CLE': { x: 0, y: 240 }, // EW23 - Clementi
  // JUR connects EWL back to NSL

  // Circle Line (circular layout around center)
  // Starting from DBG, going clockwise
  'BBS': { x: 220, y: 260 }, // CC2 - Bras Basah
  'EPN': { x: 240, y: 280 }, // CC3 - Esplanade
  'PMN': { x: 260, y: 300 }, // CC4/DT15 - Promenade (Interchange)
  'NCH': { x: 280, y: 320 }, // CC5 - Nicoll Highway
  'SDM': { x: 300, y: 340 }, // CC6 - Stadium
  'MBT': { x: 320, y: 360 }, // CC7 - Mountbatten
  'DKT': { x: 340, y: 380 }, // CC8 - Dakota
  // PYL already positioned
  'MPS': { x: 580, y: 260 }, // CC10/DT26 - MacPherson (Interchange)
  'TSG': { x: 600, y: 280 }, // CC11 - Tai Seng
  'BTL': { x: 620, y: 300 }, // CC12 - Bartley
  'SER': { x: 640, y: 320 }, // CC13/NE12 - Serangoon (Major interchange)
  'LRC': { x: 620, y: 340 }, // CC14 - Lorong Chuan
  // BSH already positioned
  'MRM': { x: 180, y: 380 }, // CC16 - Marymount
  'CDT': { x: 160, y: 360 }, // CC17/TE9 - Caldecott (Interchange)

  // North East Line (diagonal SW to NE)
  'HBF': { x: 100, y: 160 }, // NE1/CC29 - HarbourFront (Interchange)
  'CTN': { x: 120, y: 180 }, // NE4/DT19 - Chinatown (Interchange)
  'CQY': { x: 140, y: 200 }, // NE5 - Clarke Quay
  // DBG already positioned (NE6)
  'LTI': { x: 220, y: 280 }, // NE7/DT12 - Little India (Major interchange)
  'FRP': { x: 240, y: 300 }, // NE8/CC20 - Farrer Park (Interchange)
  'BKG': { x: 260, y: 320 }, // NE9 - Boon Keng
  'PTR': { x: 280, y: 340 }, // NE10 - Potong Pasir
  'WDL_NE': { x: 300, y: 360 }, // NE11 - Woodlands (different position for clarity)
  // SER already positioned (NE12)
  'KVN': { x: 660, y: 340 }, // NE13 - Kovan
  'HGN': { x: 680, y: 360 }, // NE14 - Hougang
  'BGK_NE': { x: 700, y: 380 }, // NE15 - Buangkok
  'SKG': { x: 720, y: 400 }, // NE16 - Sengkang
  'PGL': { x: 740, y: 420 }, // NE17 - Punggol

  // Downtown Line (complex curved route)
  'BPJ': { x: -40, y: 180 }, // DT1 - Bukit Panjang (Western terminus)
  'CSW': { x: -20, y: 200 }, // DT2 - Cashew
  'HLV': { x: 0, y: 220 }, // DT3 - Hillview
  // More DTL stations positioned along the curved route...
  
  // Thomson-East Coast Line (north-south route on east side)
  'WDN': { x: 180, y: 580 }, // TE1 - Woodlands North
  'WDS': { x: 180, y: 540 }, // TE3 - Woodlands South
  'SPL': { x: 180, y: 520 }, // TE4 - Springleaf
  // More TEL stations...
};

// Enhanced station metadata with more details
const STATION_DATA: Record<string, { 
  name: string; 
  codes: string[]; 
  lines: string[]; 
  isInterchange: boolean;
  translations?: { zh?: string; ta?: string; ms?: string; };
  town?: string;
}> = {
  'JUR': { 
    name: 'Jurong East', 
    codes: ['NS1', 'EW24'], 
    lines: ['NSL', 'EWL'], 
    isInterchange: true,
    translations: { zh: '裕廊东', ta: 'ஜூரோங் கிழக்கு' },
    town: 'Jurong East'
  },
  'DBG': { 
    name: 'Dhoby Ghaut', 
    codes: ['NS24', 'NE6', 'CC1'], 
    lines: ['NSL', 'NEL', 'CCL'], 
    isInterchange: true,
    translations: { zh: '多美歌', ta: 'டோபி காட்' },
    town: 'Museum'
  },
  'CTH': { 
    name: 'City Hall', 
    codes: ['NS25', 'EW13'], 
    lines: ['NSL', 'EWL'], 
    isInterchange: true,
    translations: { zh: '政府大厦', ta: 'சிட்டி ஹால்' },
    town: 'Downtown Core'
  },
  'RFP': { 
    name: 'Raffles Place', 
    codes: ['NS26', 'EW14'], 
    lines: ['NSL', 'EWL'], 
    isInterchange: true,
    translations: { zh: '莱佛士坊', ta: 'ராஃபிள்ஸ் பிளேஸ்' },
    town: 'Downtown Core'
  },
  'MRB': { 
    name: 'Marina Bay', 
    codes: ['NS27', 'CC29', 'TE20'], 
    lines: ['NSL', 'CCL', 'TEL'], 
    isInterchange: true,
    translations: { zh: '滨海湾', ta: 'மரீனா பே' },
    town: 'Downtown Core'
  },
  'OTP': { 
    name: 'Outram Park', 
    codes: ['EW16', 'NE3', 'TE17'], 
    lines: ['EWL', 'NEL', 'TEL'], 
    isInterchange: true,
    translations: { zh: '欧南园', ta: 'அவுட்ராம் பார்க்' },
    town: 'Outram'
  },
  'BGS': { 
    name: 'Bugis', 
    codes: ['EW12', 'DT14'], 
    lines: ['EWL', 'DTL'], 
    isInterchange: true,
    translations: { zh: '武吉士', ta: 'பூகிஸ்' },
    town: 'Rochor'
  },
  'TAM': { 
    name: 'Tampines', 
    codes: ['EW2', 'DT32'], 
    lines: ['EWL', 'DTL'], 
    isInterchange: true,
    translations: { zh: '淡滨尼', ta: 'தம்பினிஸ்' },
    town: 'Tampines'
  },
  'BSH': { 
    name: 'Bishan', 
    codes: ['NS17', 'CC15'], 
    lines: ['NSL', 'CCL'], 
    isInterchange: true,
    translations: { zh: '碧山', ta: 'பிஷான்' },
    town: 'Bishan'
  },
  'SER': { 
    name: 'Serangoon', 
    codes: ['NE12', 'CC13'], 
    lines: ['NEL', 'CCL'], 
    isInterchange: true,
    translations: { zh: '实龙岗', ta: 'சேராங்கூன்' },
    town: 'Serangoon'
  },
  'NEW': { 
    name: 'Newton', 
    codes: ['NS21', 'DT11'], 
    lines: ['NSL', 'DTL'], 
    isInterchange: true,
    translations: { zh: '牛顿', ta: 'நியூட்டன்' },
    town: 'Newton'
  },
  'ORC': { 
    name: 'Orchard', 
    codes: ['NS22', 'TE14'], 
    lines: ['NSL', 'TEL'], 
    isInterchange: true,
    translations: { zh: '乌节', ta: 'ஆர்ச்சர்ட்' },
    town: 'Orchard'
  },
  'PYL': { 
    name: 'Paya Lebar', 
    codes: ['EW8', 'CC9'], 
    lines: ['EWL', 'CCL'], 
    isInterchange: true,
    translations: { zh: '巴耶利峇', ta: 'பாயா லேபார்' },
    town: 'Paya Lebar'
  },
  'BNV': { 
    name: 'Buona Vista', 
    codes: ['EW21', 'CC22'], 
    lines: ['EWL', 'CCL'], 
    isInterchange: true,
    translations: { zh: '波那维斯达', ta: 'புவோனா விஸ்தா' },
    town: 'Buona Vista'
  },
  
  // Regular stations
  'PSR': { name: 'Pasir Ris', codes: ['EW1'], lines: ['EWL'], isInterchange: false, town: 'Pasir Ris' },
  'CLE': { name: 'Clementi', codes: ['EW23'], lines: ['EWL'], isInterchange: false, town: 'Clementi' },
  'HBF': { name: 'HarbourFront', codes: ['NE1', 'CC29'], lines: ['NEL', 'CCL'], isInterchange: true, town: 'HarbourFront' },
  'SKG': { name: 'Sengkang', codes: ['NE16'], lines: ['NEL'], isInterchange: false, town: 'Sengkang' },
  'PGL': { name: 'Punggol', codes: ['NE17'], lines: ['NEL'], isInterchange: false, town: 'Punggol' },
  'WDL': { name: 'Woodlands', codes: ['NS9', 'TE2'], lines: ['NSL', 'TEL'], isInterchange: true, town: 'Woodlands' },
  'MSP': { name: 'Marina South Pier', codes: ['NS28'], lines: ['NSL'], isInterchange: false, town: 'Marina South' },
  'BBT': { name: 'Bukit Batok', codes: ['NS2'], lines: ['NSL'], isInterchange: false, town: 'Bukit Batok' },
  'SOM': { name: 'Somerset', codes: ['NS23'], lines: ['NSL'], isInterchange: false, town: 'Somerset' },
  'NOV': { name: 'Novena', codes: ['NS20'], lines: ['NSL'], isInterchange: false, town: 'Novena' },
  'TPY': { name: 'Toa Payoh', codes: ['NS19'], lines: ['NSL'], isInterchange: false, town: 'Toa Payoh' },
  'AMK': { name: 'Ang Mo Kio', codes: ['NS16'], lines: ['NSL'], isInterchange: false, town: 'Ang Mo Kio' },
  'YIS': { name: 'Yishun', codes: ['NS13'], lines: ['NSL'], isInterchange: false, town: 'Yishun' },
  'LTI': { name: 'Little India', codes: ['NE7', 'DT12'], lines: ['NEL', 'DTL'], isInterchange: true, town: 'Little India' },
  'TGP': { name: 'Tanjong Pagar', codes: ['EW15'], lines: ['EWL'], isInterchange: false, town: 'Tanjong Pagar' },
  'KAL': { name: 'Kallang', codes: ['EW10'], lines: ['EWL'], isInterchange: false, town: 'Kallang' },
  'BDK': { name: 'Bedok', codes: ['EW5'], lines: ['EWL'], isInterchange: false, town: 'Bedok' },
};

// Optimized line connections for smooth rendering
const LINE_CONNECTIONS = {
  NSL: [
    ['JUR', 'BBT'], ['BBT', 'BGK'], ['BGK', 'CCK'], ['CCK', 'YWT'], 
    ['YWT', 'KRJ'], ['KRJ', 'MSL'], ['MSL', 'WDL'], ['WDL', 'ADM'],
    ['ADM', 'SBW'], ['SBW', 'CBR'], ['CBR', 'YIS'], ['YIS', 'KTB'],
    ['KTB', 'YCK'], ['YCK', 'AMK'], ['AMK', 'BSH'], ['BSH', 'BDL'],
    ['BDL', 'TPY'], ['TPY', 'NOV'], ['NOV', 'NEW'], ['NEW', 'ORC'],
    ['ORC', 'SOM'], ['SOM', 'DBG'], ['DBG', 'CTH'], ['CTH', 'RFP'],
    ['RFP', 'MRB'], ['MRB', 'MSP']
  ],
  EWL: [
    ['PSR', 'TAM'], ['TAM', 'SIM'], ['SIM', 'TNM'], ['TNM', 'BDK'],
    ['BDK', 'KEM'], ['KEM', 'EUN'], ['EUN', 'PYL'], ['PYL', 'ALJ'],
    ['ALJ', 'KAL'], ['KAL', 'LVR'], ['LVR', 'BGS'], ['BGS', 'CTH'],
    ['CTH', 'RFP'], ['RFP', 'TGP'], ['TGP', 'OTP'], ['OTP', 'TIB'],
    ['TIB', 'RDH'], ['RDH', 'QUE'], ['QUE', 'COM'], ['COM', 'BNV'],
    ['BNV', 'DVR'], ['DVR', 'CLE'], ['CLE', 'JUR']
  ],
  CCL: [
    ['DBG', 'BBS'], ['BBS', 'EPN'], ['EPN', 'PMN'], ['PMN', 'NCH'],
    ['NCH', 'SDM'], ['SDM', 'MBT'], ['MBT', 'DKT'], ['DKT', 'PYL'],
    ['PYL', 'MPS'], ['MPS', 'TSG'], ['TSG', 'BTL'], ['BTL', 'SER'],
    ['SER', 'LRC'], ['LRC', 'BSH'], ['BSH', 'MRM'], ['MRM', 'CDT'],
    ['CDT', 'BNV'], ['BNV', 'HBF'], ['HBF', 'MRB']
  ],
  NEL: [
    ['HBF', 'OTP'], ['OTP', 'CTN'], ['CTN', 'CQY'], ['CQY', 'DBG'],
    ['DBG', 'LTI'], ['LTI', 'FRP'], ['FRP', 'BKG'], ['BKG', 'PTR'],
    ['PTR', 'SER'], ['SER', 'KVN'], ['KVN', 'HGN'], ['HGN', 'SKG'], ['SKG', 'PGL']
  ]
};

const CinematicMRTMap: React.FC<CinematicMRTMapProps> = ({ 
  onStationClick, 
  showLabels = true, 
  selectedLines = [],
  className = ""
}) => {
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Cinematic loading animation
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const filteredStations = useMemo(() => {
    if (selectedLines.length === 0) return Object.keys(STATION_DATA);
    return Object.keys(STATION_DATA).filter(stationId => 
      STATION_DATA[stationId].lines.some(line => selectedLines.includes(line))
    );
  }, [selectedLines]);

  const handleStationClick = (stationId: string) => {
    const stationData = STATION_DATA[stationId];
    if (stationData && onStationClick) {
      const station: Station = {
        id: stationId,
        name: stationData.name,
        name_translations: stationData.translations || {},
        codes: stationData.codes,
        lines: stationData.lines,
        coordinates: { lat: 0, lng: 0 },
        isInterchange: stationData.isInterchange,
        structureType: 'underground'
      };
      onStationClick(station);
    }
  };

  return (
    <div className={`w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-3xl shadow-2xl overflow-hidden ${className}`}>
      <svg 
        viewBox="-50 100 800 600" 
        className="w-full h-full transition-all duration-700 ease-out"
        style={{ minHeight: '400px' }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Advanced definitions for cinematic effects */}
        <defs>
          {/* Animated gradient background */}
          <linearGradient id="cinematicBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="50%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          
          {/* Glow effects for stations */}
          <filter id="stationGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Enhanced shadow for interchanges */}
          <filter id="interchangeShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1e293b" floodOpacity="0.25"/>
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.15"/>
          </filter>

          {/* Pulsing animation for active elements */}
          <filter id="pulse">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
            <animate attributeName="stdDeviation" values="2;4;2" dur="2s" repeatCount="indefinite"/>
          </filter>

          {/* Line gradient effects */}
          <linearGradient id="lineGradientNSL" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#d42e12" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>

          <linearGradient id="lineGradientEWL" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#009645" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
        </defs>
        
        {/* Cinematic background with subtle animation */}
        <rect width="800" height="600" fill="url(#cinematicBg)" />
        
        {/* Subtle grid pattern for depth */}
        <pattern id="cinematicGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.3"/>
        </pattern>
        <rect width="800" height="600" fill="url(#cinematicGrid)" />

        {/* Draw line segments with enhanced styling */}
        {Object.entries(LINE_CONNECTIONS).map(([lineId, segments]) => {
          if (selectedLines.length > 0 && !selectedLines.includes(lineId)) return null;
          
          return (
            <g key={lineId} className="line-group">
              {segments.map(([from, to], index) => {
                const fromPos = STATION_POSITIONS[from as keyof typeof STATION_POSITIONS];
                const toPos = STATION_POSITIONS[to as keyof typeof STATION_POSITIONS];
                if (!fromPos || !toPos) return null;

                const lineColor = OFFICIAL_COLORS[lineId as keyof typeof OFFICIAL_COLORS];
                const isAnimated = animationPhase === index % 4;

                return (
                  <line
                    key={`${lineId}-${index}`}
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={toPos.x}
                    y2={toPos.y}
                    stroke={lineColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                    className={`transition-all duration-500 ease-out ${isAnimated ? 'animate-pulse' : ''}`}
                    style={{
                      filter: isAnimated ? 'url(#pulse)' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                      opacity: selectedLines.length === 0 || selectedLines.includes(lineId) ? 0.9 : 0.3
                    }}
                  />
                );
              })}
            </g>
          );
        })}

        {/* Draw stations with cinematic effects */}
        {filteredStations.map(stationId => {
            const position = STATION_POSITIONS[stationId as keyof typeof STATION_POSITIONS];
          const data = STATION_DATA[stationId];
          if (!position || !data) return null;

          const primaryLine = data.lines[0];
          const stationColor = OFFICIAL_COLORS[primaryLine as keyof typeof OFFICIAL_COLORS] || '#64748b';
          const isHovered = hoveredStation === stationId;
          const isVisible = selectedLines.length === 0 || 
                           data.lines.some(line => selectedLines.includes(line));

          return (
            <g key={stationId} className="station-group">
              {/* Station halo effect for interchanges */}
              {data.isInterchange && (
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={isHovered ? 20 : 16}
                  fill={stationColor}
                  opacity={isHovered ? 0.2 : 0.1}
                  className="transition-all duration-300 ease-out"
                />
              )}

              {/* Main station circle */}
              <circle
                cx={position.x}
                cy={position.y}
                r={data.isInterchange ? 12 : 8}
                fill="white"
                stroke={stationColor}
                strokeWidth={data.isInterchange ? 4 : 3}
                filter={data.isInterchange ? "url(#interchangeShadow)" : "url(#stationGlow)"}
                className={`cursor-pointer transition-all duration-300 ease-out transform-gpu ${
                  isHovered ? 'scale-125' : 'scale-100'
                } hover:scale-125`}
                style={{
                  opacity: isVisible ? 1 : 0.3,
                  transformOrigin: `${position.x}px ${position.y}px`
                }}
                onClick={() => handleStationClick(stationId)}
                onMouseEnter={() => setHoveredStation(stationId)}
                onMouseLeave={() => setHoveredStation(null)}
              />
              
              {/* Interchange inner indicator */}
              {data.isInterchange && (
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={6}
                  fill={stationColor}
                  className="pointer-events-none transition-all duration-300"
                  style={{ opacity: isVisible ? 0.8 : 0.3 }}
                />
              )}

              {/* Station labels with enhanced typography */}
              {showLabels && (
                <g className="pointer-events-none label-group">
                  {/* Label background with blur effect */}
                  <rect
                    x={position.x + (data.isInterchange ? 16 : 12)}
                    y={position.y - 12}
                    width={data.name.length * 7 + 12}
                    height="24"
                    fill="white"
                    fillOpacity="0.95"
                    rx="6"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    filter="url(#stationGlow)"
                    className={`transition-all duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}
                    style={{ 
                      opacity: isVisible ? 1 : 0.4,
                      transformOrigin: `${position.x + 16}px ${position.y}px`
                    }}
                  />
                  
                  {/* Station name */}
                  <text
                    x={position.x + (data.isInterchange ? 22 : 18)}
                    y={position.y - 2}
                    fontSize={data.isInterchange ? "11" : "10"}
                    fontWeight="700"
                    fill="#1e293b"
                    fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
                    className={`transition-all duration-300 ${isHovered ? 'fill-blue-600' : ''}`}
                    style={{ opacity: isVisible ? 1 : 0.4 }}
                  >
                    {data.name}
                  </text>
                  
                  {/* Station codes with enhanced styling */}
                  <text
                    x={position.x + (data.isInterchange ? 22 : 18)}
                    y={position.y + 10}
                    fontSize="8"
                    fill="#64748b"
                    fontFamily="ui-monospace, 'SF Mono', monospace"
                    fontWeight="500"
                    style={{ opacity: isVisible ? 0.8 : 0.3 }}
                  >
                    {data.codes.join(' • ')}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Enhanced legend with cinematic styling */}
        <g transform="translate(20, 450)" className="legend-group">
          <rect 
            x="0" y="0" width="220" height="140" 
            fill="white" fillOpacity="0.98" rx="12" 
            stroke="#e2e8f0" strokeWidth="2" 
            filter="url(#interchangeShadow)"
          />
          
          <text x="15" y="25" fontSize="14" fontWeight="bold" fill="#1e293b" 
                fontFamily="system-ui, -apple-system, sans-serif">
            Singapore MRT Lines
          </text>
          
          {Object.entries(OFFICIAL_COLORS).map(([lineId, color], index) => {
            const lineNames = {
              NSL: 'North-South Line',
              EWL: 'East-West Line', 
              CCL: 'Circle Line',
              NEL: 'North East Line',
              DTL: 'Downtown Line',
              TEL: 'Thomson-East Coast Line'
            };
            
            const isSelected = selectedLines.length === 0 || selectedLines.includes(lineId);
            
            return (
              <g key={lineId} transform={`translate(15, ${40 + index * 16})`} 
                 className="transition-all duration-300"
                 style={{ opacity: isSelected ? 1 : 0.4 }}>
                <rect x="0" y="0" width="20" height="4" fill={color} rx="2"
                      filter="url(#stationGlow)"/>
                <text x="28" y="7" fontSize="10" fill="#374151" fontWeight="600"
                      fontFamily="system-ui, -apple-system, sans-serif">
                  {lineId}
                </text>
                <text x="55" y="7" fontSize="9" fill="#64748b" fontWeight="500">
                  {lineNames[lineId as keyof typeof lineNames]}
                </text>
              </g>
            );
          })}
        </g>

        {/* Cinematic title with gradient text effect */}
        <g transform="translate(400, 140)" className="title-group">
          <defs>
            <linearGradient id="titleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
          </defs>
          
          <text x="0" y="0" fontSize="20" fontWeight="900" 
                fill="url(#titleGradient)" textAnchor="middle"
                fontFamily="system-ui, -apple-system, sans-serif"
                filter="url(#stationGlow)">
            Singapore MRT Network
          </text>
          <text x="0" y="20" fontSize="11" fill="#64748b" textAnchor="middle"
                fontFamily="system-ui, -apple-system, sans-serif" fontWeight="500">
            Interactive Schematic Map • Based on Official LTA Data
          </text>
        </g>
      </svg>
    </div>
  );
};

export default CinematicMRTMap;
