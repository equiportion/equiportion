<script setup lang="ts">
/**
 * @component {TransactionTile} - Partial that shows transactions as a tile
 * @author Leandro El Omari
 * @author Philipp Stappert
 *
 * @prop {TransactionEvent} transaction - A transaction event of a transaction (sent into a room).
 */

import ModalDialog from '@/components/modals/ModalDialog.vue';
import TransactionEvent from '@/logic/models/events/custom/TransactionEvent';
import {useRoomsStore} from '@/stores/rooms';
import User from '@/logic/models/User';
import UserBadge from '@/components/user/UserBadge.vue';
import SystemAlert from '@/components/messaging/SystemAlert.vue';
import {centsPart, eurosPart} from '@/logic/utils/money';
import MxcImage from '@/components/media/MxcImage.vue';

import {computed, ref} from 'vue';

const props = defineProps({
  transaction: {
    type: TransactionEvent,
    required: true,
  },
});

const viewReceipt = ref(false);

const roomsStore = useRoomsStore();
const room = roomsStore.getRoom(props.transaction.getRoomId());

const creditor: User | undefined = room?.getMember(props.transaction.getCreditorId());

const mainClasses = computed(() => {
  const classes = 'flex flex-col w-full rounded-lg shadow-lg transition p-5 gap-2';

  if (props.transaction.isValid() === false) {
    return (
      classes +
      ' bg-red-200 lg:hover:bg-red-300 dark:bg-red-700 dark:lg:hover:bg-red-600 dark:text-gray-200'
    );
  } else {
    return (
      classes +
      ' bg-gray-100 lg:hover:bg-gray-200 dark:bg-gray-700 dark:lg:hover:bg-gray-600 dark:text-gray-200'
    );
  }
});

const timestampSent = new Date(props.transaction.getTimestamp()!);
</script>

<template>
  <div :class="mainClasses">
    <!--Zweck-->
    <h2 class="text-2xl font-bold w-full text-center lg:text-left break-all">
      {{ transaction.getPurpose() }}
    </h2>

    <div class="flex flex-col lg:flex-row w-full">
      <!--Gläubiger und Beleg-->
      <div class="self-start flex flex-col gap-2 w-full">
        <div class="flex flex-col lg:flex-row flex-wrap gap-1 items-center">
          <UserBadge class="shadow-md" :user="creditor!" />
          <span>
            hat
            <b>{{ eurosPart(transaction.getSum()) }},{{ centsPart(transaction.getSum()) }}€</b>
            ausgegeben
          </span>
        </div>
        <button
          v-if="transaction.getReceiptUrl()"
          class="cursor-pointer lg:text-start"
          @click.stop="viewReceipt = true"
        >
          <i class="fa-solid fa-file-invoice"></i> Zahlungsbeleg anzeigen
        </button>

        <ModalDialog v-model:open="viewReceipt">
          <div class="overflow-y-scroll">
            <MxcImage
              v-if="viewReceipt && transaction.getReceiptUrl()"
              :mxc-url="transaction.getReceiptUrl()!"
            />
          </div>
        </ModalDialog>
      </div>

      <!-- > -->
      <div class="hidden lg:flex flex-row items-center justify-center">
        <i class="fa-solid fa-chevron-right w-5"></i>
      </div>

      <!--Schuldner-->
      <div
        class="flex flex-col justify-center gap-5 lg:gap-2 w-full border-t-2 border-gray-400 pt-5 mt-5 lg:border-0 lg:pt-0 lg:mt-0"
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

    <div
      class="flex flex-row flex-wrap gap-1 items-center justify-center lg:justify-end text-sm text-gray-500 dark:text-gray-400 mt-3"
    >
      <i class="fa-solid fa-paper-plane"></i>
      <span>
        {{ timestampSent.toLocaleDateString() }}, {{ timestampSent.toLocaleTimeString() }} Uhr
      </span>
      <span>von</span>
      <UserBadge
        v-if="transaction.getSender() != undefined"
        :user="transaction.getSender()!"
        size="sm"
      />
    </div>

    <SystemAlert v-if="transaction.isValid() === false" class="text-black mt-2" severity="danger">
      <span class="text-lg font-bold"> <i class="fa-solid fa-code-merge"></i>&nbsp;Konflikt </span>
      <br />
      Es gibt ein Problem beim Zusammenführen dieser Transaktion mit dem aktuellen Stand, der von
      dem selben Gerät aus gesendet wurde. Das kann passieren, wenn die App per Task-Manager beendet
      wurde oder der Cache des Browsers gelöscht wurde.<br />
      <strong>Was bedeutet das? </strong>Diese Transaktion wird
      <span class="underline">nicht in den aktuellen Schuldenstand eingerechnet</span>.<br />
      <strong>Was kann ich tun? </strong>Du kannst diese Transaktion erneut senden, um sie in den
      aktuellen Schuldenstand einzuberechnen.<br />
    </SystemAlert>
  </div>
</template>
