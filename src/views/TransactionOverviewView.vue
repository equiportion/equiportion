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
</script>

<template>
  <MainLayout>
    <!--shows a button that enables the user to add a new transaction-->
    <RoundButton class="fixed bottom-5 right-5 shadow-lg" @click="newTransaction">
      <i class="fa-solid fa-plus"></i>
    </RoundButton>

    <!--content-->
    <div class="flex flex-col p-5 items-center">
      <!--The main body of the transaction overview, being 80% wide-->
      <div class="flex flex-col lg:max-w-[80%] w-full">
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
            <h1 class="flex text-3xl font-bold text-gray-900">
              {{ room?.getName() ?? roomId }}
            </h1>

            <div class="flex flex-col lg:flex-row gap-2 items-center">
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
  </MainLayout>
</template>
