<script setup lang="ts">
import {computed} from 'vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
  (event: 'search', value: string): void;
}>();

const searchValue = computed({
  get() {
    return props.modelValue;
  },
  set(value: string) {
    emit('update:modelValue', value);
  },
});
</script>
<template>
  <div class="flex items-center gap-4">
    <div class="relative">
      <label class="sr-only" for="search"> Suche </label>

      <input
        id="search"
        v-model="searchValue"
        autocomplete="off"
        class="h-10 w-full rounded-full border-none bg-white dark:bg-gray-600 dark:text-gray-200 dark:placeholder:text-gray-400 lg:hover:scale-105 pe-10 ps-4 text-sm shadow-sm sm:w-56"
        type="search"
        placeholder="Raum suchen..."
      />

      <div
        class="absolute end-1 top-1/2 -translate-y-1/2 rounded-full bg-gray-100 dark:bg-gray-400 p-2 text-gray-600 dark:text-gray-200 transition hover:text-gray-700 dark:hover:text-gray-100"
      >
        <span class="sr-only">Suchen</span>
        <i class="block fa-solid fa-search fa-fw"></i>
      </div>
    </div>
  </div>
</template>
