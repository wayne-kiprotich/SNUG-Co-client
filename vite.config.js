import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Dev: proxy the Flask API so it's one domain, like production.
const api = process.env.API_ORIGIN || 'http://127.0.0.1:5000'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Keep changeOrigin false: the API checks Origin against Host.
    proxy: {
      '/api': { target: api, changeOrigin: false },
      '/uploads': { target: api, changeOrigin: false },
    },
  },
})
