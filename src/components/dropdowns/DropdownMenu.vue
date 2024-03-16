<script setup lang="ts">
import {ref, watch, computed} from 'vue';
import useGlobalEventBus from '@/composables/useGlobalEventBus';
const {bus} = useGlobalEventBus();

const open = ref(false);

const props = defineProps({
  inline: {
    type: Boolean,
    default: false,
  },
});

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

// classes for dropdown
const classes = computed(() => {
  const classes =
    'mt-2 divide-y divide-gray-100 dark:divide-gray-600 rounded-md border border-gray-100 dark:border-0 bg-white dark:bg-gray-700 shadow-lg';

  if (!props.inline) {
    return classes + ' absolute end-0 z-10 w-56';
  } else {
    return classes + ' w-full';
  }
});
</script>

<template>
  <div class="relative no-close">
    <div class="cursor-pointer" @click="toggle()">
      <slot name="trigger" :toggle="toggle" />
    </div>
    <div v-show="open" :class="classes" role="menu">
      <slot :toggle="toggle" />
    </div>
  </div>
</template>
