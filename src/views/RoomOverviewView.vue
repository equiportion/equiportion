<script setup lang="ts">
import useAuthenticatedMatrixClient from '@/composables/useAuthenticatedMatrixClient';
import MainLayout from '@/layouts/MainLayout.vue';
//TODO: revert changes
const authenticatedMatrixClient = useAuthenticatedMatrixClient().getAuthenticatedMatrixClient();
const loggedInUser = authenticatedMatrixClient.getLoggedInUser();
</script>
<template>
  <MainLayout>
    <div class="bg-gray-50">
      <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Willkommen zurück, Max Muster!</h1>

        <p class="mt-1.5 text-sm text-gray-500">
          Du hast 1.000.000 € Schulden - beginne, Geld zurückzuzahlen!
        </p>
      </div>
    </div>
    <div>Logged in User:</div>
    <div>{{ loggedInUser }}</div>
  </MainLayout>
</template>
