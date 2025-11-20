import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Cette ligne est CRUCIALE pour GitHub Pages.
  // Elle doit correspondre exactement au nom de votre dépôt entre les slashs.
  base: '/allo-docteur/', 
})