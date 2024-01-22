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
    <label :for="'select-' + hopefullyUniqueId" class="block text-sm font-medium text-gray-900">
      {{ label }}
    </label>

    <select
      :id="'select-' + hopefullyUniqueId"
      v-model="inputValue"
      :name="'select-' + hopefullyUniqueId"
      class="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
