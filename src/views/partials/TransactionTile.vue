<script setup lang="ts">
/**
 * @component {TransactionTile} - Partial that shows transactions as a tile
 * @author Leandro El Omari
 * @author Philipp Stappert
 *
 * @prop {TransactionEvent} transaction - A transaction event of a transaction (sent into a room).
 */

import TransactionEvent from '@/logic/models/events/custom/TransactionEvent';
import {useRoomsStore} from '@/stores/rooms';
import User from '@/logic/models/User';
import UserBadge from '@/components/user/UserBadge.vue';

import {computed} from 'vue';
import SystemAlert from '@/components/messaging/SystemAlert.vue';

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

const mainClasses = computed(() => {
  const classes = 'flex flex-col w-full rounded-lg shadow-lg transition p-5 gap-2';

  if (props.transaction.isValid() == false) {
    return classes + ' bg-red-200 lg:hover:bg-red-300';
  } else {
    return classes + ' bg-gray-100 lg:hover:bg-gray-200';
  }
});
</script>

<template>
  <div :class="mainClasses">
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
          ausgegeben
        </span>
      </div>

      <!-- > -->
      <div class="hidden lg:flex flex-row items-center justify-center">
        <i class="fa-solid fa-chevron-right w-5"></i>
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
            <b>{{ eurosPart(debtor.amount) }},{{ centsPart(debtor.amount) }}€</b>
          </span>
        </div>
      </div>
    </div>

    <SystemAlert v-if="transaction.isValid() == false" class="text-black mt-2" severity="danger">
      <span class="text-lg font-bold"> <i class="fa-solid fa-code-merge"></i>&nbsp;Konflikt </span>
      <br />
      Es gibt ein Problem beim Zusammenführen dieser Transaktion mit dem aktuellen Stand, den du von
      diesem Gerät aus gesendet hast. Das kann passieren, wenn du die App per Task-Manager beendet
      hast oder den Cache deines Browsers gelöscht hast.<br />
      <strong>Was bedeutet das? </strong>Diese Transaktion wird
      <span class="underline">nicht in den aktuellen Schuldenstand eingerechnet</span>.<br />
      <strong>Was kann ich tun? </strong>Du kannst diese Transaktion erneut senden, um sie in den
      aktuellen Schuldenstand einzuberechnen.<br />
      <i>In zukünfigten Versionen ist eine automatische Auflösung des Konflikts geplant.</i>
    </SystemAlert>
  </div>
</template>
