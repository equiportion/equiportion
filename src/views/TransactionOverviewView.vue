<script setup lang="ts">
/**
 * =======================
 * Imports
 * =======================
 */
// Layout and Components
import MainLayout from '@/layouts/MainLayout.vue';
import TransactionTile from '@/views/transactionoverview/TransactionTile.vue';
import RoundButton from '@/components/buttons/RoundButton.vue';
import UserBadge from '@/components/user/UserBadge.vue';
import MemberList from '@/views/transactionoverview/MemberList.vue';
import RoomHeader from '@/views/transactionoverview/RoomHeader.vue';
import ToPayWarning from '@/views/transactionoverview/ToPayWarning.vue';

// models
import type Room from '@/logic/models/Room';
import MatrixEvent from '@/logic/models/events/MatrixEvent';
import MRoomMemberEvent from '@/logic/models/events/matrix/MRoomMemberEvent';
import TransactionEvent from '@/logic/models/events/custom/TransactionEvent';

// transitions
import HeightFade from '@/components/transitions/HeightFade.vue';

//composables
import {onIntersect} from '@/composables/useIntersectionObserver';

// stores
import {useRoomsStore} from '@/stores/rooms';

// utils
import waitForInitialSync from '@/logic/utils/waitForSync';

// framework and libraries
import {computed, ref, watch, type Ref, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import router from '@/router';

/**
 * =======================
 * Variable definitions,
 * data from stores
 * =======================
 */
/**
 * @var the roomId of the room to be displayed
 */
const roomId = ref(useRoute().params.roomId.toString());

/**
 * @var the store, where all rooms are kept
 */
const roomsStore = useRoomsStore();

/**
 * @var the room to be displayed
 */
const room: Ref<Room | undefined> = ref(undefined);

/**
 * @var all events of the room
 */
const events: Ref<MatrixEvent[]> = ref([]);

/**
 * @var whether the transactions are currently loading (on bottom of already shown transactions)
 */
const showTransactionsLoader = ref(false);

/**
 * @var the reference to the element that is observed to toggle loading new transactions / events
 */
const observeRef = ref<HTMLElement | null>(null);

/**
 * @var whether the member list is open (true) or not (false)
 */
const memberListOpen = ref(false);

/**
 * =======================
 * Computed
 * =======================
 */

// classes for the main content (events) depending on whether the member list is open or not
const contentClasses = computed(() => {
  if (memberListOpen.value) {
    return 'hidden lg:flex flex-col p-5 items-center w-full';
  } else {
    return 'flex flex-col p-5 items-center w-full';
  }
});

// all events but in reverse order
const reversedEvents = computed(() => {
  return events.value.slice().reverse();
});

/**
 * =======================
 * Methods
 * =======================
 */
/**
 * Loads the room and its events from the store
 * @author Philipp Stappert
 * @returns {void}
 */
function loadRooms() {
  room.value = roomsStore.getRoom(roomId.value);
  events.value = room.value?.getTimelineEvents() ?? [];
}

/**
 * Opens NewTransactionView of the room of this TransactionOverviewView.
 * @author Clara Gießibl
 * @returns {void}
 */
function newTransaction(): void {
  router.push({name: 'new-transaction', params: {roomId: roomId.value}});
}

/**
 * Checks whether the user sees the "observeRef" element.
 * If so, the function "loadMoreTransactions" is called.
 * @author Philipp Stappert
 * @returns {void}
 */
function intersectPageEnd() {
  onIntersect(observeRef.value!, () => {
    loadMoreTransactions();
  });
}

/**
 * Loads more transactions from the room and updates the view accordingly.
 * If there are more transactions to load, the intersection observer is restarted.
 * If not, the observer is removed.
 * @author Philipp Stappert
 * @returns {void}
 */
async function loadMoreTransactions() {
  showTransactionsLoader.value = true;

  const reloadAgain = await room.value?.loadPreviousTimelineEvents();
  loadRooms();

  showTransactionsLoader.value = false;

  // restart the intersection observer if there are more transactions to load
  if (reloadAgain === true) {
    onIntersect(observeRef.value!, () => {
      loadMoreTransactions();
    });
  }
}

/**
 * function to help vscode not to explode because of ts in vue
 * (not support at the moment see https://github.com/vuejs/vetur/issues/1854)
 * @param event - the event to cast
 * @returns the event casted to a TransactionEvent
 */
function asTransactionEvent(event: MatrixEvent): TransactionEvent {
  return event as TransactionEvent;
}

/**
 * function to help vscode not to explode because of ts in vue
 * (not support at the moment see https://github.com/vuejs/vetur/issues/1854)
 * @param event - the event to cast
 * @returns the event casted to a MRoomMemberEvent
 */
function asMRoomMemberEvent(event: MatrixEvent): MRoomMemberEvent {
  return event as MRoomMemberEvent;
}

/** Watchers */

// update if viewed room changes
watch(roomId, () => {
  loadRooms();
});

/**
 * =======================
 * Lifecycle hooks
 * and initial load
 * =======================
 */
onMounted(() => {
  // start the intersection observer
  intersectPageEnd();
});

// load room after initial sync
waitForInitialSync().then(() => {
  loadRooms();
});
</script>

<template>
  <MainLayout>
    <!-- plus button bottom right screen corner -->
    <RoundButton
      id="newTransactionButton"
      class="fixed bottom-5 right-5 shadow-lg z-50"
      @click="newTransaction"
    >
      <i class="fa-solid fa-plus"></i>
    </RoundButton>

    <!-- main content -->
    <div class="flex flex-col lg:flex-row min-h-screen">
      <div :class="contentClasses">
        <!--The main body of the transaction overview -->
        <div class="flex flex-col lg:max-w-[1500px] w-full">
          <RoomHeader v-model:memberListOpen="memberListOpen" :room="room" />

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

            <!--list of all events-->
            <div
              v-show="!(events && events.length <= 0)"
              id="transactions"
              class="flex flex-col justify-center gap-5"
            >
              <!--show a notification if you have to pay something-->
              <ToPayWarning v-if="room" :room="room" @click="memberListOpen = true" />

              <!--shows all transactions and membership events using the transacion tile partial / membership view -->
              <template v-for="event in reversedEvents" :key="event.getEventId()">
                <template v-if="!!(event instanceof TransactionEvent)">
                  <TransactionTile
                    :transaction="asTransactionEvent(event)"
                    @click="memberListOpen = true"
                  />
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

              <!-- div that is observed to toggle loading new messages -->
              <div ref="observeRef"></div>

              <!-- Loader for more messages (when scrolling down) -->
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

      <MemberList v-model:open="memberListOpen" :room="room" />
    </div>
  </MainLayout>
</template>
