<script setup lang="ts">
/**
 * @component {TransactionOverview} - Shows all transactions in a group.
 * @author Leandro El Omari
 */

import MainLayout from '@/layouts/MainLayout.vue';
import MxcOrPlaceholderImage from '@/components/media/MxcOrPlaceholderImage.vue';
import RoundButton from '@/components/buttons/RoundButton.vue';
import {useRoute} from 'vue-router';
import TransactionTile from './partials/TransactionTile.vue';
import {useRoomsStore} from '@/stores/rooms';
import TransactionEvent from '@/logic/models/events/custom/TransactionEvent';
import router from '@/router';
import UserBadge from '@/components/user/UserBadge.vue';
import {computed, ref} from 'vue';

const roomId = useRoute().params.roomId.toString();

const roomsStore = useRoomsStore();
const room = roomsStore.getRoom(roomId);

const transactionEvents = room?.getEvents(TransactionEvent.TYPE) as TransactionEvent[];

/**
 * Opens NewTransactionView of the room of this TransactionOverviewView.
 * @returns {void}
 */
function newTransaction(): void {
  router.push({
    name: 'new-transaction',
    params: {roomId: roomId},
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

const addBuffer = computed(() => {
  if (memberListOpen.value) {
    return 'flex max-w-[12%] w-full';
  } else {
    return 'flex max-w-[12%] w-full hidden';
  }
});

const showRoomOverview = computed(() => {
  if (memberListOpen.value) {
    return 'flex flex-col w-full';
  } else {
    return 'flex flex-col lg:max-w-[80%] w-full';
  }
});

const showMemberList = computed(() => {
  if (memberListOpen.value) {
    return 'flex flex-col h-full max-w-[20%] w-full h-screen shadow-lg transition flex-grow p-5';
  } else {
    return 'flex flex-col h-full max-w-[20%] w-full hidden';
  }
});
</script>

<template>
  <MainLayout>
    <RoundButton class="fixed bottom-5 right-5 shadow-lg" @click="newTransaction">
      <i class="fa-solid fa-plus"></i>
    </RoundButton>

    <!--Content-->
    <div class="flex flex-row justify-center gap-5">
      <!--transaction overview-->
      <div :class="showRoomOverview">
        <!--Room info-->
        <div class="flex flex-row p-5">
          <!--Buffer-->
          <div :class="addBuffer"></div>
          <!--Room image-->
          <MxcOrPlaceholderImage
            :mxc-url="room?.getAvatarUrl() ?? ''"
            :placeholder-text="room?.getName() ?? '?'"
            class="rounded-full w-16 h-16 lg:w-32 lg:h-32 shadow-lg"
          />
          <!--Room name and members-->
          <div class="flex flex-col p-5">
            <!--Room name-->
            <h1 class="flex text-3xl font-bold text-gray-900 break-all">
              {{ room?.getName() ?? roomId }}
            </h1>
            <div class="flex flex-row gap-2 justify-center flex-wrap pt-5">
              <!--shows the display names of all members in a room if possible or the member id if not-->
              <UserBadge
                v-for="member in room?.getMembers()"
                :key="member.getUserId()"
                :user="member"
                class="shadow-md"
              />

              <RoundButton class="w-8 h-8 shadow-md" @click="toggleMemberList()">
                <i :class="iconClasses"></i>
              </RoundButton>
            </div>
          </div>
        </div>
        <!--Transaction tiles-->
        <div class="flex flex-col">
          <div v-if="room" class="flex flex-col mt-10 lg:mt-5">
            <!--default message if no transactions were made-->
            <template v-if="transactionEvents && transactionEvents.length <= 0">
              <span class="text-sm text-gray-400 text-center"> Keine Transaktionen vorhanden </span>
            </template>

            <!--the header of the table containing the transactions-->
            <div v-else class="flex flex-col justify-center gap-5">
              <!--shows all transaction using the transacion tile partial-->
              <TransactionTile
                v-for="transactionEvent in transactionEvents"
                :key="transactionEvent.getEventId()"
                :transaction="transactionEvent"
              />
            </div>
          </div>
        </div>
      </div>

      <!--Member list-->
      <div :class="showMemberList">
        <RoundButton class="w-8 h-8 shadow-md" @click="toggleMemberList()">
          <i class="fa-solid fa-angles-right"></i>
        </RoundButton>
        <div class="flex flex-row justify-center">
          <h2 class="flex text-3xl font-bold text-gray-900 break-all text-center">Mitglieder</h2>
        </div>
        <div class="flex flex-col gap-2 justify-center flex-wrap pt-5">
          <!--shows the display names of all members in a room if possible or the member id if not-->
          <div
            v-for="member in room?.getMembers()"
            :key="member.getUserId()"
            class="flex flex-row items-center gap-2"
          >
            <!--Placeholder-->
            <div class="h-12 w-12 rounded-full bg-gray-200"></div>
            <span>
              {{ member.getDisplayname() ?? member.getUserId() }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
