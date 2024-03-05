<script setup lang="ts">
import {computed, ref, watch} from 'vue';

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
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  autocomplete: {
    type: String,
    required: false,
    default: 'off',
  },
});

const inputValue = ref('');

watch(
  () => props.modelValue,
  () => {
    inputValue.value = props.modelValue.toString();
  },
  {immediate: true}
);

watch(
  () => inputValue.value,
  () => {
    emit('update:modelValue', inputValue.value);
    inputValue.value = props.modelValue.toString();
  }
);

const classes = computed(() => {
  let classes = 'w-full rounded-md border-gray-200 text-sm text-gray-700 shadow-sm dark:text-gray-200 dark:placeholder:text-gray-400';

  if (props.disabled) {
    classes += ' bg-gray-50 dark:bg-gray-400';
  } else {
    classes += ' bg-white dark:bg-gray-600';
  }

  return classes;
});
</script>
<template>
  <div class="relative">
    <Transition name="fade">
      <div
        v-show="loading"
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <span class="text-gray-500 sm:text-sm">
          <i class="fa fa-spinner animate-spin"></i>
        </span>
      </div>
    </Transition>
    <input
      :id="id"
      v-model="inputValue"
      :autocomplete="autocomplete"
      :type="type"
      :name="name"
      :class="classes"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
    />
  </div>
</template>
