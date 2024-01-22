<script setup lang="ts">
import StepsBar from '@/components/steps/StepsBar.vue';
import StepsBarStep from '@/components/steps/StepsBarStep.vue';

defineProps({
  active: {
    type: Number,
    required: true,
  },
});
</script>
<template>
  <StepsBar>
    <RouterLink :to="{name: 'login'}">
      <StepsBarStep :completed="active == 2" :active="active == 1">
        <template #step> 1 </template>
        <template #description> Homeserver </template>
      </StepsBarStep>
    </RouterLink>
    <StepsBarStep :active="active == 2">
      <template #step> 2 </template>
      <template #description> Bei Matrix anmelden </template>
    </StepsBarStep>
  </StepsBar>
</template>
