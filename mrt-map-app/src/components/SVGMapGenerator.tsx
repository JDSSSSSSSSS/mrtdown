import React, { useMemo } from 'react';
import { Station } from '../data/mrtData';

interface SVGMapGeneratorProps {
  onStationClick?: (station: Station) => void;
  showLabels?: boolean;
  selectedLines?: string[];
  className?: string;
}

// Official LTA Colors - Exact Hex Values
const OFFICIAL_COLORS = {
  NSL: '#d42e12', // North-South Line - Red
  EWL: '#009645', // East-West Line - Green  
  CCL: '#fa9e0d', // Circle Line - Orange
  NEL: '#9900aa', // North East Line - Purple
  DTL: '#005ec4', // Downtown Line - Blue
  TEL: '#9D5B25', // Thomson-East Coast Line - Brown
} as const;

// Optimized schematic positions (like official LTA map)
const STATION_POSITIONS = {
  // Major interchanges positioned first
  'JUR': { x: 100, y: 400 }, // NS1/EW24 - Jurong East
  'DBG': { x: 300, y: 200 }, // NS24/NE6/CC1 - Dhoby Ghaut  
  'CTH': { x: 300, y: 180 }, // NS25/EW13 - City Hall
  'RFP': { x: 300, y: 160 }, // NS26/EW14 - Raffles Place
  'MRB': { x: 300, y: 140 }, // NS27/CC29/TE20 - Marina Bay
  'OTP': { x: 250, y: 180 }, // EW16/NE3/TE17 - Outram Park
  'BGS': { x: 350, y: 180 }, // EW12/DT14 - Bugis
  'TAM': { x: 500, y: 180 }, // EW2/DT32 - Tampines
  'BSH': { x: 300, y: 250 }, // NS17/CC15 - Bishan
  'SER': { x: 400, y: 280 }, // NE12/CC13 - Serangoon
  'NEW': { x: 300, y: 220 }, // NS21/DT11 - Newton
  'ORC': { x: 300, y: 240 }, // NS22/TE14 - Orchard
  
  // NSL stations (vertical)
  'MSP': { x: 300, y: 120 }, // NS28
  'BBT': { x: 100, y: 380 }, // NS2
  'BGK': { x: 100, y: 360 }, // NS3
  'CCK': { x: 100, y: 340 }, // NS4
  'YWT': { x: 100, y: 320 }, // NS5
  'KRJ': { x: 100, y: 300 }, // NS7
  'MSL': { x: 100, y: 280 }, // NS8
  'WDL': { x: 100, y: 260 }, // NS9
  'ADM': { x: 200, y: 260 }, // NS10
  'SBW': { x: 250, y: 260 }, // NS11
  'CBR': { x: 280, y: 260 }, // NS12
  'YIS': { x: 300, y: 260 }, // NS13
  'KTB': { x: 300, y: 270 }, // NS14
  'YCK': { x: 300, y: 280 }, // NS15
  'AMK': { x: 300, y: 290 }, // NS16
  'BDL': { x: 300, y: 300 }, // NS18
  'TPY': { x: 300, y: 310 }, // NS19
  'NOV': { x: 300, y: 320 }, // NS20
  'SOM': { x: 300, y: 330 }, // NS23
  
  // EWL stations (horizontal)
  'PSR': { x: 600, y: 180 }, // EW1
  'SIM': { x: 480, y: 180 }, // EW3
  'TNM': { x: 460, y: 180 }, // EW4
  'BDK': { x: 440, y: 180 }, // EW5
  'KEM': { x: 420, y: 180 }, // EW6
  'EUN': { x: 400, y: 180 }, // EW7
  'PYL': { x: 380, y: 180 }, // EW8/CC9
  'ALJ': { x: 370, y: 180 }, // EW9
  'KAL': { x: 360, y: 180 }, // EW10
  'LVR': { x: 355, y: 180 }, // EW11
  'TGP': { x: 200, y: 180 }, // EW15
  'TIB': { x: 180, y: 180 }, // EW17
  'RDH': { x: 160, y: 180 }, // EW18
  'QUE': { x: 140, y: 180 }, // EW19
  'COM': { x: 120, y: 180 }, // EW20
  'BNV': { x: 100, y: 180 }, // EW21/CC22
  'DVR': { x: 90, y: 200 }, // EW22
  'CLE': { x: 90, y: 220 }, // EW23
  
  // Add more stations with calculated positions...
  'HBF': { x: 200, y: 120 }, // NE1
  'SKG': { x: 450, y: 320 }, // NE16
  'PGL': { x: 480, y: 340 }, // NE17
};

// Station metadata
const STATION_DATA: Record<string, { 
  name: string; 
  codes: string[]; 
  lines: string[]; 
  isInterchange: boolean;
  translations?: { zh?: string; ta?: string; };
}> = {
  'JUR': { name: 'Jurong East', codes: ['NS1', 'EW24'], lines: ['NSL', 'EWL'], isInterchange: true },
  'DBG': { name: 'Dhoby Ghaut', codes: ['NS24', 'NE6', 'CC1'], lines: ['NSL', 'NEL', 'CCL'], isInterchange: true },
  'CTH': { name: 'City Hall', codes: ['NS25', 'EW13'], lines: ['NSL', 'EWL'], isInterchange: true },
  'RFP': { name: 'Raffles Place', codes: ['NS26', 'EW14'], lines: ['NSL', 'EWL'], isInterchange: true },
  'MRB': { name: 'Marina Bay', codes: ['NS27', 'CC29', 'TE20'], lines: ['NSL', 'CCL', 'TEL'], isInterchange: true },
  'OTP': { name: 'Outram Park', codes: ['EW16', 'NE3', 'TE17'], lines: ['EWL', 'NEL', 'TEL'], isInterchange: true },
  'BGS': { name: 'Bugis', codes: ['EW12', 'DT14'], lines: ['EWL', 'DTL'], isInterchange: true },
  'TAM': { name: 'Tampines', codes: ['EW2', 'DT32'], lines: ['EWL', 'DTL'], isInterchange: true },
  'BSH': { name: 'Bishan', codes: ['NS17', 'CC15'], lines: ['NSL', 'CCL'], isInterchange: true },
  'SER': { name: 'Serangoon', codes: ['NE12', 'CC13'], lines: ['NEL', 'CCL'], isInterchange: true },
  'NEW': { name: 'Newton', codes: ['NS21', 'DT11'], lines: ['NSL', 'DTL'], isInterchange: true },
  'ORC': { name: 'Orchard', codes: ['NS22', 'TE14'], lines: ['NSL', 'TEL'], isInterchange: true },
  'PYL': { name: 'Paya Lebar', codes: ['EW8', 'CC9'], lines: ['EWL', 'CCL'], isInterchange: true },
  'BNV': { name: 'Buona Vista', codes: ['EW21', 'CC22'], lines: ['EWL', 'CCL'], isInterchange: true },
  
  // Regular stations
  'PSR': { name: 'Pasir Ris', codes: ['EW1'], lines: ['EWL'], isInterchange: false },
  'CLE': { name: 'Clementi', codes: ['EW23'], lines: ['EWL'], isInterchange: false },
  'HBF': { name: 'HarbourFront', codes: ['NE1', 'CC29'], lines: ['NEL', 'CCL'], isInterchange: true },
  'SKG': { name: 'Sengkang', codes: ['NE16'], lines: ['NEL'], isInterchange: false },
  'PGL': { name: 'Punggol', codes: ['NE17'], lines: ['NEL'], isInterchange: false },
  'WDL': { name: 'Woodlands', codes: ['NS9', 'TE2'], lines: ['NSL', 'TEL'], isInterchange: true },
  'MSP': { name: 'Marina South Pier', codes: ['NS28'], lines: ['NSL'], isInterchange: false },
};

// Line connections (simplified for key routes)
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
    ['DBG', 'BSH'], ['BSH', 'SER'], ['SER', 'PYL'], ['PYL', 'BNV'],
    ['BNV', 'MRB']
  ],
  NEL: [
    ['HBF', 'OTP'], ['OTP', 'DBG'], ['DBG', 'SER'], ['SER', 'SKG'], ['SKG', 'PGL']
  ]
};

const SVGMapGenerator: React.FC<SVGMapGeneratorProps> = ({ 
  onStationClick, 
  showLabels = true, 
  selectedLines = [],
  className = ""
}) => {
  
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
        name_translations: {},
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
    <div className={`w-full bg-white rounded-xl shadow-2xl overflow-hidden ${className}`}>
      <svg 
        viewBox="0 0 700 500" 
        className="w-full h-full"
        style={{ minHeight: '600px' }}
      >
        {/* Elegant background */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>
        
        <rect width="700" height="500" fill="url(#bgGradient)" />
        
        {/* Draw line segments */}
        {Object.entries(LINE_CONNECTIONS).map(([lineId, segments]) => {
          if (selectedLines.length > 0 && !selectedLines.includes(lineId)) return null;
          
          return (
            <g key={lineId}>
              {segments.map(([from, to], index) => {
            const fromPos = STATION_POSITIONS[from as keyof typeof STATION_POSITIONS];
            const toPos = STATION_POSITIONS[to as keyof typeof STATION_POSITIONS];
                if (!fromPos || !toPos) return null;

                return (
                  <line
                    key={`${lineId}-${index}`}
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={toPos.x}
                    y2={toPos.y}
                    stroke={OFFICIAL_COLORS[lineId as keyof typeof OFFICIAL_COLORS]}
                    strokeWidth="6"
                    strokeLinecap="round"
                    filter="url(#shadow)"
                    className="transition-all duration-300"
                  />
                );
              })}
            </g>
          );
        })}

        {/* Draw stations */}
        {filteredStations.map(stationId => {
          const position = STATION_POSITIONS[stationId as keyof typeof STATION_POSITIONS];
          const data = STATION_DATA[stationId];
          if (!position || !data) return null;

          const primaryLine = data.lines[0];
          const stationColor = OFFICIAL_COLORS[primaryLine as keyof typeof OFFICIAL_COLORS] || '#64748b';

          return (
            <g key={stationId}>
              {/* Station circle */}
              <circle
                cx={position.x}
                cy={position.y}
                r={data.isInterchange ? 10 : 6}
                fill="white"
                stroke={stationColor}
                strokeWidth={data.isInterchange ? 3 : 2}
                filter="url(#shadow)"
                className="cursor-pointer transition-all duration-200 hover:scale-125 hover:stroke-4"
                onClick={() => handleStationClick(stationId)}
              />
              
              {/* Interchange indicator */}
              {data.isInterchange && (
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={4}
                  fill={stationColor}
                  className="pointer-events-none"
                />
              )}

              {/* Station labels */}
              {showLabels && (
                <g className="pointer-events-none">
                  {/* Label background */}
                  <rect
                    x={position.x + 12}
                    y={position.y - 8}
                    width={data.name.length * 5.5 + 6}
                    height="16"
                    fill="white"
                    fillOpacity="0.95"
                    rx="2"
                    stroke="#e2e8f0"
                    strokeWidth="0.5"
                    filter="url(#shadow)"
                  />
                  {/* Station name */}
                  <text
                    x={position.x + 15}
                    y={position.y + 2}
                    fontSize="9"
                    fontWeight="600"
                    fill="#1e293b"
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    {data.name}
                  </text>
                  {/* Station codes */}
                  {data.codes.length > 0 && (
                    <text
                      x={position.x + 15}
                      y={position.y + 12}
                      fontSize="7"
                      fill="#64748b"
                      fontFamily="monospace"
                    >
                      {data.codes.join('•')}
                    </text>
                  )}
                </g>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(20, 350)">
          <rect x="0" y="0" width="180" height="140" fill="white" fillOpacity="0.98" rx="8" 
                stroke="#e2e8f0" strokeWidth="1" filter="url(#shadow)"/>
          <text x="10" y="20" fontSize="12" fontWeight="bold" fill="#1e293b">Singapore MRT Lines</text>
          
          {Object.entries(OFFICIAL_COLORS).map(([lineId, color], index) => {
            const lineNames = {
              NSL: 'North-South',
              EWL: 'East-West', 
              CCL: 'Circle',
              NEL: 'North East',
              DTL: 'Downtown',
              TEL: 'Thomson-East Coast'
            };
            
            return (
              <g key={lineId} transform={`translate(10, ${30 + index * 18})`}>
                <rect x="0" y="0" width="16" height="3" fill={color} rx="1.5"/>
                <text x="22" y="6" fontSize="9" fill="#374151" fontWeight="500">
                  {lineId} - {lineNames[lineId as keyof typeof lineNames]}
                </text>
              </g>
            );
          })}
        </g>

        {/* Title */}
        <g transform="translate(350, 30)">
          <text x="0" y="0" fontSize="18" fontWeight="bold" fill="#1e293b" textAnchor="middle">
            Singapore MRT Network
          </text>
          <text x="0" y="18" fontSize="10" fill="#64748b" textAnchor="middle">
            Schematic Representation • Based on Official LTA Data
          </text>
        </g>
      </svg>
    </div>
  );
};

export default SVGMapGenerator;