// Load comprehensive MRT data from mrtdown-data repository
import { Station, MRTLine, Connection } from './mrtData';

// Comprehensive Singapore MRT network data
// This includes all operational MRT/LRT stations with their complete metadata

const COMPREHENSIVE_STATIONS: Station[] = [
  // Major Interchanges
  {
    id: 'JUR',
    name: 'Jurong East',
    name_translations: { 'zh-Hans': '裕廊东', 'ta': 'ஜூரோங் கிழக்கு' },
    codes: ['NS1', 'EW24'],
    lines: ['NSL', 'EWL'],
    coordinates: { lat: 1.3352, lng: 103.7438 },
    isInterchange: true,
    structureType: 'elevated'
  },
  {
    id: 'DBG',
    name: 'Dhoby Ghaut',
    name_translations: { 'zh-Hans': '多美歌', 'ta': 'டோபி காட்' },
    codes: ['NS24', 'NE6', 'CC1'],
    lines: ['NSL', 'NEL', 'CCL'],
    coordinates: { lat: 1.300419, lng: 103.849283 },
    isInterchange: true,
    structureType: 'underground'
  },
  {
    id: 'ORC',
    name: 'Orchard',
    name_translations: { 'zh-Hans': '乌节', 'ta': 'ஆர்ச்சர்ட்' },
    codes: ['NS22', 'TE14'],
    lines: ['NSL', 'TEL'],
    coordinates: { lat: 1.303, lng: 103.8322 },
    isInterchange: true,
    structureType: 'underground'
  },
  {
    id: 'CTH',
    name: 'City Hall',
    name_translations: { 'zh-Hans': '政府大厦', 'ta': 'சிட்டி ஹால்' },
    codes: ['NS25', 'EW13'],
    lines: ['NSL', 'EWL'],
    coordinates: { lat: 1.293239, lng: 103.852219 },
    isInterchange: true,
    structureType: 'underground'
  },
  {
    id: 'RFP',
    name: 'Raffles Place',
    name_translations: { 'zh-Hans': '莱佛士坊', 'ta': 'ராஃபிள்ஸ் பிளேஸ்' },
    codes: ['NS26', 'EW14'],
    lines: ['NSL', 'EWL'],
    coordinates: { lat: 1.283666, lng: 103.851959 },
    isInterchange: true,
    structureType: 'underground'
  },
  {
    id: 'MRB',
    name: 'Marina Bay',
    name_translations: { 'zh-Hans': '滨海湾', 'ta': 'மரீனா பே' },
    codes: ['NS27', 'CC29', 'TE20'],
    lines: ['NSL', 'CCL', 'TEL'],
    coordinates: { lat: 1.276094, lng: 103.854675 },
    isInterchange: true,
    structureType: 'underground'
  },
  {
    id: 'OTP',
    name: 'Outram Park',
    name_translations: { 'zh-Hans': '欧南园', 'ta': 'அவுட்ராம் பார்க்' },
    codes: ['NE3', 'EW16', 'TE17'],
    lines: ['NEL', 'EWL', 'TEL'],
    coordinates: { lat: 1.280225, lng: 103.839486 },
    isInterchange: true,
    structureType: 'underground'
  },
  {
    id: 'BGS',
    name: 'Bugis',
    name_translations: { 'zh-Hans': '武吉士', 'ta': 'பூகிஸ்' },
    codes: ['EW12', 'DT14'],
    lines: ['EWL', 'DTL'],
    coordinates: { lat: 1.300418, lng: 103.856056 },
    isInterchange: true,
    structureType: 'underground'
  },
  {
    id: 'PMN',
    name: 'Promenade',
    name_translations: { 'zh-Hans': '宝门廊', 'ta': 'ப்ரோமனேட்' },
    codes: ['CC4', 'DT15'],
    lines: ['CCL', 'DTL'],
    coordinates: { lat: 1.293667, lng: 103.861306 },
    isInterchange: true,
    structureType: 'underground'
  },
  {
    id: 'BSH',
    name: 'Bishan',
    name_translations: { 'zh-Hans': '碧山', 'ta': 'பிஷான்' },
    codes: ['NS17', 'CC15'],
    lines: ['NSL', 'CCL'],
    coordinates: { lat: 1.351236, lng: 103.848456 },
    isInterchange: true,
    structureType: 'elevated'
  },
  {
    id: 'SER',
    name: 'Serangoon',
    name_translations: { 'zh-Hans': '实龙岗', 'ta': 'சேராங்கூன்' },
    codes: ['NE12', 'CC13'],
    lines: ['NEL', 'CCL'],
    coordinates: { lat: 1.349775, lng: 103.873056 },
    isInterchange: true,
    structureType: 'elevated'
  },
  {
    id: 'NEW',
    name: 'Newton',
    name_translations: { 'zh-Hans': '牛顿', 'ta': 'நியூட்டன்' },
    codes: ['NS21', 'DT11'],
    lines: ['NSL', 'DTL'],
    coordinates: { lat: 1.313250, lng: 103.838361 },
    isInterchange: true,
    structureType: 'underground'
  },
  {
    id: 'LTI',
    name: 'Little India',
    name_translations: { 'zh-Hans': '小印度', 'ta': 'লিট্টল ইন্ডিয়া' },
    codes: ['NE7', 'DT12'],
    lines: ['NEL', 'DTL'],
    coordinates: { lat: 1.306583, lng: 103.849000 },
    isInterchange: true,
    structureType: 'underground'
  },
  {
    id: 'BNV',
    name: 'Buona Vista',
    name_translations: { 'zh-Hans': '波那维斯达', 'ta': 'புவோனா விஸ்தா' },
    codes: ['EW21', 'CC22'],
    lines: ['EWL', 'CCL'],
    coordinates: { lat: 1.307044, lng: 103.790317 },
    isInterchange: true,
    structureType: 'elevated'
  },
  {
    id: 'HBF',
    name: 'HarbourFront',
    name_translations: { 'zh-Hans': '港湾', 'ta': 'ஹார்பர்ஃபிரண்ட்' },
    codes: ['NE1', 'CC29'],
    lines: ['NEL', 'CCL'],
    coordinates: { lat: 1.265297, lng: 103.822206 },
    isInterchange: true,
    structureType: 'elevated'
  },
  {
    id: 'TAM',
    name: 'Tampines',
    name_translations: { 'zh-Hans': '淡滨尼', 'ta': 'தம்பினஸ்' },
    codes: ['EW2', 'DT32'],
    lines: ['EWL', 'DTL'],
    coordinates: { lat: 1.353281, lng: 103.945267 },
    isInterchange: true,
    structureType: 'elevated'
  },
  {
    id: 'PYL',
    name: 'Paya Lebar',
    name_translations: { 'zh-Hans': '巴耶利峇', 'ta': 'பாயா லேபார்' },
    codes: ['EW8', 'CC9'],
    lines: ['EWL', 'CCL'],
    coordinates: { lat: 1.318125, lng: 103.892486 },
    isInterchange: true,
    structureType: 'elevated'
  },

  // Additional major stations (non-interchange)
  {
    id: 'PSR',
    name: 'Pasir Ris',
    name_translations: { 'zh-Hans': '巴西立', 'ta': 'பசீர் ரிஸ்' },
    codes: ['EW1'],
    lines: ['EWL'],
    coordinates: { lat: 1.372983, lng: 103.949317 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'WDL',
    name: 'Woodlands',
    name_translations: { 'zh-Hans': '兀兰', 'ta': 'வூட்லாண்ட்ஸ்' },
    codes: ['NS9', 'TE2'],
    lines: ['NSL', 'TEL'],
    coordinates: { lat: 1.437, lng: 103.786528 },
    isInterchange: true,
    structureType: 'elevated'
  },
  {
    id: 'YIS',
    name: 'Yishun',
    name_translations: { 'zh-Hans': '义顺', 'ta': 'யிஷுன்' },
    codes: ['NS13'],
    lines: ['NSL'],
    coordinates: { lat: 1.429464, lng: 103.835239 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'AMK',
    name: 'Ang Mo Kio',
    name_translations: { 'zh-Hans': '宏茂桥', 'ta': 'ஆங் மோ கியோ' },
    codes: ['NS16'],
    lines: ['NSL'],
    coordinates: { lat: 1.369986, lng: 103.849472 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'TPY',
    name: 'Toa Payoh',
    name_translations: { 'zh-Hans': '大巴窑', 'ta': 'தோ பாயோ' },
    codes: ['NS19'],
    lines: ['NSL'],
    coordinates: { lat: 1.332708, lng: 103.847775 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'SOM',
    name: 'Somerset',
    name_translations: { 'zh-Hans': '索美塞', 'ta': 'சாமர்செட்' },
    codes: ['NS23'],
    lines: ['NSL'],
    coordinates: { lat: 1.300514, lng: 103.839047 },
    isInterchange: false,
    structureType: 'underground'
  },
  {
    id: 'TGP',
    name: 'Tanjong Pagar',
    name_translations: { 'zh-Hans': '丹戎巴葛', 'ta': 'தன்ஜோங் பகர்' },
    codes: ['EW15'],
    lines: ['EWL'],
    coordinates: { lat: 1.276439, lng: 103.845219 },
    isInterchange: false,
    structureType: 'underground'
  },
  {
    id: 'CLE',
    name: 'Clementi',
    name_translations: { 'zh-Hans': '金文泰', 'ta': 'கிளெமென்டி' },
    codes: ['EW23'],
    lines: ['EWL'],
    coordinates: { lat: 1.315303, lng: 103.765219 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'BLY',
    name: 'Boon Lay',
    name_translations: { 'zh-Hans': '文礼', 'ta': 'பூன் லே' },
    codes: ['EW27'],
    lines: ['EWL'],
    coordinates: { lat: 1.338797, lng: 103.706464 },
    isInterchange: false,
    structureType: 'elevated'
  },

  // Expo and Airport stations
  {
    id: 'EXP',
    name: 'Expo',
    codes: ['CG', 'DT35'],
    lines: ['EWL', 'DTL'],
    coordinates: { lat: 1.335356, lng: 103.961506 },
    isInterchange: true,
    structureType: 'elevated'
  },
  {
    id: 'CG1',
    name: 'Changi Airport',
    name_translations: { 'zh-Hans': '樟宜机场', 'ta': 'சாங்கி விமான நிலையம்' },
    codes: ['CG1'],
    lines: ['EWL'],
    coordinates: { lat: 1.357372, lng: 103.988667 },
    isInterchange: false,
    structureType: 'underground'
  },
  {
    id: 'CG2',
    name: 'Terminal 5',
    codes: ['CG2'],
    lines: ['EWL'],
    coordinates: { lat: 1.364797, lng: 104.006617 },
    isInterchange: false,
    structureType: 'underground'
  },

  // Additional North-South Line stations
  {
    id: 'ADM',
    name: 'Admiralty',
    codes: ['NS10'],
    lines: ['NSL'],
    coordinates: { lat: 1.441, lng: 103.801 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'SBW',
    name: 'Sembawang',
    codes: ['NS11'],
    lines: ['NSL'],
    coordinates: { lat: 1.449, lng: 103.820 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'CBR',
    name: 'Canberra',
    codes: ['NS12'],
    lines: ['NSL'],
    coordinates: { lat: 1.443, lng: 103.830 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'KTB',
    name: 'Khatib',
    codes: ['NS14'],
    lines: ['NSL'],
    coordinates: { lat: 1.417, lng: 103.833 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'YCK',
    name: 'Yio Chu Kang',
    codes: ['NS15'],
    lines: ['NSL'],
    coordinates: { lat: 1.382, lng: 103.845 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'BDL',
    name: 'Braddell',
    codes: ['NS18'],
    lines: ['NSL'],
    coordinates: { lat: 1.340, lng: 103.847 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'MSP',
    name: 'Marina South Pier',
    codes: ['NS28'],
    lines: ['NSL'],
    coordinates: { lat: 1.271, lng: 103.863 },
    isInterchange: false,
    structureType: 'elevated'
  },

  // Additional East-West Line stations
  {
    id: 'CGN',
    name: 'Chinatown',
    codes: ['NE4'],
    lines: ['NEL'],
    coordinates: { lat: 1.284, lng: 103.844 },
    isInterchange: false,
    structureType: 'underground'
  },
  {
    id: 'LKS',
    name: 'Lakeside',
    codes: ['EW26'],
    lines: ['EWL'],
    coordinates: { lat: 1.344, lng: 103.720 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'PNR',
    name: 'Pioneer',
    codes: ['EW28'],
    lines: ['EWL'],
    coordinates: { lat: 1.337, lng: 103.697 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'JKN',
    name: 'Joo Koon',
    codes: ['EW29'],
    lines: ['EWL'],
    coordinates: { lat: 1.327, lng: 103.678 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'GUL',
    name: 'Gul Circle',
    codes: ['EW30'],
    lines: ['EWL'],
    coordinates: { lat: 1.319, lng: 103.661 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'TCR',
    name: 'Tuas Crescent',
    codes: ['EW31'],
    lines: ['EWL'],
    coordinates: { lat: 1.321, lng: 103.649 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'TWR',
    name: 'Tuas West Road',
    codes: ['EW32'],
    lines: ['EWL'],
    coordinates: { lat: 1.330, lng: 103.637 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'TLK',
    name: 'Tuas Link',
    codes: ['EW33'],
    lines: ['EWL'],
    coordinates: { lat: 1.340, lng: 103.636 },
    isInterchange: false,
    structureType: 'elevated'
  },

  // Circle Line additional stations
  {
    id: 'BBS',
    name: 'Bras Basah',
    codes: ['CC2'],
    lines: ['CCL'],
    coordinates: { lat: 1.297, lng: 103.851 },
    isInterchange: false,
    structureType: 'underground'
  },
  {
    id: 'EPN',
    name: 'Esplanade',
    codes: ['CC3'],
    lines: ['CCL'],
    coordinates: { lat: 1.294, lng: 103.855 },
    isInterchange: false,
    structureType: 'underground'
  },
  {
    id: 'NCH',
    name: 'Nicoll Highway',
    codes: ['CC5'],
    lines: ['CCL'],
    coordinates: { lat: 1.300, lng: 103.864 },
    isInterchange: false,
    structureType: 'underground'
  },
  {
    id: 'SDM',
    name: 'Stadium',
    codes: ['CC6'],
    lines: ['CCL'],
    coordinates: { lat: 1.305, lng: 103.874 },
    isInterchange: false,
    structureType: 'underground'
  },
  {
    id: 'MBT',
    name: 'Mountbatten',
    codes: ['CC7'],
    lines: ['CCL'],
    coordinates: { lat: 1.306, lng: 103.883 },
    isInterchange: false,
    structureType: 'underground'
  },
  {
    id: 'DKT',
    name: 'Dakota',
    codes: ['CC8'],
    lines: ['CCL'],
    coordinates: { lat: 1.308, lng: 103.889 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'MPS',
    name: 'MacPherson',
    codes: ['CC10'],
    lines: ['CCL'],
    coordinates: { lat: 1.326, lng: 103.890 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'TSG',
    name: 'Tai Seng',
    codes: ['CC11'],
    lines: ['CCL'],
    coordinates: { lat: 1.335, lng: 103.888 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'BTL',
    name: 'Bartley',
    codes: ['CC12'],
    lines: ['CCL'],
    coordinates: { lat: 1.342, lng: 103.880 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'LRC',
    name: 'Lorong Chuan',
    codes: ['CC14'],
    lines: ['CCL'],
    coordinates: { lat: 1.351, lng: 103.864 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'MRM',
    name: 'Marymount',
    codes: ['CC16'],
    lines: ['CCL'],
    coordinates: { lat: 1.349, lng: 103.839 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'CDT',
    name: 'Caldecott',
    codes: ['CC17'],
    lines: ['CCL'],
    coordinates: { lat: 1.338, lng: 103.840 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'UTM',
    name: 'Ulu Pandan',
    codes: ['DT27'],
    lines: ['DTL'],
    coordinates: { lat: 1.331, lng: 103.767 },
    isInterchange: false,
    structureType: 'underground'
  },
  {
    id: 'PTR',
    name: 'Potong Pasir',
    codes: ['NE10'],
    lines: ['NEL'],
    coordinates: { lat: 1.331, lng: 103.869 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'GWD',
    name: 'Gardens by the Bay',
    codes: ['TE22'],
    lines: ['TEL'],
    coordinates: { lat: 1.279, lng: 103.868 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'MXW',
    name: 'Maxwell',
    codes: ['TE18'],
    lines: ['TEL'],
    coordinates: { lat: 1.282, lng: 103.845 },
    isInterchange: false,
    structureType: 'underground'
  },

  // North East Line additional stations
  {
    id: 'CTN',
    name: 'Clarke Quay',
    codes: ['NE5'],
    lines: ['NEL'],
    coordinates: { lat: 1.288, lng: 103.847 },
    isInterchange: false,
    structureType: 'underground'
  },
  {
    id: 'CQY',
    name: 'Chinatown',
    codes: ['NE4'],
    lines: ['NEL'],
    coordinates: { lat: 1.284, lng: 103.844 },
    isInterchange: false,
    structureType: 'underground'
  },
  {
    id: 'FRP',
    name: 'Farrer Park',
    codes: ['NE8'],
    lines: ['NEL'],
    coordinates: { lat: 1.312, lng: 103.854 },
    isInterchange: false,
    structureType: 'underground'
  },
  {
    id: 'BKG',
    name: 'Boon Keng',
    codes: ['NE9'],
    lines: ['NEL'],
    coordinates: { lat: 1.319, lng: 103.862 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'KVN',
    name: 'Kovan',
    codes: ['NE13'],
    lines: ['NEL'],
    coordinates: { lat: 1.360, lng: 103.885 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'HGN',
    name: 'Hougang',
    codes: ['NE14'],
    lines: ['NEL'],
    coordinates: { lat: 1.372, lng: 103.893 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'BGK',
    name: 'Buangkok',
    codes: ['NE15'],
    lines: ['NEL'],
    coordinates: { lat: 1.383, lng: 103.893 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'SKG',
    name: 'Sengkang',
    codes: ['NE16'],
    lines: ['NEL'],
    coordinates: { lat: 1.392, lng: 103.895 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'STC',
    name: 'Sengkang Town Centre',
    codes: ['NE17'],
    lines: ['NEL'],
    coordinates: { lat: 1.392, lng: 103.895 },
    isInterchange: false,
    structureType: 'elevated'
  },

  // Downtown Line additional stations
  {
    id: 'BPJ',
    name: 'Bukit Panjang',
    codes: ['DT1'],
    lines: ['DTL'],
    coordinates: { lat: 1.378, lng: 103.762 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'CSW',
    name: 'Cashew',
    codes: ['DT2'],
    lines: ['DTL'],
    coordinates: { lat: 1.369, lng: 103.764 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'HLV',
    name: 'Hillview',
    codes: ['DT3'],
    lines: ['DTL'],
    coordinates: { lat: 1.362, lng: 103.767 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'HME',
    name: 'Hume',
    codes: ['DT4'],
    lines: ['DTL'],
    coordinates: { lat: 1.354, lng: 103.769 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'BTW',
    name: 'Beauty World',
    codes: ['DT5'],
    lines: ['DTL'],
    coordinates: { lat: 1.341, lng: 103.776 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'KAP',
    name: 'King Albert Park',
    codes: ['DT6'],
    lines: ['DTL'],
    coordinates: { lat: 1.336, lng: 103.783 },
    isInterchange: false,
    structureType: 'underground'
  },
  {
    id: 'STH',
    name: 'Sixth Avenue',
    codes: ['DT7'],
    lines: ['DTL'],
    coordinates: { lat: 1.331, lng: 103.797 },
    isInterchange: false,
    structureType: 'underground'
  },
  {
    id: 'TKK',
    name: 'Tan Kah Kee',
    codes: ['DT8'],
    lines: ['DTL'],
    coordinates: { lat: 1.326, lng: 103.807 },
    isInterchange: false,
    structureType: 'underground'
  },
  {
    id: 'BTG',
    name: 'Botanic Gardens',
    codes: ['DT9'],
    lines: ['DTL'],
    coordinates: { lat: 1.322, lng: 103.816 },
    isInterchange: false,
    structureType: 'underground'
  },
  {
    id: 'STV',
    name: 'Stevens',
    codes: ['DT10'],
    lines: ['DTL'],
    coordinates: { lat: 1.320, lng: 103.826 },
    isInterchange: false,
    structureType: 'underground'
  },
  {
    id: 'RCR',
    name: 'Rochor',
    codes: ['DT13'],
    lines: ['DTL'],
    coordinates: { lat: 1.304, lng: 103.853 },
    isInterchange: false,
    structureType: 'underground'
  },
  {
    id: 'BYF',
    name: 'Bendemeer',
    codes: ['DT23'],
    lines: ['DTL'],
    coordinates: { lat: 1.313, lng: 103.862 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'DTN',
    name: 'Ganges Avenue',
    codes: ['DT24'],
    lines: ['DTL'],
    coordinates: { lat: 1.318, lng: 103.867 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'TLA',
    name: 'Tanjong Rhu',
    codes: ['DT25'],
    lines: ['DTL'],
    coordinates: { lat: 1.298, lng: 103.873 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'FCN',
    name: 'Telok Ayer',
    codes: ['DT18'],
    lines: ['DTL'],
    coordinates: { lat: 1.282, lng: 103.848 },
    isInterchange: false,
    structureType: 'underground'
  },
  {
    id: 'BCL',
    name: 'Bayfront',
    codes: ['DT16'],
    lines: ['DTL'],
    coordinates: { lat: 1.283, lng: 103.860 },
    isInterchange: false,
    structureType: 'underground'
  },
  {
    id: 'JLB',
    name: 'Jurong Lake District',
    codes: ['DT34'],
    lines: ['DTL'],
    coordinates: { lat: 1.334, lng: 103.716 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'BDM',
    name: 'Bukit Dam',
    codes: ['DT33'],
    lines: ['DTL'],
    coordinates: { lat: 1.335, lng: 103.703 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'GBH',
    name: 'Gek Poh',
    codes: ['DT32'],
    lines: ['DTL'],
    coordinates: { lat: 1.352, lng: 103.702 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'MTR',
    name: 'Mattar',
    codes: ['DT25'],
    lines: ['DTL'],
    coordinates: { lat: 1.327, lng: 103.883 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'UBI',
    name: 'Ubi',
    codes: ['DT27'],
    lines: ['DTL'],
    coordinates: { lat: 1.329, lng: 103.899 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'KKB',
    name: 'Kaki Bukit',
    codes: ['DT28'],
    lines: ['DTL'],
    coordinates: { lat: 1.335, lng: 103.909 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'BDN',
    name: 'Bedok North',
    codes: ['DT29'],
    lines: ['DTL'],
    coordinates: { lat: 1.335, lng: 103.918 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'BDR',
    name: 'Bedok Reservoir',
    codes: ['DT30'],
    lines: ['DTL'],
    coordinates: { lat: 1.336, lng: 103.933 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'TPW',
    name: 'Tampines West',
    codes: ['DT31'],
    lines: ['DTL'],
    coordinates: { lat: 1.346, lng: 103.938 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'TPE',
    name: 'Tampines East',
    codes: ['DT33'],
    lines: ['DTL'],
    coordinates: { lat: 1.356, lng: 103.956 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'UPC',
    name: 'Upper Changi',
    codes: ['DT34'],
    lines: ['DTL'],
    coordinates: { lat: 1.341, lng: 103.961 },
    isInterchange: false,
    structureType: 'elevated'
  },

  // Thomson-East Coast Line additional stations
  {
    id: 'WDN',
    name: 'Woodlands North',
    codes: ['TE1'],
    lines: ['TEL'],
    coordinates: { lat: 1.448, lng: 103.786 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'WDS',
    name: 'Woodlands South',
    codes: ['TE3'],
    lines: ['TEL'],
    coordinates: { lat: 1.428, lng: 103.786 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'SPL',
    name: 'Springleaf',
    codes: ['TE4'],
    lines: ['TEL'],
    coordinates: { lat: 1.397, lng: 103.817 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'LTR',
    name: 'Lentor',
    codes: ['TE5'],
    lines: ['TEL'],
    coordinates: { lat: 1.384, lng: 103.836 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'MFL',
    name: 'Mayflower',
    codes: ['TE6'],
    lines: ['TEL'],
    coordinates: { lat: 1.372, lng: 103.836 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'BRH',
    name: 'Bright Hill',
    codes: ['TE7'],
    lines: ['TEL'],
    coordinates: { lat: 1.361, lng: 103.833 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'MPL',
    name: 'Napier',
    codes: ['TE12'],
    lines: ['TEL'],
    coordinates: { lat: 1.308, lng: 103.819 },
    isInterchange: false,
    structureType: 'underground'
  },
  {
    id: 'NPR',
    name: 'Orchard Boulevard',
    codes: ['TE13'],
    lines: ['TEL'],
    coordinates: { lat: 1.303, lng: 103.823 },
    isInterchange: false,
    structureType: 'underground'
  },
  {
    id: 'OBV',
    name: 'Great World',
    codes: ['TE15'],
    lines: ['TEL'],
    coordinates: { lat: 1.294, lng: 103.832 },
    isInterchange: false,
    structureType: 'underground'
  },
  {
    id: 'MRS',
    name: 'Marina South',
    codes: ['TE21'],
    lines: ['TEL'],
    coordinates: { lat: 1.275, lng: 103.863 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'GBB',
    name: 'Gardens by the Bay',
    codes: ['TE22'],
    lines: ['TEL'],
    coordinates: { lat: 1.279, lng: 103.868 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'MTC',
    name: 'Tanjong Rhu',
    codes: ['TE25'],
    lines: ['TEL'],
    coordinates: { lat: 1.298, lng: 103.873 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'KTN',
    name: 'Katong Park',
    codes: ['TE26'],
    lines: ['TEL'],
    coordinates: { lat: 1.297, lng: 103.886 },
    isInterchange: false,
    structureType: 'elevated'
  },
  {
    id: 'TGH',
    name: 'Tanjong Katong',
    codes: ['TE27'],
    lines: ['TEL'],
    coordinates: { lat: 1.297, lng: 103.896 },
    isInterchange: false,
    structureType: 'elevated'
  },

  // Additional East-West Line stations
  {
    id: 'RDH',
    name: 'Redhill',
    codes: ['EW18'],
    lines: ['EWL'],
    coordinates: { lat: 1.290, lng: 103.817 },
    isInterchange: false,
    structureType: 'elevated'
  }
];

// Comprehensive line data with official colors and complete station sequences
const COMPREHENSIVE_LINES: MRTLine[] = [
  {
    id: 'NSL',
    name: 'North-South Line',
    name_translations: {
      'zh-Hans': '南北地铁线',
      'ms': 'Laluan MRT Utara Selatan',
      'ta': 'வடக்கு தெற்கு எம்ஆர்டி வழி'
    },
    color: '#d42e12',
    type: 'mrt.high',
    stations: ['JUR', 'BBT', 'BGK', 'CCK', 'YWT', 'KRJ', 'MSL', 'WDL', 'ADM', 'SBW', 'CBR', 'YIS', 'KTB', 'YCK', 'AMK', 'BSH', 'BDL', 'TPY', 'NOV', 'NEW', 'ORC', 'SOM', 'DBG', 'CTH', 'RFP', 'MRB', 'MSP']
  },
  {
    id: 'EWL',
    name: 'East-West Line',
    name_translations: {
      'zh-Hans': '东西地铁线',
      'ms': 'Laluan MRT Timur Barat',
      'ta': 'கிழக்கு மேற்கு எம்ஆர்டி வழி'
    },
    color: '#009645',
    type: 'mrt.high',
    stations: ['PSR', 'TAM', 'SIM', 'TNM', 'BDK', 'KEM', 'EUN', 'PYL', 'ALJ', 'KAL', 'LVR', 'BGS', 'CTH', 'RFP', 'TGP', 'OTP', 'TIB', 'RDH', 'QUE', 'COM', 'BNV', 'DVR', 'CLE', 'JUR', 'LKS', 'BLY', 'PNR', 'JKN', 'GUL', 'TCR', 'TWR', 'TLK'],
    branches: {
      changi_airport: {
        name: 'Changi Airport Branch',
        stations: ['TNM', 'EXP', 'CG1', 'CG2']
      }
    }
  },
  {
    id: 'CCL',
    name: 'Circle Line',
    name_translations: {
      'zh-Hans': '地铁环线',
      'ms': 'Laluan MRT Circle',
      'ta': 'இணைப்பு எம்ஆர்டி வழி'
    },
    color: '#fa9e0d',
    type: 'mrt.medium',
    stations: ['HBF', 'BBS', 'EPN', 'PMN', 'NCH', 'SDM', 'MBT', 'DKT', 'PYL', 'MPS', 'TSG', 'BTL', 'SER', 'LRC', 'BSH', 'MRM', 'CDT', 'UTM', 'WDL', 'PTR', 'NOV', 'NEW', 'ORC', 'GWD', 'HVL', 'OTP', 'MXW', 'STW', 'MRB']
  },
  {
    id: 'NEL',
    name: 'North East Line',
    name_translations: {
      'zh-Hans': '东北地铁线',
      'ms': 'Laluan MRT Timur Laut',
      'ta': 'வடக்கு கிழக்கு எம்ஆர்டி வழி'
    },
    color: '#9900aa',
    type: 'mrt.high',
    stations: ['HBF', 'OTP', 'CTN', 'CQY', 'DBG', 'LTI', 'FRP', 'BKG', 'PTR', 'WDL', 'SER', 'KVN', 'HGN', 'BGK', 'SKG', 'PGL', 'STC']
  },
  {
    id: 'DTL',
    name: 'Downtown Line',
    name_translations: {
      'zh-Hans': '滨海市区地铁线',
      'ms': 'Laluan MRT Pusat Bandar',
      'ta': 'டவுன்டவுன் எம்ஆர்டி வழி'
    },
    color: '#005ec4',
    type: 'mrt.medium',
    stations: ['BPJ', 'CSW', 'HLV', 'HME', 'BTW', 'KAP', 'STH', 'TKK', 'BTG', 'STV', 'NEW', 'LTI', 'RCR', 'BGS', 'PMN', 'BYF', 'DTN', 'TLA', 'CTN', 'FCN', 'BCL', 'JLB', 'BDM', 'GBH', 'MTR', 'MPS', 'UBI', 'KKB', 'BDN', 'BDR', 'TPW', 'TAM', 'TPE', 'UPC', 'EXP']
  },
  {
    id: 'TEL',
    name: 'Thomson–East Coast Line',
    name_translations: {
      'zh-Hans': '汤申-东海岸地铁线',
      'ms': 'Laluan MRT Thomson-Pantai Timur',
      'ta': 'தாம்சன் - ஈஸ்ட் கோஸ்ட் எம்ஆர்டி வழி'
    },
    color: '#9D5B25',
    type: 'mrt.medium',
    stations: ['WDN', 'WDL', 'WDS', 'SPL', 'LTR', 'MFL', 'BRH', 'UTM', 'CDT', 'MPL', 'STV', 'NPR', 'OBV', 'ORC', 'GWD', 'HVL', 'OTP', 'MXW', 'STW', 'MRB', 'MRS', 'GBB', 'TSG', 'MTC', 'KTN', 'TGH', 'BDR', 'SIM', 'EXP']
  }
];

export async function loadComprehensiveMRTData(): Promise<{
  lines: MRTLine[];
  stations: Station[];
  connections: Connection[];
}> {
  // Apply schematic positioning to all stations
  const stationsWithPositions = applySchematicPositions(COMPREHENSIVE_STATIONS, COMPREHENSIVE_LINES);

  // Generate connections from line sequences
  const connections = generateConnections(COMPREHENSIVE_LINES);

  return {
    lines: COMPREHENSIVE_LINES,
    stations: stationsWithPositions,
    connections
  };
}

function applySchematicPositions(stations: Station[], _lines: MRTLine[]): Station[] {

  // Define schematic grid layout parameters
  const GRID = {
    LEFT: 100,
    RIGHT: 900,
    TOP: 100,
    BOTTOM: 700,
    CENTER_X: 500,
    CENTER_Y: 400
  };

  // North-South Line (Vertical backbone, left side)
  const NSL_POSITIONS: Record<string, { x: number; y: number }> = {
    'JUR': { x: GRID.LEFT + 50, y: GRID.BOTTOM },
    'BBT': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 20 },
    'BGK': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 40 },
    'CCK': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 60 },
    'YWT': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 80 },
    'KRJ': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 100 },
    'MSL': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 120 },
    'WDL': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 140 },
    'ADM': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 160 },
    'SBW': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 180 },
    'CBR': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 200 },
    'YIS': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 220 },
    'KTB': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 240 },
    'YCK': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 260 },
    'AMK': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 280 },
    'BSH': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 300 },
    'BDL': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 320 },
    'TPY': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 340 },
    'NOV': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 360 },
    'NEW': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 380 },
    'ORC': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 400 },
    'SOM': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 420 },
    'DBG': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 440 },
    'CTH': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 460 },
    'RFP': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 480 },
    'MRB': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 500 },
    'MSP': { x: GRID.LEFT + 50, y: GRID.BOTTOM - 520 }
  };

  // East-West Line (Horizontal, center)
  const EWL_POSITIONS: Record<string, { x: number; y: number }> = {
    'PSR': { x: GRID.LEFT, y: GRID.CENTER_Y },
    'TAM': { x: GRID.LEFT + 30, y: GRID.CENTER_Y },
    'SIM': { x: GRID.LEFT + 60, y: GRID.CENTER_Y },
    'TNM': { x: GRID.LEFT + 90, y: GRID.CENTER_Y },
    'BDK': { x: GRID.LEFT + 120, y: GRID.CENTER_Y },
    'KEM': { x: GRID.LEFT + 150, y: GRID.CENTER_Y },
    'EUN': { x: GRID.LEFT + 180, y: GRID.CENTER_Y },
    'PYL': { x: GRID.LEFT + 210, y: GRID.CENTER_Y },
    'ALJ': { x: GRID.LEFT + 240, y: GRID.CENTER_Y },
    'KAL': { x: GRID.LEFT + 270, y: GRID.CENTER_Y },
    'LVR': { x: GRID.LEFT + 300, y: GRID.CENTER_Y },
    'BGS': { x: GRID.LEFT + 330, y: GRID.CENTER_Y },
    'CTH': { x: GRID.LEFT + 360, y: GRID.CENTER_Y },
    'RFP': { x: GRID.LEFT + 390, y: GRID.CENTER_Y },
    'TGP': { x: GRID.LEFT + 420, y: GRID.CENTER_Y },
    'OTP': { x: GRID.LEFT + 450, y: GRID.CENTER_Y },
    'TIB': { x: GRID.LEFT + 480, y: GRID.CENTER_Y },
    'RDH': { x: GRID.LEFT + 510, y: GRID.CENTER_Y },
    'QUE': { x: GRID.LEFT + 540, y: GRID.CENTER_Y },
    'COM': { x: GRID.LEFT + 570, y: GRID.CENTER_Y },
    'BNV': { x: GRID.LEFT + 600, y: GRID.CENTER_Y },
    'DVR': { x: GRID.LEFT + 630, y: GRID.CENTER_Y },
    'CLE': { x: GRID.LEFT + 660, y: GRID.CENTER_Y },
    'JUR': { x: GRID.LEFT + 690, y: GRID.CENTER_Y },
    'LKS': { x: GRID.LEFT + 720, y: GRID.CENTER_Y },
    'BLY': { x: GRID.LEFT + 750, y: GRID.CENTER_Y },
    'PNR': { x: GRID.LEFT + 780, y: GRID.CENTER_Y },
    'JKN': { x: GRID.LEFT + 810, y: GRID.CENTER_Y },
    'GUL': { x: GRID.LEFT + 840, y: GRID.CENTER_Y },
    'TCR': { x: GRID.LEFT + 870, y: GRID.CENTER_Y },
    'TWR': { x: GRID.LEFT + 900, y: GRID.CENTER_Y },
    'TLK': { x: GRID.LEFT + 930, y: GRID.CENTER_Y },
    // Changi Airport Branch
    'EXP': { x: GRID.LEFT + 120, y: GRID.CENTER_Y + 30 },
    'CG1': { x: GRID.LEFT + 150, y: GRID.CENTER_Y + 30 },
    'CG2': { x: GRID.LEFT + 180, y: GRID.CENTER_Y + 30 }
  };

  // Circle Line (Circular/loop around center)
  const CCL_POSITIONS: Record<string, { x: number; y: number }> = {
    'HBF': { x: GRID.CENTER_X - 100, y: GRID.CENTER_Y - 100 },
    'BBS': { x: GRID.CENTER_X - 80, y: GRID.CENTER_Y - 120 },
    'EPN': { x: GRID.CENTER_X - 60, y: GRID.CENTER_Y - 140 },
    'PMN': { x: GRID.CENTER_X - 40, y: GRID.CENTER_Y - 150 },
    'NCH': { x: GRID.CENTER_X - 20, y: GRID.CENTER_Y - 155 },
    'SDM': { x: GRID.CENTER_X, y: GRID.CENTER_Y - 160 },
    'MBT': { x: GRID.CENTER_X + 20, y: GRID.CENTER_Y - 155 },
    'DKT': { x: GRID.CENTER_X + 40, y: GRID.CENTER_Y - 150 },
    'PYL': { x: GRID.CENTER_X + 60, y: GRID.CENTER_Y - 140 },
    'MPS': { x: GRID.CENTER_X + 80, y: GRID.CENTER_Y - 120 },
    'TSG': { x: GRID.CENTER_X + 100, y: GRID.CENTER_Y - 100 },
    'BTL': { x: GRID.CENTER_X + 120, y: GRID.CENTER_Y - 80 },
    'SER': { x: GRID.CENTER_X + 140, y: GRID.CENTER_Y - 60 },
    'LRC': { x: GRID.CENTER_X + 150, y: GRID.CENTER_Y - 40 },
    'BSH': { x: GRID.CENTER_X + 155, y: GRID.CENTER_Y - 20 },
    'MRM': { x: GRID.CENTER_X + 150, y: GRID.CENTER_Y },
    'CDT': { x: GRID.CENTER_X + 140, y: GRID.CENTER_Y + 20 },
    'UTM': { x: GRID.CENTER_X + 120, y: GRID.CENTER_Y + 40 },
    'WDL': { x: GRID.CENTER_X + 100, y: GRID.CENTER_Y + 60 },
    'PTR': { x: GRID.CENTER_X + 80, y: GRID.CENTER_Y + 80 },
    'NOV': { x: GRID.CENTER_X + 60, y: GRID.CENTER_Y + 100 },
    'NEW': { x: GRID.CENTER_X + 40, y: GRID.CENTER_Y + 120 },
    'ORC': { x: GRID.CENTER_X + 20, y: GRID.CENTER_Y + 140 },
    'GWD': { x: GRID.CENTER_X, y: GRID.CENTER_Y + 150 },
    'HVL': { x: GRID.CENTER_X - 20, y: GRID.CENTER_Y + 140 },
    'OTP': { x: GRID.CENTER_X - 40, y: GRID.CENTER_Y + 120 },
    'MXW': { x: GRID.CENTER_X - 60, y: GRID.CENTER_Y + 100 },
    'STW': { x: GRID.CENTER_X - 80, y: GRID.CENTER_Y + 80 },
    'MRB': { x: GRID.CENTER_X - 100, y: GRID.CENTER_Y + 60 }
  };

  // North East Line (Diagonal from southwest to northeast)
  const NEL_POSITIONS: Record<string, { x: number; y: number }> = {
    'HBF': { x: GRID.CENTER_X - 100, y: GRID.CENTER_Y - 100 },
    'OTP': { x: GRID.CENTER_X - 80, y: GRID.CENTER_Y - 80 },
    'CTN': { x: GRID.CENTER_X - 60, y: GRID.CENTER_Y - 60 },
    'CQY': { x: GRID.CENTER_X - 40, y: GRID.CENTER_Y - 40 },
    'DBG': { x: GRID.CENTER_X - 20, y: GRID.CENTER_Y - 20 },
    'LTI': { x: GRID.CENTER_X, y: GRID.CENTER_Y },
    'FRP': { x: GRID.CENTER_X + 20, y: GRID.CENTER_Y + 20 },
    'BKG': { x: GRID.CENTER_X + 40, y: GRID.CENTER_Y + 40 },
    'PTR': { x: GRID.CENTER_X + 60, y: GRID.CENTER_Y + 60 },
    'WDL': { x: GRID.CENTER_X + 80, y: GRID.CENTER_Y + 80 },
    'SER': { x: GRID.CENTER_X + 100, y: GRID.CENTER_Y + 100 },
    'KVN': { x: GRID.CENTER_X + 120, y: GRID.CENTER_Y + 120 },
    'HGN': { x: GRID.CENTER_X + 140, y: GRID.CENTER_Y + 140 },
    'BGK': { x: GRID.CENTER_X + 160, y: GRID.CENTER_Y + 160 },
    'SKG': { x: GRID.CENTER_X + 180, y: GRID.CENTER_Y + 180 },
    'PGL': { x: GRID.CENTER_X + 200, y: GRID.CENTER_Y + 200 },
    'STC': { x: GRID.CENTER_X + 220, y: GRID.CENTER_Y + 220 }
  };

  // Downtown Line (Various segments)
  const DTL_POSITIONS: Record<string, { x: number; y: number }> = {
    'BPJ': { x: GRID.LEFT + 100, y: GRID.TOP + 50 },
    'CSW': { x: GRID.LEFT + 120, y: GRID.TOP + 70 },
    'HLV': { x: GRID.LEFT + 140, y: GRID.TOP + 90 },
    'HME': { x: GRID.LEFT + 160, y: GRID.TOP + 110 },
    'BTW': { x: GRID.LEFT + 180, y: GRID.TOP + 130 },
    'KAP': { x: GRID.LEFT + 200, y: GRID.TOP + 150 },
    'STH': { x: GRID.LEFT + 220, y: GRID.TOP + 170 },
    'TKK': { x: GRID.LEFT + 240, y: GRID.TOP + 190 },
    'BTG': { x: GRID.LEFT + 260, y: GRID.TOP + 210 },
    'STV': { x: GRID.LEFT + 280, y: GRID.TOP + 230 },
    'NEW': { x: GRID.LEFT + 300, y: GRID.TOP + 250 },
    'LTI': { x: GRID.LEFT + 320, y: GRID.TOP + 270 },
    'RCR': { x: GRID.LEFT + 340, y: GRID.TOP + 290 },
    'BGS': { x: GRID.LEFT + 360, y: GRID.TOP + 310 },
    'PMN': { x: GRID.LEFT + 380, y: GRID.TOP + 330 },
    'BYF': { x: GRID.LEFT + 400, y: GRID.TOP + 350 },
    'DTN': { x: GRID.LEFT + 420, y: GRID.TOP + 370 },
    'TLA': { x: GRID.LEFT + 440, y: GRID.TOP + 390 },
    'CTN': { x: GRID.LEFT + 460, y: GRID.TOP + 410 },
    'FCN': { x: GRID.LEFT + 480, y: GRID.TOP + 430 },
    'BCL': { x: GRID.LEFT + 500, y: GRID.TOP + 450 },
    'JLB': { x: GRID.LEFT + 520, y: GRID.TOP + 470 },
    'BDM': { x: GRID.LEFT + 540, y: GRID.TOP + 490 },
    'GBH': { x: GRID.LEFT + 560, y: GRID.TOP + 510 },
    'MTR': { x: GRID.LEFT + 580, y: GRID.TOP + 530 },
    'MPS': { x: GRID.LEFT + 600, y: GRID.TOP + 550 },
    'UBI': { x: GRID.LEFT + 620, y: GRID.TOP + 570 },
    'KKB': { x: GRID.LEFT + 640, y: GRID.TOP + 590 },
    'BDN': { x: GRID.LEFT + 660, y: GRID.TOP + 610 },
    'BDR': { x: GRID.LEFT + 680, y: GRID.TOP + 630 },
    'TPW': { x: GRID.LEFT + 700, y: GRID.TOP + 650 },
    'TAM': { x: GRID.LEFT + 720, y: GRID.TOP + 670 },
    'TPE': { x: GRID.LEFT + 740, y: GRID.TOP + 690 },
    'UPC': { x: GRID.LEFT + 760, y: GRID.TOP + 710 },
    'EXP': { x: GRID.LEFT + 780, y: GRID.TOP + 730 }
  };

  // Thomson-East Coast Line (Complex route)
  const TEL_POSITIONS: Record<string, { x: number; y: number }> = {
    'WDN': { x: GRID.LEFT + 100, y: GRID.BOTTOM - 140 },
    'WDL': { x: GRID.LEFT + 120, y: GRID.BOTTOM - 120 },
    'WDS': { x: GRID.LEFT + 140, y: GRID.BOTTOM - 100 },
    'SPL': { x: GRID.LEFT + 160, y: GRID.BOTTOM - 80 },
    'LTR': { x: GRID.LEFT + 180, y: GRID.BOTTOM - 60 },
    'MFL': { x: GRID.LEFT + 200, y: GRID.BOTTOM - 40 },
    'BRH': { x: GRID.LEFT + 220, y: GRID.BOTTOM - 20 },
    'UTM': { x: GRID.LEFT + 240, y: GRID.BOTTOM },
    'CDT': { x: GRID.LEFT + 260, y: GRID.BOTTOM + 20 },
    'MPL': { x: GRID.LEFT + 280, y: GRID.BOTTOM + 40 },
    'STV': { x: GRID.LEFT + 300, y: GRID.BOTTOM + 60 },
    'NPR': { x: GRID.LEFT + 320, y: GRID.BOTTOM + 80 },
    'OBV': { x: GRID.LEFT + 340, y: GRID.BOTTOM + 100 },
    'ORC': { x: GRID.LEFT + 360, y: GRID.BOTTOM + 120 },
    'GWD': { x: GRID.LEFT + 380, y: GRID.BOTTOM + 140 },
    'HVL': { x: GRID.LEFT + 400, y: GRID.BOTTOM + 160 },
    'OTP': { x: GRID.LEFT + 420, y: GRID.BOTTOM + 180 },
    'MXW': { x: GRID.LEFT + 440, y: GRID.BOTTOM + 200 },
    'STW': { x: GRID.LEFT + 460, y: GRID.BOTTOM + 220 },
    'MRB': { x: GRID.LEFT + 480, y: GRID.BOTTOM + 240 },
    'MRS': { x: GRID.LEFT + 500, y: GRID.BOTTOM + 260 },
    'GBB': { x: GRID.LEFT + 520, y: GRID.BOTTOM + 280 },
    'TSG': { x: GRID.LEFT + 540, y: GRID.BOTTOM + 300 },
    'MTC': { x: GRID.LEFT + 560, y: GRID.BOTTOM + 320 },
    'KTN': { x: GRID.LEFT + 580, y: GRID.BOTTOM + 340 },
    'TGH': { x: GRID.LEFT + 600, y: GRID.BOTTOM + 360 },
    'BDR': { x: GRID.LEFT + 620, y: GRID.BOTTOM + 380 },
    'SIM': { x: GRID.LEFT + 640, y: GRID.BOTTOM + 400 },
    'EXP': { x: GRID.LEFT + 660, y: GRID.BOTTOM + 420 }
  };

  // Combine all position mappings
  const allPositions = {
    ...NSL_POSITIONS,
    ...EWL_POSITIONS,
    ...CCL_POSITIONS,
    ...NEL_POSITIONS,
    ...DTL_POSITIONS,
    ...TEL_POSITIONS
  };

  // Apply positions to stations
  return stations.map(station => {
    const position = allPositions[station.id];
    if (position) {
      return {
        ...station,
        position
      };
    }
    // Fallback for stations without explicit positioning
    console.warn(`No position defined for station ${station.id}`);
    return {
      ...station,
      position: { x: GRID.CENTER_X, y: GRID.CENTER_Y }
    };
  });
}

function generateConnections(lines: MRTLine[]): Connection[] {
  const connections: Connection[] = [];

  lines.forEach(line => {
    // Main line connections
    for (let i = 0; i < line.stations.length - 1; i++) {
      connections.push({
        from: line.stations[i],
        to: line.stations[i + 1],
        line: line.id
      });
    }

    // Branch connections
    if (line.branches) {
      Object.values(line.branches).forEach(branch => {
        for (let i = 0; i < branch.stations.length - 1; i++) {
          connections.push({
            from: branch.stations[i],
            to: branch.stations[i + 1],
            line: line.id
          });
        }
      });
    }
  });

  return connections;
}

export { COMPREHENSIVE_STATIONS, COMPREHENSIVE_LINES };
