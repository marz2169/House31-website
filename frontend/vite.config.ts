import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    hmr: {
      clientPort: 3000, // Use the Docker-mapped port for HMR WebSocket
      host: 'localhost',
    },
    watch: {
      usePolling: true,
    },
  },
  build: {
    // Enable source maps for debugging in production
    sourcemap: false,
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor dependencies
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'player-vendor': ['react-player'],
          'ui-vendor': ['@radix-ui/react-slot', 'class-variance-authority', 'clsx', 'tailwind-merge'],
        }
      }
    },
    // Optimize chunk size threshold
    chunkSizeWarningLimit: 1000
  },
  // Performance optimizations
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'react-player'
    ]
  }
})
