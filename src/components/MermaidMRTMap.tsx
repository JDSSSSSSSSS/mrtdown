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
      : data.lines.slice(0, 4); // Show first 4 lines for better readability

    let diagram = 'graph TB\n';
    diagram += '    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:2px,color:#1f2937;\n';
    
    // Add line-specific styling
    Object.entries(OFFICIAL_COLORS).forEach(([lineId, color]) => {
      diagram += `    classDef ${lineId} fill:${color},stroke:${color},stroke-width:3px,color:#ffffff;\n`;
    });

    // Add interchange styling
    diagram += '    classDef interchange fill:#ffffff,stroke:#1f2937,stroke-width:4px,color:#1f2937;\n';

    // Generate simplified network structure
    filteredLines.forEach((line) => {
      const lineStations = data.stations.filter(station => 
        station.lines.includes(line.id)
      ).slice(0, 8); // Limit stations for readability

      // Add stations for this line
      lineStations.forEach((station, index) => {
        const stationLabel = showLabels ? station.name.replace(/\s+/g, '<br/>') : station.id;
        const isInterchange = station.isInterchange;
        const className = isInterchange ? 'interchange' : line.id;
        
        diagram += `    ${station.id}["${stationLabel}"]:::${className}\n`;

        // Connect to next station in line
        if (index < lineStations.length - 1) {
          const nextStation = lineStations[index + 1];
          diagram += `    ${station.id} --> ${nextStation.id}\n`;
        }
      });
    });

    // Add some key interchanges manually for better structure
    if (data.stations.length > 0) {
      const interchanges = data.stations.filter(s => s.isInterchange).slice(0, 6);
      interchanges.forEach((station, index) => {
        if (index < interchanges.length - 1) {
          const nextInterchange = interchanges[index + 1];
          diagram += `    ${station.id} -.-> ${nextInterchange.id}\n`;
        }
      });
    }

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

        // Add click handlers manually
        const svgElement = mermaidRef.current!.querySelector('svg');
        if (svgElement) {
          svgElement.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            const stationElement = target.closest('[id]');
            if (stationElement && onStationClick) {
              const stationId = stationElement.id.replace('flowchart-', '').replace('-0', '');
              const station = data.stations.find(s => s.id === stationId);
              if (station) {
                onStationClick(station);
              }
            }
          });
        }

      } catch (error) {
        console.error('Error rendering Mermaid diagram:', error);
        mermaidRef.current!.innerHTML = '<p class="text-red-500 p-4">Error rendering transit map</p>';
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
      {/* Header */}
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
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-500">
              Powered by Mermaid.js • Click stations for details
            </div>
          </div>
        </div>
      </div>

      {/* Mermaid Diagram Container */}
      <div className="pt-20 h-full min-h-[600px] overflow-auto bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="p-6">
          <div 
            ref={mermaidRef} 
            className="w-full h-full mermaid-container"
            style={{
              minHeight: '500px',
              fontSize: '14px',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4 max-w-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">MRT Lines</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {data?.lines.slice(0, 8).map((line) => (
            <div key={line.id} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full border" 
                style={{ 
                  backgroundColor: OFFICIAL_COLORS[line.id as keyof typeof OFFICIAL_COLORS] || line.color,
                  borderColor: OFFICIAL_COLORS[line.id as keyof typeof OFFICIAL_COLORS] || line.color
                }}
              />
              <span className="text-gray-700 truncate">{line.id}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-800" />
            <span>Interchange Station</span>
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
          <div className="text-xs text-gray-500">
            Mermaid.js Network Diagram • {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MermaidMRTMap;