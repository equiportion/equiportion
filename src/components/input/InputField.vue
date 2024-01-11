<script setup lang="ts">
import {computed, ref} from 'vue';

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
  <input
    :id="id"
    v-model="inputValue"
    :type="type"
    :name="name"
    class="w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
    :placeholder="placeholder"
    :min="min"
    :max="max"
    :step="step"
  />
</template>
