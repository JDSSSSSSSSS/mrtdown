import React, { useState, useEffect, useMemo } from 'react';
import { Station, MRTLine, Connection } from '../data/mrtData';
import { loadOfficialMRTData } from '../data/aggregateOfficialData';

interface OfficialLTAMapProps {
  onStationClick?: (station: Station) => void;
  showLabels?: boolean;
  selectedLines?: string[];
  className?: string;
}

// Official LTA Map Layout - Proper Schematic Positioning
const OFFICIAL_LAYOUT = {
  // Map dimensions for proper spacing
  WIDTH: 1400,
  HEIGHT: 1000,
  MARGIN: 80,
  
  // Station sizing
  STATION_SIZE: {
    REGULAR: 8,
    INTERCHANGE_MINOR: 12,
    INTERCHANGE_MAJOR: 16,
  },
  
  // Line styling
  LINE_WIDTH: {
    MRT: 8,
    LRT: 5,
    FUTURE: 6,
  },
  
  // Grid spacing for schematic layout
  GRID_SIZE: 40,
};

// Official LTA Colors (exact hex codes)
const OFFICIAL_COLORS = {
  NSL: '#D71920', // North-South Line (Red)
  EWL: '#009739', // East-West Line (Green)
  CCL: '#FA9E0D', // Circle Line (Orange)
  NEL: '#9900AA', // North East Line (Purple)
  DTL: '#005EC4', // Downtown Line (Blue)
  TEL: '#9D5B25', // Thomson-East Coast Line (Brown)
  JRL: '#0099AA', // Jurong Region Line (Teal)
  CRL: '#97C616', // Cross Island Line (Lime)
  BPLRT: '#748477', // Bukit Panjang LRT (Grey-Green)
  SKLRT: '#748477', // Sengkang LRT (Grey-Green)
  PGLRT: '#748477', // Punggol LRT (Grey-Green)
};

// Proper schematic positions matching official LTA map layout
const SCHEMATIC_POSITIONS: Record<string, { x: number; y: number }> = {
  // North-South Line (Main vertical spine)
  'JUR': { x: 300, y: 850 }, // NS1/EW24
  'BBT': { x: 300, y: 810 },
  'BGK': { x: 300, y: 770 },
  'CCK': { x: 300, y: 730 },
  'YWT': { x: 300, y: 690 },
  'KRJ': { x: 300, y: 650 },
  'MSL': { x: 300, y: 610 },
  'WDL': { x: 300, y: 570 },
  'ADM': { x: 300, y: 530 },
  'SBW': { x: 300, y: 490 },
  'CBR': { x: 300, y: 450 },
  'YIS': { x: 300, y: 410 },
  'KTB': { x: 300, y: 370 },
  'YCK': { x: 300, y: 330 },
  'AMK': { x: 300, y: 290 },
  'BSH': { x: 300, y: 250 }, // NS17/CC15
  'BDL': { x: 300, y: 210 },
  'TPY': { x: 300, y: 170 },
  'NOV': { x: 300, y: 130 },
  'NEW': { x: 300, y: 90 }, // NS21/DT11
  'ORC': { x: 300, y: 50 }, // NS22/TE14
  'SOM': { x: 300, y: 10 },
  'DBG': { x: 300, y: -30 }, // NS24/NE6/CC1
  'CTH': { x: 300, y: -70 }, // NS25/EW13
  'RFP': { x: 300, y: -110 }, // NS26/EW14
  'MRB': { x: 300, y: -150 }, // NS27/CE2
  'MSP': { x: 300, y: -190 },

  // East-West Line (Main horizontal spine)
  'PSR': { x: 1200, y: -70 },
  'TAM': { x: 1160, y: -70 }, // EW2/DT32
  'SIM': { x: 1120, y: -70 },
  'TNM': { x: 1080, y: -70 }, // Branch point
  'BDK': { x: 1040, y: -70 },
  'KEM': { x: 1000, y: -70 },
  'EUN': { x: 960, y: -70 },
  'PYL': { x: 920, y: -70 }, // EW8/CC9
  'ALJ': { x: 880, y: -70 },
  'KAL': { x: 840, y: -70 },
  'LVR': { x: 800, y: -70 },
  'BGS': { x: 760, y: -70 }, // EW12/DT14
  'TGP': { x: 720, y: -70 },
  'OTP': { x: 680, y: -70 }, // EW16/NE3/TE17
  'TIB': { x: 640, y: -70 },
  'RDH': { x: 600, y: -70 },
  'QUE': { x: 560, y: -70 },
  'COM': { x: 520, y: -70 },
  'BNV': { x: 480, y: -70 }, // EW21/CC22
  'DVR': { x: 440, y: -70 },
  'CLE': { x: 400, y: -70 },
  // JUR already positioned
  'LKS': { x: 260, y: 850 },
  'BLY': { x: 220, y: 850 },
  'PNR': { x: 180, y: 850 },
  'JKN': { x: 140, y: 850 },
  'GUL': { x: 100, y: 850 },
  'TCR': { x: 60, y: 850 },
  'TWR': { x: 20, y: 850 },
  'TLK': { x: -20, y: 850 },

  // Changi Airport Branch
  'EXP': { x: 1080, y: -30 }, // CG1/DT35
  'CG1': { x: 1120, y: -30 },
  'CG2': { x: 1160, y: -30 },

  // Circle Line (Circular around city center)
  'HBF': { x: 400, y: 200 }, // NE1/CC29
  'BBS': { x: 450, y: 150 }, // CE1/DT16
  'EPN': { x: 500, y: 100 },
  'PMN': { x: 550, y: 50 }, // CC4/DT15
  'NCH': { x: 600, y: 0 },
  'SDM': { x: 650, y: -50 },
  'MBT': { x: 700, y: -100 },
  'DKT': { x: 750, y: -150 },
  // PYL already positioned
  'MPS': { x: 850, y: -200 }, // CC10/DT26
  'TSG': { x: 800, y: -250 },
  'BTL': { x: 750, y: -300 },
  'SER': { x: 700, y: -350 }, // CC13/NE12
  'LRC': { x: 650, y: -400 },
  // BSH already positioned
  'MRM': { x: 550, y: -450 },
  'CDT': { x: 500, y: -500 }, // CC17/TE9
  'UTM': { x: 450, y: -550 }, // CC19/DT9
  // BNV already positioned
  'GWD': { x: 350, y: -350 }, // TE15
  'HVL': { x: 320, y: -300 }, // TE16
  'MXW': { x: 280, y: -250 }, // TE18
  'STW': { x: 250, y: -200 }, // TE19

  // North East Line (Diagonal from SW to NE)
  // HBF already positioned
  // OTP already positioned
  'CTN': { x: 620, y: -30 }, // NE4/DT19
  'CQY': { x: 580, y: 10 },
  // DBG already positioned
  'LTI': { x: 350, y: 50 }, // NE7/DT12
  'FRP': { x: 400, y: 90 },
  'BKG': { x: 450, y: 130 },
  'PTR': { x: 500, y: 170 }, // NE10
  // WDL connection point
  // SER already positioned
  'KVN': { x: 600, y: -450 },
  'HGN': { x: 650, y: -500 },
  'SKG': { x: 750, y: -600 }, // NE16/STC
  'PGL': { x: 800, y: -650 }, // NE17/PTC
  'STC': { x: 850, y: -700 },

  // Downtown Line (Complex multi-segment route)
  'BPJ': { x: 150, y: 400 }, // DT1/BP6
  'CSW': { x: 190, y: 360 },
  'HLV': { x: 230, y: 320 },
  'HME': { x: 270, y: 280 },
  'BTW': { x: 310, y: 240 },
  'KAP': { x: 350, y: 200 },
  'STH': { x: 390, y: 160 },
  'TKK': { x: 430, y: 120 },
  'BTG': { x: 470, y: 80 }, // DT10/TE11
  // UTM already positioned
  // NEW already positioned
  // LTI already positioned
  'RCR': { x: 390, y: 10 },
  // BGS already positioned
  // PMN already positioned
  // BBS already positioned
  'DTN': { x: 400, y: -150 },
  'TLA': { x: 440, y: -110 },
  // CTN already positioned
  'FCN': { x: 520, y: -110 },
  'BCL': { x: 560, y: -150 },
  'JLB': { x: 600, y: -190 },
  'BDM': { x: 640, y: -230 },
  'GBH': { x: 680, y: -270 },
  'MTR': { x: 720, y: -310 },
  // MPS already positioned
  'UBI': { x: 890, y: -240 },
  'KKB': { x: 930, y: -280 },
  'BDN': { x: 970, y: -320 },
  'BDR': { x: 1010, y: -360 },
  'TPW': { x: 1050, y: -400 },
  // TAM already positioned
  'TPE': { x: 1200, y: -110 },
  'UPC': { x: 1160, y: -150 },
  // EXP already positioned

  // Thomson-East Coast Line (Complex route)
  'WDN': { x: 300, y: 610 },
  'SPR': { x: 340, y: 570 },
  'LEN': { x: 380, y: 530 },
  'MYW': { x: 420, y: 490 },
  'BRP': { x: 460, y: 450 },
  'CAL': { x: 500, y: 410 },
  // CDT already positioned
  'SIX': { x: 540, y: -540 },
  'TAN': { x: 580, y: -580 },
  // BTG already positioned
  'NBV': { x: 260, y: -250 },
  'GBB': { x: 220, y: -200 },
  // ORC already positioned
  // GWD already positioned
  // HVL already positioned
  // OTP already positioned
  // MXW already positioned
  // STW already positioned
  // MRB already positioned
  'KTN': { x: 200, y: -150 },
  'TGH': { x: 150, y: -100 },
  'MRD': { x: 100, y: -50 },
  'MRS': { x: 50, y: 0 },
};

const OfficialLTAMap: React.FC<OfficialLTAMapProps> = ({
  onStationClick,
  showLabels = true,
  selectedLines = [],
  className = ''
}) => {
  const [data, setData] = useState<{
    stations: Station[];
    lines: MRTLine[];
    connections: Connection[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const [tooltipInfo, setTooltipInfo] = useState<{
    station: Station;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedData = await loadOfficialMRTData();
        // Apply schematic positions to stations
        const stationsWithPositions = loadedData.stations.map(station => ({
          ...station,
          position: SCHEMATIC_POSITIONS[station.id] || { x: 700, y: 500 }
        }));
        
        setData({
          ...loadedData,
          stations: stationsWithPositions
        });
      } catch (error) {
        console.error('Error loading MRT data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Generate line segments with proper routing
  const lineSegments = useMemo(() => {
    if (!data) return [];
    
    const segments: Array<{
      from: { x: number; y: number };
      to: { x: number; y: number };
      color: string;
      lineId: string;
      width: number;
    }> = [];

    data.connections.forEach(connection => {
      const fromStation = data.stations.find(s => s.id === connection.from);
      const toStation = data.stations.find(s => s.id === connection.to);

      if (fromStation?.position && toStation?.position) {
        const line = data.lines.find(l => l.id === connection.line);
        const color = OFFICIAL_COLORS[connection.line] || line?.color || '#6b7280';
        const width = line?.type === 'lrt' ? OFFICIAL_LAYOUT.LINE_WIDTH.LRT : OFFICIAL_LAYOUT.LINE_WIDTH.MRT;

        segments.push({
          from: fromStation.position,
          to: toStation.position,
          color,
          lineId: connection.line,
          width
        });
      }
    });

    return segments;
  }, [data]);

  // Filter data based on selected lines
  const filteredStations = useMemo(() => {
    if (!data || selectedLines.length === 0) return data?.stations || [];
    return data.stations.filter(station =>
      station.lines.some(line => selectedLines.includes(line))
    );
  }, [data, selectedLines]);

  const filteredSegments = useMemo(() => {
    if (selectedLines.length === 0) return lineSegments;
    return lineSegments.filter(segment => selectedLines.includes(segment.lineId));
  }, [lineSegments, selectedLines]);

  // Handle station interactions
  const handleStationHover = (station: Station, event: React.MouseEvent<SVGCircleElement>) => {
    setHoveredStation(station.id);
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipInfo({
      station,
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const handleStationLeave = () => {
    setHoveredStation(null);
    setTooltipInfo(null);
  };

  const handleStationClick = (station: Station) => {
    if (onStationClick) {
      onStationClick(station);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading Official Singapore MRT Map...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <p className="text-gray-600">Failed to load MRT data</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Map Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-green-50">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Singapore MRT & LRT System Map
        </h1>
        <p className="text-sm text-gray-600 text-center mt-1">
          Official Network Layout • {data.stations.length} Stations • {data.lines.length} Lines
        </p>
      </div>

      {/* Main Map */}
      <div className="relative overflow-auto bg-gradient-to-br from-gray-50 to-blue-50" style={{ height: '800px' }}>
        <svg
          width={OFFICIAL_LAYOUT.WIDTH}
          height={OFFICIAL_LAYOUT.HEIGHT}
          viewBox={`0 0 ${OFFICIAL_LAYOUT.WIDTH} ${OFFICIAL_LAYOUT.HEIGHT}`}
          className="w-full h-full cursor-move"
          style={{ minWidth: '1400px', minHeight: '1000px' }}
        >
          {/* Background grid (subtle) */}
          <defs>
            <pattern id="grid" width={OFFICIAL_LAYOUT.GRID_SIZE} height={OFFICIAL_LAYOUT.GRID_SIZE} patternUnits="userSpaceOnUse">
              <path 
                d={`M ${OFFICIAL_LAYOUT.GRID_SIZE} 0 L 0 0 0 ${OFFICIAL_LAYOUT.GRID_SIZE}`} 
                fill="none" 
                stroke="#f0f0f0" 
                strokeWidth="0.5" 
                opacity="0.3"
              />
            </pattern>
            
            {/* Station glow effects */}
            <filter id="stationGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Line segments */}
          <g className="lines">
            {filteredSegments.map((segment, index) => (
              <line
                key={`segment-${index}`}
                x1={segment.from.x + OFFICIAL_LAYOUT.MARGIN}
                y1={segment.from.y + OFFICIAL_LAYOUT.HEIGHT / 2}
                x2={segment.to.x + OFFICIAL_LAYOUT.MARGIN}
                y2={segment.to.y + OFFICIAL_LAYOUT.HEIGHT / 2}
                stroke={segment.color}
                strokeWidth={segment.width}
                strokeLinecap="round"
                className="transition-opacity duration-200"
                opacity={selectedLines.length === 0 || selectedLines.includes(segment.lineId) ? 1 : 0.2}
              />
            ))}
          </g>

          {/* Station circles */}
          <g className="stations">
            {filteredStations.map((station) => {
              if (!station.position) return null;
              
              const isInterchange = station.lines.length > 1;
              const isMajorInterchange = station.lines.length >= 3;
              const isHovered = hoveredStation === station.id;
              
              const radius = isMajorInterchange 
                ? OFFICIAL_LAYOUT.STATION_SIZE.INTERCHANGE_MAJOR
                : isInterchange 
                  ? OFFICIAL_LAYOUT.STATION_SIZE.INTERCHANGE_MINOR
                  : OFFICIAL_LAYOUT.STATION_SIZE.REGULAR;

              const strokeColor = station.lines.length === 1 
                ? OFFICIAL_COLORS[station.lines[0]] || '#666'
                : '#000';

              return (
                <g key={station.id}>
                  {/* Station circle */}
                  <circle
                    cx={station.position.x + OFFICIAL_LAYOUT.MARGIN}
                    cy={station.position.y + OFFICIAL_LAYOUT.HEIGHT / 2}
                    r={radius}
                    fill="white"
                    stroke={strokeColor}
                    strokeWidth={isInterchange ? 3 : 2}
                    className={`cursor-pointer transition-all duration-200 ${
                      isHovered ? 'filter drop-shadow-lg' : ''
                    }`}
                    style={{
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                      transformOrigin: `${station.position.x + OFFICIAL_LAYOUT.MARGIN}px ${station.position.y + OFFICIAL_LAYOUT.HEIGHT / 2}px`
                    }}
                    filter={isHovered ? "url(#stationGlow)" : undefined}
                    onMouseEnter={(e) => handleStationHover(station, e)}
                    onMouseLeave={handleStationLeave}
                    onClick={() => handleStationClick(station)}
                  />

                  {/* Multi-line indicators for interchanges */}
                  {isInterchange && (
                    <g>
                      {station.lines.slice(0, 3).map((lineId, index) => {
                        const angle = (index * 120) - 90; // Distribute around circle
                        const indicatorRadius = radius + 8;
                        const x = station.position!.x + OFFICIAL_LAYOUT.MARGIN + indicatorRadius * Math.cos(angle * Math.PI / 180);
                        const y = station.position!.y + OFFICIAL_LAYOUT.HEIGHT / 2 + indicatorRadius * Math.sin(angle * Math.PI / 180);
                        
                        return (
                          <circle
                            key={`${station.id}-${lineId}-${index}`}
                            cx={x}
                            cy={y}
                            r={3}
                            fill={OFFICIAL_COLORS[lineId] || '#666'}
                            stroke="white"
                            strokeWidth={1}
                          />
                        );
                      })}
                    </g>
                  )}

                  {/* Station labels */}
                  {showLabels && (
                    <text
                      x={station.position.x + OFFICIAL_LAYOUT.MARGIN + radius + 12}
                      y={station.position.y + OFFICIAL_LAYOUT.HEIGHT / 2 + 4}
                      fontSize={isInterchange ? 12 : 10}
                      fontWeight={isInterchange ? 600 : 400}
                      fill="#1f2937"
                      className="pointer-events-none select-none"
                      style={{
                        textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
                      }}
                    >
                      {station.name}
                    </text>
                  )}

                  {/* Station codes for interchanges */}
                  {showLabels && isInterchange && (
                    <text
                      x={station.position.x + OFFICIAL_LAYOUT.MARGIN + radius + 12}
                      y={station.position.y + OFFICIAL_LAYOUT.HEIGHT / 2 + 18}
                      fontSize={8}
                      fontWeight={400}
                      fill="#6b7280"
                      className="pointer-events-none select-none"
                    >
                      {station.codes.join(' • ')}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Legend */}
          <g className="legend" transform={`translate(50, ${OFFICIAL_LAYOUT.HEIGHT - 200})`}>
            <rect x="0" y="0" width="300" height="180" fill="white" fillOpacity="0.95" rx="8" stroke="#e5e7eb" strokeWidth="1"/>
            <text x="15" y="25" fontSize="14" fontWeight="600" fill="#374151">MRT & LRT Lines</text>
            
            {data.lines.slice(0, 8).map((line, index) => {
              const y = 45 + index * 18;
              const isVisible = selectedLines.length === 0 || selectedLines.includes(line.id);
              
              return (
                <g key={line.id} opacity={isVisible ? 1 : 0.4}>
                  <line 
                    x1="15" 
                    y1={y} 
                    x2="35" 
                    y2={y} 
                    stroke={OFFICIAL_COLORS[line.id] || line.color} 
                    strokeWidth="4" 
                    strokeLinecap="round"
                  />
                  <text x="45" y={y + 4} fontSize="11" fill="#374151">{line.id}</text>
                  <text x="75" y={y + 4} fontSize="10" fill="#6b7280">
                    {line.name.replace(' Line', '').replace('Thomson–East Coast', 'Thomson-E.Coast')}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Compass */}
          <g className="compass" transform={`translate(${OFFICIAL_LAYOUT.WIDTH - 80}, 80)`}>
            <circle cx="0" cy="0" r="25" fill="white" fillOpacity="0.9" stroke="#e5e7eb"/>
            <path d="M 0,-18 L 6,0 L 0,18 L -6,0 Z" fill="#dc2626"/>
            <text x="0" y="-30" fontSize="10" textAnchor="middle" fill="#374151" fontWeight="600">N</text>
          </g>
        </svg>
      </div>

      {/* Tooltip */}
      {tooltipInfo && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-3 pointer-events-none"
          style={{
            left: tooltipInfo.x,
            top: tooltipInfo.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="text-sm font-semibold text-gray-900">{tooltipInfo.station.name}</div>
          <div className="text-xs text-gray-600 mt-1">
            {tooltipInfo.station.codes.join(' • ')}
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-gray-500">Lines:</span>
            {tooltipInfo.station.lines.map(lineId => (
              <div
                key={lineId}
                className="w-3 h-2 rounded"
                style={{ backgroundColor: OFFICIAL_COLORS[lineId] }}
                title={data?.lines.find(l => l.id === lineId)?.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Operational
            </span>
            <span>{filteredStations.length} stations shown</span>
            <span>{data.lines.length} lines total</span>
          </div>
          <div className="text-xs text-gray-500">
            Based on official LTA network data • Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialLTAMap;
