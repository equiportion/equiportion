<script setup lang="ts">
import RoundButton from '@/components/buttons/RoundButton.vue';
import MxcOrPlaceholderImage from '@/components/media/MxcOrPlaceholderImage.vue';
import Room from '@/logic/models/Room';
import router from '@/router';
import UserBadge from '@/components/user/UserBadge.vue';
import {computed, watch, type Ref, ref} from 'vue';
import type User from '@/logic/models/User';
import BipartiteCompensation from '@/logic/compensation/BipartiteCompensation';

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

const sum: Ref<number | undefined> = ref(undefined);

watch(
  () => props.room,
  () => {
    const compensationCalculation = new BipartiteCompensation();
    const compensation = compensationCalculation.calculateCompensation(props.room);
    let sumCalc = 0;
    for (const userId in compensation) {
      sumCalc += compensation[userId];
    }
    sum.value = sumCalc;
  },
  {
    immediate: true,
    deep: true,
  }
);

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
  <div
    class="flex flex-col items-center lg:items-start lg:flex-row justify-between w-full lg:max-w-[80%] gap-2 p-5 rounded-lg bg-gray-100 cursor-pointer shadow-lg lg:hover:scale-105 lg:hover:bg-gray-200 transition"
    @click="openTransactions()"
  >
    <div class="flex flex-col lg:flex-row items-center lg:items-start">
      <div class="flex-shrink-0">
        <MxcOrPlaceholderImage
          :mxc-url="room.getAvatarUrl() ?? ''"
          class="rounded-full w-16 h-16 lg:w-32 lg:h-32"
          :placeholder-text="room.getName() ?? '?'"
        />
      </div>

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
          <div class="flex flex-row flex-wrap justify-center lg:justify-start gap-2">
            <span class="font-bold flex flex-row items-center">
              <i class="fa-solid fa-users fa-fw mr-1"></i>
              {{ Object.keys(room.getMembers()).length }} Mitglied
              <span v-if="Object.keys(room.getMembers()).length > 1">er</span>
            </span>

            <template v-for="member in showUserBadges" :key="member.getUserId()">
              <UserBadge :user="member" class="shadow-md" size="sm" />
            </template>
            <span v-if="Object.keys(room!.getMembers()).length > 3">...</span>
          </div>
          <div v-if="sum! > 0" class="flex flex-row gap-1 text-red-600">
            <span class="font-bold"><i class="fa-solid fa-coins fa-fw"></i> Du schuldest</span>
            <span>{{ eurosPart(sum!) }},{{ centsPart(sum!) }} €</span>
          </div>
          <div v-else-if="sum! < 0" class="flex flex-row gap-1 text-green-600">
            <span class="font-bold"><i class="fa-solid fa-coins fa-fw"></i> Du erhältst</span>
            <span>{{ eurosPart(sum!) }},{{ centsPart(sum!) }} €</span>
          </div>
          <div v-else class="flex flex-row gap-1 text-blue-600">
            <span class="font-bold"><i class="fa-solid fa-coins fa-fw"></i> Ausgeglichen</span>
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
