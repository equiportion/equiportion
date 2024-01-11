<script setup lang="ts">
import {computed, ref} from 'vue';

import InputField from '@/components/input/InputField.vue';

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: false,
    default: undefined,
  },
  name: {
    type: String,
    required: false,
    default: '',
  },
  placeholder: {
    type: String,
    required: false,
    default: '',
  },
  modelValue: {
    type: [String, Number],
    required: false,
    default: '',
  },
  error: {
    type: String,
    required: false,
    default: undefined,
  },
  label: {
    type: String,
    required: false,
    default: '',
  },
  min: {
    type: Number,
    required: false,
    default: undefined,
  },
  max: {
    type: Number,
    required: false,
    default: undefined,
  },
  step: {
    type: Number,
    required: false,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const changeCounter = ref(0);

const inputValue = computed({
  get(): string | number {
    changeCounter.value;

    return props.modelValue;
  },
  set(value: string | number) {
    emit('update:modelValue', value);

    // force recomputation of inputValue
    changeCounter.value++;
  },
});
</script>
<template>
  <div>
    <label for="Email" class="block text-sm font-medium text-gray-700"> {{ label }} </label>
    <InputField
      :id="id"
      v-model="inputValue"
      class="mt-1 w-full"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
    />
    <small v-if="error" class="block text-sm text-red-500"> {{ error }} </small>
  </div>
</template>
