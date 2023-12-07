<script setup lang="ts">
import {computed} from 'vue';

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
  <input
    :id="id"
    v-model="inputValue"
    :type="type"
    :name="name"
    class="w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
    :placeholder="placeholder"
  />
</template>
