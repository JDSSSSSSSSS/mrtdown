import React, { useState, useEffect } from 'react';
import { Station } from '../data/mrtData';
import { TransitStation } from '../data/transitSystem';
import { MapPin, Train, Building, ExternalLink, Clock, MapIcon, Globe, Star } from 'lucide-react';
import { Button } from './ui/button';
import { getEnhancedStation, getNearbyLandmarks, formatOperatingHours, getEnhancedLine, type EnhancedStation } from '../data/loadEnhancedMRTData';

interface StationInfoProps {
  station: Station | TransitStation | null;
}

// Type guard to check if station is Singapore Station
function isSingaporeStation(station: Station | TransitStation): station is Station {
  return station && 'structureType' in station;
}

const StationInfo: React.FC<StationInfoProps> = ({ station }) => {
  const [enhancedData, setEnhancedData] = useState<EnhancedStation | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  
  useEffect(() => {
    if (station && isSingaporeStation(station)) {
      const enhanced = getEnhancedStation(station.id);
      setEnhancedData(enhanced);
    } else {
      setEnhancedData(null);
    }
  }, [station]);

  if (!station) return null;

  const lineColors: { [key: string]: string } = {
    // Singapore MRT colors
    'NSL': '#d42e12', 'EWL': '#009645', 'CCL': '#fa9e0d',
    'NEL': '#9900aa', 'DTL': '#005ec4', 'TEL': '#9D5B25',
    'JRL': '#0099aa', 'CRL': '#97c616',
    
    // NYC Subway colors
    '1': '#EE352E', '2': '#EE352E', '3': '#EE352E',
    '4': '#00933C', '5': '#00933C', '6': '#00933C',
    '7': '#B933AD', 'L': '#A7A9AC',
    'N': '#FCCC0A', 'Q': '#FCCC0A', 'R': '#FCCC0A', 'W': '#FCCC0A',
    'A': '#0039A6', 'C': '#0039A6', 'E': '#0039A6',
    
    // Tokyo Metro colors
    'G': '#FF9500', 'M': '#E60012', 'H': '#A5A5A5', 'C': '#00BB85',
    'T': '#00A7DB', 'Y': '#C1A470', 'N': '#00ADA9', 'Z': '#B6007A', 'F': '#9C5E31'
  };

  const isSingapore = isSingaporeStation(station);
  
  return (
    <div className="space-y-5 p-1">
      {/* Station Name */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-1">
          {station.name}
        </h3>
        {isSingapore && (station.name_translations || enhancedData?.name_translations) && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <div className="flex gap-1">
                {['en', 'zh-Hans', 'ta', 'ms'].map((lang) => {
                  const translations = station.name_translations || enhancedData?.name_translations;
                  if (!translations || (!translations[lang] && lang !== 'en')) return null;
                  return (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        selectedLanguage === lang
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      {lang === 'en' ? 'EN' : lang === 'zh-Hans' ? '中' : lang === 'ta' ? 'த' : 'MS'}
                    </button>
                  );
                })}
              </div>
            </div>
            {selectedLanguage !== 'en' && (
              <p className="text-lg font-semibold text-foreground">
                {(station.name_translations || enhancedData?.name_translations)?.[selectedLanguage] || station.name}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Station Codes */}
      <div className="flex flex-wrap gap-2">
        {station.codes.map(code => (
          <span
            key={code}
            className="px-2.5 py-1 bg-muted text-muted-foreground text-xs font-mono rounded-md"
          >
            {code}
          </span>
        ))}
      </div>

      {/* Lines */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
          <Train className="w-4 h-4" />
          Lines Served
        </h4>
        <div className="space-y-2">
          {station.lines.map(lineId => (
            <div key={lineId} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full border-2 border-border shadow-sm flex-shrink-0"
                style={{ backgroundColor: lineColors[lineId] || 'hsl(var(--muted))' }}
              />
              <span className="text-sm font-medium text-foreground">
                {lineId.replace('LRT', ' LRT').replace('Line', ' Line')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Structure Type - Only for Singapore stations */}
      {isSingapore && station.structureType && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <Building className="w-4 h-4" />
            Structure
          </h4>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
            station.structureType === 'underground' ? 'bg-blue-500/10 text-blue-400' :
            station.structureType === 'elevated' ? 'bg-green-500/10 text-green-400' :
            station.structureType === 'at_grade' ? 'bg-yellow-500/10 text-yellow-400' :
            'bg-muted text-muted-foreground'
          }`}>
            {station.structureType.replace('_', ' ')}
          </span>
        </div>
      )}

      {/* Town/Area Information - Enhanced for Singapore */}
      {enhancedData?.town && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <MapIcon className="w-4 h-4" />
            Area
          </h4>
          <p className="text-sm text-foreground">
            {selectedLanguage !== 'en' && enhancedData.town_translations?.[selectedLanguage] 
              ? enhancedData.town_translations[selectedLanguage] 
              : enhancedData.town}
          </p>
        </div>
      )}

      {/* Nearby Landmarks - Enhanced for Singapore */}
      {enhancedData?.landmarks && enhancedData.landmarks.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Nearby Landmarks
          </h4>
          <div className="space-y-1">
            {getNearbyLandmarks(station.id, selectedLanguage).slice(0, 4).map((landmark, index) => (
              <p key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></span>
                {landmark}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Operating Hours - For Singapore lines */}
      {isSingapore && station.lines.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Operating Hours
          </h4>
          <div className="space-y-2">
            {station.lines.slice(0, 2).map(lineId => {
              const lineData = getEnhancedLine(lineId);
              if (!lineData?.operatingHours) return null;
              
              return (
                <div key={lineId} className="text-xs space-y-1">
                  <p className="font-medium text-foreground">
                    {lineData.title_translations?.[selectedLanguage] || lineData.title}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                    <div>
                      <span className="font-medium">Weekdays:</span><br />
                      {formatOperatingHours(lineData.operatingHours.weekdays)}
                    </div>
                    <div>
                      <span className="font-medium">Weekends:</span><br />
                      {formatOperatingHours(lineData.operatingHours.weekends)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Coordinates */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Location
        </h4>
        <div className="text-sm text-muted-foreground font-mono">
          {station.coordinates.lat.toFixed(6)}, {station.coordinates.lng.toFixed(6)}
        </div>
      </div>

      {/* Interchange Status */}
      {station.isInterchange && (
        <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <span className="text-sm font-medium text-primary-foreground">
              Interchange Station
            </span>
          </div>
          <p className="text-xs text-primary-foreground/80 mt-1">
            Transfer point between multiple transit lines
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 pt-5 border-t border-border/50">
        <Button
          onClick={() => {
            const url = `https://www.google.com/maps?q=${station.coordinates.lat},${station.coordinates.lng}&z=16`
            window.open(url, '_blank')
          }}
          className="w-full btn-enhance"
          variant="outline"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View on Google Maps
        </Button>
      </div>
    </div>
  );
};

export default StationInfo;