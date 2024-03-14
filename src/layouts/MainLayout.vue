<script setup lang="ts">
import {RouterLink} from 'vue-router';
import DarkLightSwitch from '@/layouts/partials/DarkLightSwitch.vue';
import MenuProfilePicture from '@/layouts/partials/MenuProfilePicture.vue';
import DropdownMenu from '@/components/dropdowns/DropdownMenu.vue';
import DropdownButton from '@/components/dropdowns/DropdownButton.vue';
import DropdownLink from '@/components/dropdowns/DropdownLink.vue';

import LogoWide from '@/components/brand/LogoWide.vue';
import LogoWideWhite from '@/components/brand/LogoWideWhite.vue';

import useGlobalEventBus from '@/composables/useGlobalEventBus';
import cookieNames from '@/logic/constants/cookieNames';
import {setCookie} from '@/logic/utils/cookies';
import router from '@/router';
const {emitGlobal} = useGlobalEventBus();

function emitClick(event: Event) {
  const eventTarget = event.target! as HTMLElement;
  emitGlobal('click', {'no-close': eventTarget.closest('.no-close') !== null});
}

function logout() {
  setCookie(cookieNames.accessToken, '');

  router.push({name: 'login'});
}
</script>

<template>
  <div @click="emitClick($event)">
    <header class="fixed top-0 bg-gray-100 dark:bg-gray-900 w-full z-50 shadow-md">
      <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="flex items-center justify-end lg:justify-between">
          <!-- Logo on the left sisde -->
          <RouterLink :to="{name: 'home'}">
            <LogoWide class="hidden lg:flex dark:hidden h-10" />
            <LogoWideWhite class="hidden lg:dark:flex h-10" />
          </RouterLink>

          <!-- Buttons, Search and Profile Picture on the right side -->
          <div class="flex items-center justify-end gap-4">
            <!-- Link to room overview -->
            <RouterLink
              id="home-button"
              :to="{name: 'home'}"
              class="block shrink-0 rounded-full bg-white dark:bg-gray-600 p-2.5 text-gray-600 dark:text-gray-200 shadow-sm hover:text-gray-900 dark:hover:text-white lg:hover:scale-105 w-10 h-10"
            >
              <span class="sr-only">Raumübersicht</span>
              <div class="flex w-full h-full items-center">
                <i class="fa-solid fa-house-chimney fa-fw"></i>
              </div>
            </RouterLink>

            <DarkLightSwitch />

            <!-- search -->
            <!-- <SearchField v-model="searchInputValue" /> -->

            <!-- profile pic & dropdown -->
            <DropdownMenu>
              <template #trigger>
                <MenuProfilePicture id="profile-picture" />
              </template>
              <DropdownLink id="profil-ansicht" to="/profile">Profil</DropdownLink>
              <DropdownButton id="logout-button" @click="logout"> Abmelden </DropdownButton>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>

    <main class="w-full pt-[104px] min-h-screen dark:bg-gray-800">
      <slot />
    </main>
  </div>
</template>
