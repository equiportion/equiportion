<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import ProfileImage from '@/components/media/ProfileImage.vue';
import TransactionTile from '@/views/partials/TransactionTile.vue';
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
          <table class="border-collapse">
            <tr class="hidden lg:table-row text-center">
              <th>Verwendungszweck</th>
              <th>Gläubiger</th>
              <th>Schuldner</th>
            </tr>
            <tr
              class="flex flex-col lg:table-row text-center max-w-screen rounded-lg border-b-4 border-r-4 border-bg-400"
              v-for="transaction in transactionList"
              :key="transaction.event_id"
            >
              <td class="truncate">{{ transaction.content.purpose }}</td>
              <td class="truncate">{{ transaction.content.creditor }}</td>
              <td>
                <ul>
                  <li v-for="debitor in transaction.content.debitors" :key="debitor.user">
                    <span class="truncate max-w-[100%">{{ debitor.user }}</span>
                  </li>
                </ul>
              </td>
            </tr>
          </table>

          <!--Plus button-->
          <div class="self-end lg:self-center mt-5">
            <RoundButton><i class="fa-solid fa-plus"></i></RoundButton>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
