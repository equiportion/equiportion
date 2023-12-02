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
});

const emit = defineEmits(['click']);

const buttonClasses = computed(() => {
  if (props.loading) {
    return 'disabled h-12 w-12 inline-block rounded-full border border-gray-200 bg-gray-400 text-white transition';
  }
  if (props.success) {
    return 'h-12 w-12 inline-block rounded-full border border-green-600 bg-green-600 text-white hover:bg-transparent hover:text-green-600 focus:outline-none focus:ring active:text-green-500 transition';
  }

  return 'h-12 w-12 inline-block rounded-full border border-blue-600 bg-blue-600 text-white hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 transition';
});
</script>
<template>
  <button :class="buttonClasses" @click.stop="emit('click')" :disabled="loading" :title="title">
    <span v-show="!loading && !success">
      <slot />
    </span>
    <span v-if="loading">
      <i class="fa-solid fa-spinner animate-spin"></i>
    </span>
    <span v-if="success"><i class="fa-solid fa-check"></i></span>
  </button>
</template>
