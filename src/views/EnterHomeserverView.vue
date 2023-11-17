<script setup lang="ts">
import {ref} from 'vue';

import InputFieldWithLabelAndError from '@/components/input/InputFieldWithLabelAndError.vue';
import LoginProcessBase from '@/views/partials/LoginProcessBase.vue';
import LoginContinueButton from '@/views/partials/LoginContinueButton.vue';
import LoginStepsBar from '@/views/partials/LoginStepsBar.vue';

import {MatrixClient} from '@/logic/controller/MatrixClient';
import router from '@/router';

const loading = ref(false);
const homeserverUrl = ref(MatrixClient.getHomeserverUrlCookie() ?? '');
const error = ref();

async function continueToLogin() {
  loading.value = true;

  await validateHomeserverUrl();

  loading.value = false;
}

async function validateHomeserverUrl() {
  const matrixClient = new MatrixClient(homeserverUrl.value);

  if (await matrixClient.isHomeserverUrlValid()) {
    error.value = undefined;

    MatrixClient.setHomeserverUrlCookie(homeserverUrl.value);
    router.push({name: 'login'});
  } else {
    error.value = 'Ungültige Homeserver-URL';
  }
}
</script>

<template>
  <LoginProcessBase>
    <div class="mt-8 flex flex-col gap-6 w-full">
      <LoginStepsBar :active="1" />
      <div>
        <InputFieldWithLabelAndError
          type="text"
          id="homeserver"
          name="homeserver"
          placeholder="z.B. https://matrix.org"
          label="Homeserver-URL"
          v-bind:error="error"
          v-model:model-value="homeserverUrl"
        />
      </div>

      <div class="sm:flex sm:items-center sm:gap-4">
        <LoginContinueButton :loading="loading" @continue="continueToLogin">
          Weiter zum Anmelden <i class="fa-solid fa-arrow-right-to-bracket"></i>
        </LoginContinueButton>
      </div>
    </div>
  </LoginProcessBase>
</template>
