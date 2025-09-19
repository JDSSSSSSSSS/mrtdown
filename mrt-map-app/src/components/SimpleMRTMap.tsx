import React, { useState } from 'react';
import { Station } from '../data/mrtData';

interface SimpleMRTMapProps {
  onStationClick?: (station: Station) => void;
  showLabels?: boolean;
  selectedLines?: string[];
  className?: string;
}

// Simplified Official Colors
const LINE_COLORS = {
  NSL: '#d42e12', // Red
  EWL: '#009645', // Green  
  CCL: '#fa9e0d', // Orange
  NEL: '#9900aa', // Purple
  DTL: '#005ec4', // Blue
  TEL: '#9D5B25', // Brown
} as const;

// Core station positions - simplified schematic layout
const STATIONS = {
  // Major interchanges positioned strategically
  'JUR': { x: 100, y: 400, name: 'Jurong East', codes: ['NS1', 'EW24'], lines: ['NSL', 'EWL'], isInterchange: true },
  'DBG': { x: 300, y: 200, name: 'Dhoby Ghaut', codes: ['NS24', 'NE6', 'CC1'], lines: ['NSL', 'NEL', 'CCL'], isInterchange: true },
  'CTH': { x: 300, y: 180, name: 'City Hall', codes: ['NS25', 'EW13'], lines: ['NSL', 'EWL'], isInterchange: true },
  'RFP': { x: 300, y: 160, name: 'Raffles Place', codes: ['NS26', 'EW14'], lines: ['NSL', 'EWL'], isInterchange: true },
  'MRB': { x: 300, y: 140, name: 'Marina Bay', codes: ['NS27', 'CC29', 'TE20'], lines: ['NSL', 'CCL', 'TEL'], isInterchange: true },
  'OTP': { x: 250, y: 180, name: 'Outram Park', codes: ['EW16', 'NE3', 'TE17'], lines: ['EWL', 'NEL', 'TEL'], isInterchange: true },
  'BGS': { x: 350, y: 180, name: 'Bugis', codes: ['EW12', 'DT14'], lines: ['EWL', 'DTL'], isInterchange: true },
  'TAM': { x: 500, y: 180, name: 'Tampines', codes: ['EW2', 'DT32'], lines: ['EWL', 'DTL'], isInterchange: true },
  'BSH': { x: 300, y: 250, name: 'Bishan', codes: ['NS17', 'CC15'], lines: ['NSL', 'CCL'], isInterchange: true },
  'SER': { x: 400, y: 280, name: 'Serangoon', codes: ['NE12', 'CC13'], lines: ['NEL', 'CCL'], isInterchange: true },
  'NEW': { x: 300, y: 220, name: 'Newton', codes: ['NS21', 'DT11'], lines: ['NSL', 'DTL'], isInterchange: true },
  'ORC': { x: 300, y: 240, name: 'Orchard', codes: ['NS22', 'TE14'], lines: ['NSL', 'TEL'], isInterchange: true },
  
  // Regular stations
  'PSR': { x: 550, y: 180, name: 'Pasir Ris', codes: ['EW1'], lines: ['EWL'], isInterchange: false },
  'CLE': { x: 50, y: 380, name: 'Clementi', codes: ['EW23'], lines: ['EWL'], isInterchange: false },
  'HBF': { x: 200, y: 120, name: 'HarbourFront', codes: ['NE1', 'CC29'], lines: ['NEL', 'CCL'], isInterchange: true },
  'WDL': { x: 280, y: 300, name: 'Woodlands', codes: ['NS9', 'TE2'], lines: ['NSL', 'TEL'], isInterchange: true },
  'MSP': { x: 300, y: 120, name: 'Marina South Pier', codes: ['NS28'], lines: ['NSL'], isInterchange: false },
  'AMK': { x: 300, y: 280, name: 'Ang Mo Kio', codes: ['NS16'], lines: ['NSL'], isInterchange: false },
  'TPY': { x: 300, y: 260, name: 'Toa Payoh', codes: ['NS19'], lines: ['NSL'], isInterchange: false },
  'NOV': { x: 300, y: 230, name: 'Novena', codes: ['NS20'], lines: ['NSL'], isInterchange: false },
  'SOM': { x: 300, y: 210, name: 'Somerset', codes: ['NS23'], lines: ['NSL'], isInterchange: false },
};

// Simplified line connections
const LINE_SEGMENTS = [
  // North-South Line (vertical backbone)
  { from: 'JUR', to: 'NEW', color: LINE_COLORS.NSL, line: 'NSL' },
  { from: 'NEW', to: 'ORC', color: LINE_COLORS.NSL, line: 'NSL' },
  { from: 'ORC', to: 'SOM', color: LINE_COLORS.NSL, line: 'NSL' },
  { from: 'SOM', to: 'DBG', color: LINE_COLORS.NSL, line: 'NSL' },
  { from: 'DBG', to: 'CTH', color: LINE_COLORS.NSL, line: 'NSL' },
  { from: 'CTH', to: 'RFP', color: LINE_COLORS.NSL, line: 'NSL' },
  { from: 'RFP', to: 'MRB', color: LINE_COLORS.NSL, line: 'NSL' },
  { from: 'MRB', to: 'MSP', color: LINE_COLORS.NSL, line: 'NSL' },
  
  // East-West Line (horizontal)
  { from: 'PSR', to: 'TAM', color: LINE_COLORS.EWL, line: 'EWL' },
  { from: 'TAM', to: 'BGS', color: LINE_COLORS.EWL, line: 'EWL' },
  { from: 'BGS', to: 'CTH', color: LINE_COLORS.EWL, line: 'EWL' },
  { from: 'CTH', to: 'OTP', color: LINE_COLORS.EWL, line: 'EWL' },
  { from: 'OTP', to: 'CLE', color: LINE_COLORS.EWL, line: 'EWL' },
  { from: 'CLE', to: 'JUR', color: LINE_COLORS.EWL, line: 'EWL' },
  
  // Circle Line (partial circle)
  { from: 'DBG', to: 'BSH', color: LINE_COLORS.CCL, line: 'CCL' },
  { from: 'BSH', to: 'SER', color: LINE_COLORS.CCL, line: 'CCL' },
  { from: 'SER', to: 'HBF', color: LINE_COLORS.CCL, line: 'CCL' },
  { from: 'HBF', to: 'MRB', color: LINE_COLORS.CCL, line: 'CCL' },
  
  // North East Line (diagonal)
  { from: 'HBF', to: 'OTP', color: LINE_COLORS.NEL, line: 'NEL' },
  { from: 'OTP', to: 'DBG', color: LINE_COLORS.NEL, line: 'NEL' },
  { from: 'DBG', to: 'SER', color: LINE_COLORS.NEL, line: 'NEL' },
  
  // Downtown Line (curved)
  { from: 'NEW', to: 'BGS', color: LINE_COLORS.DTL, line: 'DTL' },
  { from: 'BGS', to: 'TAM', color: LINE_COLORS.DTL, line: 'DTL' },
  
  // Thomson-East Coast Line
  { from: 'WDL', to: 'ORC', color: LINE_COLORS.TEL, line: 'TEL' },
  { from: 'ORC', to: 'OTP', color: LINE_COLORS.TEL, line: 'TEL' },
  { from: 'OTP', to: 'MRB', color: LINE_COLORS.TEL, line: 'TEL' },
];

const SimpleMRTMap: React.FC<SimpleMRTMapProps> = ({ 
  onStationClick, 
  showLabels = true, 
  selectedLines = [],
  className = ""
}) => {
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);

  const handleStationClick = (stationId: string) => {
    const stationData = STATIONS[stationId as keyof typeof STATIONS];
    if (stationData && onStationClick) {
      const station: Station = {
        id: stationId,
        name: stationData.name,
        name_translations: {},
        codes: stationData.codes,
        lines: stationData.lines,
        coordinates: { lat: 0, lng: 0 },
        isInterchange: stationData.isInterchange,
        structureType: 'underground',
        town: stationData.name,
        landmarks: []
      };
      onStationClick(station);
    }
  };

  const visibleSegments = selectedLines.length === 0 
    ? LINE_SEGMENTS 
    : LINE_SEGMENTS.filter(segment => selectedLines.includes(segment.line));

  const visibleStations = selectedLines.length === 0
    ? Object.keys(STATIONS)
    : Object.keys(STATIONS).filter(stationId => 
        STATIONS[stationId as keyof typeof STATIONS].lines.some(line => selectedLines.includes(line))
      );

  return (
    <div className={`w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-2xl shadow-xl overflow-hidden ${className}`}>
      <svg 
        viewBox="0 0 600 450" 
        className="w-full h-full transition-all duration-500 ease-out"
        style={{ minHeight: '400px' }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background */}
        <rect width="600" height="450" fill="#f8fafc" />
        
        {/* Grid pattern */}
        <defs>
          <pattern id="simpleGrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
          
          <filter id="simpleShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.2"/>
          </filter>
        </defs>
        
        <rect width="600" height="450" fill="url(#simpleGrid)" />
        
        {/* Title */}
        <text x="300" y="30" fontSize="18" fontWeight="bold" fill="#1e293b" textAnchor="middle" fontFamily="system-ui, sans-serif">
          Singapore MRT Network
        </text>
        
        {/* Line segments */}
        {visibleSegments.map((segment, index) => {
          const fromStation = STATIONS[segment.from as keyof typeof STATIONS];
          const toStation = STATIONS[segment.to as keyof typeof STATIONS];
          
          if (!fromStation || !toStation) return null;
          
          return (
            <line
              key={index}
              x1={fromStation.x}
              y1={fromStation.y}
              x2={toStation.x}
              y2={toStation.y}
              stroke={segment.color}
              strokeWidth="6"
              strokeLinecap="round"
              className="transition-opacity duration-300"
              style={{ opacity: selectedLines.length === 0 || selectedLines.includes(segment.line) ? 0.9 : 0.3 }}
            />
          );
        })}
        
        {/* Stations */}
        {visibleStations.map(stationId => {
          const station = STATIONS[stationId as keyof typeof STATIONS];
          const isHovered = hoveredStation === stationId;
          const isVisible = selectedLines.length === 0 || 
                           station.lines.some(line => selectedLines.includes(line));
          
          return (
            <g key={stationId}>
              {/* Station circle */}
              <circle
                cx={station.x}
                cy={station.y}
                r={station.isInterchange ? 10 : 6}
                fill="white"
                stroke={LINE_COLORS[station.lines[0] as keyof typeof LINE_COLORS] || '#64748b'}
                strokeWidth={station.isInterchange ? 3 : 2}
                filter="url(#simpleShadow)"
                className={`cursor-pointer transition-all duration-200 ${
                  isHovered ? 'scale-125' : 'scale-100'
                }`}
                style={{
                  opacity: isVisible ? 1 : 0.3,
                  transformOrigin: `${station.x}px ${station.y}px`
                }}
                onClick={() => handleStationClick(stationId)}
                onMouseEnter={() => setHoveredStation(stationId)}
                onMouseLeave={() => setHoveredStation(null)}
              />
              
              {/* Interchange indicator */}
              {station.isInterchange && (
                <circle
                  cx={station.x}
                  cy={station.y}
                  r={4}
                  fill={LINE_COLORS[station.lines[0] as keyof typeof LINE_COLORS] || '#64748b'}
                  className="pointer-events-none"
                  style={{ opacity: isVisible ? 0.8 : 0.3 }}
                />
              )}
              
              {/* Station labels */}
              {showLabels && (
                <g className="pointer-events-none">
                  {/* Label background */}
                  <rect
                    x={station.x + (station.isInterchange ? 14 : 10)}
                    y={station.y - 10}
                    width={station.name.length * 6 + 8}
                    height="20"
                    fill="white"
                    fillOpacity="0.95"
                    rx="4"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    style={{ opacity: isVisible ? 1 : 0.4 }}
                  />
                  
                  {/* Station name */}
                  <text
                    x={station.x + (station.isInterchange ? 18 : 14)}
                    y={station.y + 1}
                    fontSize={station.isInterchange ? "9" : "8"}
                    fontWeight="600"
                    fill="#1e293b"
                    fontFamily="system-ui, sans-serif"
                    style={{ opacity: isVisible ? 1 : 0.4 }}
                  >
                    {station.name}
                  </text>
                  
                  {/* Station codes */}
                  <text
                    x={station.x + (station.isInterchange ? 18 : 14)}
                    y={station.y + 12}
                    fontSize="7"
                    fill="#64748b"
                    fontFamily="monospace"
                    style={{ opacity: isVisible ? 0.8 : 0.3 }}
                  >
                    {station.codes.join(' ')}
                  </text>
                </g>
              )}
            </g>
          );
        })}
        
        {/* Legend */}
        <g transform="translate(20, 350)">
          <rect x="0" y="0" width="180" height="90" fill="white" fillOpacity="0.98" rx="8" stroke="#e2e8f0" strokeWidth="1" filter="url(#simpleShadow)"/>
          <text x="10" y="20" fontSize="12" fontWeight="bold" fill="#1e293b" fontFamily="system-ui, sans-serif">
            MRT Lines
          </text>
          
          {Object.entries(LINE_COLORS).map(([lineId, color], index) => {
            const lineNames = {
              NSL: 'North-South',
              EWL: 'East-West', 
              CCL: 'Circle',
              NEL: 'North East',
              DTL: 'Downtown',
              TEL: 'Thomson-East Coast'
            };
            
            const isSelected = selectedLines.length === 0 || selectedLines.includes(lineId);
            
            return (
              <g key={lineId} transform={`translate(10, ${30 + index * 12})`} 
                 style={{ opacity: isSelected ? 1 : 0.4 }}>
                <rect x="0" y="0" width="16" height="3" fill={color} rx="1"/>
                <text x="22" y="6" fontSize="8" fill="#374151" fontWeight="500"
                      fontFamily="system-ui, sans-serif">
                  {lineId} - {lineNames[lineId as keyof typeof lineNames]}
                </text>
              </g>
            );
          })}
        </g>
        
        {/* Footer */}
        <text x="300" y="430" fontSize="10" fill="#64748b" textAnchor="middle" fontFamily="system-ui, sans-serif">
          Simplified Singapore MRT Network • Based on Official LTA Data
        </text>
      </svg>
    </div>
  );
};

export default SimpleMRTMap;
