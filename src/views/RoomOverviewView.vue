<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import ProfileImage from '@/components/media/ProfileImage.vue';

</script>
<template>
  <MainLayout>
    <div class="bg-gray-50">
      <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Willkommen zurück, Max Muster!</h1>

        <p class="mt-1.5 text-sm text-gray-500">
          Du hast 1.000.000.000 € Schulden - beginne, Geld zurückzuzahlen!
        </p>
      </div>
    </div>

    <div class="flex flex-col items-center gap-2 p-2 lg:p-5">

      <div class="flex flex-row w-full lg:max-w-[80%] gap-2 p-5 rounded-lg border-r-8 border-b-8 bg-gray-100 border-gray-200">
        <div>
          <ProfileImage class="rounded-full w-32 h-32"></ProfileImage>
        </div>
        <div class="flex flex-col flex-grow gap-2">
          <h1>PSE</h1>
          <span><i class="fa-solid fa-users"></i> 5 Mitglieder</span>
          <span><i class="fa-solid fa-coins"></i> Bilanz: +5€</span>
        </div>
      </div>

      <div class="flex flex-row w-full lg:max-w-[80%] gap-2 p-5 rounded-lg border-r-8 border-b-8 bg-gray-100 border-gray-200">
        <div>
          <ProfileImage class="rounded-full w-32 h-32"></ProfileImage>
        </div>
        <div class="flex flex-col flex-grow gap-2">
          <h1>Fußball</h1>
          <span><i class="fa-solid fa-users"></i> 30 Mitglieder</span>
          <span><i class="fa-solid fa-coins"></i> Bilanz: -20€</span>
        </div>
      </div>

    </div>
  </MainLayout>
</template>
