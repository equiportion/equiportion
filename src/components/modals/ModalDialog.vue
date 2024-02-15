<script setup lang="ts">
import {computed, watch} from 'vue';
import useGlobalEventBus from '@/composables/useGlobalEventBus';
const {bus} = useGlobalEventBus();

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:open']);

const modalOpen = computed({
  get: () => props.open,
  set: (val) => {
    emit('update:open', val);
  },
});

// close modal on click outside
watch(
  () => bus.value.get('click'),
  (val) => {
    if (!val[0]['no-close']) {
      emit('update:open', false);
    }
  }
);
</script>
<template>
  <div
    v-show="modalOpen"
    class="fixed inset-0 z-50 flex justify-center items-center w-full backdrop-blur-lg backdrop-brightness-50"
  >
    <div
      class="relative p-4 gap-3 w-full max-w-2xl max-h-screen flex flex-col bg-slate-50 rounded-md no-close"
    >
      <div
        class="absolute top-2 right-2 backdrop-blur-md rounded-full w-10 h-10 flex items-center justify-center"
      >
        <button class="p-2 text-2xl text-gray-500 hover:text-gray-800" @click="modalOpen = false">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <slot />
    </div>
  </div>
</template>
