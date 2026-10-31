import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    basicSsl(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Aegis Field Collaboration', short_name: 'Aegis', display: 'standalone',
        start_url: '/', theme_color: '#0b1220', background_color: '#09101d'
      },
      workbox: { globPatterns: ['**/*.{html,js,css,svg,png,ico,webmanifest}'] }
    })
  ],
  server: {
    https: true, host: '0.0.0.0', port: 5173,
    proxy: { '/relay': { target: 'ws://127.0.0.1:8080', ws: true } }
  },
  preview: {
    https: true, host: '0.0.0.0', port: 5173,
    proxy: { '/relay': { target: 'ws://127.0.0.1:8080', ws: true } }
  }
});
