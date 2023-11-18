<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import ProfileImage from '@/components/media/ProfileImage.vue';
import DropdownButton from '@/components/dropdowns/DropdownButton.vue';
</script>
<template>
  <MainLayout>
    <div class="flex flex-col">

      <!--Profilbild und Name-->
      <div class="flex flex-row">
        <div class="basis-1/5"></div>
        <div class="basis-3/5 flex flex-row border-solid border-b-4 border-gray-950">
          <ProfileImage class="rounded-full w-40 h-40 m-5"></ProfileImage>
          <div class="flex flex-col m-5 justify-center">
            <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Max Mustermann</h1>
            <h2 class="text-1xl font-bold text-gray-900 sm:text-2xl">@maxmuster:matrix.org</h2>
          </div>
        </div>
        <div class="basis-1/5"></div>
      </div>

      <!--Accountsettings-->
      <div class="flex flex-row">
        <div class="basis-1/5"></div>
        <div class="basis-3/5 flex flex-col">
          <h1 class="text-1xl font-bold text-gray-900 sm:text-2xl">Bezahleinstellungen</h1>
          <div class="mt-2">
            <!--Different payment options-->
            <div class="mt-2 border-solid border-b-2 border-gray-400">
              <h1 class="font-semibold">Option 1</h1>
              <div class="flex flex-row">
                <div class="basis-1/2 flex flex-col justify-around">
                  <span>E-Mail: max@mustermann.de</span>
                  <span>Added since: 01.01.2023</span>
                </div>
                <div class="basis-1/2 flex">
                  <div class="basis-5/6"></div>
                  <div class="basis-1/6  flex flex-col justify-around">
                    <DropdownButton class="justify-end gap-0 py-0 border-solid border border-gray-600 justify-center">Ändern</DropdownButton>
                    <DropdownButton class="justify-end gap-0 py-0 border-solid border border-gray-600 justify-center">Entfernen</DropdownButton>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-2 border-solid border-b-2 border-gray-400">
              <h1 class="font-semibold">Option 2</h1>
              <div class="flex flex-row">
                <div class="basis-1/2 flex flex-col justify-around">
                  <span>E-Mail: max@mustermann.de</span>
                  <span>Added since: 01.01.2023</span>
                </div>
                <div class="basis-1/2 flex">
                  <div class="basis-5/6"></div>
                  <div class="basis-1/6  flex flex-col justify-around">
                    <DropdownButton class="justify-end gap-0 py-0 border-solid border border-gray-600 justify-center">Ändern</DropdownButton>
                    <DropdownButton class="justify-end gap-0 py-0 border-solid border border-gray-600 justify-center">Entfernen</DropdownButton>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-2 border-solid border-b-2 border-gray-400">
              <h1 class="font-semibold">Option 3</h1>
              <div class="flex flex-row">
                <div class="basis-1/2 flex flex-col justify-around">
                  <span>E-Mail: max@mustermann.de</span>
                  <span>Added since: 01.01.2023</span>
                </div>
                <div class="basis-1/2 flex">
                  <div class="basis-5/6"></div>
                  <div class="basis-1/6  flex flex-col justify-around">
                    <DropdownButton class="justify-end gap-0 py-0 border-solid border border-gray-600 justify-center">Ändern</DropdownButton>
                    <DropdownButton class="justify-end gap-0 py-0 border-solid border border-gray-600 justify-center">Entfernen</DropdownButton>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div class="basis-1/5"></div>
      </div>
    </div>
  </MainLayout>
</template>