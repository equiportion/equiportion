import {fileURLToPath, URL} from 'node:url';

import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

import {VitePWA} from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      manifest: {
        name: 'EquiPortion',
        short_name: 'EquiPortion',
        description:
          'Aufteilen von Rechnungen war noch nie so einfach. Mit EquiPortion kannst du deine Rechnungen aufteilen und mit deinen Freunden teilen. Einfach, schnell und sicher über den Matrix-Server deines Vertrauens.',
        theme_color: '#98e9e1',
        display: 'standalone',
        icons: [
          {
            src: 'LogoSquare.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: 'LogoSquare.png',
            sizes: '1000x1000',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
