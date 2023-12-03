<script setup lang="ts">
import {ref, watch} from 'vue';
import useGlobalEventBus from '@/composables/useGlobalEventBus';
const {bus} = useGlobalEventBus();

const open = ref(false);

// toggle dropdown
function toggle() {
  open.value = !open.value;
}

// close dropdown on click outside
watch(
  () => bus.value.get('click'),
  (val) => {
    if (!val[0]['no-close']) {
      open.value = false;
    }
  }
);
</script>

<template>
  <div class="relative no-close">
    <div @click="toggle()" class="cursor-pointer">
      <slot name="trigger" />
    </div>
    <div
      class="absolute end-0 z-10 mt-2 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"
      role="menu"
      v-show="open"
    >
      <slot />
    </div>
  </div>
</template>
