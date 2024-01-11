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
    <div class="cursor-pointer" @click="toggle()">
      <slot name="trigger" :toggle="toggle" />
    </div>
    <div
      v-show="open"
      class="absolute end-0 z-10 mt-2 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"
      role="menu"
    >
      <slot />
    </div>
  </div>
</template>
