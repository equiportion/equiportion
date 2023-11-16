<script setup lang="ts">
import {LoginMatrixClient} from '@/logic/controller/LoginMatrixClient';
import router from '@/router';

const loginMatrixClient = new LoginMatrixClient();
if (!(await loginMatrixClient.isHomeserverUrlValid())) {
  router.push({name: 'enter-homeserver'});
}
</script>

<template>
  <h1>This is the login view</h1>
</template>
