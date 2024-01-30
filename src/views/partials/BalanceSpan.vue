<script setup lang="ts">
/**
 * Generic Functions
 */
function eurosPart(num: number): string {
  return Math.floor(num / 100).toString();
}

function centsPart(num: number): string {
  return ('00' + (num % 100)).slice(-2);
}

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
