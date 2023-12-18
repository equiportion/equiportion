<script setup lang="ts">
import RoundButton from '@/components/buttons/RoundButton.vue';
import MxcOrPlaceholderImage from '@/components/media/MxcOrPlaceholderImage.vue';
import Room from '@/logic/models/Room';
import router from '@/router';
import UserBadge from '@/components/user/UserBadge.vue';
import {computed} from 'vue';
import type User from '@/logic/models/User';

const props = defineProps({
  room: {
    type: Room,
    required: true,
  },
});

function openTransactions() {
  router.push({name: 'transactions', params: {roomId: props.room.getRoomId()}});
}

function newTransaction() {
  router.push({name: 'new-transaction', params: {roomId: props.room.getRoomId()}});
}

const showUserBadges = computed(() => {
  let i = 0;
  let badgeList: User[] = [];
  const members = props.room?.getMembers();
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
  <div
    class="flex flex-col items-center lg:items-start lg:flex-row justify-between w-full lg:max-w-[80%] gap-2 p-5 rounded-lg bg-gray-100 cursor-pointer shadow-lg lg:hover:scale-105 lg:hover:bg-gray-200 transition"
    @click="openTransactions()"
  >
    <div class="flex flex-col lg:flex-row items-center lg:items-start">
      <MxcOrPlaceholderImage
        :mxc-url="room.getAvatarUrl() ?? ''"
        class="rounded-full w-16 h-16 lg:w-32 lg:h-32"
        :placeholder-text="room.getName() ?? '?'"
      />

      <div class="lg:ml-5 flex flex-col gap-2">
        <div class="flex flex-col">
          <h2 class="text-2xl font-bold w-full text-center lg:text-start break-all">
            {{ room.getName() }}
          </h2>
          <span class="text-sm text-gray-500 w-full text-center lg:text-start break-all">
            {{ room.getTopic() }}
          </span>
        </div>

        <div
          class="flex flex-col flex-wrap text-gray-700 gap-x-5 gap-y-2 items-center lg:items-start"
        >
          <div class="flex flex-row flex-wrap justify-center gap-2">
            <span class="font-bold flex flex-row items-center">
              <i class="fa-solid fa-users mr-1"></i>
              {{ Object.keys(room.getMembers()).length }} Mitglied
              <span v-if="Object.keys(room.getMembers()).length > 1">er</span>
            </span>

            <template v-for="member in showUserBadges" :key="member.getUserId()">
              <UserBadge :user="member" class="shadow-md" size="sm" />
            </template>
            <span v-if="Object.keys(room!.getMembers()).length > 3">...</span>
          </div>
          <div>
            <span class="font-bold"><i class="fa-solid fa-coins"></i> Schulden</span>
            5 €
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row self-center gap-2">
      <RoundButton title="Transaktionsliste anzeigen" @click="openTransactions">
        <i class="fas fa-solid fa-list"></i>
      </RoundButton>
      <RoundButton title="Neue Transaktion anlegen" @click="newTransaction">
        <i class="fas fa-solid fa-plus"></i>
      </RoundButton>
    </div>
  </div>
</template>
