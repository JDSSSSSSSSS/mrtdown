import React from 'react';
import { Eye, EyeOff, Train } from 'lucide-react';

interface MapControlsProps {
  showLabels: boolean;
  setShowLabels: (show: boolean) => void;
  selectedLines: string[];
  setSelectedLines: (lines: string[]) => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  showLabels,
  setShowLabels,
  selectedLines,
  setSelectedLines
}) => {
  const availableLines = [
    { id: 'NSL', name: 'North-South Line', color: '#d42e12' },
    { id: 'EWL', name: 'East-West Line', color: '#009645' },
    { id: 'CCL', name: 'Circle Line', color: '#fa9e0d' },
    { id: 'NEL', name: 'North East Line', color: '#9900aa' },
    { id: 'DTL', name: 'Downtown Line', color: '#005ec4' },
    { id: 'TEL', name: 'Thomson–East Coast Line', color: '#9D5B25' },
  ];

  const handleLineToggle = (lineId: string) => {
    if (selectedLines.includes(lineId)) {
      setSelectedLines(selectedLines.filter(id => id !== lineId));
    } else {
      setSelectedLines([...selectedLines, lineId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedLines.length === availableLines.length) {
      setSelectedLines([]);
    } else {
      setSelectedLines(availableLines.map(line => line.id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        
        {/* Labels Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
              showLabels 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {showLabels ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {showLabels ? 'Hide' : 'Show'} Labels
            </span>
          </button>
        </div>

        {/* Line Selection */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <Train className="w-5 h-5 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-700">Filter Lines</h3>
            <button
              onClick={handleSelectAll}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              {selectedLines.length === availableLines.length ? 'Clear All' : 'Select All'}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {availableLines.map(line => {
              const isSelected = selectedLines.includes(line.id);
              return (
                <button
                  key={line.id}
                  onClick={() => handleLineToggle(line.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-white border-2 shadow-sm'
                      : 'bg-gray-100 border-2 border-transparent text-gray-600 hover:bg-gray-200'
                  }`}
                  style={isSelected ? { borderColor: line.color } : {}}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: line.color }}
                  />
                  <span>{line.id}</span>
                </button>
              );
            })}
          </div>
          
          <div className="mt-2 text-xs text-gray-500">
            {selectedLines.length === 0 
              ? 'All lines shown' 
              : `${selectedLines.length} line${selectedLines.length === 1 ? '' : 's'} selected`
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapControls;