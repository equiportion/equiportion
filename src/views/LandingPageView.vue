<script setup lang="ts">
import LogoWide from '@/components/brand/LogoWide.vue';
import router from '@/router';

function goToLogin() {
  router.push({name: 'login'});
}
</script>
<template>
  <div class="min-h-screen flex flex-col items-center justify-center">
    <LogoWide class="scale-[1] custom-logo" />
    <button
      id="loginButton"
      @click="goToLogin"
      class="h-12 px-6 m-2 block bg-white p-1.5 text-gray-600 shadow-md border border-gray-100 hover:bg-gray-100 hover:scale-110 transition-all font-bold rounded-lg mt-36"
    >
      Anmelden
    </button>
  </div>
</template>
