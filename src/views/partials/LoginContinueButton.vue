<script setup lang="ts">
import {computed} from 'vue';

const props = defineProps({
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(['continue']);

const buttonClasses = computed(() => {
  if (props.loading) {
    return 'w-full disabled inline-block shrink-0 rounded-md border border-gray-200 bg-gray-400 px-12 py-3 text-sm font-medium text-white transition';
  }
  return 'w-full inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500';
});
</script>
<template>
  <button :class="buttonClasses" @click="emit('continue')" :disabled="loading">
    <span v-show="!loading">
      <slot />
    </span>
    <span v-if="loading">
      <i class="fa-solid fa-spinner animate-spin"></i>
    </span>
  </button>
</template>
