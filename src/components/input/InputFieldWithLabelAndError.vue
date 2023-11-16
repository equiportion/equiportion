<script setup lang="ts">
import {computed, defineEmits} from 'vue';

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
    type: Boolean,
    required: false,
    default: false,
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
      class="mt-1"
      :type="type"
      :id="id"
      :name="name"
      :placeholder="placeholder"
      v-model="inputValue"
    />
    <small class="block text-sm text-red-500" v-if="error"> {{ error }} </small>
  </div>
</template>
