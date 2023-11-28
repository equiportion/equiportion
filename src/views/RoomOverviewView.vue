<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import RoomTile from '@/views/partials/RoomTile.vue';
import {ref} from 'vue';
import AuthenticatedMatrixClient from '@/logic/controller/clients/AuthenticatedMatrixClient';
import Room from '@/logic/models/Room';
import useAuthenticatedMatrixClient from '@/composables/useAuthenticatedMatrixClient';
import User from '@/logic/models/User';

var client: AuthenticatedMatrixClient;
var rooms: {[roomId: string]: Room};
var loggedInUser: User;

const loading = ref(true);
useAuthenticatedMatrixClient(loadData);

async function loadData(clientInstance: AuthenticatedMatrixClient) {
  client = clientInstance;

  rooms = client.getJoinedRooms();
  loggedInUser = client.getLoggedInUser();

  loading.value = false;
}
</script>
<template>
  <MainLayout>
    <div class="bg-gray-50">
      <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
          Willkommen zurück, {{ loggedInUser?.getDisplayname() ?? loggedInUser?.getUserId() }}!
        </h1>

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
      <span class="text-sm text-gray-300" v-if="rooms && Object.keys(rooms).length <= 0">
        Keine Räume gefunden - trete einem Raum bei, um Rechnungen aufzuteilen
      </span>
      <template v-for="room in rooms" :key="room.id">
        <RoomTile :room="room" />
      </template>
    </div>
    <!--End of rooms-->
  </MainLayout>
</template>
