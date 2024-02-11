import './assets/main.css';

import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import {createPinia} from 'pinia';

import {useRegisterSW} from 'virtual:pwa-register/vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount('#app');

/**
 * PWA auto update
 */
const intervalMS = 60 * 60 * 1000;

useRegisterSW({
  onRegisteredSW(swUrl, r) {
    r &&
      setInterval(async () => {
        if (!(!r.installing && navigator)) return;

        if ('connection' in navigator && !navigator.onLine) return;

        const resp = await fetch(swUrl, {
          cache: 'no-store',
          headers: {
            cache: 'no-store',
            'cache-control': 'no-cache',
          },
        });

        if (resp?.status === 200) await r.update();
      }, intervalMS);
  },
});
