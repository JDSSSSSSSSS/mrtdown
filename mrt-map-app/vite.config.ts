import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/mrtdown/' : '/',
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1600, // Increase limit to reduce warnings
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate mermaid into its own chunk
          'mermaid': ['mermaid'],
          // Separate large UI libraries
          'vendor-ui': ['lucide-react', 'class-variance-authority', 'clsx', 'tailwind-merge'],
          // Separate zoom/pan library
          'vendor-interaction': ['react-zoom-pan-pinch', 'react-rnd']
        }
      }
    }
  }
})
