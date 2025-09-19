# Universal Transit Map Visualization

> **🙏 Built with immense gratitude to [@foldaway](https://github.com/foldaway) and the MRTDown ecosystem**
> 
> This project stands on the shoulders of giants - specifically the incredible work done by [@foldaway](https://github.com/foldaway) with [MRTDown Data](https://github.com/foldaway/mrtdown-data) and [MRTDown Site](https://github.com/foldaway/mrtdown-site). Without their comprehensive Singapore MRT data collection, real-time tracking, and community-driven approach, this universal transit visualization platform would not exist.

A comprehensive, interactive transit map application supporting multiple cities worldwide, including Singapore MRT, NYC Subway, Tokyo Metro, and more. Built with modern web technologies and designed as a universal transit system visualization platform.

![Universal Transit Map](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/React-18.x-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC)

## 🚀 Features

### 🗺️ Multi-City Transit Support
- **Singapore MRT**: Complete network with all lines (NSL, EWL, CCL, NEL, DTL, TEL, JRL, CRL)
- **New York Subway**: Comprehensive subway system with major lines
- **Tokyo Metro**: Full metro network with accurate station data
- **Extensible Architecture**: Easy to add new transit systems

### 🎨 Multiple Visualization Modes
- **Mermaid Network Maps**: Interactive diagram-based visualization
- **Enhanced Maps**: Custom-styled transit maps with modern design
- **Official LTA Style**: Singapore-specific maps matching official LTA design
- **Universal Transit Renderer**: Geographic coordinate-based rendering for any transit system

### 🌟 Interactive Features
- **Pan & Zoom**: Smooth navigation with mouse/touch support
- **Station Details**: Click any station for detailed information
- **Line Filtering**: Show/hide specific transit lines
- **Label Toggle**: Switch between station names and codes
- **Dark Mode**: Full dark theme support with system preference detection
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 🎯 Modern UI/UX
- **Command Center Dashboard**: Full-width layout optimized for data visualization
- **Floating Map Panel**: Draggable and resizable map interface
- **Glass Morphism Design**: Modern visual effects with backdrop blur
- **Smooth Animations**: Polished interactions with CSS transitions
- **Accessibility**: WCAG compliant with proper ARIA labels

## 🏗️ Architecture

```
mrtdown/
├── mrt-map-app/          # React frontend application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── data/         # Transit system data
│   │   ├── context/      # React contexts
│   │   └── hooks/        # Custom React hooks
├── mrtdown-data/         # Data API and backend services
├── mrtdown-site/         # Additional site components
└── docs/                 # Documentation
```

## 🚦 Quick Start

### Prerequisites
- Node.js 18+ (see `.nvmrc` for exact version)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/johnxie/mrtdown.git
   cd mrtdown
   ```

2. **Install dependencies**
   ```bash
   cd mrt-map-app
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

## 🛠️ Development

### Adding New Transit Systems

1. **Create data file** in `src/data/`
   ```typescript
   export const newCityData: Partial<TransitSystem> = {
     stations: [...],
     lines: [...],
     connections: [...]
   };
   ```

2. **Update TransitSystemFactory** in `src/data/transitSystem.ts`
   ```typescript
   'new-city': {
     id: 'new-city',
     name: 'New City Transit',
     // ... configuration
   }
   ```

3. **Add to CitySelector** in `src/components/CitySelector.tsx`

### Customizing Visualizations

The application supports multiple rendering engines:

- **Mermaid**: Diagram-based using Mermaid.js
- **SVG**: Custom SVG rendering with D3.js-like functionality  
- **Canvas**: High-performance rendering for complex networks
- **Universal**: Geographic coordinate transformation

## 📊 Data Sources

### Singapore MRT
- **Primary**: [MRTDown Data API](https://github.com/foldaway/mrtdown-data)
- **Official**: Land Transport Authority (LTA) Singapore
- **Real-time**: Service status and disruption data

### New York Subway  
- **Primary**: MTA (Metropolitan Transportation Authority)
- **Static Data**: Curated station and line information
- **Geographic**: Accurate station coordinates

### Tokyo Metro
- **Primary**: Tokyo Metro Co., Ltd. official data
- **Static Data**: Major lines and interchange stations
- **Multilingual**: Station names in Japanese and English

## 🏆 Credits and Acknowledgments

This project builds upon and integrates with several excellent open-source projects and data sources:

### Core Data Sources
- **[MRTDown Data](https://github.com/foldaway/mrtdown-data)** by [@foldaway](https://github.com/foldaway)
  - Comprehensive Singapore MRT disruption tracking and historical data
  - Real-time service status API
  - Detailed station and line information

- **[MRTDown Site](https://github.com/foldaway/mrtdown-site)** by [@foldaway](https://github.com/foldaway)  
  - Original Singapore MRT status tracking website
  - Inspiration for real-time transit monitoring
  - Community-driven transit data collection

### Technology Stack
- **[React](https://reactjs.org/)** - User interface framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Modern React component library
- **[Mermaid.js](https://mermaid.js.org/)** - Diagram and flowchart library
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[React Zoom Pan Pinch](https://github.com/BetterTyped/react-zoom-pan-pinch)** - Pan and zoom functionality

### Inspiration and References
- **[Metro Map Maker](https://github.com/shannonturner/metro-map-maker)** - SVG-based metro map generation
- **[Rail Art](https://jabza.github.io/rail-art/)** - Beautiful transit map visualizations
- **Official Transit Authority Designs**:
  - Singapore Land Transport Authority (LTA)
  - New York MTA Design Standards  
  - Tokyo Metro Visual Identity Guidelines

### Special Thanks
- **[@foldaway](https://github.com/foldaway)** for creating and maintaining the comprehensive MRTDown ecosystem
- **Singapore Transit Community** for data validation and feedback
- **Open Source Contributors** who provided libraries and tools that made this project possible

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Data Attribution
- Singapore MRT data courtesy of [MRTDown](https://mrtdown.org) and LTA Singapore
- NYC Subway data from MTA Open Data
- Tokyo Metro data from official Tokyo Metro sources

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/johnxie/mrtdown/issues)
- **Discussions**: [GitHub Discussions](https://github.com/johnxie/mrtdown/discussions)
- **Documentation**: [Project Wiki](https://github.com/johnxie/mrtdown/wiki)

## 🗺️ Roadmap

- [ ] **Additional Cities**: London Underground, Paris Metro, Hong Kong MTR
- [ ] **Real-time Data**: Live service updates and delays
- [ ] **Route Planning**: Journey planner with optimal paths
- [ ] **Accessibility Features**: Screen reader support, high contrast mode
- [ ] **Mobile App**: React Native version for iOS/Android
- [ ] **API Integration**: Public API for transit data access

---

**Built with ❤️ for the global transit community**

*This project aims to make transit information more accessible and beautiful for everyone. Whether you're a daily commuter, transit enthusiast, or city planner, we hope this tool helps you navigate and understand urban transportation networks better.*
