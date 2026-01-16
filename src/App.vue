<script setup lang="ts">
import {onMounted} from 'vue';
import {RouterView} from 'vue-router';
import initLocal from '@/logic/utils/local';
import ReloadPrompt from '@/components/pwa/ReloadPrompt.vue';
import router from '@/router';

import '@fortawesome/fontawesome-free/css/all.css';

onMounted(() => {
  initLocal();

  window.addEventListener('offline', () => {
    router.push({name: 'offline'});
  });
});

/**
 * Switch for dark / light mode
 */
if (
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}
</script>

<template>
  <RouterView v-slot="{Component, route}">
    <transition :name="(route.meta.transition as string) || 'fade'">
      <component :is="Component" />
    </transition>
  </RouterView>
  <ReloadPrompt />
</template>
