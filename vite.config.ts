import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative assets work in a GitHub Pages project URL and when the static build is opened locally.
  base: './',
  plugins: [react()],
})
