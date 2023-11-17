<script setup lang="ts">
import {computed} from 'vue';

const props = defineProps({
  severity: {
    type: String,
    required: false,
    default: 'info',
  },
});

const divClasses = computed(() => {
  const baseClasses = 'rounded-md p-4 border-l-4';

  if (props.severity == 'info') {
    return baseClasses + ' border-blue-600 bg-blue-50';
  } else if (props.severity == 'success') {
    return baseClasses + ' border-green-600 bg-green-50';
  } else if (props.severity == 'warning') {
    return baseClasses + ' border-yellow-600 bg-yellow-50';
  } else if (props.severity == 'danger') {
    return baseClasses + ' border-red-600 bg-red-50';
  }

  return baseClasses;
});
</script>
<template>
  <div :class="divClasses">
    <slot />
  </div>
</template>
