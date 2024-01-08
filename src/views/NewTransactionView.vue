<script setup lang="ts">
/** Imports */
// Layout and Components
import MainLayout from '@/layouts/MainLayout.vue';
import RoundButton from '@/components/buttons/RoundButton.vue';
import MoneyInputWrapper from '@/components/input/MoneyInputWrapper.vue';
import HugeFreeInput from '@/components/input/HugeFreeInput.vue';

// framework and libraries
import {computed, ref, watch} from 'vue';

/** Validation */

// when all fields are valid, the submit button is enabled
const submitDisabled = computed(() => {
  return false;
});

const moneyVal = ref(0);
const reasonVal = ref('');

watch(moneyVal, (newVal) => {
  console.log(newVal);
});
</script>

<template>
  <MainLayout>
    <!-- Submit Button (bottom right) -->
    <RoundButton class="fixed bottom-5 right-5 shadow-lg" :disabled="submitDisabled">
      <i class="fa-solid fa-check"></i>
    </RoundButton>

    <!-- Form -->
    <div class="p-2 lg:p-5 flex flex-col">
      <!-- Sum -->
      <div class="flex flex-col items-center">
        <MoneyInputWrapper v-model="moneyVal">
          <template #input="{inputValue, updateValue}">
            <input
              type="text"
              placeholder="0,00"
              class="w-full text-center border-0 p-0 border-transparent focus:border-transparent focus:ring-0 text-6xl font-bold"
              :value="inputValue"
              @input="(e) => updateValue((e!.target as HTMLInputElement)!.value)"
            />
          </template>
        </MoneyInputWrapper>
        <span class="text-sm text-gray-500">Gesamtbetrag (Euro)</span>
      </div>

      <!-- Purpose -->
      <HugeFreeInput label="Zweck" placeholder="Pizzabacken" v-model="reasonVal" />
    </div>
  </MainLayout>
</template>
