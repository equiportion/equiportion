<script setup lang="ts">
import {ref} from 'vue';

import InputFieldWithLabelAndError from '@/components/input/InputFieldWithLabelAndError.vue';
import LoginProcessBase from '@/views/partials/LoginProcessBase.vue';
import LoginContinueButton from '@/views/partials/LoginContinueButton.vue';
import LoginStepsBar from '@/views/partials/LoginStepsBar.vue';
import SystemAlert from '@/components/messaging/SystemAlert.vue';

import {LoginMatrixClient} from '@/logic/controller/LoginMatrixClient';
import router from '@/router';

const loading = ref(false);

const username = ref('');
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

  const successful = await loginMatrixClient.login(username.value, password.value);
  if (successful) {
    error.value = undefined;
    router.push({name: 'home'});
  } else {
    error.value = 'Ungültiger Benutzername oder Passwort';
  }

  loading.value = false;
}
</script>

<template>
  <LoginProcessBase>
    <div class="mt-8 flex flex-col gap-6 w-full">
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
        type="text"
        id="username"
        name="username"
        placeholder="z.B. @maxmustermann:matrix.org"
        label="Benutzername"
        v-model:model-value="username"
        v-bind:error="error"
      />
      <InputFieldWithLabelAndError
        type="password"
        id="homeserver"
        name="homeserver"
        placeholder="Matrix-Passwort eingeben..."
        label="Passwort"
        v-model:model-value="password"
        v-bind:error="error"
      />

      <div class="sm:flex sm:items-center sm:gap-4">
        <LoginContinueButton :loading="loading" @continue="login">
          Anmelden <i class="fa-solid fa-arrow-right-to-bracket"></i>
        </LoginContinueButton>
      </div>
    </div>
  </LoginProcessBase>
</template>
