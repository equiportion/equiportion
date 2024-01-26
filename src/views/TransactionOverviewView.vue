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
import NonOptimizedCompensation from '@/logic/models/compensation/NonOptimizedCompensation';
import MRoomMemberEvent from '@/logic/models/events/matrix/MRoomMemberEvent';
import BalanceTile from './partials/BalanceTile.vue';

const roomId = ref(useRoute().params.roomId.toString());

const roomsStore = useRoomsStore();
const room: Ref<Room | undefined> = ref(undefined);

const compensation: Ref<{[userId: string]: number}> = ref({});
const events: Ref<(TransactionEvent | MRoomMemberEvent)[]> = ref([]);

const actualMembers: Ref<User[]> = ref([]);
const invitedMembers: Ref<User[]> = ref([]);
const leftMembers: Ref<User[]> = ref([]);

// load rooms
function loadRooms() {
  room.value = roomsStore.getRoom(roomId.value);
  transactionEvents.value = room.value?.getEvents(TransactionEvent.TYPE) as TransactionEvent[];
  transactionEvents.value.reverse();

  events.value = room.value?.getEvents().filter((event) => {
    if (event instanceof TransactionEvent) {
      return true;
    } else if (event instanceof MRoomMemberEvent) {
      return isMembershipEvent(event);
    }
    return false;
  }) as (TransactionEvent | MRoomMemberEvent)[];

  //get actual, invited and left members
  events.value.forEach((event) => {
    if (event instanceof MRoomMemberEvent) {
      const member = room.value?.getMembers()[event.getStateKey()]!;
      if (isMembershipEvent(event) == 'join') {
        invitedMembers.value = invitedMembers.value.filter(
          (invitedMember) => invitedMember !== member
        );
        leftMembers.value = leftMembers.value.filter((leftMember) => leftMember !== member);
        actualMembers.value.push(member);
      } else if (isMembershipEvent(event) == 'leave' && !leftMembers.value.includes(member)) {
        leftMembers.value.push(member);
        actualMembers.value = actualMembers.value.filter((actualMember) => actualMember !== member);
      } else if (isMembershipEvent(event) == 'invite' && !invitedMembers.value.includes(member)) {
        invitedMembers.value.push(member);
      }
    }
  });

  events.value.reverse();

  const compensationCalculation = new NonOptimizedCompensation();
  compensation.value = compensationCalculation.calculateCompensation(room.value!);
}

//check if event is join, leave or invite
function isMembershipEvent(event: MRoomMemberEvent): string | undefined {
  const content = event.toEventContent() as {membership?: string};
  if (
    content.membership === 'join' ||
    content.membership === 'leave' ||
    content.membership === 'invite'
  ) {
    return content.membership;
  }
}

// load room
waitForInitialSync().then(() => {
  loadRooms();
});

// update if room changes
watch(roomId, () => {
  loadRooms();
});

const transactionEvents: Ref<TransactionEvent[]> = ref([]);

const loggedInUser = useLoggedInUserStore().user;

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

const memberListOpen = ref(false);

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

onMounted(() => {
  // start the intersection observer
  intersectPageEnd();
});

const observeRef: Ref<HTMLElement | null> = ref(null);
const showTransactionsLoader = ref(false);

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
  if (reloadAgain == true) {
    onIntersect(observeRef.value!, () => {
      loadMoreTransactions();
    });
  }
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
            <!--shows the room picture-->
            <MxcOrPlaceholderImage
              :mxc-url="room?.getAvatarUrl() ?? ''"
              :placeholder-text="room?.getName() ?? '?'"
              class="rounded-full w-16 h-16 lg:w-32 lg:h-32 shadow-lg"
            />

            <div class="flex flex-col items-center gap-2 lg:items-start lg:ml-4 lg:gap-5">
              <!--shows the room name if possible or the room id if not-->
              <h1 class="flex text-3xl font-bold text-gray-900 break-all">
                {{ room?.getName() ?? roomId }}
              </h1>

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

          <div v-show="room" class="flex flex-col mt-10 lg:mt-5">
            <!--default message if no transactions were made-->
            <div v-show="transactionEvents && transactionEvents.length <= 0">
              <span id="no-transaction-message" class="text-sm text-gray-400 text-center">
                Keine Transaktionen vorhanden
              </span>
            </div>

            <!--the header of the table containing the transactions-->
            <div
              v-show="!(transactionEvents && transactionEvents.length <= 0)"
              id="transactions"
              class="flex flex-col justify-center gap-5"
            >
              <!--shows all transaction using the transacion tile partial-->
              <div v-for="event in events" :key="event.getEventId()">
                <div v-if="event instanceof TransactionEvent">
                  <TransactionTile :transaction="event as TransactionEvent" />
                </div>
                <div
                  v-if="event instanceof MRoomMemberEvent"
                  class="flex flex-row justify-center items-center italic text-gray-600 text-sm gap-1"
                >
                  <!--shows all membership change-->
                  <UserBadge :user="room?.getMembers()[event.getStateKey()]!" class="shadow-md" />
                  <div v-if="isMembershipEvent(event) == 'join'">ist beigetreten</div>
                  <div v-if="isMembershipEvent(event) == 'leave'">hat den Raum verlassen</div>
                  <div v-if="isMembershipEvent(event) == 'invite'">wurde eingeladen</div>
                </div>
              </div>

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
          <UserTile
            :user="room?.getMember(loggedInUser.getUserId())!"
            class="bg-gray-300 p-2 rounded-lg"
          />
          <template v-for="member in actualMembers" :key="member.getUserId()">
            <div
              v-if="member.getUserId() != loggedInUser.getUserId()"
              class="flex flex-col items-center gap-1 bg-gray-300 p-2 rounded-lg"
            >
              <UserTile :user="member" class="w-full" />
              <BalanceTile :compensation="compensation[member.getUserId()]"></BalanceTile>
            </div>
          </template>
          <!--invited members-->
          <div v-if="invitedMembers.length > 0" class="opacity-50">
            <span class="text-sm text-gray-800 items-center">Eingeladen</span>
            <div
              v-for="member in invitedMembers"
              :key="member.getUserId()"
              class="flex flex-col items-center gap-1 bg-gray-300 p-2 rounded-lg"
            >
              <UserTile :user="member" class="w-full" />
            </div>
          </div>
          <!--left members-->
          <div v-if="leftMembers.length > 0" class="opacity-50">
            <span class="text-sm text-gray-800">Ehemalige Mitglieder</span>
            <div
              v-for="member in leftMembers"
              :key="member.getUserId()"
              class="flex flex-col items-center gap-1 bg-gray-300 p-2 rounded-lg"
            >
              <UserTile :user="member" class="w-full" />
              <BalanceTile :compensation="compensation[member.getUserId()]"></BalanceTile>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
