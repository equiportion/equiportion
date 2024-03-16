<script setup lang="ts">
import {type PropType, computed} from 'vue';

const props = defineProps({
  options: {
    type: Array as PropType<{value: string; label: string}[]>,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const hopefullyUniqueId = () => Math.random().toString(36).substring(7);
</script>
<template>
  <div>
    <label
      :for="'select-' + hopefullyUniqueId"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ label }}
    </label>

    <select
      :id="'select-' + hopefullyUniqueId"
      v-model="inputValue"
      :name="'select-' + hopefullyUniqueId"
      class="mt-1 w-full rounded-md shadow-sm dark:bg-gray-600 border-gray-200 text-gray-700 dark:text-gray-200 sm:text-sm"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
