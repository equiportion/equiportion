<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import MxcOrPlaceholderImage from '@/components/media/MxcOrPlaceholderImage.vue';
import RoundButton from '@/components/buttons/RoundButton.vue';
import {useRoute} from 'vue-router';
import TransactionTile from './partials/TransactionTile.vue';
import {useRoomsStore} from '@/stores/rooms';
import TransactionEvent from '@/logic/models/events/custom/TransactionEvent';
import router from '@/router';
import UserBadge from '@/components/user/UserBadge.vue';
import {computed, ref, watch, type Ref, onMounted} from 'vue';
import type User from '@/logic/models/User';
import UserTile from '@/components/user/UserTile.vue';
import {useLoggedInUserStore} from '@/stores/loggedInUser';
import type Room from '@/logic/models/Room';
import waitForInitialSync from '@/logic/utils/waitForSync';
import {onIntersect} from '@/composables/useIntersectionObserver';
import HeightFade from '@/components/transitions/HeightFade.vue';
import MRoomMemberEvent from '@/logic/models/events/matrix/MRoomMemberEvent';
import BalanceSpan from './partials/BalanceSpan.vue';
import MatrixEvent from '@/logic/models/events/MatrixEvent';
import BipartiteCompensation from '@/logic/models/compensation/BipartiteCompensation';
import InputFieldWithLabelAndError from '@/components/input/InputFieldWithLabelAndError.vue';
import MRoomNameEvent from '@/logic/models/events/matrix/MRoomNameEvent';
import MRoomTopicEvent from '@/logic/models/events/matrix/MRoomTopicEvent';

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
const memberListOpen = ref(false);
const observeRef: Ref<HTMLElement | null> = ref(null);
const showTransactionsLoader = ref(false);

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

// load rooms
function loadRooms() {
  room.value = roomsStore.getRoom(roomId.value);
  events.value = room.value?.getEvents()!;
  events.value.reverse();

  events.value = room.value?.getEvents() as (TransactionEvent | MRoomMemberEvent)[];
  events.value.reverse();

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

// update if room changes
watch(roomId, () => {
  loadRooms();
});

watch(
  room,
  () => {
    updateNewRoomData();
  },
  {deep: true}
);

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

function setRoomData(): void {
  if (newRoomName.value != room.value?.getName()) {
    const mRoomNameEvent = new MRoomNameEvent(
      MatrixEvent.EVENT_ID_NEW,
      roomId.value,
      newRoomName.value
    );
    mRoomNameEvent.publish();
  }
  if (newRoomTopic.value != room.value?.getTopic()) {
    const mRoomTopicEvent = new MRoomTopicEvent(
      MatrixEvent.EVENT_ID_NEW,
      roomId.value,
      newRoomTopic.value
    );
    mRoomTopicEvent.publish();
  }
  changeRoomData.value = false;
}

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

  const reloadAgain = await room.value?.loadPreviousEvents();
  loadRooms();

  showTransactionsLoader.value = false;

  // restart the intersection observer
  if (reloadAgain === true) {
    onIntersect(observeRef.value!, () => {
      loadMoreTransactions();
    });
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
</script>

<template>
  <MainLayout>
    <!--shows a button that enables the user to add a new transaction-->
    <RoundButton
      id="newTransactionButton"
      class="fixed bottom-5 right-5 shadow-lg"
      @click="newTransaction"
    >
      <i class="fa-solid fa-plus"></i>
    </RoundButton>

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
              class="w-16 h-16 lg:w-32 lg:h-32 relative justify-center items-center"
            >
              <div>
                <MxcOrPlaceholderImage
                  :mxc-url="room?.getAvatarUrl() ?? ''"
                  :placeholder-text="room?.getName() ?? '?'"
                  class="absolute rounded-full w-16 h-16 lg:w-32 lg:h-32 shadow-lg"
                />
                <label
                  class="rounded-full lg:opacity-0 backdrop-blur-md lg:backdrop-blur-none lg:hover:backdrop-blur-md lg:hover:opacity-95 absolute w-16 h-16 lg:h-32 lg:w-32 flex justify-center items-center cursor-pointer"
                  for="fileInput"
                >
                  <div class="flex flex-col absolute text-center">
                    <span><i class="fa-solid fa-upload"></i></span>
                    <span class="hidden lg:block">Bild hochladen</span>
                  </div>
                </label>
                <input id="fileInput" type="file" class="hidden" />
              </div>
            </div>
            <!--shows the room picture-->
            <MxcOrPlaceholderImage
              v-else
              :mxc-url="room?.getAvatarUrl() ?? ''"
              :placeholder-text="room?.getName() ?? '?'"
              class="rounded-full w-16 h-16 lg:w-32 lg:h-32 shadow-lg"
            />
            <div class="mt-2">
              <!--edit mode with submit button and input fields-->
              <div
                v-if="changeRoomData"
                class="flex flex-col items-center gap-2 lg:items-start lg:ml-4 lg:gap-3"
              >
                <div class="flex flex-row space-x-4 items-center">
                  <InputFieldWithLabelAndError
                    id="roomName"
                    v-model:model-value="newRoomName"
                    type="text"
                    name=""
                    placeholder="Name eingeben"
                    label=""
                    :error="error"
                  />
                  <RoundButton
                    id="changeRoomData"
                    class="shadow-lg h-8 w-8 hidden lg:block"
                    @click="setRoomData()"
                    ><i class="fa-solid fa-check"></i
                  ></RoundButton>
                </div>
                <InputFieldWithLabelAndError
                  id="roomTopic"
                  v-model:model-value="newRoomTopic"
                  type="text"
                  name=""
                  placeholder="Thema eingeben"
                  label=""
                  :error="error"
                />
                <RoundButton
                  id="changeRoomData"
                  class="shadow-lg h-8 w-8 lg:hidden"
                  @click="setRoomData()"
                  ><i class="fa-solid fa-check"></i
                ></RoundButton>
              </div>
              <!--room name and room topic-->
              <div v-else class="flex flex-col items-center gap-2 lg:items-start lg:ml-4 lg:gap-3">
                <!--shows the room name if possible or the room id if not-->
                <div class="flex flex-row space-x-4">
                  <h1 class="flex text-3xl font-bold text-gray-900 break-all items-center">
                    {{ room?.getName() ?? roomId }}
                  </h1>
                  <!--Change room data button-->
                  <RoundButton
                    id="changeRoomData"
                    class="shadow-lg h-8 w-8 hidden lg:block"
                    @click="toggleChangeRoomData()"
                    ><i class="fa-solid fa-pen"></i
                  ></RoundButton>
                </div>
                <h2 class="flex text-2xl font-bold text-gray-800 break-all">
                  {{ room?.getTopic() }}
                </h2>
                <RoundButton
                  id="changeRoomData"
                  class="shadow-lg h-8 w-8 lg:hidden"
                  @click="toggleChangeRoomData()"
                  ><i class="fa-solid fa-pen"></i
                ></RoundButton>

                <div
                  id="memberBadgesList"
                  class="flex flex-row gap-2 justify-center lg:justify-start flex-wrap"
                >
                  <!--shows the display names of all members in a room if possible or the member id if not-->
                  <template v-for="member in showUserBadges" :key="member.getUserId()">
                    <UserBadge :user="member" class="shadow-md" />
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
              <span id="no-transaction-message" class="text-sm text-gray-400 text-center">
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
              <template v-for="event in events" :key="event.getEventId()">
                <template v-if="!!(event instanceof TransactionEvent)">
                  <TransactionTile :transaction="asTransactionEvent(event)" />
                </template>

                <div
                  v-else-if="!!(event instanceof MRoomMemberEvent)"
                  class="flex flex-row justify-center items-center gap-1"
                >
                  <UserBadge
                    :user="room?.getMember(asMRoomMemberEvent(event).getUserId())!"
                    size="sm"
                    class="shadow-md"
                  />

                  <!-- string for which membership change was performed-->
                  <span
                    v-if="asMRoomMemberEvent(event).getMembershipType() == 'join'"
                    class="italic text-gray-600 text-sm"
                  >
                    ist beigetreten
                  </span>
                  <span
                    v-else-if="asMRoomMemberEvent(event).getMembershipType() == 'leave'"
                    class="italic text-gray-600 text-sm"
                  >
                    hat den Raum verlassen
                  </span>
                  <span
                    v-else-if="asMRoomMemberEvent(event).getMembershipType() == 'invite'"
                    class="italic text-gray-600 text-sm"
                  >
                    wurde eingeladen
                  </span>
                  <span
                    v-else-if="asMRoomMemberEvent(event).getMembershipType() == 'ban'"
                    class="italic text-gray-600 text-sm"
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
        class="flex flex-col flex-grow w-full lg:w-1/3 shadow-lg rounded-tl-lg rounded-bl-lg transition bg-gray-100 my-5 p-5 gap-5"
      >
        <RoundButton class="w-8 h-8 flex-shrink-0 shadow-md" @click="toggleMemberList()">
          <i class="fa-solid fa-angles-right"></i>
        </RoundButton>

        <div id="userTiles" class="flex flex-col gap-2 overflow-y-auto">
          <!--shows the display names of all members in a room if possible or the member id if not-->

          <!-- current user -->
          <UserTile
            :user="room?.getMember(loggedInUser.getUserId())!"
            class="bg-gray-300 p-2 rounded-lg"
          />

          <!-- all current room members-->
          <template v-for="member in room?.getMembers()" :key="member.getUserId()">
            <div
              v-if="member.getUserId() != loggedInUser.getUserId()"
              class="flex flex-col items-center gap-1 bg-gray-300 p-2 rounded-lg"
            >
              <UserTile :user="member" class="w-full" />
              <BalanceSpan :compensation="compensation[member.getUserId()]"></BalanceSpan>
            </div>
          </template>

          <!--invited members-->
          <div
            v-if="
              room?.getMembers(['invite']) && Object.keys(room!.getMembers(['invite'])).length > 0
            "
            class="opacity-50"
          >
            <span class="text-sm text-gray-800 items-center">Eingeladen</span>
            <div
              v-for="member in room!.getMembers(['invite'])"
              :key="member.getUserId()"
              class="flex flex-col items-center gap-1 bg-gray-300 p-2 rounded-lg"
            >
              <UserTile :user="member" class="w-full" />
            </div>
          </div>

          <!--left members-->
          <div
            v-if="room?.getMembers(['left']) && Object.keys(room!.getMembers(['left'])).length > 0"
            class="opacity-50"
          >
            <span class="text-sm text-gray-800 items-center">Ehemalige Mitglieder</span>
            <div
              v-for="member in room!.getMembers(['left'])"
              :key="member.getUserId()"
              class="flex flex-col items-center gap-1 bg-gray-300 p-2 rounded-lg"
            >
              <UserTile :user="member" class="w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
