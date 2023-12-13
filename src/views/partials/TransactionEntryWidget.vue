<script setup lang="ts">
/**
 * @component {TransactionEntryWidget} - Component for creating a new transaction in a Matrix room.
 * @author Yinlei Ba
 * 
 * @prop {any} modelValue - v-model of the parent component
 * @prop {String} tag - context of the widget
 */
 defineProps({
  modelValue: null as any,
  tag: String,
});
defineEmits(['update:modelValue']);
</script>

<template>
  <div class="flex flex-row items-center">
    <div>{{ $props.tag }} :</div>
    <div>
      <input
        :value="modelValue"
        @input="$emit('update:modelValue',($event.target as HTMLInputElement).value)"
        type="text"
        class="block p-3 bg-slate-100 sm:text-md rounded-md m-3"
      />
    </div>
  </div>
</template>
