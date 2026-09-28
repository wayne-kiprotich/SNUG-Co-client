import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// In development the site and the Flask API run on different ports. Proxying /api and
// /uploads makes them look like one domain, exactly as they will in production.
const api = process.env.API_ORIGIN || 'http://127.0.0.1:5000'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // changeOrigin must stay false: the API checks that a request's Origin matches its Host.
    proxy: {
      '/api': { target: api, changeOrigin: false },
      '/uploads': { target: api, changeOrigin: false },
    },
  },
})
