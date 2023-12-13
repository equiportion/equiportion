<script setup lang="ts">
import {computed} from 'vue';

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
    type: String,
    required: false,
    default: '',
  },
  error: {
    type: String,
    required: false,
  },
  label: {
    type: String,
    required: false,
    default: '',
  },
});

const inputValue = computed({
  get() {
    return props.modelValue;
  },
  set(value: string) {
    emit('update:modelValue', value);
  },
});
</script>
<template>
  <div>
    <label for="Email" class="block text-sm font-medium text-gray-700"> {{ label }} </label>
    <InputField
      :id="id"
      v-model="inputValue"
      class="mt-1"
      :type="type"
      :name="name"
      :placeholder="placeholder"
    />
    <small v-if="error" id="error-message" class="block text-sm text-red-500"> {{ error }} </small>
  </div>
</template>
