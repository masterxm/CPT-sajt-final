import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/quote-api': {
        target: 'https://api.quotable.io',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/quote-api/, ''),
      },
      '/news/n1': {
        target: 'https://n1info.rs',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/news\/n1/, ''),
      },
      '/news/blic': {
        target: 'https://www.blic.rs',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/news\/blic/, ''),
      },
      '/news/telegraf': {
        target: 'https://www.telegraf.rs',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/news\/telegraf/, ''),
      },
      '/news/novosti': {
        target: 'https://www.novosti.rs',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/news\/novosti/, ''),
      },
      '/news/kurir': {
        target: 'https://www.kurir.rs',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/news\/kurir/, ''),
      },
      '/news/rts': {
        target: 'https://www.rts.rs',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/news\/rts/, ''),
      },
      '/news/b92': {
        target: 'https://www.b92.net',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/news\/b92/, ''),
      },
      '/news/naslovi': {
        target: 'https://naslovi.net',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/news\/naslovi/, ''),
      },
      '/api/anthropic': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/api\/anthropic/, ''),
      },
      '/api/gemini': {
        target: 'https://gemini.googleapis.com',
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/api\/gemini/, ''),
      },
    },
  },
})
