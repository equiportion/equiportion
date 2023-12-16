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
import type User from '@/logic/models/User';
import UserTile from '@/components/user/UserTile.vue';

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

const contentClasses = computed(() => {
  if (memberListOpen.value) {
    return 'hidden lg:flex flex-col p-5 items-center w-full';
  } else {
    return 'flex flex-col p-5 items-center w-full';
  }
});

const showUserBadges = computed(() => {
  var i = 0;
  var badgeList: User[] = [];
  const members = room?.getMembers();
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
</script>

<template>
  <MainLayout>
    <!--shows a button that enables the user to add a new transaction-->
    <RoundButton class="fixed bottom-5 right-5 shadow-lg" @click="newTransaction">
      <i class="fa-solid fa-plus"></i>
    </RoundButton>

    <div class="flex flex-col lg:flex-row">
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

              <div class="flex flex-row gap-2 justify-center lg:justify-start flex-wrap">
                <!--shows the display names of all members in a room if possible or the member id if not-->
                <template v-for="member in showUserBadges" :key="member.getUserId()">
                  <UserBadge :user="member" class="shadow-md" />
                </template>
                <span v-if="Object.keys(room!.getMembers()).length >= 3">...</span>

                <RoundButton class="w-8 h-8 shadow-md" @click="toggleMemberList()">
                  <i :class="iconClasses"></i>
                </RoundButton>
              </div>
            </div>
          </div>

          <div v-if="room" class="flex flex-col mt-10 lg:mt-5">
            <!--default message if no transactions were made-->
            <template v-if="transactionEvents && transactionEvents.length <= 0">
              <span id="no-transaction-message" class="text-sm text-gray-400 text-center">
                Keine Transaktionen vorhanden
              </span>
            </template>

            <!--the header of the table containing the transactions-->
            <div v-else id="transactions" class="flex flex-col justify-center gap-5">
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
      <div
        v-show="memberListOpen"
        class="flex flex-col h-full w-full lg:w-1/4 h-screen shadow-lg rounded-tl-lg rounded-bl-lg transition bg-gray-100 my-5 p-5 gap-5"
      >
        <RoundButton class="w-8 h-8 flex-shrink-0 shadow-md" @click="toggleMemberList()">
          <i class="fa-solid fa-angles-right"></i>
        </RoundButton>

        <div class="flex flex-col gap-2 overflow-y-auto">
          <!--shows the display names of all members in a room if possible or the member id if not-->
          <UserTile v-for="member in room?.getMembers()" :key="member.getUserId()" :user="member" />
        </div>
      </div>
    </div>
  </MainLayout>
</template>
