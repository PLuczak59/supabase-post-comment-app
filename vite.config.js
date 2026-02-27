import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Pour GitHub Pages : remplace par le nom de ton repo si différent
  base: process.env.GITHUB_PAGES === 'true' ? '/supabase-post-comment-app/' : '/',
})
