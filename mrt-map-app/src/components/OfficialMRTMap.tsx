import React, { useMemo, useState } from 'react';
import { Station, MRTLine, Connection } from '../data/mrtData';

// Language context for multi-language support
const LanguageContext = React.createContext<{
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, any>) => string;
}>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key
});

// Language provider component
const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Check localStorage or browser preference
    const stored = localStorage.getItem('mrtdown-language');
    if (stored) return stored;

    const browserLang = navigator.language.split('-')[0];
    if (['en', 'zh', 'ms', 'ta'].includes(browserLang)) {
      return browserLang === 'zh' ? 'zh-Hans' : browserLang;
    }
    return 'en';
  });

  const t = (key: string, _params?: Record<string, any>) => {
    // Simple translation function - in production this would use i18n library
    if (language === 'zh-Hans') {
      const translations: Record<string, string> = {
        'station.interchange': '换乘站',
        'station.regular': '车站',
        'lines': '线路',
        'status.operational': '运营中',
        'click.for.details': '点击查看详情'
      };
      return translations[key] || key;
    }
    return key;
  };

  const setLanguageAndStore = (newLang: string) => {
    setLanguage(newLang);
    localStorage.setItem('mrtdown-language', newLang);
    document.documentElement.lang = newLang;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLanguageAndStore, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

interface OfficialMRTMapProps {
  onStationClick?: (station: Station) => void;
  showLabels?: boolean;
  selectedLines?: string[];
  className?: string;
  stations?: Station[];
  lines?: MRTLine[];
  connections?: Connection[];
}

const OfficialMRTMap: React.FC<OfficialMRTMapProps> = ({
  onStationClick,
  showLabels = true,
  selectedLines = [],
  className = '',
  stations: propStations,
  lines: propLines,
  connections: propConnections
}) => {
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [data, setData] = useState<{
    stations: Station[];
    lines: MRTLine[];
    connections: Connection[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipContent, setTooltipContent] = useState<Station | null>(null);

  const { language, setLanguage, t } = React.useContext(LanguageContext);

  // Get station display name based on language
  const getStationDisplayName = (station: Station) => {
    if (language === 'zh-Hans' && station.name_translations?.['zh-Hans']) {
      return station.name_translations['zh-Hans'];
    }
    if (language === 'ms' && station.name_translations?.['ms']) {
      return station.name_translations['ms'];
    }
    if (language === 'ta' && station.name_translations?.['ta']) {
      return station.name_translations['ta'];
    }
    return station.name;
  };

  // Enhanced interchange detection
  const getInterchangeInfo = (station: Station) => {
    const lineCount = station.lines.length;
    const isMajorInterchange = lineCount >= 3;
    const isMinorInterchange = lineCount === 2;
    const isFutureLine = station.codes.some(code => code.includes('JE') || code.includes('CR'));

    return {
      lineCount,
      isMajorInterchange,
      isMinorInterchange,
      isFutureLine,
      interchangeType: isMajorInterchange ? 'major' : isMinorInterchange ? 'minor' : 'none'
    };
  };

  React.useEffect(() => {
    const loadData = async () => {
      try {
        if (propStations && propLines && propConnections) {
          setData({ stations: propStations, lines: propLines, connections: propConnections });
        } else {
          const { loadOfficialMRTData } = await import('../data/aggregateOfficialData');
          const loadedData = await loadOfficialMRTData();
          setData(loadedData);
        }
      } catch (error) {
        console.error('Error loading MRT data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [propStations, propLines, propConnections]);

  // Handle station interactions
  const handleStationHover = (station: Station, event: React.MouseEvent) => {
    setHoveredStation(station.id);
    setTooltipContent(station);
    setTooltipPosition({ x: event.clientX + 10, y: event.clientY + 10 });
    setShowTooltip(true);
  };

  const handleStationLeave = () => {
    setHoveredStation(null);
    setShowTooltip(false);
    setTooltipContent(null);
  };

  const handleStationClickInternal = (stationId: string) => {
    const station = data?.stations.find(s => s.id === stationId);
    if (station && onStationClick) {
      onStationClick(station);
    }
    setSelectedStation(stationId);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading Singapore MRT Map...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <p className="text-gray-600">Failed to load MRT data</p>
      </div>
    );
  }

  const { stations, lines, connections } = data;

  // Official LTA Line Colors
  const lineColors: Record<string, string> = {
    'NSL': '#d42e12', // North-South Line (Red)
    'EWL': '#009645', // East-West Line (Green)
    'CCL': '#fa9e0d', // Circle Line (Orange)
    'NEL': '#9900aa', // North East Line (Purple)
    'DTL': '#005ec4', // Downtown Line (Blue)
    'TEL': '#9D5B25', // Thomson-East Coast Line (Brown)
    'JRL': '#0099aa', // Jurong Region Line (Cyan/Teal)
    'CRL': '#97c616', // Cross Island Line (Green/Lime)
    'BPLRT': '#669900', // Bukit Panjang LRT (Light Green)
    'SKLRT': '#669900', // Sengkang LRT (Light Green)
    'PGLRT': '#669900', // Punggol LRT (Light Green)
  };

  // Generate line segments between connected stations
  const lineSegments = useMemo(() => {
    const segments: Array<{
      from: { x: number; y: number };
      to: { x: number; y: number };
      color: string;
      lineId: string;
    }> = [];

    connections.forEach(connection => {
      const fromStation = stations.find(s => s.id === connection.from);
      const toStation = stations.find(s => s.id === connection.to);

      if (fromStation?.position && toStation?.position) {
        const line = lines.find(l => l.id === connection.line);
        const color = line ? line.color : lineColors[connection.line] || '#6b7280';

        segments.push({
          from: fromStation.position,
          to: toStation.position,
          color,
          lineId: connection.line
        });
      }
    });

    return segments;
  }, [connections, stations, lines]);

  const filteredStations = useMemo(() => {
    if (selectedLines.length === 0) return stations;
    return stations.filter(station =>
      station.lines.some(line => selectedLines.includes(line))
    );
  }, [stations, selectedLines]);

  const filteredSegments = useMemo(() => {
    if (selectedLines.length === 0) return lineSegments;
    return lineSegments.filter(segment => selectedLines.includes(segment.lineId));
  }, [lineSegments, selectedLines]);


  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden ${className}`}>
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {language === 'zh-Hans' ? '新加坡地铁网络' : 'Singapore MRT Network'}
            </h2>
            <p className="text-sm text-gray-600">
              {language === 'zh-Hans' ? '官方示意图表示 • 点击车站查看详情' : 'Official schematic representation • Hover for details'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
              {[
                { code: 'en', name: 'EN', flag: '🇬🇧' },
                { code: 'zh-Hans', name: '中文', flag: '🇨🇳' },
                { code: 'ms', name: 'BM', flag: '🇲🇾' },
                { code: 'ta', name: 'த', flag: '🇮🇳' }
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                    language === lang.code
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {lang.flag} {lang.name}
                </button>
              ))}
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">
                {selectedLines.length === 0
                  ? (language === 'zh-Hans' ? '显示所有线路' : 'All lines shown')
                  : `${selectedLines.length} ${language === 'zh-Hans' ? '条线路选中' : 'line' + (selectedLines.length === 1 ? '' : 's') + ' selected'}`
                }
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {language === 'zh-Hans' ? '基于LTA官方数据' : 'Based on LTA official data'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg
          width="100%"
          height="600"
          viewBox="0 0 1000 800"
          className="w-full"
          style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}
        >
          {/* Grid pattern */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="0.5" opacity="0.5"/>
            </pattern>

            {/* Station glow effect */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Interchange station shadow */}
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.2"/>
            </filter>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Line segments */}
          {filteredSegments.map((segment, index) => (
            <line
              key={`segment-${index}`}
              x1={segment.from.x}
              y1={segment.from.y}
              x2={segment.to.x}
              y2={segment.to.y}
              stroke={segment.color}
              strokeWidth="6"
              strokeLinecap="round"
              className="transition-opacity duration-200"
              opacity={selectedLines.length === 0 || selectedLines.includes(segment.lineId) ? 0.9 : 0.3}
            />
          ))}

          {/* Station circles */}
          {filteredStations.map((station) => {
            const isVisible = selectedLines.length === 0 ||
                             station.lines.some(line => selectedLines.includes(line));
            const isHovered = hoveredStation === station.id;
            const isSelected = selectedStation === station.id;
            const interchangeInfo = getInterchangeInfo(station);

            if (!isVisible || !station.position) return null;

            return (
              <g key={station.id}>
                {/* Station circle with enhanced interchange detection */}
                <circle
                  cx={station.position.x}
                  cy={station.position.y}
                  r={interchangeInfo.isMajorInterchange ? 12 : interchangeInfo.isMinorInterchange ? 10 : 7}
                  fill="white"
                  stroke={
                    interchangeInfo.isMajorInterchange ? '#dc2626' : // Red for major interchanges
                    interchangeInfo.isMinorInterchange ? '#ea580c' : // Orange for minor interchanges
                    lineColors[station.lines[0]] || '#6b7280'
                  }
                  strokeWidth={interchangeInfo.lineCount > 1 ? 4 : 2}
                  className={`transition-all duration-300 cursor-pointer ${
                    interchangeInfo.isMajorInterchange ? 'drop-shadow-lg' :
                    interchangeInfo.isMinorInterchange ? 'drop-shadow-md' : ''
                  }`}
                  filter={
                    interchangeInfo.isMajorInterchange ? "url(#shadow)" :
                    isHovered ? "url(#glow)" : undefined
                  }
                  onClick={() => handleStationClickInternal(station.id)}
                  onMouseEnter={(e) => handleStationHover(station, e)}
                  onMouseLeave={handleStationLeave}
                  style={{
                    transform: isSelected ? 'scale(1.2)' : isHovered ? 'scale(1.15)' : 'scale(1)',
                    opacity: isVisible ? 1 : 0.3
                  }}
                />

                {/* Multiple line indicators for interchanges */}
                {interchangeInfo.lineCount > 1 && (
                  <g>
                    {station.lines.slice(0, Math.min(3, interchangeInfo.lineCount)).map((lineId, index) => {
                      const line = lines.find(l => l.id === lineId);
                      const angle = (index * 360) / Math.min(3, interchangeInfo.lineCount);
                      const radius = interchangeInfo.isMajorInterchange ? 16 : 14;
                      const x = (station.position?.x || 0) + radius * Math.cos((angle - 90) * Math.PI / 180);
                      const y = (station.position?.y || 0) + radius * Math.sin((angle - 90) * Math.PI / 180);

                      return (
                        <circle
                          key={`${lineId}-${index}`}
                          cx={x}
                          cy={y}
                          r="3"
                          fill={line?.color || lineColors[lineId] || '#6b7280'}
                          stroke="white"
                          strokeWidth="1"
                          className="transition-all duration-200"
                        />
                      );
                    })}
                  </g>
                )}

                {/* Station label with language support */}
                {showLabels && (
                  <text
                    x={station.position.x + (interchangeInfo.isMajorInterchange ? 18 : interchangeInfo.isMinorInterchange ? 14 : 10)}
                    y={station.position.y - (interchangeInfo.lineCount > 1 ? 2 : 0)}
                    fontSize={interchangeInfo.isMajorInterchange ? "12" : interchangeInfo.isMinorInterchange ? "11" : "10"}
                    fontWeight={interchangeInfo.lineCount > 1 ? "700" : "500"}
                    fill="#1f2937"
                    className="pointer-events-none select-none transition-all duration-200"
                    style={{
                      opacity: isVisible ? 1 : 0.3,
                      textShadow: isHovered ? '0 0 4px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    {getStationDisplayName(station)}
                  </text>
                )}

                {/* Station codes for interchanges */}
                {showLabels && interchangeInfo.lineCount > 1 && (
                  <text
                    x={station.position.x + (interchangeInfo.isMajorInterchange ? 18 : 14)}
                    y={station.position.y + (interchangeInfo.isMajorInterchange ? 16 : 14)}
                    fontSize="8"
                    fontWeight="500"
                    fill="#6b7280"
                    className="pointer-events-none select-none transition-opacity duration-200"
                    style={{ opacity: isVisible ? 1 : 0.3 }}
                  >
                    {station.codes.join('/')}
                  </text>
                )}

                {/* Secondary language for major interchanges */}
                {showLabels && language !== 'en' && interchangeInfo.isMajorInterchange && (
                  <text
                    x={station.position.x + 18}
                    y={station.position.y + 28}
                    fontSize="8"
                    fontWeight="400"
                    fill="#6b7280"
                    className="pointer-events-none select-none transition-opacity duration-200"
                    style={{ opacity: isVisible ? 0.8 : 0.2 }}
                  >
                    ({station.name})
                  </text>
                )}

                {/* Future station indicator */}
                {interchangeInfo.isFutureLine && (
                  <circle
                    cx={station.position.x}
                    cy={station.position.y}
                    r="15"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    className="animate-pulse"
                  />
                )}
              </g>
            );
          })}

          {/* Legend */}
          <g transform="translate(20, 20)">
            <rect x="0" y="0" width="200" height="140" fill="white" fillOpacity="0.95" rx="8" stroke="#e5e7eb" strokeWidth="1"/>
            <text x="10" y="20" fontSize="12" fontWeight="600" fill="#374151">MRT Lines</text>

            {lines.slice(0, 6).map((line, index) => {
              const isSelected = selectedLines.length === 0 || selectedLines.includes(line.id);
              return (
                <g key={line.id} transform={`translate(10, ${35 + index * 16})`} opacity={isSelected ? 1 : 0.4}>
                  <line x1="0" y1="0" x2="16" y2="0" stroke={line.color} strokeWidth="3" strokeLinecap="round"/>
                  <text x="22" y="4" fontSize="10" fill="#374151">{line.id}</text>
                  <text x="50" y="4" fontSize="9" fill="#6b7280">{line.name.split(' ').slice(0, 2).join(' ')}</text>
                </g>
              );
            })}
          </g>

          {/* Compass */}
          <g transform="translate(950, 50)">
            <circle cx="0" cy="0" r="20" fill="white" fillOpacity="0.9" stroke="#e5e7eb"/>
            <path d="M 0,-15 L 5,0 L 0,15 L -5,0 Z" fill="#dc2626"/>
            <text x="0" y="-25" fontSize="8" textAnchor="middle" fill="#374151" fontWeight="600">N</text>
          </g>
        </svg>

        {/* Enhanced Tooltip */}
        {showTooltip && tooltipContent && (
          <div
            className="absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 pointer-events-none"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: 'translate(-50%, -100%)',
              marginTop: '-10px'
            }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {getStationDisplayName(tooltipContent)}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {tooltipContent.codes.join(' • ')}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-medium text-gray-700">
                    {t('lines')}:
                  </span>
                  <div className="flex gap-1">
                    {tooltipContent.lines.map(lineId => {
                      const line = lines.find(l => l.id === lineId);
                      return (
                        <div
                          key={lineId}
                          className="w-4 h-2 rounded"
                          style={{ backgroundColor: line?.color || lineColors[lineId] }}
                          title={line?.name || lineId}
                        />
                      );
                    })}
                  </div>
                </div>
                {tooltipContent.structureType && (
                  <p className="text-xs text-gray-500 mt-1">
                    {tooltipContent.structureType === 'underground' ? '🅿️' : '🏗️'} {tooltipContent.structureType}
                  </p>
                )}
              </div>
            </div>
            {/* Tooltip arrow */}
            <div
              className="absolute w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"
              style={{
                left: '50%',
                bottom: '-4px',
                transform: 'translateX(-50%)'
              }}
            />
          </div>
        )}
      </div>

      {/* Enhanced Status bar */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              {t('status.operational')}
            </span>
            <span>
              {data?.stations.length || 0} {language === 'zh-Hans' ? '个车站' : 'stations'}
            </span>
            <span>
              {data?.lines.length || 0} {language === 'zh-Hans' ? '条线路' : 'lines'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>
              {language === 'zh-Hans' ? '最后更新：' : 'Last updated: '}
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component with language provider wrapper
const OfficialMRTMapWithLanguage: React.FC<OfficialMRTMapProps> = (props) => {
  return (
    <LanguageProvider>
      <OfficialMRTMap {...props} />
    </LanguageProvider>
  );
};

export default OfficialMRTMapWithLanguage;