import React from 'react';
import OfficialMRTMap from './OfficialMRTMap';
import { Station } from '../data/mrtData';

interface MRTMapProps {
  onStationClick?: (station: Station) => void;
  showLabels?: boolean;
  selectedLines?: string[];
  className?: string;
}

const MRTMap: React.FC<MRTMapProps> = ({
  onStationClick,
  showLabels = true,
  selectedLines = [],
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`}>
      <OfficialMRTMap
        onStationClick={onStationClick}
        showLabels={showLabels}
        selectedLines={selectedLines}
        className="w-full"
      />
    </div>
  );
};

export default MRTMap;