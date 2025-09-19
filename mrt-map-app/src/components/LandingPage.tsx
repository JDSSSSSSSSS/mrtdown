import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { MapPin, Train, Clock, Star, Globe, Zap, Network, Activity, Users, Eye, EyeOff, Plus, Minus, RotateCcw, Wifi, WifiOff, Settings, Info, Layers, Moon, Sun } from 'lucide-react';
import MermaidMRTMap from './MermaidMRTMap';
import OfficialLTAMap from './OfficialLTAMap';
import EnhancedMRTMap from './EnhancedMRTMap';
import UniversalTransitMap from './UniversalTransitMap';
import StationInfo from './StationInfo';
import { CitySelector, CITIES } from './CitySelector';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Station } from '../data/mrtData';
import { TransitStation } from '../data/transitSystem';
import { useTransitSystem } from '../context/TransitSystemContext';
import { TRANSIT_SYSTEMS } from '../data/transitSystem';
import { useTheme } from '../context/ThemeProvider';

const LandingPage: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<Station | TransitStation | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [selectedLines, setSelectedLines] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('singapore');
  const [mapVersion, setMapVersion] = useState<'mermaid' | 'enhanced' | 'official'>('mermaid');
  const [isConnected, setIsConnected] = useState(true);
  const { currentSystem, availableSystems, switchSystem, loading, error } = useTransitSystem();
  const { theme, setTheme } = useTheme();

  // Handle city switching
  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId);
    setSelectedStation(null); // Clear selected station when switching cities
    switchSystem(cityId);
  };

  // Handle station selection for universal transit systems
  const handleUniversalStationClick = (station: TransitStation) => {
    setSelectedStation(station);
  };

  // Mock data for system status
  const systemStats = {
    totalStations: 160,
    totalLines: 6,
    uptime: 98.7,
    activeIncidents: 0,
    dailyRidership: "3.2M"
  };

  const selectedCityData = CITIES.find(city => city.id === selectedCity);

  if (loading) {
    return (
      <div className="min-h-screen bg-background gradient-bg flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-primary/20 mx-auto"></div>
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-primary absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            <Network className="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground animate-pulse-slow">Loading Transit System</h2>
            <div className="space-y-1">
              <p className="text-base text-muted-foreground">Initializing interactive map data</p>
              <p className="text-sm text-muted-foreground/70">
                {selectedCityData?.name} • {selectedCityData?.stations} stations • {selectedCityData?.lines} lines
              </p>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div className="bg-primary h-full rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background gradient-bg flex items-center justify-center">
        <div className="text-center space-y-4 bg-destructive/10 p-8 rounded-lg border border-destructive/20">
          <Zap className="w-16 h-16 mx-auto text-destructive" />
          <h2 className="text-2xl font-bold text-destructive-foreground">Failed to Load System Data</h2>
          <p className="text-destructive-foreground/80">{error}</p>
          <Button variant="destructive" onClick={() => switchSystem('singapore')}>
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background gradient-bg">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary rounded-lg">
                  <Network className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">Universal Transit Map</h1>
                  <p className="text-xs text-muted-foreground">Interactive Network Visualization</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                {isConnected ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span className="text-muted-foreground">Live</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-red-500" />
                    <span className="text-muted-foreground">Offline</span>
                  </>
                )}
              </div>

              <CitySelector
                selectedCity={selectedCity}
                onCityChange={handleCityChange}
              />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-9 w-9"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width Dashboard Layout */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-120px)]">

          {/* Map Area - Spans 9 columns for more space */}
          <div className="lg:col-span-9 relative bg-muted/10 rounded-xl border border-border/30 overflow-hidden">
            <div className="absolute inset-0">
              {/* Map content will be rendered here */}
              <div className="w-full h-full flex items-center justify-center">
                <div className='text-center'>
                  <Network className="w-16 h-16 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">Interactive Transit Map</p>
                </div>
              </div>
            </div>
          </div>
          
          <Rnd
            default={{
              x: 50,
              y: 100,
              width: Math.min(1200, window.innerWidth - 100),
              height: Math.min(800, window.innerHeight - 200),
            }}
            minWidth={600}
            minHeight={500}
            maxWidth={window.innerWidth - 50}
            maxHeight={window.innerHeight - 150}
            bounds="window"
            className="z-50"
            dragHandleClassName="drag-handle"
            enableResizing={{
              top: true,
              right: true,
              bottom: true,
              left: true,
              topRight: true,
              bottomRight: true,
              bottomLeft: true,
              topLeft: true,
            }}
          >
            <Card className="h-full w-full glass border-border/50 flex flex-col">
              <CardHeader className="pb-4 cursor-move drag-handle bg-card/95 backdrop-blur-sm border-b border-border/20">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Train className="w-5 h-5" />
                      Interactive Network Map
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedCityData?.name} • Live System
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowLabels(!showLabels)}
                      className="h-8"
                    >
                      {showLabels ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      <span className="ml-1 hidden sm:inline">{showLabels ? 'Labels' : 'Codes'}</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMapVersion(
                        mapVersion === 'mermaid' ? 'enhanced' :
                        mapVersion === 'enhanced' ? 'official' : 'mermaid'
                      )}
                      className="h-8"
                    >
                      <Layers className="w-4 h-4" />
                      <span className="ml-1 hidden sm:inline">
                        {mapVersion === 'mermaid' ? 'Network' :
                         mapVersion === 'enhanced' ? 'Enhanced' : 'Official'}
                      </span>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0 flex-grow">
                <div className="h-full rounded-b-lg overflow-hidden">
                  {selectedCity === 'singapore' && (
                    <>
                      {mapVersion === 'mermaid' && (
                        <MermaidMRTMap
                          onStationClick={setSelectedStation}
                          showLabels={showLabels}
                          selectedLines={selectedLines}
                          className="h-full"
                        />
                      )}
                      {mapVersion === 'enhanced' && (
                        <EnhancedMRTMap
                          onStationClick={setSelectedStation}
                          showLabels={showLabels}
                          selectedLines={selectedLines}
                          className="h-full"
                        />
                      )}
                      {mapVersion === 'official' && (
                        <OfficialLTAMap
                          onStationClick={setSelectedStation}
                          showLabels={showLabels}
                          selectedLines={selectedLines}
                          className="h-full"
                        />
                      )}
                    </>
                  )}
                  {(selectedCity === 'nyc' || selectedCity === 'tokyo') && currentSystem && (
                    <UniversalTransitMap
                      system={currentSystem}
                      onStationClick={handleUniversalStationClick}
                      showLabels={showLabels}
                      selectedLines={selectedLines}
                      className="h-full"
                    />
                  )}
                  {(selectedCity === 'nyc' || selectedCity === 'tokyo') && !currentSystem && (
                    <div className="h-full flex items-center justify-center bg-muted/30">
                      <div className="text-center space-y-4">
                        <Train className="w-16 h-16 mx-auto text-primary animate-pulse" />
                        <div>
                          <h3 className="text-lg font-semibold">{selectedCityData?.name}</h3>
                          <p className="text-muted-foreground">Loading transit data...</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {!['singapore', 'nyc', 'tokyo'].includes(selectedCity) && (
                    <div className="h-full flex items-center justify-center bg-muted/30">
                      <div className="text-center space-y-4">
                        <Globe className="w-16 h-16 mx-auto text-muted-foreground" />
                        <div>
                          <h3 className="text-lg font-semibold">{selectedCityData?.name}</h3>
                          <p className="text-muted-foreground">
                            {selectedCityData?.lines} lines • {selectedCityData?.stations} stations
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-md">
                          Interactive map for {selectedCityData?.name} will be available soon.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Rnd>

          {/* Right Sidebar - Spans 3 columns for more compact info */}
          <div className="lg:col-span-3 space-y-4 overflow-y-auto">

            {/* Station Details */}
            <Card className="glass border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="w-4 h-4" />
                  Station Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {selectedStation ? (
                  <StationInfo station={selectedStation} />
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2 text-sm">Click on any station</p>
                    <p className="text-xs text-muted-foreground">to view detailed information</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="glass border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="w-4 h-4" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{systemStats.uptime}%</div>
                    <div className="text-xs text-muted-foreground">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{systemStats.activeIncidents}</div>
                    <div className="text-xs text-muted-foreground">Incidents</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{systemStats.totalStations}</div>
                    <div className="text-xs text-muted-foreground">Stations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{systemStats.totalLines}</div>
                    <div className="text-xs text-muted-foreground">Lines</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last updated</span>
                    <span className="font-mono text-xs">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Network Stats */}
            <Card className="glass border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="w-4 h-4" />
                  Network Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Daily Ridership</span>
                  <span className="font-semibold">{systemStats.dailyRidership}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Network Length</span>
                  <span className="font-semibold">240 km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Speed</span>
                  <span className="font-semibold">35 km/h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Train Capacity</span>
                  <span className="font-semibold">800 pax</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings className="w-4 h-4" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSelectedLines([])}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setShowLabels(!showLabels)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showLabels ? 'Hide Labels' : 'Show Labels'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Info className="w-4 h-4 mr-2" />
                  Help & Shortcuts
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-border/50">
          <div className="text-center text-sm text-muted-foreground">
            <p>Universal Transit Map Engine • Built with React, TypeScript & Tailwind CSS</p>
            <p className="mt-1">Supporting Singapore MRT, NYC Subway, Tokyo Metro, London Underground & more</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
