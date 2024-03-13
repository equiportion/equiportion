<script setup lang="ts">
/** Imports */
// Layout and Components
import MainLayout from '@/layouts/MainLayout.vue';
import MxcOrPlaceholderImage from '@/components/media/MxcOrPlaceholderImage.vue';
import TransactionTile from '@/views/transactionoverview/TransactionTile.vue';
import RoundButton from '@/components/buttons/RoundButton.vue';
import UserBadge from '@/components/user/UserBadge.vue';
import UserTile from '@/components/user/UserTile.vue';

// models
import type User from '@/logic/models/User';
import type Room from '@/logic/models/Room';
import MatrixEvent from '@/logic/models/events/MatrixEvent';
import MRoomMemberEvent from '@/logic/models/events/matrix/MRoomMemberEvent';
import TransactionEvent from '@/logic/models/events/custom/TransactionEvent';
import MRoomNameEvent from '@/logic/models/events/matrix/MRoomNameEvent';
import MRoomAvatarEvent from '@/logic/models/events/matrix/MRoomAvatarEvent';
import MRoomTopicEvent from '@/logic/models/events/matrix/MRoomTopicEvent';
import HeightFade from '@/components/transitions/HeightFade.vue';
import BalanceSpan from '@/views/transactionoverview/BalanceSpan.vue';
import InputFieldWithLabelAndError from '@/components/input/InputFieldWithLabelAndError.vue';
import DropdownMenu from '@/components/dropdowns/DropdownMenu.vue';
import DropdownButton from '@/components/dropdowns/DropdownButton.vue';
import InviteModal from '@/views/transactionoverview/InviteModal.vue';

//composables
import {onIntersect} from '@/composables/useIntersectionObserver';

//clients
import AuthenticatedMatrixClient from '@/logic/clients/AuthenticatedMatrixClient';

//compensation
import BipartiteCompensation from '@/logic/compensation/BipartiteCompensation';

// stores
import {useRoomsStore} from '@/stores/rooms';
import {useLoggedInUserStore} from '@/stores/loggedInUser';

// utils
import waitForInitialSync from '@/logic/utils/waitForSync';

// framework and libraries
import {computed, ref, watch, type Ref, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import router from '@/router';

/** Data */
const roomId = ref(useRoute().params.roomId.toString());
const roomsStore = useRoomsStore();
const room: Ref<Room | undefined> = ref(undefined);
const compensation: Ref<{[userId: string]: number}> = ref({});
const events: Ref<MatrixEvent[]> = ref([]);
const error = ref();
const newRoomName = ref();
const newRoomTopic = ref();
const loggedInUser = useLoggedInUserStore().user;
const changeRoomData = ref(false);
const showTransactionsLoader = ref(false);
const observeRef = ref<HTMLElement | null>(null);

const memberListOpen = ref(false);
const inviteModalOpen = ref(false);

const roomDataSetLoading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const previewUploadImage: Ref<string | null> = ref(null);

/** Computed */

const iconClasses = computed(() => {
  if (memberListOpen.value) {
    return 'fa-solid fa-angles-right rotate-180 transition';
  } else {
    return 'fa-solid fa-angles-right transition';
  }
});

const contentClasses = computed(() => {
  if (memberListOpen.value) {
    return 'hidden lg:flex flex-col p-5 items-center w-full';
  } else {
    return 'flex flex-col p-5 items-center w-full';
  }
});

const showUserBadges = computed(() => {
  let i = 0;
  let badgeList: User[] = [];
  const members = room.value?.getMembers();
  for (const userId in members) {
    if (i < 3) {
      badgeList.push(members[userId]);
    } else {
      break;
    }
    i++;
  }
  return badgeList;
});

/** Functions */

function toggleInviteModal(): void {
  inviteModalOpen.value = !inviteModalOpen.value;
}

// load rooms
function loadRooms() {
  room.value = roomsStore.getRoom(roomId.value);
  events.value = room.value?.getTimelineEvents() as (TransactionEvent | MRoomMemberEvent)[];

  const compensationCalculation = new BipartiteCompensation();
  compensation.value = compensationCalculation.calculateCompensation(room.value!);
}

function updateNewRoomData() {
  newRoomName.value = room.value?.getName() ?? '';
  newRoomTopic.value = room.value?.getTopic() ?? '';
}

// load room
waitForInitialSync().then(() => {
  loadRooms();
  updateNewRoomData();
});

// reversed events
const reversedEvents = computed(() => {
  return events.value.slice().reverse();
});

/**
 * Opens NewTransactionView of the room of this TransactionOverviewView.
 * @returns {void}
 */
function newTransaction(): void {
  router.push({
    name: 'new-transaction',
    params: {roomId: roomId.value},
  });
}

function toggleMemberList(): void {
  memberListOpen.value = !memberListOpen.value;
}

function toggleChangeRoomData(): void {
  changeRoomData.value = !changeRoomData.value;
}

onMounted(() => {
  // start the intersection observer
  intersectPageEnd();
});
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length) {
    selectedFile.value = input.files[0];
  }
};

async function setRoomData(): Promise<void> {
  roomDataSetLoading.value = true;

  if (selectedFile.value) {
    const client = AuthenticatedMatrixClient.getClient();
    try {
      const imageMxcUrl = await client.uploadFile(selectedFile.value);
      const mRoomAvatarEvent = new MRoomAvatarEvent(
        MatrixEvent.EVENT_ID_NEW,
        roomId.value,
        imageMxcUrl
      );
      await mRoomAvatarEvent.publish();
    } catch (error) {
      console.error(error);
    }

    previewUploadImage.value = null;
  }

  if (newRoomName.value != room.value?.getName()) {
    const mRoomNameEvent = new MRoomNameEvent(
      MatrixEvent.EVENT_ID_NEW,
      roomId.value,
      newRoomName.value
    );
    await mRoomNameEvent.publish();
  }

  if (newRoomTopic.value != room.value?.getTopic()) {
    const mRoomTopicEvent = new MRoomTopicEvent(
      MatrixEvent.EVENT_ID_NEW,
      roomId.value,
      newRoomTopic.value
    );
    await mRoomTopicEvent.publish();
  }
  changeRoomData.value = false;
  roomDataSetLoading.value = false;
}

/**
 * Preview the selected image.
 */
watch(
  () => selectedFile.value,
  () => {
    if (selectedFile.value) {
      const reader = new FileReader();
      reader.onload = () => {
        previewUploadImage.value = reader.result as string | null;
      };
      reader.readAsDataURL(selectedFile.value);
    }
  }
);

/**
 * Checks whether the user sees the "observeRef" element.
 * If so, the function "loadMoreTransactions" is called.
 */
function intersectPageEnd() {
  onIntersect(observeRef.value!, () => {
    loadMoreTransactions();
  });
}

/**
 * Loads more transactions.
 */
async function loadMoreTransactions() {
  showTransactionsLoader.value = true;

  const reloadAgain = await room.value?.loadPreviousTimelineEvents();
  loadRooms();

  showTransactionsLoader.value = false;

  // restart the intersection observer
  if (reloadAgain === true) {
    onIntersect(observeRef.value!, () => {
      loadMoreTransactions();
    });
  }
}

//redirects to new transaction view and stores compensation and user id of participant in session storage
function redirectToCompensationPayment(compensation: number, userId: string) {
  if (!compensation) {
    return;
  }

  sessionStorage.setItem('compensation', compensation.toString());
  sessionStorage.setItem('compensation_userId', userId);
  router.push({
    name: 'new-transaction',
    params: {roomId: roomId.value},
  });
}

/**
 * Kick a user from the room.
 */
async function kickUser(userId: string) {
  const success = await room.value?.kickUser(userId);

  if (!success) {
    alert('Fehler beim Kicken des Mitglieds. Bitte prüfe, ob du die nötigen Rechte hast!');
  }
}

/**
 * Leave the room.
 */
async function leaveRoom() {
  // ask for confirmation
  if (!confirm('Möchtest du den Raum wirklich verlassen?')) {
    return;
  }

  const client = AuthenticatedMatrixClient.getClient();
  const success = await client.leaveRoom(roomId.value);

  if (!success) {
    alert('Fehler beim Verlassen des Raums! Bitte probiere es später erneut.');
  } else {
    router.push({name: 'home'});
  }
}

/**
 * function to help vscode not to explode because of ts in vue
 * (not support at the moment see https://github.com/vuejs/vetur/issues/1854)
 */
function asTransactionEvent(event: MatrixEvent): TransactionEvent {
  return event as TransactionEvent;
}

function asMRoomMemberEvent(event: MatrixEvent): MRoomMemberEvent {
  return event as MRoomMemberEvent;
}

/** Watchers */

// update if room changes
watch(roomId, () => {
  loadRooms();
});

watch(
  room,
  () => {
    if (!roomDataSetLoading.value) {
      updateNewRoomData();
    }
  },
  {deep: true}
);
</script>

<template>
  <MainLayout>
    <!--shows a button that enables the user to add a new transaction-->
    <RoundButton
      id="newTransactionButton"
      class="fixed bottom-5 right-5 shadow-lg z-50"
      @click="newTransaction"
    >
      <i class="fa-solid fa-plus"></i>
    </RoundButton>

    <!--modal for inviting user-->
    <InviteModal v-model:open="inviteModalOpen" :room="room" />

    <div class="flex flex-col lg:flex-row min-h-screen">
      <!--content-->
      <div :class="contentClasses">
        <!--The main body of the transaction overview, being 80% wide-->
        <div class="flex flex-col lg:max-w-[1500px] w-full">
          <!--Room image and name -->
          <div class="flex flex-col items-center lg:flex-row mt-4">
            <!--shows the room picture when in edit mode-->
            <div
              v-if="changeRoomData"
              class="w-16 h-16 lg:w-32 lg:h-32 relative justify-center items-center shrink-0"
            >
              <div>
                <div
                  v-if="previewUploadImage"
                  alt="Hochgeladenes Bild"
                  class="absolute rounded-full w-16 h-16 lg:w-32 lg:h-32 shadow-lg bg-cover bg-center"
                  :style="{'background-image': `url(${previewUploadImage})`}"
                ></div>
                <MxcOrPlaceholderImage
                  v-else
                  :mxc-url="room?.getAvatarUrl() ?? ''"
                  :placeholder-text="room?.getName() ?? '?'"
                  class="absolute rounded-full w-16 h-16 lg:w-32 lg:h-32 shadow-lg"
                />
                <label
                  id="uploadLabel"
                  class="rounded-full lg:opacity-0 backdrop-blur-md lg:backdrop-blur-none lg:hover:backdrop-blur-md lg:hover:opacity-95 absolute w-16 h-16 lg:h-32 lg:w-32 flex justify-center items-center cursor-pointer"
                  for="fileInput"
                >
                  <div class="flex flex-col absolute text-center dark:text-gray-200">
                    <span><i class="fa-solid fa-upload"></i></span>
                    <span class="hidden lg:block">Bild hochladen</span>
                  </div>
                </label>
                <input
                  id="fileInput"
                  ref="fileInput"
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                  class="hidden"
                  @change="handleFileChange"
                />
              </div>
            </div>
            <!--shows the room picture-->
            <div v-else class="shrink-0">
              <MxcOrPlaceholderImage
                :mxc-url="room?.getAvatarUrl() ?? ''"
                :placeholder-text="room?.getName() ?? '?'"
                class="rounded-full w-16 h-16 lg:w-32 lg:h-32 shadow-lg"
              />
            </div>
            <div class="w-full">
              <!--edit mode with submit button and input fields-->
              <div
                v-if="changeRoomData"
                class="flex flex-col items-center gap-2 lg:items-start lg:ml-4 mt-2 lg:mt-0 lg:gap-3 w-full"
              >
                <div class="flex flex-row gap-4 items-center w-full">
                  <InputFieldWithLabelAndError
                    id="roomName"
                    v-model="newRoomName"
                    class="w-full lg:max-w-[400px]"
                    type="text"
                    name=""
                    placeholder="Name eingeben"
                    label=""
                    :error="error"
                  />

                  <RoundButton
                    id="changeRoomDataSubmitLg"
                    :loading="roomDataSetLoading"
                    class="shadow-lg h-8 w-8 hidden lg:block"
                    @click="setRoomData()"
                  >
                    <i class="fa-solid fa-check"></i>
                  </RoundButton>
                </div>
                <InputFieldWithLabelAndError
                  id="roomTopic"
                  v-model="newRoomTopic"
                  class="w-full lg:max-w-[400px]"
                  type="text"
                  name=""
                  placeholder="Thema eingeben"
                  label=""
                  :error="error"
                />
                <RoundButton
                  id="changeRoomDataSubmitSm"
                  :loading="roomDataSetLoading"
                  class="shadow-lg h-8 w-8 lg:hidden"
                  @click="setRoomData()"
                >
                  <i class="fa-solid fa-check"></i>
                </RoundButton>
              </div>
              <!--room name and room topic-->
              <div v-else class="flex flex-col items-center lg:items-start lg:ml-5 gap-2 lg:gap-1">
                <!--shows the room name if possible or the room id if not-->
                <div class="flex flex-row gap-3 items-center">
                  <h1
                    class="flex text-3xl font-bold text-gray-900 dark:text-gray-200 break-all items-center"
                  >
                    {{ room?.getName() ?? roomId }}
                  </h1>
                  <!--Change room data button-->
                  <div class="shrink-0 hidden lg:block">
                    <RoundButton
                      id="changeRoomDataButtonLg"
                      class="shadow-lg h-8 w-8"
                      @click="toggleChangeRoomData()"
                    >
                      <i class="fa-solid fa-pen"></i>
                    </RoundButton>
                  </div>
                </div>

                <span
                  class="flex text-sm text-gray-500 dark:text-gray-400 break-all items-center lg:mb-2"
                >
                  {{ room?.getTopic() }}
                </span>
                <RoundButton
                  id="changeRoomDataButtonSm"
                  class="shadow-lg h-8 w-8 lg:hidden"
                  @click="toggleChangeRoomData()"
                >
                  <i class="fa-solid fa-pen"></i>
                </RoundButton>

                <div
                  id="memberBadgesList"
                  class="flex flex-row gap-2 justify-center lg:justify-start flex-wrap"
                >
                  <!--shows the display names of all members in a room if possible or the member id if not-->
                  <template v-for="member in showUserBadges" :key="member.getUserId()">
                    <UserBadge v-show="member.getUserId() != ''" :user="member" class="shadow-md" />
                  </template>
                  <span v-if="Object.keys(room?.getMembers() ?? {}).length > 3">...</span>

                  <RoundButton
                    id="toggleMemberListButton"
                    class="w-8 h-8 shadow-md"
                    @click="toggleMemberList()"
                  >
                    <i :class="iconClasses"></i>
                  </RoundButton>
                </div>
              </div>
            </div>
          </div>

          <div v-show="room" class="flex flex-col mt-10 lg:mt-5">
            <!--default message if no transactions were made-->
            <div v-show="events && events.length <= 0">
              <span
                id="no-transaction-message"
                class="text-sm text-gray-400 dark:text-gray-300 text-center"
              >
                Ganz schön leer hier... Füge weitere Personen hinzu und erstelle eine Transaktion!
              </span>
            </div>

            <!--the header of the table containing the transactions-->
            <div
              v-show="!(events && events.length <= 0)"
              id="transactions"
              class="flex flex-col justify-center gap-5"
            >
              <!--shows all transactions and membership events using the transacion tile partial / membership view -->
              <template v-for="event in reversedEvents" :key="event.getEventId()">
                <template v-if="!!(event instanceof TransactionEvent)">
                  <TransactionTile :transaction="asTransactionEvent(event)" />
                </template>

                <div
                  v-else-if="
                    !!(event instanceof MRoomMemberEvent) &&
                    asMRoomMemberEvent(event).getPreviousMembership() !=
                      asMRoomMemberEvent(event).getMembershipType()
                  "
                  class="flex flex-row justify-center items-center gap-1"
                >
                  <UserBadge
                    :user="room?.getMember(asMRoomMemberEvent(event).getUserId())!"
                    size="sm"
                    class="shadow-md"
                  />

                  {{}}

                  <!-- string for which membership change was performed-->
                  <span
                    v-if="asMRoomMemberEvent(event).getMembershipType() == 'join'"
                    class="italic text-gray-600 dark:text-gray-400 text-sm"
                  >
                    ist beigetreten
                  </span>
                  <span
                    v-else-if="asMRoomMemberEvent(event).getMembershipType() == 'leave'"
                    class="italic text-gray-600 dark:text-gray-400 text-sm"
                  >
                    hat den Raum verlassen
                  </span>
                  <span
                    v-else-if="asMRoomMemberEvent(event).getMembershipType() == 'invite'"
                    class="italic text-gray-600 dark:text-gray-400 text-sm"
                  >
                    wurde eingeladen
                  </span>
                  <span
                    v-else-if="asMRoomMemberEvent(event).getMembershipType() == 'ban'"
                    class="italic text-gray-600 dark:text-gray-400 text-sm"
                  >
                    wurde aus dem Raum verbannt
                  </span>
                  <span v-else>unbekannte Mitgliedsänderung</span>
                </div>
              </template>

              <div ref="observeRef"></div>
              <HeightFade>
                <div
                  v-show="showTransactionsLoader"
                  id="spinner"
                  class="flex flex-col items-center text-3xl text-gray-300"
                >
                  <i class="fa-solid fa-spinner animate-spin"></i>
                </div>
              </HeightFade>
            </div>
          </div>
        </div>
      </div>

      <!--Member list-->
      <div
        v-show="memberListOpen"
        id="memberList"
        class="flex flex-col flex-grow w-full lg:w-1/3 shadow-lg rounded-tl-lg rounded-bl-lg transition bg-gray-100 dark:bg-gray-700 my-5 p-5 gap-5"
      >
        <div class="flex flex-row items-center justify-between">
          <RoundButton class="w-8 h-8 shrink-0 shadow-md" @click="toggleMemberList()">
            <i class="fa-solid fa-angles-right"></i>
          </RoundButton>
          <RoundButton
            id="addMemberButton"
            class="w-8 h-8 shrink-0 shadow-md"
            @click="toggleInviteModal()"
          >
            <i class="fa-solid fa-user-plus text-sm"></i>
          </RoundButton>
        </div>
        <div id="userTiles" class="flex flex-col gap-2">
          <!-- current user -->
          <div class="flex items-center bg-gray-300 dark:bg-gray-500 p-2 rounded-lg">
            <UserTile :user="room?.getMember(loggedInUser.getUserId())!" class="w-full" />

            <button
              class="text-red-600 dark:text-red-500"
              title="Raum verlassen"
              @click="leaveRoom()"
            >
              <i class="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>

          <!-- all current room members-->
          <template v-for="member in room?.getMembers()" :key="member.getUserId()">
            <div
              v-show="member.getUserId() != ''"
              v-if="member.getUserId() != loggedInUser.getUserId()"
              class="flex items-center bg-gray-300 dark:bg-gray-500 p-2 rounded-lg"
            >
              <div class="flex flex-col items-center gap-1 w-full">
                <UserTile :user="member" class="w-full" />
                <BalanceSpan :compensation="compensation[member.getUserId()]" />
              </div>

              <!-- dropdown menu for banning and creating compensation payments -->
              <DropdownMenu>
                <template #trigger>
                  <i class="fa-solid fa-ellipsis-vertical px-2 dark:text-gray-200"></i>
                </template>

                <DropdownButton
                  v-show="compensation[member.getUserId()]"
                  @click="
                    redirectToCompensationPayment(
                      compensation[member.getUserId()],
                      member.getUserId()
                    )
                  "
                >
                  <i class="fa-solid fa-money-bill-transfer"></i>
                  <span>Ausgleichs-Transaktion erstellen</span>
                </DropdownButton>

                <DropdownButton @click="kickUser(member.getUserId())">
                  <i class="fa-solid fa-user-slash text-red-600"></i>
                  <span class="grow text-red-600">Mitglied kicken</span>
                </DropdownButton>
              </DropdownMenu>
            </div>
          </template>

          <!--invited members-->
          <div
            v-if="
              room?.getMembers(['invite']) && Object.keys(room!.getMembers(['invite'])).length > 0
            "
            class="opacity-50"
          >
            <span class="text-sm text-gray-800 dark:text-gray-200 items-center">Eingeladen</span>
            <div
              v-for="member in room!.getMembers(['invite'])"
              :key="member.getUserId()"
              class="flex flex-col items-center gap-1 bg-gray-300 dark:bg-gray-500 p-2 rounded-lg mb-2"
            >
              <UserTile :user="member" class="w-full" />
            </div>
          </div>

          <!--left members-->
          <div
            v-if="room?.getMembers(['left']) && Object.keys(room!.getMembers(['left'])).length > 0"
            class="opacity-50"
          >
            <span class="text-sm text-gray-800 dark:text-gray-200 items-center"
              >Ehemalige Mitglieder</span
            >
            <div
              v-for="member in room!.getMembers(['left'])"
              :key="member.getUserId()"
              class="flex flex-col items-center gap-1 bg-gray-300 dark:bg-gray-500 p-2 rounded-lg mb-2"
            >
              <UserTile :user="member" class="w-full" />
              <BalanceSpan :compensation="compensation[member.getUserId()]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
