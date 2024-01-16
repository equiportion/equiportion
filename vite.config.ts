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
      manifest: {
        name: 'EquiPortion',
        short_name: 'EquiPortion',
        description: 'Decentral bill splitting via [Matrix]',
        theme_color: '#98e9e1',
        icons: [
          {
            src: 'src/assets/LogoSquare.svg',
            sizes: '192x192',
            type: 'image/svg',
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
