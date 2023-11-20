<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import RoomTile from '@/views/partials/RoomTile.vue';

import {ref} from 'vue';

import useAuthenticatedMatrixClient from '@/composables/useAuthenticatedMatrixClient';
const {getAuthenticatedMatrixClient} = useAuthenticatedMatrixClient();
const authenticatedMatrixClient = getAuthenticatedMatrixClient();

const rooms = ref({});
const loading = ref(true);

async function loadRooms() {
  rooms.value = await authenticatedMatrixClient.getRooms().value;
  loading.value = false;
}

loadRooms();
</script>
<template>
  <MainLayout>
    <div class="bg-gray-50">
      <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Willkommen zurück, Max Muster!</h1>

        <p class="mt-1.5 text-sm text-gray-500">
          Du hast 1.000.000 € Schulden - beginne, Geld zurückzuzahlen!
        </p>
      </div>
    </div>

    <!--Rooms-->
    <div class="flex flex-col items-center gap-2 p-2 lg:p-5">
      <span class="text-3xl text-gray-300" v-if="loading">
        <i class="fa-solid fa-spinner animate-spin"></i>
      </span>
      <span class="text-sm text-gray-300" v-if="Object.keys(rooms).length <= 0 && !loading">
        Keine Räume gefunden - trete einem Raum bei, um Rechnungen aufzuteilen
      </span>
      <template v-for="room in rooms" :key="room.id">
        <RoomTile :room="room" />
      </template>
    </div>
    <!--End of rooms-->
  </MainLayout>
</template>
