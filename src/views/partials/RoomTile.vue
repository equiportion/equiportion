<script setup lang="ts">
import ProfileImage from '@/components/media/ProfileImage.vue';

defineProps({
  room: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <div
    class="flex flex-col items-center lg:items-start lg:flex-row w-full lg:max-w-[80%] gap-2 p-5 rounded-lg border-r-8 border-b-8 bg-gray-100 border-gray-200"
  >
    <ProfileImage class="rounded-full w-16 h-16 lg:w-32 lg:h-32"></ProfileImage>

    <div class="lg:ml-5 flex flex-col gap-2">
      <h2 class="text-2xl font-bold w-full text-center lg:text-start">{{ room.name }}</h2>

      <div
        class="flex flex-col flex-wrap text-gray-700 gap-x-5 gap-y-2 items-center lg:items-start"
      >
        <div>
          <span class="font-bold"><i class="fa-solid fa-users"></i> 5 Mitglieder</span>
          Name 1, Name 2, ...
        </div>
        <div>
          <span class="font-bold"><i class="fa-solid fa-coins"></i> Schulden</span>
          5 €
        </div>
      </div>
    </div>
  </div>
</template>

<!--
      <div class="flex flex-row justify-center">
        <div class="basis-1/2 flex flex-col gap-5 text-center">
          <div class="flex flex-col">
            <span class="font-semibold"><i class="fa-solid fa-users"></i> 5 Mitglieder</span>
            <span>2 online</span>
          </div>
          <div class="flex flex-col">
            <span class="font-semibold"><i class="fa-solid fa-coins"></i> +5€</span>
            <span>Geld fehlt von: Maxi</span>
          </div>
        </div>

        <div class="basis-1/2 flex flex-col gap-5 text-center">
          <div class="flex flex-col">
            <span class="font-semibold"
              ><i class="fa-solid fa-comments"></i> 2 ungelesene Nachrichten</span
            >
            <span>Maxi: PSE läuft super</span>
          </div>
          <div class="flex flex-col">
            <span class="font-semibold"
              ><i class="fa-solid fa-building-columns"></i> 2 unbezahlte Rechnungen</span
            >
            <span>Maxi, Maxim</span>
          </div>
        </div>
-->
