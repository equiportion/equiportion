<script setup lang="ts">
import {computed} from 'vue';

const props = defineProps({
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  success: {
    type: Boolean,
    required: false,
    default: false,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(['click']);

const buttonClasses = computed(() => {
  if (props.loading) {
    return 'w-full disabled inline-block shrink-0 rounded-md border border-gray-200 dark:border-0 bg-gray-400 px-12 py-3 text-sm font-medium text-white transition';
  }
  if (props.disabled) {
    return 'w-full disabled inline-block shrink-0 rounded-md border border-gray-200 dark:border-0 bg-gray-400 px-12 py-3 text-sm font-medium text-white transition';
  }
  if (props.success) {
    return 'w-full disabled inline-block shrink-0 rounded-md border border-green-400 dark:border-0 bg-green-600 px-12 py-3 text-sm font-medium text-white transition';
  }

  return 'w-full inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-white dark:hover:bg-gray-800 hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500';
});
</script>
<template>
  <button :class="buttonClasses" :disabled="loading || disabled" @click.stop="emit('click')">
    <span v-show="!loading && !success">
      <slot />
    </span>
    <span v-if="loading">
      <i class="fa-solid fa-spinner animate-spin"></i>
    </span>
    <span v-if="success"> <i class="fa-solid fa-check"></i> Erfolgreich </span>
  </button>
</template>
