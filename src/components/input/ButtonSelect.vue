<script setup lang="ts">
import {type PropType, computed} from 'vue';

const props = defineProps({
  options: {
    type: Array as PropType<{value: string; label: string; icon?: string}[]>,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

function setNewValue(newValue: string) {
  emit('update:modelValue', newValue);
}

function buttonClassNames(position: string, option: {value: string; label: string; icon?: string}) {
  const selected = props.modelValue === option.value;
  let classNames = '';

  const classesAllButtons =
    'flex-grow inline-block shrink-0 border-blue-600 px-12 py-3 text-sm font-medium transition hover:bg-blue-900 hover:text-white hover:border-blue-900 focus:outline-none focus:ring';
  const selectedAdd = ' bg-blue-600 text-white';
  const nonselectedAdd = ' text-blue-600';
  const classesFirstButton =
    ' rounded-tr-md rounded-tl-md lg:rounded-tr-none lg:rounded-bl-md border-l-2 border-t-2 lg:border-b-2 border-r-2 lg:border-r-0';
  const classesMiddleButtons =
    ' lg:border-t-2 lg:border-b-2 border-l-2 lg:border-l-0 border-r-2 lg:border-r-0';
  const classesLastButton =
    ' rounded-bl-md rounded-br-md lg:rounded-bl-none lg:rounded-tr-md border-l-2 lg:border-l-0 lg:border-t-2 border-r-2 border-b-2';

  classNames += classesAllButtons;

  if (selected) {
    classNames += selectedAdd;
  } else {
    classNames += nonselectedAdd;
  }

  if (position === 'first') {
    classNames += classesFirstButton;
  } else if (position === 'middle') {
    classNames += classesMiddleButtons;
  } else if (position === 'last') {
    classNames += classesLastButton;
  }

  return classNames;
}

const buttonClasses = computed(() => {
  const returnValue: string[] = [];

  if (props.options.length == 0) {
    return returnValue;
  }

  returnValue.push(buttonClassNames('first', props.options[0]));

  for (let i = 1; i < props.options.length - 1; i++) {
    returnValue.push(buttonClassNames('middle', props.options[i]));
  }

  returnValue.push(buttonClassNames('last', props.options[props.options.length - 1]));

  return returnValue;
});

const buttonStyle = computed(() => {
  return `flex-basis: ${100 / props.options.length}%`;
});
</script>
<template>
  <div class="flex flex-col lg:flex-row w-full">
    <button
      v-for="(option, index) in options"
      :key="index"
      :class="buttonClasses[index]"
      :style="buttonStyle"
      @click="setNewValue(option.value)"
    >
      <i v-if="option.icon" :class="option.icon"></i> {{ option.label }}
    </button>
  </div>
</template>
