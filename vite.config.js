import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set DEPLOY_TARGET=ghpages when deploying to GitHub Pages.
// Default ('/') is correct for Firebase Hosting, Vercel, Netlify, local dev.
const isGithubPages = process.env.DEPLOY_TARGET === 'ghpages'

export default defineConfig({
  plugins: [react()],
  base: isGithubPages ? '/Placement-dept-demo/' : '/',
  server: {
    port: 3000
  }
})
