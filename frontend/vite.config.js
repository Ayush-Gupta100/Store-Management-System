import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/register': 'http://localhost:5000',
      '/login': 'http://localhost:5000',
      '/expense': 'http://localhost:5000',
      '/expenses': 'http://localhost:5000',
    }
  }
})
