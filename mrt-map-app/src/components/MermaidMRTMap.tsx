import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Station, MRTLine } from '../data/mrtData';
import { loadOfficialMRTData } from '../data/aggregateOfficialData';

interface MermaidMRTMapProps {
  onStationClick?: (station: Station) => void;
  showLabels?: boolean;
  selectedLines?: string[];
  className?: string;
}

// Official LTA Colors for Mermaid styling
const OFFICIAL_COLORS = {
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
};

const MermaidMRTMap: React.FC<MermaidMRTMapProps> = ({
  onStationClick,
  showLabels = true,
  selectedLines = [],
  className = ''
}) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<{
    stations: Station[];
    lines: MRTLine[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Initialize Mermaid with custom configuration
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        primaryColor: '#ffffff',
        primaryTextColor: '#1f2937',
        primaryBorderColor: '#e5e7eb',
        lineColor: '#6b7280',
        sectionBkgColor: '#f9fafb',
        altSectionBkgColor: '#f3f4f6',
        gridColor: '#e5e7eb',
        secondaryColor: '#f3f4f6',
        tertiaryColor: '#f9fafb',
        background: '#ffffff',
        mainBkg: '#ffffff',
        secondBkg: '#f9fafb',
        tertiaryBkg: '#f3f4f6',
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'linear',
        padding: 20,
        nodeSpacing: 50,
        rankSpacing: 80,
        diagramPadding: 20,
      },
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '14px',
      securityLevel: 'loose', // Allow click events
    });
  }, []);

  // Keyboard shortcuts for accessibility
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return; // Don't interfere with input fields
      }

      switch (event.key) {
        case '+':
        case '=':
          event.preventDefault();
          setZoom(Math.min(zoom * 1.2, 3));
          break;
        case '-':
        case '_':
          event.preventDefault();
          setZoom(Math.max(zoom / 1.2, 0.5));
          break;
        case '0':
          event.preventDefault();
          setZoom(1);
          setPan({ x: 0, y: 0 });
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          setZoom(1);
          setPan({ x: 0, y: 0 });
          break;
        case 'l':
        case 'L':
          event.preventDefault();
          setShowLabels(!showLabels);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [zoom, showLabels]);

  // Load MRT data
  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedData = await loadOfficialMRTData();
        setData({
          stations: loadedData.stations,
          lines: loadedData.lines
        });
      } catch (error) {
        console.error('Error loading MRT data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Generate Mermaid diagram syntax for Singapore MRT
  const generateMermaidDiagram = (): string => {
    if (!data) return '';

    const filteredLines = selectedLines.length > 0
      ? data.lines.filter(line => selectedLines.includes(line.id))
      : data.lines; // Show all lines by default for complete network

    let diagram = 'graph TB\n';
    diagram += '    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:2px,color:#1f2937;\n';

    // Add line-specific styling
    Object.entries(OFFICIAL_COLORS).forEach(([lineId, color]) => {
      diagram += `    classDef ${lineId} fill:${color},stroke:${color},stroke-width:4px,color:#ffffff,font-weight:bold;\n`;
    });

    // Add interchange styling
    diagram += '    classDef interchange fill:#ffffff,stroke:#1f2937,stroke-width:5px,color:#1f2937,font-weight:bolder;\n';

    // Add airport styling
    diagram += '    classDef airport fill:#fbbf24,stroke:#d97706,stroke-width:4px,color:#92400e;\n';

    // Generate complete network structure
    filteredLines.forEach((line) => {
      const lineStations = data.stations.filter(station =>
        station.lines.includes(line.id)
      );

      // Sort stations by their position in the line (if available) or alphabetically
      lineStations.sort((a, b) => {
        const aIndex = a.codes.findIndex(code => code.startsWith(line.id));
        const bIndex = b.codes.findIndex(code => code.startsWith(line.id));
        if (aIndex !== -1 && bIndex !== -1) {
          const aNum = parseInt(a.codes[aIndex].replace(line.id, ''));
          const bNum = parseInt(b.codes[bIndex].replace(line.id, ''));
          return aNum - bNum;
        }
        return a.name.localeCompare(b.name);
      });

      // Add stations for this line
      lineStations.forEach((station, index) => {
        const stationLabel = showLabels ? station.name.replace(/\s+/g, '<br/>') : station.id;
        const isInterchange = station.isInterchange;
        const isAirport = station.id.includes('CG') || station.name.toLowerCase().includes('airport');

        let className = 'default';
        if (isAirport) className = 'airport';
        else if (isInterchange) className = 'interchange';
        else className = line.id;

        diagram += `    ${station.id}["${stationLabel}"]:::${className}\n`;

        // Connect to next station in line
        if (index < lineStations.length - 1) {
          const nextStation = lineStations[index + 1];
          const connectionStyle = line.id === 'EWL' && station.id === 'TNM' ? '-.-' : '--'; // Dashed for airport branch
          diagram += `    ${station.id} ${connectionStyle}> ${nextStation.id}\n`;
        }
      });

      // Handle branches if they exist
      if (line.branches) {
        Object.values(line.branches).forEach((branch) => {
          for (let i = 0; i < branch.stations.length - 1; i++) {
            const currentStation = branch.stations[i];
            const nextStation = branch.stations[i + 1];
            diagram += `    ${currentStation} -.-> ${nextStation}\n`;
          }
        });
      }
    });

    // Add key interchange connections for better network visualization
    const keyInterchanges = ['CTH', 'DBG', 'OTP', 'PMN', 'BNV', 'SER'];
    keyInterchanges.forEach((stationId, index) => {
      if (index < keyInterchanges.length - 1) {
        const currentStation = keyInterchanges[index];
        const nextStation = keyInterchanges[index + 1];
        diagram += `    ${currentStation} -.-> ${nextStation}\n`;
      }
    });

    return diagram;
  };

  // Render Mermaid diagram
  useEffect(() => {
    if (!data || !mermaidRef.current || loading) return;

    const renderDiagram = async () => {
      const diagramDefinition = generateMermaidDiagram();

      try {
        // Clear previous content
        mermaidRef.current!.innerHTML = '';

        // Generate unique ID
        const id = `mermaid-${Date.now()}`;

        // Render the diagram
        const { svg } = await mermaid.render(id, diagramDefinition);
        mermaidRef.current!.innerHTML = svg;

        // Add enhanced click handlers and hover effects
        const svgElement = mermaidRef.current!.querySelector('svg');
        if (svgElement) {
          // Add click handlers for stations
          svgElement.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            const stationElement = target.closest('[id]');
            if (stationElement && onStationClick) {
              let stationId = stationElement.id.replace('flowchart-', '').replace('-0', '');

              // Try to extract station ID from various Mermaid-generated IDs
              const idParts = stationElement.id.split('-');
              if (idParts.length > 2) {
                stationId = idParts[idParts.length - 2]; // Usually the station ID
              }

              const station = data.stations.find(s => s.id === stationId);
              if (station) {
                onStationClick(station);
              }
            }
          });

          // Add hover effects
          svgElement.addEventListener('mouseover', (event) => {
            const target = event.target as HTMLElement;
            const stationElement = target.closest('[id]');
            if (stationElement) {
              stationElement.style.cursor = 'pointer';
              stationElement.style.opacity = '0.8';
            }
          });

          svgElement.addEventListener('mouseout', (event) => {
            const target = event.target as HTMLElement;
            const stationElement = target.closest('[id]');
            if (stationElement) {
              stationElement.style.opacity = '1';
            }
          });
        }

      } catch (error) {
        console.error('Error rendering Mermaid diagram:', error);
        mermaidRef.current!.innerHTML = '<div class="text-red-500 p-4 text-center"><div class="font-semibold">Error rendering transit map</div><div class="text-sm mt-1">Please refresh the page</div></div>';
      }
    };

    renderDiagram();
  }, [data, selectedLines, showLabels, loading, onStationClick]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">Loading Mermaid Transit Map</p>
            <p className="text-sm text-gray-500">Generating interactive network diagram...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full bg-white rounded-xl shadow-2xl overflow-hidden ${className}`}>
      {/* Enhanced Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Singapore MRT Network
            </h1>
            <p className="text-sm text-gray-600">
              Interactive Mermaid Diagram • {data?.stations.length} Stations • {data?.lines.length} Lines
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* View Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLabels(!showLabels)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-200 ${
                  showLabels
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {showLabels ? '🔤 Labels' : '🔢 Codes'}
              </button>
            </div>

            <div className="text-xs text-gray-500 hidden sm:block">
              Powered by Mermaid.js • Click stations for details
            </div>
          </div>
        </div>
      </div>

      {/* Mermaid Diagram Container */}
      <div className="pt-20 h-full min-h-[600px] overflow-auto bg-gradient-to-br from-gray-50 to-blue-50 relative">
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <button
            onClick={() => setZoom(Math.min(zoom * 1.2, 3))}
            className="w-8 h-8 bg-white rounded shadow hover:bg-gray-50 transition-colors flex items-center justify-center text-sm font-medium"
            title="Zoom In (+)"
          >
            +
          </button>
          <button
            onClick={() => setZoom(Math.max(zoom / 1.2, 0.5))}
            className="w-8 h-8 bg-white rounded shadow hover:bg-gray-50 transition-colors flex items-center justify-center text-sm font-medium"
            title="Zoom Out (-)"
          >
            −
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="w-8 h-8 bg-white rounded shadow hover:bg-gray-50 transition-colors flex items-center justify-center text-xs"
            title="Reset View (R)"
          >
            ↻
          </button>
        </div>

        <div className="p-6">
          <div
            ref={mermaidRef}
            className="w-full h-full mermaid-container select-none"
            style={{
              minHeight: '500px',
              fontSize: `${14 * zoom}px`,
              fontFamily: 'Inter, system-ui, sans-serif',
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: 'top left',
              transition: 'transform 0.3s ease'
            }}
          />
        </div>
      </div>

      {/* Enhanced Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4 max-w-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Singapore MRT Network</h3>

        {/* Line Legend */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          {data?.lines.map((line) => (
            <div key={line.id} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border-2"
                style={{
                  backgroundColor: OFFICIAL_COLORS[line.id as keyof typeof OFFICIAL_COLORS] || line.color,
                  borderColor: OFFICIAL_COLORS[line.id as keyof typeof OFFICIAL_COLORS] || line.color
                }}
              />
              <span className="text-gray-700 truncate text-xs">
                {line.id} - {line.name.replace(' Line', '')}
              </span>
            </div>
          ))}
        </div>

        {/* Station Types */}
        <div className="space-y-2 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-800" />
            <span>Interchange Station</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-3 h-3 rounded-full bg-yellow-400 border-2 border-yellow-600" />
            <span>Airport Station</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-300" />
            <span>Regular Station</span>
          </div>
        </div>

        {/* Network Stats */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
            <div className="text-center">
              <div className="font-semibold text-gray-900">{data?.lines.length}</div>
              <div>Lines</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">{data?.stations.length}</div>
              <div>Stations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Interactive Mode
            </span>
            <span>Click stations for details</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span title="Zoom In/Out: + / - | Reset: R | Toggle Labels: L">⌨️ Shortcuts</span>
            <span>Powered by Mermaid.js</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Tooltip */}
      <div className="absolute bottom-16 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-3 max-w-xs opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <h4 className="text-xs font-semibold text-gray-900 mb-2">Keyboard Shortcuts</h4>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Zoom In:</span>
            <kbd className="bg-gray-100 px-1 rounded">+</kbd>
          </div>
          <div className="flex justify-between">
            <span>Zoom Out:</span>
            <kbd className="bg-gray-100 px-1 rounded">-</kbd>
          </div>
          <div className="flex justify-between">
            <span>Reset View:</span>
            <kbd className="bg-gray-100 px-1 rounded">R</kbd>
          </div>
          <div className="flex justify-between">
            <span>Toggle Labels:</span>
            <kbd className="bg-gray-100 px-1 rounded">L</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MermaidMRTMap;
