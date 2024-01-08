<script setup lang="ts">
/**
 * @component {HugeFreeInput} - A huge input field with a label and a placeholder.
 * @description This component is displaying a heading-like input field with a label and a placeholder. It is used for the purpose input in the NewTransactionView.
 * @author Philipp Stappert
 *
 * @emits {string|number} update:modelValue - Emitted when the value changes.
 *
 * @prop {string} [placeholder=''] - The placeholder text.
 * @prop {string|number} [modelValue=''] - The value of the input.
 * @prop {string} [label=''] - The label text.
 */

import {computed} from 'vue';

const props = defineProps({
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
  label: {
    type: String,
    required: false,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const inputValue = computed({
  get(): string | number {
    return props.modelValue;
  },
  set(value: string | number) {
    emit('update:modelValue', value);
  },
});

const inputClasses = computed(() => {
  const classes =
    'w-full text-center border-0 p-0 border-transparent focus:border-transparent focus:ring-0 font-bold';

  // calculate input length
  let inputLength;
  if (props.modelValue == undefined) {
    inputLength = props.placeholder.length;
  } else {
    inputLength = props.modelValue.toString().length;
  }
  console.log(inputLength);

  if (inputLength > 20) {
    return classes + ' text-4xl';
  } else if (inputLength > 10) {
    return classes + ' text-5xl';
  } else {
    return classes + ' text-6xl';
  }
});
</script>
<template>
  <div class="flex flex-col items-center">
    <input v-model="inputValue" type="text" :placeholder="placeholder" :class="inputClasses" />
    <span class="text-sm text-gray-500">{{ label }}</span>
  </div>
</template>
