# Singapore MRT Network Map

An accurate, interactive representation of Singapore's MRT (Mass Rapid Transit) network based on official LTA data and the comprehensive mrtdown-data repository.

![Singapore MRT Map](https://img.shields.io/badge/Singapore-MRT%20Network-brightgreen)
![Built with React](https://img.shields.io/badge/Built%20with-React-blue)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)
![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC)

## 🌟 Features

### ✅ **Accurate Data**
- **Official LTA Data**: Based on Land Transport Authority's official network information
- **Real Station Coordinates**: Precise GPS coordinates for all stations
- **Multi-language Support**: Station names in English, Chinese, Malay, and Tamil
- **Complete Network Coverage**: All 6 MRT lines and LRT connections

### 🎯 **Interactive Experience**
- **Click Stations**: View detailed information for any station
- **Line Filtering**: Show/hide specific MRT lines
- **Label Toggle**: Control station name visibility
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Interchange Detection**: Automatic identification of transfer stations

### 🗺️ **Schematic Design**
- **Visual Clarity**: Optimized for wayfinding, not geographic accuracy
- **Official Colors**: Uses LTA's official line colors
- **Clean Typography**: Clear, readable station labels
- **Interchange Highlighting**: Larger circles for transfer stations

## 🚇 Supported Lines

| Line | Name | Color | Type | Stations |
|------|------|-------|------|----------|
| **NSL** | North-South Line | <span style="color: #d42e12">●</span> `#d42e12` | High Capacity | 27 |
| **EWL** | East-West Line | <span style="color: #009645">●</span> `#009645` | High Capacity | 35 |
| **CCL** | Circle Line | <span style="color: #fa9e0d">●</span> `#fa9e0d` | Medium Capacity | 31 |
| **NEL** | North East Line | <span style="color: #9900aa">●</span> `#9900aa` | High Capacity | 16 |
| **DTL** | Downtown Line | <span style="color: #005ec4">●</span> `#005ec4` | Medium Capacity | 34 |
| **TEL** | Thomson–East Coast Line | <span style="color: #9D5B25">●</span> `#9D5B25` | Medium Capacity | 32 |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd mrt-map-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server
The app will be available at `http://localhost:5173`

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Data Source**: mrtdown-data repository

### Project Structure
```
src/
├── components/          # React components
│   ├── MRTMap.tsx      # Main map component
│   ├── StationInfo.tsx # Station details panel
│   └── MapControls.tsx # Interactive controls
├── data/               # MRT network data
│   └── mrtData.ts      # Stations, lines, and connections
├── App.tsx             # Main application
├── main.tsx           # React entry point
└── index.css          # Global styles
```

### Key Components

#### `MRTMap.tsx`
- **SVG-based rendering** for crisp, scalable graphics
- **Schematic positioning** optimized for clarity
- **Interactive station circles** with hover effects
- **Dynamic line filtering** and visibility control

#### `StationInfo.tsx`
- **Comprehensive station details** including translations
- **Line information** with official colors
- **Quick actions** (Google Maps integration)
- **Interchange identification**

#### `MapControls.tsx`
- **Line filtering** with visual indicators
- **Label visibility toggle**
- **Quick reset actions**
- **Active filter status**

## 📊 Data Sources

### Primary Data
- **mrtdown-data**: Comprehensive MRT disruption and network data
- **LTA Official**: Land Transport Authority network specifications
- **Station Coordinates**: GPS coordinates for accurate positioning

### Data Structure
```typescript
interface Station {
  id: string                    // Unique identifier
  name: string                  // English name
  name_translations?: {         // Multi-language support
    'zh-Hans'?: string         // Simplified Chinese
    'ms'?: string              // Malay
    'ta'?: string              // Tamil
  }
  codes: string[]               // Station codes (e.g., ["NS1", "EW24"])
  lines: string[]               // Connected lines
  coordinates: {                // GPS coordinates
    lat: number
    lng: number
  }
  isInterchange: boolean        // Transfer station flag
  structureType?: string        // Underground/Elevated/At Grade
}
```

## 🎨 Design Principles

### Schematic vs Geographic
- **Prioritizes clarity** over geographic accuracy
- **Consistent spacing** between stations
- **Simplified geometry** (horizontal/vertical/45° angles)
- **Visual hierarchy** for interchanges

### Accessibility
- **High contrast colors** for visibility
- **Clear typography** for readability
- **Interactive feedback** for user actions
- **Keyboard navigation** support

### Mobile Responsiveness
- **Scalable SVG graphics** for all screen sizes
- **Touch-friendly interactions**
- **Responsive layout** with collapsible panels
- **Optimized performance** for mobile devices

## 🔧 Customization

### Adding New Stations
1. Update `src/data/mrtData.ts` with station data
2. Add coordinates to `stationPositions` in `MRTMap.tsx`
3. Update line station arrays
4. Add connections between adjacent stations

### Styling Modifications
- **Colors**: Modify line colors in `mrtData.ts`
- **Layout**: Adjust station positions in `MRTMap.tsx`
- **Typography**: Update CSS classes in `index.css`
- **Interactions**: Customize hover effects and animations

### Data Integration
The app is designed to easily integrate with real-time data:
- **API endpoints** for live disruption data
- **Status indicators** for service alerts
- **Dynamic updates** without page refresh

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- **TypeScript**: Maintain strict type safety
- **Components**: Keep components focused and reusable
- **Data**: Verify accuracy against official LTA sources
- **Testing**: Add tests for new features
- **Documentation**: Update README for significant changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Land Transport Authority (LTA)** for official MRT network data
- **mrtdown-data project** for comprehensive disruption tracking
- **Singapore MRT system** for being an excellent public transport network
- **Open source community** for the amazing tools and libraries

## 📞 Support

- **Issues**: Report bugs and feature requests on GitHub
- **Documentation**: Check this README and inline code comments
- **Community**: Join discussions in the Issues section

---

**Built with ❤️ for Singapore's MRT commuters**

*Accurate • Interactive • Accessible*
