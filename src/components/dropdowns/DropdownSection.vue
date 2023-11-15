<script setup lang="ts">
const props = defineProps({
  heading: {
    type: String,
    required: true,
  },
});
</script>
<template>
  <div class="p-2">
    <strong class="block p-2 text-xs font-medium uppercase text-gray-400"> {{ heading }} </strong>
    <slot />
  </div>
</template>
