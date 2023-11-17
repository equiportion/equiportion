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

    <!--Rooms-->
    <div class="flex flex-col items-center gap-2 p-2 lg:p-5">

      <!--Start of a room-->
      <div class="flex flex-row w-full lg:max-w-[80%] gap-2 p-5 rounded-lg border-r-8 border-b-8 bg-gray-100 border-gray-200">

        <div>
          <ProfileImage class="rounded-full w-32 h-32"></ProfileImage>
        </div>
          
        <div class="flex flex-col flex-grow gap-2">

        <!--Header-->
          <div class="flex flex-row justify-center text-lg font-bold">
            <h1>PSE</h1>
          </div>

          <!--Content-->
          <div class="flex flex-row justify-center">
            <!--column 1-->
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
            <!--Column 2-->
            <div class="basis-1/2 flex flex-col gap-5 text-center">
              <div class="flex flex-col">
                <span class="font-semibold"><i class="fa-solid fa-comments"></i> 2 ungelesene Nachrichten</span>
                <span>Maxi: PSE läuft super</span>
              </div>
              <div class="flex flex-col">
                <span class="font-semibold"><i class="fa-solid fa-building-columns"></i> 2 unbezahlte Rechnungen</span>
                <span>Maxi, Maxim</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--End of a room-->
      
      <!--Start of a room-->
      <div class="flex flex-row w-full lg:max-w-[80%] gap-2 p-5 rounded-lg border-r-8 border-b-8 bg-gray-100 border-gray-200">

        <div>
          <ProfileImage class="rounded-full w-32 h-32"></ProfileImage>
        </div>

        <div class="flex flex-col flex-grow gap-2">

          <!--Header-->
          <div class="flex flex-row justify-center text-lg font-bold">
            <h1>Fußball</h1>
          </div>

          <!--Content-->
          <div class="flex flex-row justify-center">
            <!--column 1-->
            <div class="basis-1/2 flex flex-col gap-5 text-center">
              <div class="flex flex-col">
                <span class="font-semibold"><i class="fa-solid fa-users"></i> 30 Mitglieder</span>
                <span>8 online</span>
              </div>
              <div class="flex flex-col">
                <span class="font-semibold"><i class="fa-solid fa-coins"></i> -40€</span>
                <span>Schulden an: Maxi, Maxim, Maximilian...</span>
              </div>
            </div>
            <!--Column 2-->
            <div class="basis-1/2 flex flex-col gap-5 text-center">
              <div class="flex flex-col">
                <span class="font-semibold"><i class="fa-solid fa-comments"></i> 5 ungelesene Nachrichten</span>
                <span>Maxi: mir fehlt noch Geld...</span>
              </div>
              <div class="flex flex-col">
                <span class="font-semibold"><i class="fa-solid fa-building-columns"></i> 8 unbezahlte Rechnungen</span>
                <span>Max, Maxi, Maximilian...</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      <!--End of a room-->

    </div>
    <!--End of rooms-->
  </MainLayout>
</template>