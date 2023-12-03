<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import ProfileImage from '@/components/media/ProfileImage.vue';
import RoundButton from '@/components/buttons/RoundButton.vue';

const transaction1 = {
  content: {
    purpose: 'Pizzaessen',
    sum: 8,
    creditor: '@example5:example.org',
    debitors: [
      {
        user: '@example3:example.org',
        amount: 2.14,
      },
      {
        user: '@example7:example.org',
        amount: 2.96,
      },
      {
        user: '@example11:example.org',
        amount: 2.9,
      },
    ],
  },
  event_id: '$14327358244PhrSn:example.org',
  origin_server_ts: 1432735824653,
  room_id: '!636q39766251:matrix.org',
  sender: '@example:example.rg',
  type: 'edu.kit.kastel.dsn.pse.transaction',
  unsigned: {
    age: 1234,
  },
};

const transaction2 = {
  content: {
    purpose: 'Einkauf',
    sum: 20,
    creditor: '@example5:example.org',
    debitors: [
      {
        user: '@example3:example.org',
        amount: 2.14,
      },
      {
        user: '@example7:example.org',
        amount: 2.96,
      },
    ],
  },
  event_id: '$14327358244PhrSn:example.org',
  origin_server_ts: 1432735824653,
  room_id: '!636q39766251:matrix.org',
  sender: '@example:example.rg',
  type: 'edu.kit.kastel.dsn.pse.transaction',
  unsigned: {
    age: 1234,
  },
};

const transactionList = [transaction1, transaction2];
</script>

<template>
  <MainLayout>
    <div class="flex flex-col px-5 items-center">
      <div class="flex flex-col lg:w-4/6 w-full">
        <!--Profile image and username -->
        <div class="flex h-40 flex-col items-center lg:flex-row mt-4">
          <ProfileImage class="w-32 h-32 rounded-full ml-4" />
          <div class="flex flex-col items-center lg:items-start ml-4 lg:gap-5">
            <h1 class="flex text-2xl font-bold text-gray-900 sm:text-3xl">PSE</h1>
            <span class="flex"> Max Muster, Maxi Muster, Maximilian Muster, ...</span>
          </div>
        </div>
        <div class="flex flex-col mt-8 lg:mt-2">
            <!--default message-->
            <template v-if="transactionList.length <= 0">
                <div class="flex flex-col text-sm text-gray-300 items-center mt-5">
                    Keine Transaktionen vorhanden
                </div>
            </template>

            <div class="grid justify-center-center grid-cols-1 lg:grid-cols-3">
                <div class="col-span-3 lg:m-5 invisible lg:visible">
                    <div class="flex flex-row">
                        <div class="w-1/3 text-center font-bold text-gray-900">Verwendungszweck</div>
                        <div class="w-1/3 text-center font-bold text-gray-900">Gläubiger</div>
                        <div class="w-1/3 text-center font-bold text-gray-900">Schuldner</div>
                    </div>
                </div>
                <div class="mt-2 col-span-3 bg-gray-100 border-b-8 border-r-8 rounded border-gray-200" v-for="transaction in transactionList" :key="transaction.event_id">
                    <div class="flex flex-col lg:flex-row m-2">
                        <div class="flex lg:w-1/3 justify-center mx-2 mt-2 lg:mt-0">
                            <span class="flex flex-col justify-center truncate">
                                {{ transaction.content.purpose }}
                            </span>
                        </div>
                        <div class="flex lg:w-1/3 justify-center mx-2 mt-2 lg:mt-0">
                            <span class="flex flex-col justify-center truncate">
                                {{ transaction.content.sum }}€, gezahlt von {{ transaction.content.creditor }} 
                            </span>
                        </div>
                        <div class="flex flex-col lg:w-1/3 justify-center mx-2 mt-2 lg:mt-0">
                            <span class="flex flex-col justify-center text-center truncate" v-for="debitor in transaction.content.debitors" :key="debitor.user">
                                {{ debitor.user }} schuldet {{ debitor.amount }}€
                            </span>
                        </div>
                    </div>
                </div>
            </div>

          <!--Plus button-->
          <div class="self-end lg:self-center mt-5 mb-2">
            <RoundButton><i class="fa-solid fa-plus"></i></RoundButton>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
