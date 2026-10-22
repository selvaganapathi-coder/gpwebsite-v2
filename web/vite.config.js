import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Proxy CMS API + static assets to the existing Node server on :3001
const cmsTarget = 'http://localhost:3001'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': { target: cmsTarget, changeOrigin: true },
      '/uploads': { target: cmsTarget, changeOrigin: true },
      '/images': { target: cmsTarget, changeOrigin: true },
    },
  },
})
