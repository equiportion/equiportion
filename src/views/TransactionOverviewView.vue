<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import MxcOrPlaceholderImage from '@/components/media/MxcOrPlaceholderImage.vue';
import RoundButton from '@/components/buttons/RoundButton.vue';
import AuthenticatedMatrixClient from '@/logic/models/clients/AuthenticatedMatrixClient';
import Room from '@/logic/models/Room';
import useAuthenticatedMatrixClient from '@/composables/useAuthenticatedMatrixClient';
import {ref, type Ref} from 'vue';
import {useRoute} from 'vue-router';
import router from '@/router';
import TransactionTile from './partials/TransactionTile.vue';
import TransactionEvent from '@/logic/models/events/TransactionEvent';

//sets up 2 test users for the text transaction
const User2 = {
  user: "User2",
  amount: 10 as number,
};
const User3 = {
  user: "User3",
  amount: 10 as number,
};

//creates a test transaction
const testTransaction = new TransactionEvent("abc","Pizza",20,"User1",[User2, User3], "12345")

var client: AuthenticatedMatrixClient;
const roomId = useRoute().params.roomId.toString();
var room: Ref<Room | undefined> = ref();
const loading = ref(true);

//loads the necessary data
useAuthenticatedMatrixClient(loadData);

//function used in loading the necessary data
async function loadData(clientInstance: AuthenticatedMatrixClient) {
  client = clientInstance;
  room.value = client.getRoom(roomId);
  if(room.value.getTransactionEvents().length == 0) {
    room.value.getTransactionEvents().push(testTransaction);
  }
  loading.value = false;
}

function newTransaction() {
  router.push({name: 'new-transaction', params: {roomId: roomId}})
}
</script>

<template>
  <MainLayout>
    <div class="flex flex-col px-5 items-center">
      <!--The main body of the transaction overview, being 4/6 wide-->
      <div class="flex flex-col lg:w-4/6 w-full">
        <!--Profile image and username -->
        <div class="flex h-40 flex-col items-center lg:flex-row mt-4">
          <!--shows the room picture-->
          <MxcOrPlaceholderImage
            :mxcUrl="room?.getAvatarUrl() ?? ''"
            class="rounded-full w-16 h-16 lg:w-32 lg:h-32"
            :placeholderText="room?.getName() ?? '?'"
          />
          <div class="flex flex-col items-center lg:items-start lg:ml-4 lg:gap-5">
            <!--shows the room name if possible or the room id if not-->
            <h1 class="flex text-3xl font-bold text-gray-900">
              {{ room?.getName() ?? roomId }}
            </h1>
            <div class="flex flex-col lg:flex-row lg:gap-2">
              <!--shows the display names of all members in a room if possible or the member id if not-->
              <span v-for="member in room?.getMemberIds()" :key="member" class="flex truncate">
                {{ client.getUser(member)?.getDisplayname() ?? client.getUser(member)?.getUserId()}}
            </span>
            </div>
          </div>
        </div>
        <div v-if="!loading && room" class="flex flex-col lg:mt-2">

          <!--default message if no transactions were made-->
          <template v-if="room?.getTransactionEvents().length <= 0">
            <div class="flex flex-col text-sm text-gray-400 items-center mt-5">
              Keine Transaktionen vorhanden
            </div>
          </template>

          <!--the header of the table containing the transactions-->
          <div v-else class="grid justify-center-center grid-cols-1 lg:grid-cols-3">
            <div class="col-span-3 lg:m-5 invisible lg:visible">
              <div class="flex flex-row">
                <div class="w-1/3 text-center font-bold text-gray-900">Zweck</div>
                <div class="w-1/3 text-center font-bold text-gray-900">Gläubiger</div>
                <div class="w-1/3 text-center font-bold text-gray-900">Schuldner</div>
              </div>
            </div>

            <!--shows all transaction using the transacion tile partial-->
            <div
              class="mt-2 col-span-3 bg-gray-100 border-b-8 border-r-8 rounded border-gray-200"
              v-for="transaction in room.getTransactionEvents()"
              :key="transaction.getEventId()"
            >
            <TransactionTile :transaction="transaction"></TransactionTile>
            </div>
          </div>
        </div>

        <!--shows a button that enables the user to add a new transaction-->
        <div class="flex flex-row justify-end">
          <div class="static">
            <div class="absolute bottom-5 right-5 lg:left-1/2 lg:transform">
              <RoundButton @click="newTransaction"><i class="fa-solid fa-plus"></i></RoundButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
