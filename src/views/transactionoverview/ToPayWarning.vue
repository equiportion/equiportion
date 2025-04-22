<template>
  <div
    v-if="balanceLoaded && balance > 0"
    class="flex flex-row flex-wrap w-full rounded-lg shadow-lg p-5 gap-5 bg-red-400 text-white items-center justify-center lg:justify-between"
  >
    <h2 class="text-2xl font-bold text-center lg:text-left break-all">
      Du schuldest noch {{ absEurosPart(balance) }},{{ absCentsPart(balance) }} €
    </h2>

    <RoundButton title="Optimale Rückzahlung anzeigen">
      <i class="fa-solid fa-eye"></i>
    </RoundButton>
  </div>
</template>
<script setup lang="ts">
import {ref, watch} from 'vue';
import RoundButton from '@/components/buttons/RoundButton.vue';
import Room from '@/logic/models/Room';
import {absEurosPart, absCentsPart} from '@/logic/utils/money';
import BipartiteCompensation from '@/logic/compensation/BipartiteCompensation';
import waitForInitialSync from '@/logic/utils/waitForSync';

const props = defineProps<{room: Room}>();

const balance = ref(0);
const balanceLoaded = ref(false);
function calculateBalance() {
  let sum = 0;
  if (!props.room) {
    return;
  }

  balanceLoaded.value = true;
  const compensationCalculation = new BipartiteCompensation();
  const compensation = compensationCalculation.calculateCompensation(props.room);
  for (const comp of Object.values(compensation)) {
    sum += comp;
  }

  balance.value = sum;
}

waitForInitialSync().then(() => {
  calculateBalance();
});
watch(props.room, () => {
  calculateBalance();
});
</script>
