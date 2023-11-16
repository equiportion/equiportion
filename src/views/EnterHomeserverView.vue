<script setup lang="ts">
import {MatrixClient} from '@/logic/controller/MatrixClient';
import router from '@/router';
import {ref} from 'vue';

const homeserverUrl = ref('');

async function validateHomeserverUrl() {
  const matrixClient = new MatrixClient(homeserverUrl.value);

  if (await matrixClient.isHomeserverUrlValid()) {
    matrixClient.setHomeserverUrlCookie();
    router.push({name: 'login'});
  } else {
    //TODO: Error message
    console.log('Invalid Homeserver Url');
  }
}
</script>

<template>
  <p>Please enter your matrix homeserver:</p>
  <input type="text" v-model="homeserverUrl" />
  <button @click="validateHomeserverUrl">Enter</button>
</template>
