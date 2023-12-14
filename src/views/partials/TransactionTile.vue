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
</script>

<template>
  <div
    class="flex flex-col w-full rounded-lg bg-gray-100 shadow-lg lg:hover:bg-gray-200 transition p-5 gap-2"
  >
    <!--Zweck-->
    <h2 class="text-2xl font-bold w-full text-center lg:text-start break-all">
      {{ transaction.getPurpose() }}
    </h2>

    <div class="flex flex-col lg:flex-row">
      <!--Gläubiger-->
      <div class="flex flex-col lg:flex-row flex-wrap gap-2 items-center">
        <UserBadge class="shadow-md" :user="creditor!" />
        <span>
          hat <b>{{ transaction.getSum() }}€</b> ausgelegt
        </span>
      </div>

      <!--Schuldner-->
      <div class="flex flex-col gap-5 lg:gap-2">
        <div
          v-for="debtor in transaction.getDebtorIds()"
          :key="debtor.userId"
          class="flex flex-col lg:flex-row"
        ></div>
      </div>
    </div>
  </div>
</template>
