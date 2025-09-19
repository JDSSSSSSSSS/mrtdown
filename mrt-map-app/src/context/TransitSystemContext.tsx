import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TransitSystem, TransitSystemFactory, TransitSystemContextType, TRANSIT_SYSTEMS } from '../data/transitSystem';

const TransitSystemContext = createContext<TransitSystemContextType | undefined>(undefined);

interface TransitSystemProviderProps {
  children: ReactNode;
  defaultSystem?: string;
}

export const TransitSystemProvider: React.FC<TransitSystemProviderProps> = ({ 
  children, 
  defaultSystem = 'singapore' 
}) => {
  const [currentSystem, setCurrentSystem] = useState<TransitSystem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const availableSystems = Object.keys(TRANSIT_SYSTEMS);

  const switchSystem = async (systemId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const system = await TransitSystemFactory.loadSystem(systemId);
      setCurrentSystem(system);
      
      // Store preference in localStorage
      localStorage.setItem('preferred-transit-system', systemId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transit system');
      console.error('Error loading transit system:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load initial system (from localStorage or default)
    const savedSystem = localStorage.getItem('preferred-transit-system');
    const initialSystem = savedSystem && TRANSIT_SYSTEMS[savedSystem] ? savedSystem : defaultSystem;
    
    switchSystem(initialSystem);
  }, [defaultSystem]);

  const contextValue: TransitSystemContextType = {
    currentSystem,
    availableSystems,
    switchSystem,
    loading,
    error
  };

  return (
    <TransitSystemContext.Provider value={contextValue}>
      {children}
    </TransitSystemContext.Provider>
  );
};

export const useTransitSystem = (): TransitSystemContextType => {
  const context = useContext(TransitSystemContext);
  if (context === undefined) {
    throw new Error('useTransitSystem must be used within a TransitSystemProvider');
  }
  return context;
};

export { TransitSystemContext };
