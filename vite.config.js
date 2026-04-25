import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Placement-dept-demo/',
  server: {
    port: 3000
  }
})
