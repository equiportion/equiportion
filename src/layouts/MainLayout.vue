<script setup lang="ts">
import {ref} from 'vue';
import {RouterLink} from 'vue-router';
import SearchField from '@/layouts/partials/SearchField.vue';
import MenuDivider from '@/layouts/partials/MenuDivider.vue';
import MenuProfilePicture from '@/layouts/partials/MenuProfilePicture.vue';
import DropdownMenu from '@/components/dropdowns/DropdownMenu.vue';
import DropdownButton from '@/components/dropdowns/DropdownButton.vue';
import DropdownLink from '@/components/dropdowns/DropdownLink.vue';

import LogoWide from '@/components/brand/LogoWide.vue';

import useGlobalEventBus from '@/composables/useGlobalEventBus';
import cookieNames from '@/logic/constants/cookieNames';
import {setCookie} from '@/logic/utils/cookies';
import router from '@/router';
const {emitGlobal} = useGlobalEventBus();

// TODO Suche implementieren
const searchInputValue = ref('');

function emitClick(event: Event) {
  const eventTarget = event.target! as HTMLElement;
  emitGlobal('click', {'no-close': eventTarget.closest('.no-close') !== null});
}

function logout() {
  setCookie(cookieNames.accessToken, '');

  router.push({name: 'landing-page'});
}
</script>

<template>
  <div @click="emitClick($event)">
    <header class="fixed top-0 bg-gray-50 w-full">
      <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="flex items-center justify-end lg:justify-between">
          <!-- Logo on the left sisde -->
          <RouterLink :to="{name: 'home'}">
            <LogoWide class="hidden lg:flex h-10" />
          </RouterLink>

          <!-- Buttons, Search and Profile Picture on the right side -->
          <div class="flex items-center justify-end gap-4">
            <!-- Link to room overview -->
            <RouterLink
              id="home-button"
              :to="{name: 'home'}"
              class="block shrink-0 rounded-full bg-white p-2.5 text-gray-600 shadow-sm hover:text-gray-700 w-10 h-10"
            >
              <span class="sr-only">Raumübersicht</span>
              <div class="flex w-full h-full items-center">
                <i class="fa-solid fa-house-chimney fa-fw"></i>
              </div>
            </RouterLink>

            <!-- search -->
            <SearchField v-model="searchInputValue" />

            <!-- divider -->
            <MenuDivider />

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

    <main class="w-full pt-[104px]">
      <slot />
    </main>
  </div>
</template>
