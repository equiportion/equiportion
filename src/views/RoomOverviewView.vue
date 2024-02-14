<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import RoomTile from '@/views/roomoverview/RoomTile.vue';
import {useClientStateStore} from '@/stores/clientState';
import {useLoggedInUserStore} from '@/stores/loggedInUser';
import {useRoomsStore} from '@/stores/rooms';
import HeightFade from '@/components/transitions/HeightFade.vue';
import {watch, ref, computed} from 'vue';
import waitForInitialSync from '@/logic/utils/waitForSync';
import InputFieldWithLabelAndError from '@/components/input/InputFieldWithLabelAndError.vue';
import StandardButton from '@/components/buttons/StandardButton.vue';
import AuthenticatedMatrixClient from '@/logic/clients/AuthenticatedMatrixClient';
import ButtonSelect from '@/components/input/ButtonSelect.vue';
import SelectInput from '@/components/input/SelectInput.vue';
import EquiPortionSettingsEvent from '@/logic/models/events/custom/EquiPortionSetttingsEvent';
import useGlobalEventBus from '@/composables/useGlobalEventBus';
import BipartiteCompensation from '@/logic/compensation/BipartiteCompensation';
import MatrixEvent from '@/logic/models/events/MatrixEvent';
import InvitedRoomTile from '@/views/roomoverview/InvitedRoomTile.vue';
import { absEurosPart, centsPart } from '@/logic/utils/money';

const clientStateStore = useClientStateStore();

const loggedInUserStore = useLoggedInUserStore();
const loggedInUser = loggedInUserStore.user;

const roomsStore = useRoomsStore();
const joinedRooms = roomsStore.joinedRooms;
const invitedRooms = roomsStore.invitedRooms;

const balance = ref(0);
function calculateBalance() {
  let sum = 0;
  for (const room of Object.values(joinedRooms)) {
    if (room.isVisible() === false) {
      continue;
    }

    const compensationCalculation = new BipartiteCompensation();
    const compensation = compensationCalculation.calculateCompensation(room);
    for (const comp of Object.values(compensation)) {
      sum += comp;
    }
  }
  balance.value = sum;
}
waitForInitialSync().then(() => {
  calculateBalance();
});
watch(joinedRooms, () => {
  calculateBalance();
});

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
 * Room creation
 */
const newRoomName = ref('');
const newRoomMethod = ref('');
const newRoomSelection = ref('');
const roomsActionLoading = ref(false);

const roomCreationDisabled = computed(() => {
  return newRoomName.value == '';
});

const roomSelectionDisabled = computed(() => {
  return newRoomSelection.value == '';
});

const roomsAsOptions = computed(() => {
  return Object.values(joinedRooms)
    .filter((room) => !room.isVisible())
    .map((room) => {
      return {value: room.getRoomId(), label: room.getName() ?? room.getRoomId()};
    });
});

/**
 * creates a completely new room
 */
async function createNewRoom() {
  if (newRoomName.value === '') {
    return;
  }
  roomsActionLoading.value = true;
  await AuthenticatedMatrixClient.getClient().createRoom(newRoomName.value);

  newRoomName.value = '';
  newRoomSelection.value = '';
  newRoomMethod.value = '';

  roomsActionLoading.value = false;
}

/**
 * makes an existing room visible in the app
 */
async function makeRoomVisible() {
  if (newRoomSelection.value === '') {
    return;
  }

  roomsActionLoading.value = true;

  const newEquiportionSettingsEvent = new EquiPortionSettingsEvent(
    MatrixEvent.EVENT_ID_NEW,
    newRoomSelection.value,
    true
  );
  await newEquiportionSettingsEvent.publish();

  newRoomSelection.value = '';
  newRoomMethod.value = '';

  roomsActionLoading.value = false;
}

const {bus} = useGlobalEventBus();
watch(
  () => bus.value.get('click'),
  (val) => {
    if (!val[0]['no-close']) {
      newRoomMethod.value = '';
    }
  }
);
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
            Du hast {{ absEurosPart(balance) }},{{ centsPart(balance) }} € Schulden - beginne, Geld
            zurückzuzahlen!
          </span>
          <span v-else-if="balance < 0">
            Du erhältst noch {{ absEurosPart(balance) }},{{ centsPart(balance) }} € - gib deine
            Zahlungsinformationen an, damit dir andere das Geld zurückzahlen können!
          </span>
          <span v-else>
            Du hast weder Schulden noch Guthaben - beginne, Transaktionen zu erstellen!
          </span>
        </p>
        <div v-else class="animate-pulse bg-gray-200 h-4 w-1/2 rounded-lg mt-2"></div>
      </div>
    </div>

    <!-- Toolbar -->
    <div id="toolBar" class="flex flex-col items-center gap-5 p-2 lg:p-5">
      <div
        class="flex flex-col items-center lg:items-start justify-between w-full lg:max-w-[80%] gap-5 p-5 rounded-lg bg-gray-100 lg:hover:bg-gray-200 shadow-lg transition lg:hover:scale-[101%] no-close"
      >
        <ButtonSelect
          v-model="newRoomMethod"
          :options="[
            {label: 'Neuen Raum erstellen', value: 'new', icon: 'fa-solid fa-plus'},
            {
              label: 'Bestehenden Matrix-Raum hinzufügen',
              value: 'existing',
              icon: 'fa-solid fa-users-rectangle',
            },
          ]"
        />
        <HeightFade>
          <div v-show="newRoomMethod != ''" class="w-full">
            <div v-if="newRoomMethod == 'new'" class="w-full flex flex-col gap-5">
              <InputFieldWithLabelAndError
                id="roomNameInputField"
                v-model="newRoomName"
                label="Name des neuen Raums"
                type="text"
                class="w-full"
              />
              <StandardButton
                id="createRoomButton"
                :loading="roomsActionLoading"
                :disabled="roomCreationDisabled"
                @click="createNewRoom()"
              >
                <i class="fa-solid fa-plus"></i> Erstellen
              </StandardButton>
            </div>
            <div v-else-if="newRoomMethod == 'existing'" class="w-full flex flex-col gap-5">
              <template v-if="roomsAsOptions.length > 0">
                <SelectInput
                  v-model="newRoomSelection"
                  label="Matrix-Raum auswählen"
                  :options="roomsAsOptions"
                />
                <StandardButton
                  :loading="roomsActionLoading"
                  :disabled="roomSelectionDisabled"
                  @click="makeRoomVisible()"
                >
                  <i class="fa-solid fa-plus"></i> Raum in EquiPortion nutzen
                </StandardButton>
              </template>
              <template v-else>
                <span class="text-sm text-gray-600">
                  Keine Matrix-Räume gefunden, die noch nicht in EquiPortion genutzt werden!
                </span>
              </template>
            </div>
            <div v-else class="h-20"></div>
          </div>
        </HeightFade>
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
        v-show="
          clientStateStore.numberOfSyncs > 0 &&
          joinedRooms &&
          Object.keys(joinedRooms).length <= 0 &&
          invitedRooms &&
          Object.keys(invitedRooms).length <= 0
        "
        id="no-rooms-message"
        class="text-sm text-gray-300"
      >
        Keine Räume gefunden - trete einem Raum bei, um Rechnungen aufzuteilen
      </span>
      <template v-for="room in invitedRooms" :key="room.id">
        <InvitedRoomTile :room="room" />
      </template>
      <template v-for="room in joinedRooms" :key="room.id">
        <RoomTile v-if="room.isVisible()" :room="room" />
      </template>
    </div>
    <!--End of rooms-->
  </MainLayout>
</template>
@/logic/clients/AuthenticatedMatrixClient
