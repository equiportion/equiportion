<script setup lang="ts">
import {ref, onBeforeMount} from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter();
const previousPath = ref('');

// Speichere den vorherigen Pfad, wenn die Ansicht verlassen wird
onBeforeMount(() => {
  router.beforeEach((to, from, next) => {
    previousPath.value = from.fullPath;
    next();
  });
});

// Navigiere zur vorherigen Seite, wenn wieder online
const navigateToPreviousPage = () => {
  if (previousPath.value) {
    router.push(previousPath.value);
  } else {
    // Navigiere zur Startseite oder einer Standardseite
    router.push('/');
  }
};

// Überwache den Online-Status
window.addEventListener('online', navigateToPreviousPage);

// Beim Laden der Ansicht prüfen, ob bereits online
onBeforeMount(() => {
  if (navigator.onLine) {
    navigateToPreviousPage();
  }
});
</script>
<template>
  <div class="flex flex-col w-full min-h-screen items-center gap-5 p-5">
    <img src="@/assets/signal_searching.svg" alt="Offline" class="max-w-[80%] lg:max-w-[50%]" />
    <p class="text-center">
      Du bist offline. Bitte überprüfe deine Internetverbindung und versuche es erneut.
    </p>
  </div>
</template>
