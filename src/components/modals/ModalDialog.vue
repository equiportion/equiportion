<script setup lang="ts">
import {computed} from 'vue';

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
</script>
<template>
  <div
    v-show="modalOpen"
    class="fixed inset-0 z-50 flex justify-center items-center w-full backdrop-blur-lg backdrop-brightness-50"
  >
    <div
      class="relative p-4 gap-3 w-full max-w-2xl max-h-full flex flex-col bg-slate-50 rounded-md"
    >
      <div class="absolute top-0 right-1">
        <button class="p-2 text-2xl text-gray-500 hover:text-gray-800" @click="modalOpen = false">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <slot />
    </div>
  </div>
</template>
