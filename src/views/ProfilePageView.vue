<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import ProfileImage from '@/components/media/ProfileImage.vue';
import DividerLeftText from '@/components/dividers/DividerLeftText.vue';
</script>
<template>
  <MainLayout>
    <div class="flex flex-col px-5 mt-2 items-center gap-5">
      <!--Profile image and username -->
      <div class="flex flex-col items-center lg:flex-row justify-center gap-5">
        <ProfileImage class="w-40 h-40 rounded-full" />
        <div class="flex flex-col items-center lg:items-start">
          <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Max Mustermann</h1>
          <span class="text-md text-gray-500">@maxmustermann</span>
        </div>
      </div>

      <!-- Payment methods -->
      <div class="flex flex-col items-center w-full lg:max-w-3xl">
        <DividerLeftText><h2 class="text-xl">Zahlungseinstellungen</h2></DividerLeftText>
      </div>
    </div>
  </MainLayout>
</template>
