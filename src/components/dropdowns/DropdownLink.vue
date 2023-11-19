<script setup lang="ts">
import {RouterLink} from 'vue-router';
const props = defineProps({
  to: {
    type: String,
    required: true,
  },
});
</script>
<template>
  <RouterLink :to="props.to">
    <div
      class="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 w-full"
      role="menuitem"
    >
      <slot />
    </div>
  </RouterLink>
</template>
