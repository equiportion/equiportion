<script setup lang="ts">
import {onMounted} from 'vue';
import {RouterView} from 'vue-router';
import initLocal from '@/logic/utils/local';
import ReloadPrompt from '@/components/pwa/ReloadPrompt.vue';
import router from '@/router';

onMounted(() => {
  initLocal();

  window.addEventListener('offline', () => {
    router.push({name: 'offline'});
  });
});
</script>

<template>
  <RouterView v-slot="{Component, route}">
    <transition :name="(route.meta.transition as string) || 'fade'">
      <component :is="Component" />
    </transition>
  </RouterView>
  <ReloadPrompt />
</template>
