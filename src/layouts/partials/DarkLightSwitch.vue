<script setup lang="ts">
import {computed, ref, watch} from 'vue';

const darkMode = ref(false);

// initialise dark mode from local storage or system preference
if (
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  darkMode.value = true;
}

// watch for theme change and toggle class on html element and save to local storage
watch(darkMode, (value) => {
  document.documentElement.classList.toggle('dark', value);
  localStorage.theme = value ? 'dark' : 'light';
});

const icon = computed(() => (darkMode.value ? 'fa-solid fa-sun fa-fw' : 'fa-solid fa-moon fa-fw'));
</script>
<template>
  <button
    class="block shrink-0 rounded-full bg-white dark:bg-gray-600 p-2.5 text-gray-600 dark:text-gray-200 shadow-sm hover:text-gray-900 dark:hover:text-white lg:hover:scale-105 w-10 h-10"
    @click="darkMode = !darkMode"
  >
    <span class="sr-only">Raumübersicht</span>
    <div class="flex w-full h-full items-center">
      <i :class="icon"></i>
    </div>
  </button>
</template>
