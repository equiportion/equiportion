<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import RoomTile from '@/views/partials/RoomTile.vue';
import {useClientStateStore} from '@/stores/clientState';
import {useLoggedInUserStore} from '@/stores/loggedInUser';
import {useRoomsStore} from '@/stores/rooms';
import HeightFade from '@/components/transitions/HeightFade.vue';
import NonOptimizedCompensation from '@/logic/models/compensation/NonOptimizedCompensation';
import {watch, ref} from 'vue';

const clientStateStore = useClientStateStore();

const loggedInUserStore = useLoggedInUserStore();
const loggedInUser = loggedInUserStore.user;

const roomsStore = useRoomsStore();
const rooms = roomsStore.rooms;

const balance = ref(0);
watch(
  () => rooms,
  () => {
    let sum = 0;
    for (const room of Object.values(rooms)) {
      const compensationCalculation = new NonOptimizedCompensation();
      const compensation = compensationCalculation.calculateCompensation(room);
      for (const comp of Object.values(compensation)) {
        sum += comp;
      }
    }
    balance.value = sum;
  },
  {
    immediate: true,
    deep: true,
  }
);

const greeting = ref('');

function generateGreeting() {
  const greetings = [
    'Hi',
    'Willkommen zurück',
    'Schön, dass du wieder da bist',
    'Hallo',
    'Guten Tag',
    'Cheers',
    'Hey',
    'Hallöchen',
  ];

  const randomIndex = Math.floor(Math.random() * greetings.length);
  greeting.value = greetings[randomIndex];
}
generateGreeting();

/**
 * Generic Functions
 */
function eurosPart(num: number): string {
  if (num < 0) {
    // remove minus string
    num = Math.abs(num);
  }
  return Math.floor(num / 100).toString();
}

function centsPart(num: number): string {
  return ('00' + (num % 100)).slice(-2);
}
</script>
<template>
  <MainLayout id="main-layout">
    <div class="bg-gradient-to-tl from-sky-900 to-teal-400">
      <div class="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8 h-full">
        <h1
          v-if="loggedInUser.getUserId() != ''"
          id="welcome-message-user"
          class="text-2xl font-bold text-gray-100 sm:text-3xl"
        >
          {{ greeting }}, {{ loggedInUser.getDisplayname() ?? loggedInUser.getUserId() }}!
        </h1>
        <div v-else class="animate-pulse bg-gray-200 h-8 w-full rounded-lg"></div>

        <p v-if="loggedInUser.getUserId() != ''" class="mt-1.5 text-sm text-gray-200">
          <span v-if="balance > 0">
            Du hast {{ eurosPart(balance) }},{{ centsPart(balance) }} € Schulden - beginne, Geld
            zurückzuzahlen!
          </span>
          <span v-else-if="balance < 0">
            Du erhältst noch {{ eurosPart(balance) }},{{ centsPart(balance) }} € - gib deine
            Zahlungsinformationen an, damit dir andere das Geld zurückzahlen können!
          </span>
          <span v-else>
            Du hast weder Schulden noch Guthaben - beginne, Transaktionen zu erstellen!
          </span>
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
