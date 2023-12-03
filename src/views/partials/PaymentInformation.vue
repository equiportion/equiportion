<script setup lang="ts">
import InputFieldWithLabelAndError from '@/components/input/InputFieldWithLabelAndError.vue';

import {computed} from 'vue';

const props = defineProps({
  paymentMethodName: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});
</script>
<template>
  <div
    class="flex flex-row w-full gap-2 p-5 rounded-lg border-r-8 border-b-8 bg-gray-100 border-gray-200"
  >
    <div class="flex flex-col flex-grow gap-2">
      <div class="flex flex-row justify-center flex-grow gap-2">
        <div class="flex flex-column justify-center flex-grow gap-2">
          <InputFieldWithLabelAndError
            :label="paymentMethodName"
            :id="paymentMethodName"
            type="text"
            class="w-full"
            v-model="inputValue"
          />
        </div>
      </div>
    </div>
  </div>
</template>
