<script setup lang="ts">
import {ref} from 'vue';

const homeserverUrl = ref('');

function enterHomeServer() {
  console.log(homeserverUrl.value);
}
</script>

<template>
  <p>Please enter your matrix homeserver:</p>
  <input type="text" v-model="homeserverUrl" />
  <button @click="enterHomeServer">Enter</button>
</template>
