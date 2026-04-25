import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

export default defineConfig({
  base: '/MeteorWatch/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'icons/icon-192.png',
        'icons/icon-512.png',
        'icons/apple-touch-icon.png',
      ],
      manifest: {
        name: 'MeteorWatch — PezzaliAPP',
        short_name: 'MeteorWatch',
        description:
          "Cosa sta cadendo, passando o entrando nell'atmosfera vicino alla Terra adesso?",
        theme_color: '#0b1020',
        background_color: '#05070f',
        display: 'standalone',
        orientation: 'any',
        start_url: '/MeteorWatch/',
        scope: '/MeteorWatch/',
        lang: 'it',
        categories: ['education', 'science', 'utilities'],
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest,json}'],
        navigateFallback: '/MeteorWatch/index.html',
        navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.nasa\.gov\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'nasa-neows',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 6 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/ssd-api\.jpl\.nasa\.gov\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'cneos',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/api\.wheretheiss\.at\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'iss-live',
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 5 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/celestrak\.org\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'celestrak-tle',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 12 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/[a-z0-9.-]*\/(?:fallback-data)\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fallback-data',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 900,
  },
  server: {
    host: true,
    port: 5173,
  },
});
