<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import useAuthenticatedMatrixClient from '@/composables/useAuthenticatedMatrixClient';
import {setCookie} from '@/logic/utils/cookies';
import cookieNames from '@/logic/constants/cookieNames';
import Room from '@/logic/models/Room';

//TODO: remove afterwards
setCookie(cookieNames.homeserverUrl, 'https://matrix.scc.kit.edu');
setCookie(cookieNames.accessToken, 'syt_dWZnZmc_XuYZjgStFlmGvbRgdtAS_1MUAXr');
const {getAuthenticatedMatrixClient} = useAuthenticatedMatrixClient();
const authenticatedMatrixClient = getAuthenticatedMatrixClient();

loadRooms();

async function loadRooms() {
  const roomsJson = await authenticatedMatrixClient.initialSync();

  for (const roomId in roomsJson) {
    rooms.push(new Room(roomId, roomsJson[roomId]));
  }

  console.log(rooms);
}
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
  </MainLayout>
</template>
@/logic/controller/clients/MatrixError
