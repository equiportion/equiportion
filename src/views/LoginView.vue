<script setup lang="ts">
import {ref} from 'vue';

import InputFieldWithLabelAndError from '@/components/input/InputFieldWithLabelAndError.vue';
import LoginProcessBase from '@/views/partials/LoginProcessBase.vue';
import LoginContinueButton from '@/views/partials/LoginContinueButton.vue';
import LoginStepsBar from '@/views/partials/LoginStepsBar.vue';
import SystemAlert from '@/components/messaging/SystemAlert.vue';

import LoginMatrixClient from '@/logic/models/clients/LoginMatrixClient.js';
import router from '@/router';

const loading = ref(false);

const userId = ref('');
const password = ref('');

const error = ref();

const loginMatrixClient = new LoginMatrixClient();
validateHomeserverUrl();

async function validateHomeserverUrl() {
  if (!(await loginMatrixClient.isHomeserverUrlValid())) {
    router.push({name: 'enter-homeserver'});
  }
}

async function login() {
  loading.value = true;

  const successful = await loginMatrixClient.passwordLogin(userId.value, password.value);
  if (successful) {
    error.value = undefined;
    router.push({name: 'home'}).then(() => {
      router.go(0);
    });
  } else {
    error.value = 'Ungültiger Benutzername oder Passwort';
  }

  loading.value = false;
}
</script>

<template>
  <LoginProcessBase>
    <form id="login-form" class="mt-8 flex flex-col gap-6 w-full" @submit.prevent="login">
      <LoginStepsBar :active="2" />

      <span class="text-center"
        >Am Server "{{ loginMatrixClient.getHomeserverUrl() }}" anmelden</span
      >

      <SystemAlert severity="warning">
        <p class="font-bold">Hinweis:</p>
        <p>
          Aktuell unterstützt dieser Dienst leider nur Passwort-basierte Authentifizierung. In einer
          späteren Version ist mit Unterstützung von SSO, etc. zu rechnen.
        </p>
      </SystemAlert>

      <InputFieldWithLabelAndError
        id="username"
        v-model:model-value="userId"
        type="text"
        name="username"
        placeholder="z.B. @maxmustermann:matrix.org"
        label="Benutzername"
        :error="error"
      />
      <InputFieldWithLabelAndError
        id="homeserver"
        v-model:model-value="password"
        type="password"
        name="homeserver"
        placeholder="Matrix-Passwort eingeben..."
        label="Passwort"
        :error="error"
      />

      <div class="sm:flex sm:items-center sm:gap-4">
        <LoginContinueButton id="loginbutton" :loading="loading" @continue="login">
          Anmelden <i class="fa-solid fa-arrow-right-to-bracket"></i>
        </LoginContinueButton>
      </div>
    </form>
  </LoginProcessBase>
</template>
