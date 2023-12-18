<script setup lang="ts">
import {computed} from 'vue';

const props = defineProps({
  active: {
    type: Boolean,
    required: false,
    default: false,
  },
  completed: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const spanClasses = computed(() => {
  if (props.active) {
    return 'h-6 w-6 rounded-full bg-blue-600 text-center text-[10px]/6 font-bold text-white';
  } else if (props.completed) {
    return 'h-6 w-6 rounded-full bg-green-500 text-center text-[10px]/6 font-bold text-white';
  }
  return 'h-6 w-6 rounded-full bg-gray-100 text-center text-[10px]/6 font-bold';
});

const textClasses = computed(() => {
  if (props.active) {
    return 'hidden sm:block font-bold text-blue-600';
  } else if (props.completed) {
    return 'hidden sm:block text-green-500';
  }
  return 'hidden sm:block';
});
</script>
<template>
  <li class="flex items-center gap-2 bg-white p-2">
    <span :class="spanClasses">
      <span v-show="!completed">
        <slot name="step" />
      </span>
      <i v-if="completed" class="fa-solid fa-check"></i>
    </span>

    <span :class="textClasses"> <slot name="description" /> </span>
  </li>
</template>
