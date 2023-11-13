<script setup lang="ts">
import {ref} from 'vue';
import {RouterLink} from 'vue-router';
import SearchField from '@/layouts/partials/SearchField.vue';
import MenuDivider from '@/layouts/partials/MenuDivider.vue';
import MenuProfilePicture from '@/layouts/partials/MenuProfilePicture.vue';

import LogoWide from '@/components/brand/LogoWide.vue';
import LogoSquare from '@/components/brand/LogoSquare.vue';

// TODO Suche implementieren
const searchInputValue = ref('');
</script>

<template>
  <header class="bg-gray-50">
    <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <!-- Logo on the left sisde -->
        <LogoWide class="hidden lg:flex" />
        <LogoSquare class="flex lg:hidden" />

        <!-- Buttons, Search and Profile Picture on the right side -->
        <div class="flex items-center justify-end gap-4">
          <!-- Link zur Raumübersicht -->
          <RouterLink
            :to="{name: 'home'}"
            class="block shrink-0 rounded-full bg-white p-2.5 text-gray-600 shadow-sm hover:text-gray-700 w-10 h-10"
          >
            <span class="sr-only">Raumübersicht</span>
            <div class="flex w-full h-full items-center">
              <i class="fa-solid fa-house-chimney fa-fw"></i>
            </div>
          </RouterLink>

          <!-- Suche -->
          <SearchField v-model="searchInputValue" />

          <!-- Trennlinie -->
          <MenuDivider />

          <!-- Profilbild -->
          <MenuProfilePicture />
        </div>
      </div>
    </div>
  </header>

  <slot />
</template>
