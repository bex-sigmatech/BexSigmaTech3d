import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5174,
    strictPort: false,
    allowedHosts: true,
  },
  build: {
    chunkSizeWarningLimit: 1200,
    cssCodeSplit: true,
    minify: 'esbuild',
    target: 'es2018',
    assetsInlineLimit: 4096,
    cssMinify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom', 'zustand'],
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
          ui: ['framer-motion', 'react-icons/fa'],
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
