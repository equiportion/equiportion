<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import ProfileImage from '@/components/media/ProfileImage.vue';

import {useLoggedInUserStore} from '@/stores/loggedInUser';

const loggedInUser = useLoggedInUserStore().user;

const version = APP_VERSION;
const buildTimestamp = BUILD_TIMESTAMP;
</script>
<template>
  <MainLayout>
    <div class="flex flex-col px-5 mt-5 items-center gap-5">
      <!--Profile image and username -->
      <div class="flex flex-col items-center lg:flex-row justify-center gap-5">
        <ProfileImage class="w-40 h-40 rounded-full" />
        <div class="flex flex-col items-center lg:items-start">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-200 sm:text-3xl">
            {{ loggedInUser.getDisplayname() ?? loggedInUser.getUserId() }}
          </h1>
          <span
            v-if="loggedInUser.getDisplayname()"
            class="text-md text-gray-500 dark:text-gray-400"
          >
            {{ loggedInUser.getUserId() }}
          </span>
        </div>
      </div>

      <!-- Version and License notices  -->
      <div class="flex flex-col items-center text-sm mt-10 italic text-center">
        <span class="text-gray-500 dark:text-gray-400 font-bold"> EquiPortion v{{ version }} </span>
        <span class="text-gray-500 dark:text-gray-400">
          Build vom {{ new Date(buildTimestamp).toLocaleString() }}
        </span>
        <span class="text-gray-500 dark:text-gray-400">
          Diese Software ist frei und quelloffen unter
          <a
            href="https://github.com/equiportion/equiportion/blob/main/LICENSE"
            class="underline"
            target="_blank"
          >
            MIT-Lizenz
          </a>
          veröffentlicht.
        </span>
        <span class="text-gray-500 dark:text-gray-400">
          <a
            href="https://github.com/equiportion/equiportion.github.io/wiki/Datenschutzerkl%C3%A4rung"
            target="_blank"
            class="underline"
          >
            Hinweise zum Datenschutz
          </a>
          &nbsp;|&nbsp;
          <a href="https://github.com/equiportion/equiportion/" target="_blank" class="underline">
            Zum Projekt auf GitHub
          </a>
        </span>
        <span class="text-gray-500 dark:text-gray-400"> </span>
      </div>
    </div>
  </MainLayout>
</template>
