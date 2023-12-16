<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import RoomTile from '@/views/partials/RoomTile.vue';
import {useClientStateStore} from '@/stores/clientState';
import {useLoggedInUserStore} from '@/stores/loggedInUser';
import {useRoomsStore} from '@/stores/rooms';
import HeightFade from '@/components/transitions/HeightFade.vue';

const clientStateStore = useClientStateStore();

const loggedInUserStore = useLoggedInUserStore();
const loggedInUser = loggedInUserStore.user;

const roomsStore = useRoomsStore();
const rooms = roomsStore.rooms;
</script>
<template>
  <MainLayout id="main-layout">
    <div class="bg-gradient-to-tl from-sky-900 to-teal-400">
      <div class="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8 h-full">
        <h1
          v-if="loggedInUser.getUserId() != ''"
          class="text-2xl font-bold text-gray-100 sm:text-3xl"
        >
          Willkommen zurück, {{ loggedInUser.getDisplayname() ?? loggedInUser.getUserId() }}!
        </h1>
        <div v-else class="animate-pulse bg-gray-200 h-8 w-full rounded-lg"></div>

        <p v-if="loggedInUser.getUserId() != ''" class="mt-1.5 text-sm text-gray-200">
          Du hast 1.000.000 € Schulden - beginne, Geld zurückzuzahlen!
        </p>
        <div v-else class="animate-pulse bg-gray-200 h-4 w-1/2 rounded-lg mt-2"></div>
      </div>
    </div>

    <!--Rooms-->
    <div id="rooms" class="flex flex-col items-center gap-5 p-2 lg:p-5">
      <HeightFade>
        <span
          v-show="clientStateStore.syncing && clientStateStore.numberOfSyncs < 1"
          class="transition duration-700 text-3xl text-gray-300"
        >
          <i class="fa-solid fa-spinner animate-spin"></i>
        </span>
      </HeightFade>
      <span
        v-show="clientStateStore.numberOfSyncs > 0 && rooms && Object.keys(rooms).length <= 0"
        id="no-rooms-message"
        class="text-sm text-gray-300"
      >
        Keine Räume gefunden - trete einem Raum bei, um Rechnungen aufzuteilen
      </span>
      <template v-for="room in rooms" :key="room.id">
        <RoomTile :room="room" />
      </template>
    </div>
    <!--End of rooms-->
  </MainLayout>
</template>
