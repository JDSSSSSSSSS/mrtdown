import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple translation function
const translations: { [lang: string]: { [key: string]: string } } = {
  'en': {
    'map.title': 'Singapore MRT Network',
    'map.subtitle': 'Interactive System Map',
    'stations': 'Stations',
    'lines': 'Lines',
    'legend.title': 'Network Lines',
    'status.operational': 'Operational',
    'status.last_updated': 'Last updated',
  },
  'zh-Hans': {
    'map.title': '新加坡地铁网络',
    'map.subtitle': '互动系统地图',
    'stations': '车站',
    'lines': '线路',
    'legend.title': '网络线路',
    'status.operational': '运营中',
    'status.last_updated': '最后更新',
  },
  'ms': {
    'map.title': 'Rangkaian MRT Singapura',
    'map.subtitle': 'Peta Sistem Interaktif',
    'stations': 'Stesen',
    'lines': 'Laluan',
    'legend.title': 'Laluan Rangkaian',
    'status.operational': 'Beroperasi',
    'status.last_updated': 'Dikemas kini',
  },
  'ta': {
    'map.title': 'சிங்கப்பூர் MRT வலையமைப்பு',
    'map.subtitle': 'ஊடாடும் அமைப்பு வரைபடம்',
    'stations': 'நிலையங்கள்',
    'lines': 'பாதைகள்',
    'legend.title': 'வலையமைப்பு பாதைகள்',
    'status.operational': 'செயல்படுகிறது',
    'status.last_updated': 'கடைசியாக புதுப்பிக்கப்பட்டது',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export { LanguageContext };
