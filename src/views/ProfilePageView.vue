<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import ProfileImage from '@/components/media/ProfileImage.vue';

import {useLoggedInUserStore} from '@/stores/loggedInUser';

const loggedInUser = useLoggedInUserStore().user;
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
          <span v-if="loggedInUser.getDisplayname()" class="text-md text-gray-500 dark:text-gray-400">
            {{ loggedInUser.getUserId() }}
          </span>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
