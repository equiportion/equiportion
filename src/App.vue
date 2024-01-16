<script setup lang="ts">
import {onMounted} from 'vue';
import {RouterView} from 'vue-router';
import initLocal from '@/logic/utils/local';

onMounted(() => {
  initLocal();
});
</script>

<template>
  <RouterView />
</template>
