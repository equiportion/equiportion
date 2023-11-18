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
import LogoSquare from '@/components/brand/LogoSquare.vue';

import useGlobalEventBus from '@/composables/useGlobalEventBus';
const {emitGlobal} = useGlobalEventBus();

// TODO Suche implementieren
const searchInputValue = ref('');

function emitClick(event: Event) {
  const eventTarget = event.target! as HTMLElement;
  emitGlobal('click', {'no-close': eventTarget.closest('.no-close') !== null});
}
</script>

<template>
  <div @click="emitClick($event)">
    <header class="bg-gray-50">
      <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <!-- Logo on the left sisde -->
          <LogoWide class="hidden lg:flex" />
          <LogoSquare class="hidden md:flex lg:hidden" />

          <!-- Buttons, Search and Profile Picture on the right side -->
          <div class="flex items-center justify-end gap-4">
            <!-- Link to room overview -->
            <RouterLink id="home-button"
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
              <DropdownLink to="/profile" id="profil-ansicht">Profil</DropdownLink>
              <DropdownButton id="logout-button"> Abmelden </DropdownButton>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>

    <slot />
  </div>
</template>
