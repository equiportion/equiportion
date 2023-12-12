<!-- TransactionEntryWidgets.vue -->
<script setup lang="ts">
defineProps(['modelValue', 'tag']);
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
