<script setup lang="ts">
import {ref} from 'vue';

import InputFieldWithLabelAndError from '@/components/input/InputFieldWithLabelAndError.vue';
import LoginProcessBase from '@/views/partials/LoginProcessBase.vue';
import LoginContinueButton from '@/views/partials/LoginContinueButton.vue';
import LoginStepsBar from '@/views/partials/LoginStepsBar.vue';

import {MatrixClient} from '@/logic/controller/MatrixClient';
import router from '@/router';
import {getCookie, setCookie} from '@/logic/utils/cookies';
import cookieNames from '@/logic/constants/cookieNames';

const loading = ref(false);
const homeserverUrl = ref(getCookie(cookieNames.homeserverUrl) ?? '');
const error = ref();

async function continueToLogin() {
  loading.value = true;

  const matrixClient = new MatrixClient(homeserverUrl.value);

  if (await matrixClient.isHomeserverUrlValid()) {
    error.value = undefined;

    setCookie(cookieNames.homeserverUrl, homeserverUrl.value);
    router.push({name: 'login'});
  } else {
    error.value = 'Ungültige Homeserver-URL';
  }

  loading.value = false;
}
</script>

<template>
  <LoginProcessBase>
    <form @submit.prevent="continueToLogin" class="mt-8 flex flex-col gap-6 w-full">
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
    </form>
  </LoginProcessBase>
</template>
