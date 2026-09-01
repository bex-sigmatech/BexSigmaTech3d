import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5174,
    strictPort: false,
  },
  build: {
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    minify: 'esbuild',
    target: 'es2018',
    assetsInlineLimit: 4096,
    cssMinify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom', 'zustand'],
          three: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          ui: ['framer-motion', 'gsap', 'react-icons/fa'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'three', '@react-three/fiber'],
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
})
