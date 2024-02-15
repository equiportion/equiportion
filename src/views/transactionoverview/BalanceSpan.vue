<script setup lang="ts">
import {centsPart, eurosPart} from '@/logic/utils/money';

const props = defineProps({
  compensation: {
    type: Number,
    required: false,
    default: 0,
  },
});
</script>
<template>
  <span v-if="props.compensation && props.compensation > 0" class="text-sm text-red-600 font-bold">
    <i class="fa-solid fa-coins"></i>
    Du schuldest
    {{ eurosPart(props.compensation) }},{{ centsPart(props.compensation) }}
    €
  </span>
  <span
    v-else-if="props.compensation && props.compensation < 0"
    class="text-sm text-green-600 font-bold"
  >
    <i class="fa-solid fa-coins"></i>
    Schuldet dir
    {{ eurosPart(parseInt(props.compensation.toString().replace('-', ''))) }},{{
      centsPart(parseInt(props.compensation.toString().replace('-', '')))
    }}
    €
  </span>
  <span v-else class="text-sm text-blue-600 font-bold">
    <i class="fa-solid fa-coins"></i>
    Ausgeglichen
  </span>
</template>
