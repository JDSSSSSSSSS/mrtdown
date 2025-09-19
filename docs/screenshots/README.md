# Screenshots Directory

This directory contains demo screenshots for the Universal Transit Map application.

## Required Screenshots

Please add the following screenshots to showcase the application:

### 1. singapore-mrt-demo.png
- **Content**: Singapore MRT network view
- **Features to show**: 
  - Full MRT map with all lines (NSL, EWL, CCL, NEL, DTL, TEL, JRL, CRL)
  - Station details panel open showing multi-language support
  - Dark mode interface
  - Floating draggable map panel

### 2. nyc-subway-demo.png  
- **Content**: New York Subway system view
- **Features to show**:
  - NYC subway network with multiple lines
  - Station selection and details
  - Line filtering controls
  - Universal transit renderer

### 3. tokyo-metro-demo.png
- **Content**: Tokyo Metro network view  
- **Features to show**:
  - Tokyo Metro lines with interchange stations
  - Clean, modern interface
  - Station information display
  - Network overview

## Screenshot Guidelines

### Technical Requirements
- **Resolution**: 1920x1080 or higher
- **Format**: PNG for best quality
- **File size**: Keep under 2MB each
- **Browser**: Use Chrome or Firefox for consistent rendering

### Visual Guidelines
- **Theme**: Use dark mode for best visual impact
- **Content**: Show real functionality, not placeholder content
- **UI State**: Have a station selected to show the information panel
- **Responsive**: Capture desktop view (mobile screenshots optional)

### Capture Process
1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:5173`
3. Enable dark mode (should be default)
4. Select the appropriate city from the dropdown
5. Click on a station to show the details panel
6. Use browser screenshot tools or screen capture software
7. Crop to show the full application interface

## File Naming Convention

- Use lowercase with hyphens: `singapore-mrt-demo.png`
- Include the city/system name for clarity
- Add `-demo` suffix to indicate these are demonstration images
- Use `.png` format for best quality

## Usage in README

These screenshots are referenced in the main README.md file:

```markdown
![Singapore MRT Demo](docs/screenshots/singapore-mrt-demo.png)
![NYC Subway Demo](docs/screenshots/nyc-subway-demo.png)  
![Tokyo Metro Demo](docs/screenshots/tokyo-metro-demo.png)
```

## After Adding Screenshots

Once you've added the screenshots:

```bash
git add docs/screenshots/
git commit -m "feat: add demo screenshots for README"
git push origin main
```

The screenshots will then be visible in the GitHub README and showcase the application's capabilities to potential users and contributors.
