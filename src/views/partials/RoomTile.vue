<script setup lang="ts">
import RoundButton from '@/components/buttons/RoundButton.vue';
import MxcOrPlaceholderImage from '@/components/media/MxcOrPlaceholderImage.vue';
import Room from '@/logic/models/Room';
import router from '@/router';

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
</script>
<template>
  <div
    class="flex flex-col items-center lg:items-start lg:flex-row justify-between w-full lg:max-w-[80%] gap-2 p-5 rounded-lg border-r-8 border-b-8 bg-gray-100 border-gray-200 cursor-pointer"
    @click="openTransactions()"
  >
    <div class="flex flex-col lg:flex-row items-center lg:items-start">
      <MxcOrPlaceholderImage
        :mxc-url="room.getAvatarUrl() ?? ''"
        class="rounded-full w-16 h-16 lg:w-32 lg:h-32"
        :placeholder-text="room.getName() ?? '?'"
      />

      <div class="lg:ml-5 flex flex-col gap-2">
        <div>
          <h2 class="text-2xl font-bold w-full text-center lg:text-start">{{ room.getName() }}</h2>
          <span class="text-sm text-gray-500 w-full text-center lg:text-start">
            {{ room.getTopic() }}
          </span>
        </div>

        <div
          class="flex flex-col flex-wrap text-gray-700 gap-x-5 gap-y-2 items-center lg:items-start"
        >
          <div>
            <span class="font-bold"><i class="fa-solid fa-users"></i> 5 Mitglieder</span>
            Name 1, Name 2, ...
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
