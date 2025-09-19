// Aggregate official MRT data from mrtdown-data repository
import { Station, MRTLine, Connection } from './mrtData';
import { loadRealMRTData } from './loadRealMRTData';

// Official LTA Line Colors (verified from mrtdown data)
export const OFFICIAL_COLORS = {
  NSL: '#d42e12', // North-South Line (Red)
  EWL: '#009645', // East-West Line (Green) 
  CCL: '#fa9e0d', // Circle Line (Orange/Yellow)
  NEL: '#9900aa', // North East Line (Purple)
  DTL: '#005ec4', // Downtown Line (Blue)
  TEL: '#9D5B25', // Thomson-East Coast Line (Brown)
  JRL: '#0099aa', // Jurong Region Line (Cyan/Teal)
  CRL: '#97c616', // Cross Island Line (Green/Lime)
  BPLRT: '#669900', // Bukit Panjang LRT (Light Green)
  SKLRT: '#669900', // Sengkang LRT (Light Green) 
  PGLRT: '#669900', // Punggol LRT (Light Green)
};

// Load and aggregate all official data
export async function loadOfficialMRTData(): Promise<{
  lines: MRTLine[];
  stations: Station[];
  connections: Connection[];
}> {
  // Use real comprehensive MRT data with all 230+ stations
  return await loadRealMRTData();
}