import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Station, MRTLine, Connection } from '../data/mrtData';
import { loadOfficialMRTData } from '../data/aggregateOfficialData';

interface EnhancedMRTMapProps {
  onStationClick?: (station: Station) => void;
  showLabels?: boolean;
  selectedLines?: string[];
  className?: string;
}

// Enhanced layout inspired by Metro Map Maker's precision + Rail Art's smoothness
const MAP_CONFIG = {
  // Optimized canvas for readability and user-friendliness
  WIDTH: 2000,
  HEIGHT: 1400,
  MARGIN: 120,
  
  // Grid system for schematic accuracy with proper spacing
  GRID_SIZE: 40, // Increased for better readability
  SNAP_TOLERANCE: 20,
  
  // Station styles with better visual hierarchy
  STATION_STYLES: {
    REGULAR: { radius: 7, strokeWidth: 2.5, shape: 'circle' },
    INTERCHANGE_MINOR: { radius: 10, strokeWidth: 3.5, shape: 'circle' },
    INTERCHANGE_MAJOR: { radius: 14, strokeWidth: 4.5, shape: 'circle' },
    TERMINAL: { radius: 9, strokeWidth: 3.5, shape: 'square' },
    AIRPORT: { radius: 12, strokeWidth: 4, shape: 'diamond' },
    LRT_STATION: { radius: 5, strokeWidth: 2, shape: 'circle' },
  },
  
  // Line widths optimized for clarity
  LINE_WIDTHS: {
    MRT_MAIN: 12, // Thicker for main lines
    MRT_BRANCH: 10,
    LRT: 7, // Thinner but still visible
    FUTURE: 8,
    CONNECTION: 5,
  },
  
  // Smooth animations inspired by Rail Art
  ANIMATION: {
    HOVER_SCALE: 1.2,
    SELECTED_SCALE: 1.3,
    TRANSITION_DURATION: '250ms',
    EASE: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Rail Art's smooth easing
  },
  
  // Spacing multipliers for different areas
  SPACING: {
    CITY_CENTER: 0.8, // Compressed for dense interchange area
    SUBURBS: 1.2, // Expanded for clarity
    LRT_AREAS: 0.6, // Compact for LRT loops
  },
};

// Official LTA Colors with enhanced contrast
const ENHANCED_COLORS: { [key: string]: string } = {
  NSL: '#D71920', // North-South Line (Red)
  EWL: '#009739', // East-West Line (Green)
  CCL: '#FA9E0D', // Circle Line (Orange)
  NEL: '#9900AA', // North East Line (Purple)
  DTL: '#005EC4', // Downtown Line (Blue)
  TEL: '#9D5B25', // Thomson-East Coast Line (Brown)
  JRL: '#0099AA', // Jurong Region Line (Teal)
  CRL: '#97C616', // Cross Island Line (Lime)
  BPLRT: '#748477', // Bukit Panjang LRT
  SKLRT: '#748477', // Sengkang LRT
  PGLRT: '#748477', // Punggol LRT
  
  // UI Colors
  BACKGROUND: '#FAFBFC',
  GRID: '#F0F4F8',
  TEXT_PRIMARY: '#1A202C',
  TEXT_SECONDARY: '#718096',
  STATION_FILL: '#FFFFFF',
  HOVER_GLOW: 'rgba(59, 130, 246, 0.3)',
};

// User-friendly schematic positions - accurate but optimized for readability
// Inspired by Metro Map Maker's precision + Rail Art's visual clarity
const PRECISION_POSITIONS: Record<string, { x: number; y: number; style?: string }> = {
  // NORTH-SOUTH LINE - Main vertical spine (optimized spacing)
  'JUR': { x: 800, y: 1100, style: 'INTERCHANGE_MAJOR' }, // NS1/EW24 - Major hub
  'BBT': { x: 800, y: 1050 }, // NS2
  'BGK': { x: 800, y: 1000 }, // NS3
  'CCK': { x: 800, y: 950, style: 'INTERCHANGE_MINOR' }, // NS4/BP1 - LRT connection
  'YWT': { x: 800, y: 900 }, // NS5
  'KRJ': { x: 800, y: 850 }, // NS7
  'MSL': { x: 800, y: 800 }, // NS8
  'WDL': { x: 800, y: 750, style: 'INTERCHANGE_MINOR' }, // NS9/TE2
  'ADM': { x: 800, y: 700 }, // NS10
  'SBW': { x: 800, y: 650 }, // NS11
  'CBR': { x: 800, y: 600 }, // NS12
  'YIS': { x: 800, y: 550 }, // NS13
  'KTB': { x: 800, y: 500 }, // NS14
  'YCK': { x: 800, y: 450 }, // NS15
  'AMK': { x: 800, y: 400 }, // NS16
  'BSH': { x: 800, y: 350, style: 'INTERCHANGE_MINOR' }, // NS17/CC15
  'BDL': { x: 800, y: 320 }, // NS18 - Compressed city center
  'TPY': { x: 800, y: 290 }, // NS19
  'NOV': { x: 800, y: 260 }, // NS20
  'NEW': { x: 800, y: 230, style: 'INTERCHANGE_MINOR' }, // NS21/DT11
  'ORC': { x: 800, y: 200, style: 'INTERCHANGE_MINOR' }, // NS22/TE14
  'SOM': { x: 800, y: 170 }, // NS23
  'DBG': { x: 800, y: 140, style: 'INTERCHANGE_MAJOR' }, // NS24/NE6/CC1 - Triple interchange
  'CTH': { x: 800, y: 110, style: 'INTERCHANGE_MAJOR' }, // NS25/EW13 - Major interchange
  'RFP': { x: 800, y: 80, style: 'INTERCHANGE_MAJOR' }, // NS26/EW14 - Major interchange
  'MRB': { x: 800, y: 50, style: 'INTERCHANGE_MAJOR' }, // NS27/CE2 - Major interchange
  'MSP': { x: 800, y: 20, style: 'TERMINAL' }, // NS28 - Southern terminal

  // EAST-WEST LINE - Main horizontal spine (expanded for clarity)
  'PSR': { x: 1700, y: 110, style: 'TERMINAL' }, // EW1 - Eastern terminal
  'TAM': { x: 1650, y: 110, style: 'INTERCHANGE_MINOR' }, // EW2/DT32
  'SIM': { x: 1600, y: 110 }, // EW3
  'TNM': { x: 1550, y: 110, style: 'INTERCHANGE_MINOR' }, // EW4 - Branch point
  'BDK': { x: 1500, y: 110 }, // EW5
  'KEM': { x: 1450, y: 110 }, // EW6
  'EUN': { x: 1400, y: 110 }, // EW7
  'PYL': { x: 1350, y: 110, style: 'INTERCHANGE_MINOR' }, // EW8/CC9
  'ALJ': { x: 1300, y: 110 }, // EW9
  'KAL': { x: 1250, y: 110 }, // EW10
  'LVR': { x: 1200, y: 110 }, // EW11
  'BGS': { x: 1150, y: 110, style: 'INTERCHANGE_MINOR' }, // EW12/DT14
  'TGP': { x: 1100, y: 110 }, // EW15
  'OTP': { x: 1050, y: 110, style: 'INTERCHANGE_MAJOR' }, // EW16/NE3/TE17 - Triple interchange
  'TIB': { x: 1000, y: 110 }, // EW17
  'RDH': { x: 950, y: 110 }, // EW18
  'QUE': { x: 900, y: 110 }, // EW19
  'COM': { x: 850, y: 110 }, // EW20
  'BNV': { x: 800, y: 110, style: 'INTERCHANGE_MINOR' }, // EW21/CC22 - Connects to NSL
  'DVR': { x: 750, y: 110 }, // EW22
  'CLE': { x: 700, y: 110 }, // EW23
  // JUR connects at (800, 1100) - bend down from EW line
  'LKS': { x: 650, y: 1100 }, // EW26
  'BLY': { x: 600, y: 1100 }, // EW27
  'PNR': { x: 550, y: 1100 }, // EW28
  'JKN': { x: 500, y: 1100 }, // EW29
  'GUL': { x: 450, y: 1100 }, // EW30
  'TCR': { x: 400, y: 1100 }, // EW31
  'TWR': { x: 350, y: 1100 }, // EW32
  'TLK': { x: 300, y: 1100, style: 'TERMINAL' }, // EW33 - Western terminal

  // CHANGI AIRPORT BRANCH - Clear branch from TNM
  'EXP': { x: 1550, y: 60, style: 'INTERCHANGE_MINOR' }, // CG1/DT35
  'CG1': { x: 1600, y: 60, style: 'AIRPORT' }, // CG2
  'CG2': { x: 1650, y: 60, style: 'AIRPORT' }, // CG3

  // CIRCLE LINE - Proper circular layout around city center
  'HBF': { x: 600, y: 500, style: 'INTERCHANGE_MINOR' }, // NE1/CC29
  'BBS': { x: 650, y: 450 }, // CE1/DT16
  'EPN': { x: 700, y: 400 }, // CC3
  'PMN': { x: 750, y: 350, style: 'INTERCHANGE_MINOR' }, // CC4/DT15
  'NCH': { x: 800, y: 300 }, // CC5
  'SDM': { x: 850, y: 250 }, // CC6
  'MBT': { x: 900, y: 200 }, // CC7
  'DKT': { x: 950, y: 150 }, // CC8
  // PYL at (1350, 110) connects here - eastern arc
  'MPS': { x: 1300, y: 160, style: 'INTERCHANGE_MINOR' }, // CC10/DT26
  'TSG': { x: 1250, y: 200 }, // CC11
  'BTL': { x: 1200, y: 240 }, // CC12
  'SER': { x: 1150, y: 280, style: 'INTERCHANGE_MINOR' }, // CC13/NE12
  'LRC': { x: 1100, y: 320 }, // CC14
  // BSH at (800, 350) connects here - northern arc
  'MRM': { x: 750, y: 380 }, // CC16
  'CDT': { x: 700, y: 420, style: 'INTERCHANGE_MINOR' }, // CC17/TE9
  'UTM': { x: 650, y: 460, style: 'INTERCHANGE_MINOR' }, // CC19/DT9
  // Complete the circle back to BNV and HBF

  // NORTH EAST LINE - Clear diagonal from SW to NE
  // HBF at (600, 500) - southwestern end
  // OTP at (1050, 110) - connects to EWL
  'CTN': { x: 950, y: 140, style: 'INTERCHANGE_MINOR' }, // NE4/DT19
  'CQY': { x: 900, y: 150 }, // NE5
  // DBG at (800, 140) - connects to NSL
  'LTI': { x: 750, y: 170, style: 'INTERCHANGE_MINOR' }, // NE7/DT12
  'FRP': { x: 700, y: 200 }, // NE8
  'BKG': { x: 650, y: 230 }, // NE9
  'PTR': { x: 600, y: 260 }, // NE10
  // Continues northeast
  'KVN': { x: 1200, y: 320 }, // NE13
  'HGN': { x: 1250, y: 370 }, // NE14
  'SKG': { x: 1400, y: 450, style: 'INTERCHANGE_MINOR' }, // NE16/STC - LRT connection
  'PGL': { x: 1500, y: 500, style: 'INTERCHANGE_MINOR' }, // NE17/PTC - LRT connection
  'STC': { x: 1550, y: 550 }, // Final station

  // DOWNTOWN LINE - Multi-segment route with clear connections
  'BPJ': { x: 600, y: 950, style: 'INTERCHANGE_MINOR' }, // DT1/BP6 - LRT connection
  'CSW': { x: 650, y: 900 }, // DT2
  'HLV': { x: 700, y: 850 }, // DT3
  'HME': { x: 750, y: 800 }, // DT4
  'BTW': { x: 800, y: 750 }, // DT5
  'KAP': { x: 850, y: 700 }, // DT6
  'STH': { x: 900, y: 650 }, // DT7
  'TKK': { x: 950, y: 600 }, // DT8
  'BTG': { x: 1000, y: 550, style: 'INTERCHANGE_MINOR' }, // DT10/TE11
  // Connects to UTM at (650, 460)
  // Connects to NEW at (800, 230)
  // Connects to LTI at (750, 170)
  'RCR': { x: 800, y: 180 }, // DT13
  // Connects to BGS at (1150, 110)
  // Continues eastward
  'DTN': { x: 900, y: 60 }, // DT17
  'TLA': { x: 950, y: 50 }, // DT18
  // Connects to CTN at (950, 140)
  'FCN': { x: 850, y: 120 }, // DT20
  'BCL': { x: 900, y: 100 }, // DT21
  'JLB': { x: 950, y: 80 }, // DT22
  'BDM': { x: 1000, y: 60 }, // DT23
  'GBH': { x: 1050, y: 40 }, // DT24
  'MTR': { x: 1100, y: 20 }, // DT25
  // Connects to MPS at (1300, 160)
  'UBI': { x: 1350, y: 180 }, // DT27
  'KKB': { x: 1400, y: 200 }, // DT28
  'BDN': { x: 1450, y: 220 }, // DT29
  'BDR': { x: 1500, y: 240 }, // DT30
  'TPW': { x: 1550, y: 260 }, // DT31
  // Connects to TAM at (1650, 110)
  'TPE': { x: 1700, y: 140 }, // DT33
  'UPC': { x: 1750, y: 170 }, // DT34
  // Connects to EXP at (1550, 60)

  // THOMSON-EAST COAST LINE - Complex but clear routing
  'WDN': { x: 800, y: 800 }, // TE1 - connects to WDL
  'SPR': { x: 850, y: 750 }, // TE3
  'LEN': { x: 900, y: 700 }, // TE4
  'MYW': { x: 950, y: 650 }, // TE5
  'BRP': { x: 1000, y: 600 }, // TE6
  'CAL': { x: 1050, y: 550 }, // TE7
  // Connects to CDT at (700, 420)
  'SIX': { x: 650, y: 400 }, // TE8
  'TAN': { x: 600, y: 380 }, // TE10
  // Connects to BTG at (1000, 550)
  'NBV': { x: 550, y: 300 }, // TE12
  'GBB': { x: 500, y: 280 }, // TE13
  // Connects to ORC at (800, 200)
  'GWD': { x: 750, y: 180 }, // TE15
  'HVL': { x: 700, y: 160 }, // TE16
  // Connects to OTP at (1050, 110)
  'MXW': { x: 600, y: 90 }, // TE18
  'STW': { x: 550, y: 70 }, // TE19
  // Connects to MRB at (800, 50)
  'KTN': { x: 750, y: 30 }, // TE20
  'TGH': { x: 700, y: 10 }, // TE21
  'MRD': { x: 650, y: -10 }, // TE22
  'MRS': { x: 600, y: -30 }, // TE23

  // BUKIT PANJANG LRT - Compact loop system
  'BP1': { x: 800, y: 950 }, // Same as CCK
  'BP2': { x: 760, y: 950, style: 'LRT_STATION' },
  'BP3': { x: 720, y: 950, style: 'LRT_STATION' },
  'BP4': { x: 680, y: 950, style: 'LRT_STATION' },
  'BP5': { x: 640, y: 950, style: 'LRT_STATION' },
  'BP6': { x: 600, y: 950, style: 'LRT_STATION' }, // Same as BPJ
  'BP7': { x: 560, y: 950, style: 'LRT_STATION' },
  'BP8': { x: 520, y: 950, style: 'LRT_STATION' },
  'BP9': { x: 480, y: 950, style: 'LRT_STATION' },
  'BP10': { x: 440, y: 950, style: 'LRT_STATION' },
  'BP11': { x: 400, y: 950, style: 'LRT_STATION' },
  'BP12': { x: 360, y: 950, style: 'LRT_STATION' },
  'BP13': { x: 320, y: 950, style: 'LRT_STATION' },
  'BP14': { x: 280, y: 950, style: 'LRT_STATION' },

  // SENGKANG LRT - Loop system around SKG
  'SE1': { x: 1350, y: 450, style: 'LRT_STATION' },
  'SE2': { x: 1320, y: 480, style: 'LRT_STATION' },
  'SE3': { x: 1290, y: 510, style: 'LRT_STATION' },
  'SE4': { x: 1260, y: 540, style: 'LRT_STATION' },
  'SE5': { x: 1230, y: 570, style: 'LRT_STATION' },
  'SW1': { x: 1450, y: 450, style: 'LRT_STATION' },
  'SW2': { x: 1480, y: 480, style: 'LRT_STATION' },
  'SW3': { x: 1510, y: 510, style: 'LRT_STATION' },
  'SW4': { x: 1540, y: 540, style: 'LRT_STATION' },
  'SW5': { x: 1570, y: 570, style: 'LRT_STATION' },
  'SW6': { x: 1600, y: 600, style: 'LRT_STATION' },
  'SW7': { x: 1630, y: 630, style: 'LRT_STATION' },
  'SW8': { x: 1660, y: 660, style: 'LRT_STATION' },

  // PUNGGOL LRT - Loop system around PGL
  'PE1': { x: 1450, y: 500, style: 'LRT_STATION' },
  'PE2': { x: 1420, y: 530, style: 'LRT_STATION' },
  'PE3': { x: 1390, y: 560, style: 'LRT_STATION' },
  'PE4': { x: 1360, y: 590, style: 'LRT_STATION' },
  'PE5': { x: 1330, y: 620, style: 'LRT_STATION' },
  'PE6': { x: 1300, y: 650, style: 'LRT_STATION' },
  'PE7': { x: 1270, y: 680, style: 'LRT_STATION' },
  'PW1': { x: 1550, y: 500, style: 'LRT_STATION' },
  'PW2': { x: 1580, y: 530, style: 'LRT_STATION' },
  'PW3': { x: 1610, y: 560, style: 'LRT_STATION' },
  'PW4': { x: 1640, y: 590, style: 'LRT_STATION' },
  'PW5': { x: 1670, y: 620, style: 'LRT_STATION' },
  'PW6': { x: 1700, y: 650, style: 'LRT_STATION' },
  'PW7': { x: 1730, y: 680, style: 'LRT_STATION' },
};

const EnhancedMRTMap: React.FC<EnhancedMRTMapProps> = ({
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
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [tooltipInfo, setTooltipInfo] = useState<{
    station: Station;
    x: number;
    y: number;
  } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const transformComponentRef = useRef<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedData = await loadOfficialMRTData();
        // Apply enhanced positions to stations
        const stationsWithPositions = loadedData.stations.map(station => ({
          ...station,
          position: PRECISION_POSITIONS[station.id] || { x: 900, y: 600 },
          style: PRECISION_POSITIONS[station.id]?.style || 'REGULAR'
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

  const handleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Enhanced line segments with Metro Map Maker precision
  const enhancedLineSegments = useMemo(() => {
    if (!data) return [];
    
    const segments: Array<{
      from: { x: number; y: number };
      to: { x: number; y: number };
      color: string;
      lineId: string;
      width: number;
      isDashed?: boolean;
    }> = [];

    data.connections.forEach(connection => {
      const fromStation = data.stations.find(s => s.id === connection.from);
      const toStation = data.stations.find(s => s.id === connection.to);

      if (fromStation?.position && toStation?.position) {
        const line = data.lines.find(l => l.id === connection.line);
        const color = ENHANCED_COLORS[connection.line] || line?.color || '#6b7280';
        
        // Determine line width based on type
        let width = MAP_CONFIG.LINE_WIDTHS.MRT_MAIN;
        if (line?.type === 'lrt') {
          width = MAP_CONFIG.LINE_WIDTHS.LRT;
        } else if (connection.line.includes('JRL') || connection.line.includes('CRL')) {
          width = MAP_CONFIG.LINE_WIDTHS.FUTURE;
        }

        segments.push({
          from: fromStation.position,
          to: toStation.position,
          color,
          lineId: connection.line,
          width,
          isDashed: connection.line.includes('JRL') || connection.line.includes('CRL')
        });
      }
    });

    return segments;
  }, [data]);

  // Station interaction handlers with Rail Art smoothness
  const handleStationHover = useCallback((station: Station, event: React.MouseEvent<SVGElement>) => {
    setHoveredStation(station.id);
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (containerRect) {
      setTooltipInfo({
        station,
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top - containerRect.top - 10
      });
    }
  }, []);

  const handleStationLeave = useCallback(() => {
    setHoveredStation(null);
    setTooltipInfo(null);
  }, []);

  const handleStationClick = useCallback((station: Station) => {
    setSelectedStation(station.id);
    if (onStationClick) {
      onStationClick(station);
    }
  }, [onStationClick]);

  // Filter data based on selected lines
  const filteredData = useMemo(() => {
    if (!data || selectedLines.length === 0) return data;
    
    return {
      ...data,
      stations: data.stations.filter(station =>
        station.lines.some(line => selectedLines.includes(line))
      ),
      connections: data.connections.filter(connection =>
        selectedLines.includes(connection.line)
      )
    };
  }, [data, selectedLines]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">Loading Enhanced MRT Map</p>
            <p className="text-sm text-gray-500">Metro Map Maker precision • Rail Art smoothness</p>
            <div className="w-48 bg-gray-200 rounded-full h-2 mx-auto">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full animate-pulse" style={{ width: '85%' }}></div>
            </div>
            <p className="text-xs text-gray-400">Loading 230+ stations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!filteredData) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <p className="text-gray-600">Failed to load MRT data</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-xl shadow-2xl overflow-hidden ${className}`}
      style={{
        background: isDarkMode ? 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)' : ENHANCED_COLORS.BACKGROUND
      }}
    >
      {/* Enhanced Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Singapore MRT Network
            </h1>
            <p className="text-sm text-muted-foreground">
              Enhanced Interactive Map • {filteredData.stations.length} Stations • {filteredData.lines.length} Lines
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="px-3 py-1.5 text-sm bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <div className="text-xs text-muted-foreground">
              Precision Layout • Metro Map Maker Inspired
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Map with ultra-smooth scrolling */}
      <TransformWrapper
        ref={transformComponentRef}
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
        limitToBounds={false}
        panning={{ disabled: false, velocityDisabled: false }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute top-20 right-4 z-20 flex flex-col gap-2">
              <button onClick={() => zoomIn()} className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-md flex items-center justify-center shadow-md hover:bg-white transition-colors">+</button>
              <button onClick={() => zoomOut()} className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-md flex items-center justify-center shadow-md hover:bg-white transition-colors">-</button>
              <button onClick={() => resetTransform()} className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-md flex items-center justify-center shadow-md hover:bg-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M10.561 8 7.28 4.719l.719-.719L12 8l-3.999 4-.719-.719L10.561 8zM5 4.719 1.72 8l3.28 3.281.719-.719L3.439 8l2.28-2.561z"/></svg>
              </button>
              <button onClick={handleFullscreen} className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-md flex items-center justify-center shadow-md hover:bg-white transition-colors">
                {isFullscreen 
                  ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1H1v3.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5zM10.5 0a.5.5 0 0 1 .5.5V5a.5.5 0 0 1-1 0V1h-3.5a.5.5 0 0 1 0-1zM.5 10.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H1v3.5a.5.5 0 0 1-1 0zM15 10.5a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1 0-1h3.5V6a.5.5 0 0 1 1 0z"/></svg>
                  : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5"/></svg>
                }
              </button>
            </div>
            <TransformComponent
              wrapperStyle={{ width: '100%', height: 'calc(100% - 5rem)', marginTop: '5rem' }}
              contentStyle={{ width: MAP_CONFIG.WIDTH, height: MAP_CONFIG.HEIGHT }}
            >
              <div className="p-8" style={{ minWidth: MAP_CONFIG.WIDTH, minHeight: MAP_CONFIG.HEIGHT }}>
                <svg
                  ref={svgRef}
                  width={MAP_CONFIG.WIDTH}
                  height={MAP_CONFIG.HEIGHT}
                  viewBox={`0 0 ${MAP_CONFIG.WIDTH} ${MAP_CONFIG.HEIGHT}`}
                  className="w-full h-full"
                  style={{
                    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                    transition: `all ${MAP_CONFIG.ANIMATION.TRANSITION_DURATION} ${MAP_CONFIG.ANIMATION.EASE}`,
                    willChange: 'transform', // GPU acceleration for transforms
                    backfaceVisibility: 'hidden', // Smoother animations
                    transform: 'translateZ(0)', // Force hardware acceleration
                  }}
                >
                  {/* Enhanced background with grid */}
                  <defs>
                    <pattern 
                      id="precisionGrid" 
                      width={MAP_CONFIG.GRID_SIZE} 
                      height={MAP_CONFIG.GRID_SIZE} 
                      patternUnits="userSpaceOnUse"
                    >
                      <path 
                        d={`M ${MAP_CONFIG.GRID_SIZE} 0 L 0 0 0 ${MAP_CONFIG.GRID_SIZE}`} 
                        fill="none" 
                        stroke={ENHANCED_COLORS.GRID} 
                        strokeWidth="0.5" 
                        opacity="0.4"
                      />
                    </pattern>
                    
                    {/* Enhanced filters for stations */}
                    <filter id="stationGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    
                    <filter id="interchangeGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  <rect width="100%" height="100%" fill="url(#precisionGrid)" />

                  {/* Enhanced line segments */}
                  <g className="line-segments">
                    {enhancedLineSegments.map((segment, index) => (
                      <line
                        key={`segment-${index}`}
                        x1={segment.from.x + MAP_CONFIG.MARGIN}
                        y1={segment.from.y + MAP_CONFIG.MARGIN}
                        x2={segment.to.x + MAP_CONFIG.MARGIN}
                        y2={segment.to.y + MAP_CONFIG.MARGIN}
                        stroke={segment.color}
                        strokeWidth={segment.width}
                        strokeLinecap="round"
                        strokeDasharray={segment.isDashed ? "10,5" : "none"}
                        className="transition-all duration-200"
                        style={{
                          opacity: selectedLines.length === 0 || selectedLines.includes(segment.lineId) ? 0.95 : 0.25,
                          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                          willChange: selectedLines.length > 0 ? 'opacity' : 'auto',
                        }}
                      />
                    ))}
                  </g>

                  {/* Enhanced station circles with Metro Map Maker precision */}
                  <g className="stations">
                    {filteredData.stations.map((station) => {
                      if (!station.position) return null;
                      
                      const stationStyle = MAP_CONFIG.STATION_STYLES[station.style as keyof typeof MAP_CONFIG.STATION_STYLES] || MAP_CONFIG.STATION_STYLES.REGULAR;
                      const isHovered = hoveredStation === station.id;
                      const isSelected = selectedStation === station.id;
                      const isInterchange = station.lines.length > 1;
                      
                      const scale = isSelected ? MAP_CONFIG.ANIMATION.SELECTED_SCALE : 
                                   isHovered ? MAP_CONFIG.ANIMATION.HOVER_SCALE : 1;

                      return (
                        <g key={station.id}>
                          {/* Station shape */}
                          {stationStyle.shape === 'square' ? (
                            <rect
                              x={station.position.x + MAP_CONFIG.MARGIN - stationStyle.radius}
                              y={station.position.y + MAP_CONFIG.MARGIN - stationStyle.radius}
                              width={stationStyle.radius * 2}
                              height={stationStyle.radius * 2}
                              fill={isDarkMode ? '#1a202c' : ENHANCED_COLORS.STATION_FILL}
                              stroke={isInterchange ? ENHANCED_COLORS.TEXT_PRIMARY : ENHANCED_COLORS[station.lines[0]] || '#666'}
                              strokeWidth={stationStyle.strokeWidth}
                              className="cursor-pointer transition-all"
                              style={{
                                transform: `scale(${scale}) translateZ(0)`,
                                transformOrigin: `${station.position.x + MAP_CONFIG.MARGIN}px ${station.position.y + MAP_CONFIG.MARGIN}px`,
                                transitionDuration: MAP_CONFIG.ANIMATION.TRANSITION_DURATION,
                                transitionTimingFunction: MAP_CONFIG.ANIMATION.EASE,
                                willChange: isHovered || isSelected ? 'transform' : 'auto',
                                backfaceVisibility: 'hidden',
                              }}
                              filter={isInterchange ? "url(#interchangeGlow)" : isHovered ? "url(#stationGlow)" : undefined}
                              onMouseEnter={(e) => handleStationHover(station, e)}
                              onMouseLeave={handleStationLeave}
                              onClick={() => handleStationClick(station)}
                            />
                          ) : stationStyle.shape === 'diamond' ? (
                            <polygon
                              points={`${station.position.x + MAP_CONFIG.MARGIN},${station.position.y + MAP_CONFIG.MARGIN - stationStyle.radius} ${station.position.x + MAP_CONFIG.MARGIN + stationStyle.radius},${station.position.y + MAP_CONFIG.MARGIN} ${station.position.x + MAP_CONFIG.MARGIN},${station.position.y + MAP_CONFIG.MARGIN + stationStyle.radius} ${station.position.x + MAP_CONFIG.MARGIN - stationStyle.radius},${station.position.y + MAP_CONFIG.MARGIN}`}
                              fill={isDarkMode ? '#1a202c' : ENHANCED_COLORS.STATION_FILL}
                              stroke={ENHANCED_COLORS[station.lines[0]] || '#666'}
                              strokeWidth={stationStyle.strokeWidth}
                              className="cursor-pointer transition-all"
                              style={{
                                transform: `scale(${scale})`,
                                transformOrigin: `${station.position.x + MAP_CONFIG.MARGIN}px ${station.position.y + MAP_CONFIG.MARGIN}px`,
                                transitionDuration: MAP_CONFIG.ANIMATION.TRANSITION_DURATION,
                              }}
                              filter="url(#stationGlow)"
                              onMouseEnter={(e) => handleStationHover(station, e)}
                              onMouseLeave={handleStationLeave}
                              onClick={() => handleStationClick(station)}
                            />
                          ) : (
                            <circle
                              cx={station.position.x + MAP_CONFIG.MARGIN}
                              cy={station.position.y + MAP_CONFIG.MARGIN}
                              r={stationStyle.radius}
                              fill={isDarkMode ? '#1a202c' : ENHANCED_COLORS.STATION_FILL}
                              stroke={isInterchange ? ENHANCED_COLORS.TEXT_PRIMARY : ENHANCED_COLORS[station.lines[0]] || '#666'}
                              strokeWidth={stationStyle.strokeWidth}
                              className="cursor-pointer transition-all"
                              style={{
                                transform: `scale(${scale}) translateZ(0)`,
                                transformOrigin: `${station.position.x + MAP_CONFIG.MARGIN}px ${station.position.y + MAP_CONFIG.MARGIN}px`,
                                transitionDuration: MAP_CONFIG.ANIMATION.TRANSITION_DURATION,
                                transitionTimingFunction: MAP_CONFIG.ANIMATION.EASE,
                                willChange: isHovered || isSelected ? 'transform' : 'auto',
                                backfaceVisibility: 'hidden',
                              }}
                              filter={isInterchange ? "url(#interchangeGlow)" : isHovered ? "url(#stationGlow)" : undefined}
                              onMouseEnter={(e) => handleStationHover(station, e)}
                              onMouseLeave={handleStationLeave}
                              onClick={() => handleStationClick(station)}
                            />
                          )}

                          {/* Enhanced station labels */}
                          {showLabels && (
                            <text
                              x={station.position.x + MAP_CONFIG.MARGIN + stationStyle.radius + 8}
                              y={station.position.y + MAP_CONFIG.MARGIN + 4}
                              fontSize={isInterchange ? 11 : 9}
                              fontWeight={isInterchange ? 600 : 400}
                              fill={ENHANCED_COLORS.TEXT_PRIMARY}
                              className="pointer-events-none select-none transition-all"
                              style={{
                                fontFamily: 'system-ui, -apple-system, sans-serif',
                                textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                                opacity: isHovered ? 1 : 0.9,
                                transform: `scale(${isHovered ? 1.05 : 1})`,
                                transitionDuration: MAP_CONFIG.ANIMATION.TRANSITION_DURATION,
                              }}
                            >
                              {station.name}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </g>

                  {/* Enhanced legend */}
                  <g className="legend" transform={`translate(50, ${MAP_CONFIG.HEIGHT - 250})`}>
                    <rect x="0" y="0" width="320" height="220" fill="white" fillOpacity="0.95" rx="12" stroke="#e5e7eb" strokeWidth="1" filter="url(#stationGlow)"/>
                    <text x="20" y="30" fontSize="16" fontWeight="700" fill={ENHANCED_COLORS.TEXT_PRIMARY}>MRT & LRT Network</text>
                    <text x="20" y="50" fontSize="10" fill={ENHANCED_COLORS.TEXT_SECONDARY}>Enhanced with Metro Map Maker precision</text>
                    
                    {filteredData.lines.slice(0, 9).map((line, index) => {
                      const y = 75 + index * 20;
                      const isVisible = selectedLines.length === 0 || selectedLines.includes(line.id);
                      
                      return (
                        <g key={line.id} opacity={isVisible ? 1 : 0.4}>
                          <line 
                            x1="20" 
                            y1={y} 
                            x2="45" 
                            y2={y} 
                            stroke={ENHANCED_COLORS[line.id] || line.color} 
                            strokeWidth="5" 
                            strokeLinecap="round"
                          />
                          <text x="55" y={y + 4} fontSize="12" fontWeight="600" fill={ENHANCED_COLORS.TEXT_PRIMARY}>{line.id}</text>
                          <text x="90" y={y + 4} fontSize="10" fill={ENHANCED_COLORS.TEXT_SECONDARY}>
                            {line.name.replace(' Line', '').replace('Thomson–East Coast', 'Thomson-E.Coast')}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                </svg>
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* Enhanced tooltip with Rail Art styling */}
      {tooltipInfo && (
        <div
          className="absolute z-50 bg-card rounded-xl shadow-2xl border border-border p-4 pointer-events-none"
          style={{
            left: tooltipInfo.x,
            top: tooltipInfo.y,
            transform: 'translate(-50%, -100%)',
            transition: `all ${MAP_CONFIG.ANIMATION.TRANSITION_DURATION} ${MAP_CONFIG.ANIMATION.EASE}`,
            backdropFilter: 'blur(10px)',
            background: 'hsl(var(--card) / 0.8)'
          }}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: ENHANCED_COLORS[tooltipInfo.station.lines[0]] }}></div>
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm mb-1">
                {tooltipInfo.station.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                {tooltipInfo.station.codes.join(' • ')}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground">Lines:</span>
                <div className="flex gap-1">
                  {tooltipInfo.station.lines.map(lineId => (
                    <div
                      key={lineId}
                      className="w-4 h-3 rounded"
                      style={{ backgroundColor: ENHANCED_COLORS[lineId] }}
                      title={filteredData?.lines.find(l => l.id === lineId)?.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedMRTMap;
