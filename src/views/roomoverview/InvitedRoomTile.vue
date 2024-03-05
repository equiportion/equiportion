<script setup lang="ts">
import {type PropType, ref} from 'vue';
import Room from '@/logic/models/Room';
import RoundButton from '@/components/buttons/RoundButton.vue';
import MxcOrPlaceholderImage from '@/components/media/MxcOrPlaceholderImage.vue';
import AuthenticatedMatrixClient from '@/logic/clients/AuthenticatedMatrixClient';

const props = defineProps({
  room: {
    type: Object as PropType<Room>,
    required: true,
  },
});

const acceptLoading = ref(false);
const rejectLoading = ref(false);

/**
 * Accepts the invite to the room
 */
async function acceptInvite() {
  acceptLoading.value = true;

  const client = AuthenticatedMatrixClient.getClient();

  let response = null;
  try {
    response = await client.joinRoom(props.room.getRoomId());
  } catch (e) {
    console.error(e);
  }

  if (response) {
    acceptLoading.value = false;
  }
}

async function rejectInvite() {
  rejectLoading.value = true;

  const client = AuthenticatedMatrixClient.getClient();

  let response = null;
  try {
    response = await client.leaveRoom(props.room.getRoomId());
  } catch (e) {
    console.error(e);
  }

  if (response) {
    rejectLoading.value = false;
  }
}
</script>
<template>
  <div
    class="flex flex-col items-center lg:items-start lg:flex-row justify-between w-full lg:max-w-[80%] gap-2 p-5 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-pointer shadow-lg lg:hover:scale-105 lg:hover:bg-gray-200 dark:lg:hover:bg-gray-600 transition"
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
          <span class="text-sm text-gray-500 dark:text-gray-400 w-full text-center lg:text-start break-all">
            Du wurdest eingeladen:
          </span>
          <h2 class="text-2xl dark:text-gray-200 font-bold w-full text-center lg:text-start break-all">
            {{ room.getName() }}
          </h2>
        </div>
      </div>
    </div>

    <div class="flex flex-row self-center gap-2">
      <RoundButton title="Raum beitreten" :loading="acceptLoading" @click="acceptInvite()">
        <i class="fa-solid fa-arrow-right-to-bracket"></i>
      </RoundButton>
      <RoundButton
        title="Einladung ablehnen"
        :loading="rejectLoading"
        :danger="true"
        @click="rejectInvite()"
      >
        <i class="fa-solid fa-xmark"></i>
      </RoundButton>
    </div>
  </div>
</template>
