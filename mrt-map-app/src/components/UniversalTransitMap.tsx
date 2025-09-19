import React, { useState, useEffect, useMemo } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { MapPin, Train, Zap } from 'lucide-react';
import { TransitSystem, TransitStation } from '../data/transitSystem';
import { useTheme } from '../context/ThemeProvider';

interface UniversalTransitMapProps {
  system: TransitSystem;
  onStationClick?: (station: TransitStation) => void;
  showLabels?: boolean;
  selectedLines?: string[];
  className?: string;
}

interface TransformedStation extends TransitStation {
  x: number;
  y: number;
}

interface SVGBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
  width: number;
  height: number;
}

const UniversalTransitMap: React.FC<UniversalTransitMapProps> = ({
  system,
  onStationClick,
  showLabels = true,
  selectedLines = [],
  className
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [transformedStations, setTransformedStations] = useState<TransformedStation[]>([]);
  const [tooltipInfo, setTooltipInfo] = useState<{ station: TransformedStation; x: number; y: number } | null>(null);
  const [svgBounds, setSvgBounds] = useState<SVGBounds | null>(null);

  // Transform geographic coordinates to SVG coordinates
  const transformCoordinates = useMemo(() => {
    if (!system.stations.length) return { stations: [], bounds: null };

    // Find bounds
    const lats = system.stations.map(s => s.coordinates.lat);
    const lngs = system.stations.map(s => s.coordinates.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Add padding
    const latRange = maxLat - minLat;
    const lngRange = maxLng - minLng;
    const padding = Math.max(latRange, lngRange) * 0.1;

    const bounds: SVGBounds = {
      minLat: minLat - padding,
      maxLat: maxLat + padding,
      minLng: minLng - padding,
      maxLng: maxLng + padding,
      width: 1200,
      height: 800
    };

    // Transform stations
    const stations: TransformedStation[] = system.stations.map(station => {
      const x = ((station.coordinates.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * bounds.width;
      const y = bounds.height - ((station.coordinates.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * bounds.height;
      
      return {
        ...station,
        x,
        y
      };
    });

    return { stations, bounds };
  }, [system.stations]);

  useEffect(() => {
    const { stations, bounds } = transformCoordinates;
    setTransformedStations(stations);
    setSvgBounds(bounds);
  }, [transformCoordinates]);

  const handleStationClick = (station: TransformedStation) => {
    onStationClick?.(station);
  };

  const handleMouseEnter = (e: React.MouseEvent, station: TransformedStation) => {
    const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
    setTooltipInfo({
      station,
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const handleMouseLeave = () => {
    setTooltipInfo(null);
  };

  const getStationRadius = (station: TransformedStation) => {
    return station.isInterchange ? 8 : 5;
  };

  const getLineColor = (lineId: string) => {
    return system.colors?.[lineId] || '#666666';
  };

  const renderLine = (line: any) => {
    const lineStations = line.stations
      .map((stationId: string) => transformedStations.find(s => s.id === stationId))
      .filter(Boolean);

    if (lineStations.length < 2) return null;

    const pathData = lineStations.reduce((path: string, station: TransformedStation, index: number) => {
      if (index === 0) {
        return `M ${station.x} ${station.y}`;
      }
      return `${path} L ${station.x} ${station.y}`;
    }, '');

    return (
      <path
        key={`line-${line.id}`}
        d={pathData}
        stroke={getLineColor(line.id)}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-300"
        opacity={selectedLines.length === 0 || selectedLines.includes(line.id) ? 1 : 0.3}
      />
    );
  };

  const renderStation = (station: TransformedStation) => {
    const radius = getStationRadius(station);
    const primaryLineColor = getLineColor(station.lines[0] || '');
    
    return (
      <g
        key={station.id}
        onMouseEnter={(e) => handleMouseEnter(e, station)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleStationClick(station)}
        className="cursor-pointer group"
      >
        {/* Station circle */}
        <circle
          cx={station.x}
          cy={station.y}
          r={radius}
          fill={isDarkMode ? '#1a1a1a' : '#ffffff'}
          stroke={primaryLineColor}
          strokeWidth={station.isInterchange ? 3 : 2}
          className="transition-all duration-200 group-hover:scale-125"
          filter={station.isInterchange ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : undefined}
        />
        
        {/* Station label */}
        {showLabels && (
          <text
            x={station.x + radius + 4}
            y={station.y + 4}
            className={`text-xs font-medium pointer-events-none transition-opacity duration-200 ${
              isDarkMode ? 'fill-gray-300' : 'fill-gray-700'
            }`}
            style={{ fontSize: '11px' }}
          >
            {station.name}
          </text>
        )}
      </g>
    );
  };

  if (!svgBounds) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center">
          <Train className="w-16 h-16 mx-auto animate-spin text-primary/50" />
          <p className="mt-2 text-muted-foreground">Loading transit map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <TransformWrapper
        initialScale={0.8}
        minScale={0.3}
        maxScale={3}
        limitToBounds={false}
        panning={{ disabled: false }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-background/90 backdrop-blur-sm border-b border-border/50 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-bold text-foreground">
                    {system.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {system.stations.length} stations • {system.lines.length} lines • {system.city}, {system.country}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => zoomIn()}
                    className="px-2 py-1 text-sm bg-muted hover:bg-accent rounded transition-colors"
                  >
                    +
                  </button>
                  <button
                    onClick={() => zoomOut()}
                    className="px-2 py-1 text-sm bg-muted hover:bg-accent rounded transition-colors"
                  >
                    -
                  </button>
                  <button
                    onClick={() => resetTransform()}
                    className="px-2 py-1 text-sm bg-muted hover:bg-accent rounded transition-colors"
                  >
                    Reset
                  </button>
                  <div className="text-xs text-muted-foreground ml-2">
                    Universal Transit Renderer
                  </div>
                </div>
              </div>
            </div>

            <TransformComponent>
              <svg
                viewBox={`0 0 ${svgBounds.width} ${svgBounds.height}`}
                className="w-full h-full"
                style={{ 
                  minWidth: svgBounds.width, 
                  minHeight: svgBounds.height,
                  backgroundColor: isDarkMode ? '#0a0a0a' : '#f8f9fa'
                }}
              >
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Render lines first (behind stations) */}
                <g className="lines">
                  {system.lines.map(line => renderLine(line))}
                </g>

                {/* Render stations */}
                <g className="stations">
                  {transformedStations.map(station => renderStation(station))}
                </g>
              </svg>
            </TransformComponent>

            {/* Tooltip */}
            {tooltipInfo && (
              <div
                className="absolute z-50 bg-card rounded-lg shadow-xl border border-border p-3 pointer-events-none transform -translate-x-1/2 -translate-y-full"
                style={{
                  left: tooltipInfo.x,
                  top: tooltipInfo.y - 10,
                  backdropFilter: 'blur(8px)'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-foreground text-sm">
                    {tooltipInfo.station.name}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {tooltipInfo.station.codes.join(' • ')}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">Lines:</span>
                  <div className="flex gap-1">
                    {tooltipInfo.station.lines.map(lineId => (
                      <span
                        key={lineId}
                        className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: getLineColor(lineId) }}
                      >
                        {lineId}
                      </span>
                    ))}
                  </div>
                </div>
                {tooltipInfo.station.isInterchange && (
                  <div className="mt-2 text-xs text-primary">
                    <Zap className="w-3 h-3 inline mr-1" />
                    Interchange Station
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

export default UniversalTransitMap;