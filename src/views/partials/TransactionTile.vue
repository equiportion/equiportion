<script setup lang="ts">
/**
 * @component {TransactionTile} - Partial that shows transactions as a tile
 * @author Leandro El Omari
 *
 * @prop {TransactionEvent} transaction - A transaction event of a transaction (sent into a room).
 */

import TransactionEvent from '@/logic/models/events/custom/TransactionEvent';
import {useRoomsStore} from '@/stores/rooms';
import User from '@/logic/models/User';
import UserBadge from '@/components/user/UserBadge.vue';

const props = defineProps({
  transaction: {
    type: TransactionEvent,
    required: true,
  },
});

const roomsStore = useRoomsStore();
const room = roomsStore.getRoom(props.transaction.getRoomId());

const creditor: User | undefined = room?.getMember(props.transaction.getCreditorId());

function eurosPart(num: number): string {
  return Math.floor(num / 100).toString();
}

function centsPart(num: number): string {
  return ('00' + (num % 100)).slice(-2);
}
</script>

<template>
  <div
    class="flex flex-col w-full rounded-lg bg-gray-100 shadow-lg lg:hover:bg-gray-200 transition p-5 gap-2"
  >
    <!--Zweck-->
    <h2 class="text-2xl font-bold w-full text-center lg:text-left break-all">
      {{ transaction.getPurpose() }}
    </h2>

    <div class="flex flex-col lg:flex-row w-full">
      <!--Gläubiger-->
      <div class="self-start flex flex-col lg:flex-row flex-wrap gap-1 items-center w-full">
        <UserBadge class="shadow-md" :user="creditor!" />
        <span>
          hat
          <b>{{ eurosPart(transaction.getSum()) }},{{ centsPart(transaction.getSum()) }}€</b>
          ausgelegt
        </span>
      </div>

      <!--Schuldner-->
      <div
        class="flex flex-col gap-5 lg:gap-2 w-full border-t-2 border-gray-400 pt-5 mt-5 lg:border-0 lg:pt-0 lg:mt-0"
      >
        <div
          v-for="debtor in transaction.getDebtorIds()"
          :key="debtor.userId"
          class="flex flex-col lg:flex-row flex-wrap gap-1 items-center"
        >
          <UserBadge :user="room!.getMember(debtor.userId)" />
          <span>
            hat <b>{{ eurosPart(debtor.amount) }},{{ centsPart(debtor.amount) }}€</b> geliehen
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
