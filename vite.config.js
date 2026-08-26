import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // listen on 0.0.0.0 — all network interfaces
    port: 5174,
    strictPort: false,
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom', 'zustand'],
          three: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          ui: ['framer-motion', 'gsap', 'react-icons'],
        },
      },
    },
  },
})
