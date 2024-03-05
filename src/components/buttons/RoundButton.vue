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
  title: {
    type: String,
    required: false,
    default: '',
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  outlined: {
    type: Boolean,
    required: false,
    default: false,
  },
  danger: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(['click']);

const buttonClasses = computed(() => {
  if (props.loading) {
    return 'disabled h-12 w-12 inline-block rounded-full border border-gray-200 dark:border-0 bg-gray-400 text-white transition';
  }
  if (props.disabled) {
    return 'disabled h-12 w-12 inline-block rounded-full border border-gray-200 dark:border-0 bg-gray-400 text-white transition';
  }
  if (props.success) {
    return 'h-12 w-12 inline-block rounded-full border border-green-600 bg-green-600 text-white hover:bg-white dark:hover:bg-gray-800 hover:text-green-600 focus:outline-none focus:ring focus:ring-green-200 active:text-green-500 transition';
  }
  if (props.outlined) {
    return 'h-12 w-12 inline-block rounded-full border border-blue-600 bg-white dark:bg-gray-800 text-blue-600 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring active:text-blue-500 transition';
  }
  if (props.danger) {
    return 'h-12 w-12 inline-block rounded-full border border-red-600 bg-red-600 text-white hover:bg-white dark:hover:bg-gray-800 hover:text-red-600 focus:outline-none focus:ring focus:ring-red-200 active:text-red-500 transition';
  }

  return 'h-12 w-12 inline-block rounded-full border border-blue-600 bg-blue-600 text-white hover:bg-white dark:hover:bg-gray-800 hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 transition';
});
</script>
<template>
  <button
    :class="buttonClasses"
    :disabled="loading || disabled"
    :title="title"
    @click.stop="emit('click')"
  >
    <span v-show="!loading && !success">
      <slot />
    </span>
    <span v-if="loading">
      <i class="fa-solid fa-spinner animate-spin"></i>
    </span>
    <span v-if="success"><i class="fa-solid fa-check"></i></span>
  </button>
</template>
