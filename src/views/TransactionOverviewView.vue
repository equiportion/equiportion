<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import MxcOrPlaceholderImage from '@/components/media/MxcOrPlaceholderImage.vue';
import RoundButton from '@/components/buttons/RoundButton.vue';
import AuthenticatedMatrixClient from '@/logic/models/clients/AuthenticatedMatrixClient';
import Room from '@/logic/models/Room';
import useAuthenticatedMatrixClient from '@/composables/useAuthenticatedMatrixClient';
import {ref, type Ref} from 'vue';
import {useRoute} from 'vue-router';
import TransactionEvent from '@/logic/models/events/TransactionEvent';
import router from '@/router';

var client: AuthenticatedMatrixClient;
const roomId = useRoute().params.roomId.toString();
var room: Ref<Room | undefined> = ref();

const loading = ref(true);
useAuthenticatedMatrixClient(loadData);

async function loadData(clientInstance: AuthenticatedMatrixClient) {
  client = clientInstance;
  room.value = client.getRoom(roomId);

  loading.value = false;
}

function newTransaction() {
  router.push({name: 'new-transaction', params: {roomId: roomId}})
}
</script>

<template>
  <MainLayout>
    <div class="flex flex-col px-5 items-center">
      <div class="flex flex-col lg:w-4/6 w-full">
        <!--Profile image and username -->
        <div class="flex h-40 flex-col items-center lg:flex-row mt-4">
          <MxcOrPlaceholderImage
            :mxcUrl="room?.getAvatarUrl() ?? ''"
            class="rounded-full w-16 h-16 lg:w-32 lg:h-32"
            :placeholderText="room?.getName() ?? '?'"
          />
          <div class="flex flex-col items-center lg:items-start ml-4 lg:gap-5">
            <h1 class="flex text-2xl font-bold text-gray-900 sm:text-3xl">
              {{ room?.getName() ?? roomId }}
            </h1>
            <span class="flex"> Max Muster, Maxi Muster, Maximilian Muster, ...</span>
          </div>
        </div>
        <div v-if="!loading && room" class="flex flex-col mt-8 lg:mt-2">
          <!--default message-->
          <template v-if="room?.getTransactionEvents().length <= 0">
            <div class="flex flex-col text-sm text-gray-400 items-center mt-5">
              Keine Transaktionen vorhanden
            </div>
          </template>

          <div v-else class="grid justify-center-center grid-cols-1 lg:grid-cols-3">
            <div class="col-span-3 lg:m-5 invisible lg:visible">
              <div class="flex flex-row">
                <div class="w-1/3 text-center font-bold text-gray-900">Zweck</div>
                <div class="w-1/3 text-center font-bold text-gray-900">Gläubiger</div>
                <div class="w-1/3 text-center font-bold text-gray-900">Schuldner</div>
              </div>
            </div>
            <div
              class="mt-2 col-span-3 bg-gray-100 border-b-8 border-r-8 rounded border-gray-200"
              v-for="transaction in room.getTransactionEvents()"
              :key="transaction.getEventId()"
            >
              <div class="flex flex-col lg:flex-row m-2">
                <div class="flex lg:w-1/3 justify-center mx-2 mt-2 lg:mt-0">
                  <span class="flex flex-col justify-center truncate text-gray-700">
                    {{ transaction.getPurpose() }}
                  </span>
                </div>
                <div class="flex lg:w-1/3 justify-center mx-2 mt-2 lg:mt-0">
                  <span class="flex flex-col justify-center truncate text-gray-700">
                    {{ transaction.getSum() }}€, gezahlt von {{ transaction.getCreditor() }}
                  </span>
                </div>
                <div class="flex flex-col lg:w-1/3 justify-center mx-2 mt-2 lg:mt-0">
                  <span
                    class="flex flex-col justify-center text-center truncate text-gray-700"
                    v-for="debitor in transaction.getDebtors()"
                    :key="debitor.user"
                  >
                    {{ debitor.user }} schuldet {{ debitor.amount }}€
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!--Plus button-->
          <div class="self-end lg:self-center mt-5 mb-2">
            <RoundButton @click="newTransaction"><i class="fa-solid fa-plus"></i></RoundButton>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
