# Contributing to Universal Transit Map Visualization

Thank you for your interest in contributing to the Universal Transit Map Visualization project! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues
- Use the [GitHub Issues](https://github.com/johnxie/mrtdown/issues) page
- Search existing issues before creating a new one
- Provide detailed information including:
  - Browser and version
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots if applicable

### Suggesting Features
- Open a [GitHub Discussion](https://github.com/johnxie/mrtdown/discussions) for feature requests
- Explain the use case and potential implementation
- Consider the project's scope and goals

### Code Contributions

#### Getting Started
1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/mrtdown.git`
3. Install dependencies: `cd mrt-map-app && npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

#### Development Guidelines

**Code Style**
- Use TypeScript for all new code
- Follow existing naming conventions
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

**React Components**
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow the existing component structure
- Use Tailwind CSS for styling

**Data Management**
- Keep transit data in separate files under `src/data/`
- Follow the `TransitSystem` interface structure
- Include proper source attribution
- Validate data accuracy with official sources

#### Adding New Transit Systems

1. **Create data file** (e.g., `src/data/londonTubeData.ts`)
   ```typescript
   import { TransitSystem } from './transitSystem';
   
   export const londonTubeData: Partial<TransitSystem> = {
     stations: [
       {
         id: 'station-id',
         name: 'Station Name',
         codes: ['CODE'],
         lines: ['line-id'],
         coordinates: { lat: 51.5074, lng: -0.1278 },
         isInterchange: false
       }
     ],
     lines: [
       {
         id: 'line-id',
         name: 'Line Name',
         color: '#FF0000',
         type: 'subway',
         stations: ['station-id']
       }
     ],
     connections: [
       {
         from: 'station-1',
         to: 'station-2',
         line: 'line-id'
       }
     ]
   };
   ```

2. **Update TransitSystemFactory** in `src/data/transitSystem.ts`

3. **Add to CitySelector** in `src/components/CitySelector.tsx`

4. **Test thoroughly** with the UniversalTransitMap component

#### Commit Guidelines

**Commit Messages**
Follow the conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(transit): add London Underground data
fix(ui): resolve dark mode dropdown styling
docs(readme): update installation instructions
```

#### Pull Request Process

1. **Before submitting:**
   - Ensure all tests pass: `npm test`
   - Check for linting errors: `npm run lint`
   - Build successfully: `npm run build`
   - Test in both light and dark modes

2. **Pull Request:**
   - Use a descriptive title
   - Reference related issues: "Fixes #123"
   - Include screenshots for UI changes
   - Describe testing performed

3. **Review Process:**
   - Maintainers will review within 48 hours
   - Address feedback promptly
   - Keep the PR focused on a single feature/fix

## 🏗️ Project Structure

```
mrt-map-app/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── *Map.tsx        # Map visualization components
│   │   └── *.tsx           # Feature components
│   ├── context/            # React contexts
│   ├── data/               # Transit system data
│   │   ├── *Data.ts        # City-specific data files
│   │   └── transitSystem.ts # Core data structures
│   ├── hooks/              # Custom React hooks
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
└── docs/                   # Documentation
```

## 📊 Data Standards

### Transit System Data
- **Accuracy**: Verify with official sources
- **Completeness**: Include all major stations and lines
- **Consistency**: Follow naming conventions
- **Attribution**: Credit data sources

### Coordinate System
- Use WGS84 decimal degrees (lat, lng)
- Precision: 6 decimal places minimum
- Source: Official transit authority or OpenStreetMap

### Station Information
- **Names**: Use official names in local language
- **Codes**: Include all official station codes
- **Interchanges**: Mark major transfer stations
- **Accessibility**: Include accessibility information when available

### Line Information
- **Colors**: Use official brand colors (hex format)
- **Types**: subway, metro, light_rail, bus_rapid_transit
- **Status**: active, planned, under_construction

## 🧪 Testing

### Manual Testing
- Test all map interactions (pan, zoom, click)
- Verify station information display
- Check responsive design on different screen sizes
- Test dark/light mode switching
- Validate accessibility with screen readers

### Automated Testing
```bash
npm test                # Run unit tests
npm run test:coverage   # Generate coverage report
npm run e2e            # Run end-to-end tests (if available)
```

## 🎨 Design Guidelines

### Visual Design
- Follow the existing design system
- Use Tailwind CSS utilities
- Maintain consistency with shadcn/ui components
- Ensure proper contrast ratios for accessibility

### User Experience
- Prioritize performance and responsiveness
- Provide clear visual feedback for interactions
- Include loading states for async operations
- Handle error states gracefully

## 📝 Documentation

### Code Documentation
- Add JSDoc comments for public APIs
- Document complex algorithms or business logic
- Include usage examples for components

### User Documentation
- Update README.md for new features
- Add screenshots for visual changes
- Update installation or setup instructions if needed

## 🚀 Release Process

### Versioning
- Follow [Semantic Versioning](https://semver.org/)
- Major: Breaking changes
- Minor: New features (backward compatible)
- Patch: Bug fixes

### Release Notes
- Highlight new features and improvements
- Document breaking changes
- Credit contributors

## 💬 Community

### Communication
- Use GitHub Discussions for questions and ideas
- Be respectful and constructive in all interactions
- Help other contributors when possible

### Code of Conduct
- Be inclusive and welcoming
- Respect differing viewpoints and experiences
- Focus on what's best for the community
- Show empathy towards other community members

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to making transit information more accessible and beautiful for everyone! 🚇🗺️✨
