<script setup lang="ts">
/**
 * @component {MoneyInputWrapper} - Wraps a money input and handles the conversion between cents and displayed value.
 * @author Philipp Stappert
 *
 * @prop {number} modelValue - The value in cents.
 *
 * @event {number} update:modelValue - Emitted when the value changes.
 *
 * @slot input - The input element to be wrapped. The slot scope provides the following properties:
 * @slotProp {string} inputValue - The value to be displayed in the input.
 * @slotProp {function} updateValue - A function to update the value. Should be called by the input with @input="updateValue($event.target.value)".
 */
import {computed} from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

// computes displayed and cents value
const moneyInputValue = computed({
  get: () => {
    const centsIn = props.modelValue.toString();
    let all = centsIn;

    // if undefined, set to 0
    if (props.modelValue == undefined) {
      all = '0';
    }

    // pad with zeros
    if (all.length < 3) {
      for (let i = 0; i <= 3 - all.length; i++) {
        all = '0' + all;
      }
    }

    const euros = all.slice(0, -2);
    const cents = all.slice(-2);

    return `${euros},${cents}`;
  },
  set: (value: string) => {
    setValue(value);
  },
});

// converts displayed value to cents and emits update
function setValue(value: string) {
  if (value == undefined || value == '') {
    value = '0,00';
  }

  value = value.replace(/\D/g, '');
  const cents = parseInt(value);

  emit('update:modelValue', cents);
}
</script>
<template>
  <slot name="input" :input-value="moneyInputValue" :update-value="setValue" />
</template>
