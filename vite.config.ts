import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.png', 'apple-touch-icon.png', 'robots.txt'],
      manifest: {
        name: 'Калькулятор выгоды — Сравнение цен',
        short_name: 'Выгода',
        description: 'Умный калькулятор выгоды и честного сравнения цен на продукты, бытовую химию и штучные товары в магазине.',
        theme_color: '#415f91',
        background_color: '#111318',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: './',
        scope: './',
        icons: [
          {
            src: '/favicon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/favicon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}']
      }
    })
  ],
  base: './',
  optimizeDeps: {
    entries: ['src/**/*.{ts,tsx}']
  },
  server: {
    port: 3600,
    host: true,
    watch: {
      ignored: ['**/docs/**', '**/.wrangler/**', '**/.git/**']
    }
  }
});
