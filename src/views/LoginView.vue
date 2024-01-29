<script setup lang="ts">
import {ref, watch, type Ref} from 'vue';

import InputFieldWithLabelAndError from '@/components/input/InputFieldWithLabelAndError.vue';
import LoginProcessBase from '@/views/partials/LoginProcessBase.vue';
import LoginContinueButton from '@/views/partials/LoginContinueButton.vue';
import SystemAlert from '@/components/messaging/SystemAlert.vue';

import MatrixClient from '@/logic/models/clients/MatrixClient';
import LoginMatrixClient from '@/logic/models/clients/LoginMatrixClient';
import router from '@/router';

const loading = ref(false);

const userId = ref('');
const password = ref('');

const error = ref();

const loginMatrixClient = ref(new LoginMatrixClient());

async function login() {
  loading.value = true;

  const successful = await loginMatrixClient.value.passwordLogin(userId.value, password.value);
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

const showHomeserverWarning = ref(false);
const homeserverChecking: Ref<number> = ref(0);

watch(
  () => userId.value,
  async () => {
    if (userId.value.split(':').length != 2 || userId.value.split(':')[1].length == 0) {
      loginMatrixClient.value.setHomeserverUrl('https://matrix.org');
      return;
    }

    homeserverChecking.value++;

    const userIdValue = ref(userId.value);

    const homeserverUrlTest = 'https://' + userIdValue.value.split(':')[1];

    if (await MatrixClient.checkHomeserverUrl(homeserverUrlTest)) {
      homeserverChecking.value = 0;
      loginMatrixClient.value.setHomeserverUrl(homeserverUrlTest);
      showHomeserverWarning.value = false;
    } else {
      if ('https://' + userId.value.split(':')[1] == homeserverUrlTest) {
        const fromWellKnown = await MatrixClient.getHomeserverUrlFromWellKnown(homeserverUrlTest);
        const isFromWellKnownValid = fromWellKnown ? (await MatrixClient.checkHomeserverUrl(fromWellKnown)) : false;

        if ('https://' + userId.value.split(':')[1] == homeserverUrlTest) {
          if (isFromWellKnownValid) {
            homeserverChecking.value = 0;
            loginMatrixClient.value.setHomeserverUrl(fromWellKnown as string);
            showHomeserverWarning.value = false;
          } else {
            showHomeserverWarning.value = true;
          }
        }
      }
    }

    if (homeserverChecking.value > 0) {
      homeserverChecking.value--;
    }
  },
  {immediate: true}
);
</script>

<template>
  <LoginProcessBase>
    <form id="login-form" class="mt-8 flex flex-col gap-6 w-full" @submit.prevent="login">
      <span v-show="!showHomeserverWarning" class="text-center">
        Am Server "{{ loginMatrixClient.getHomeserverUrl()?.split('://')[1] }}" anmelden
      </span>

      <SystemAlert severity="warning">
        <p class="font-bold">Hinweis:</p>
        <p>
          Aktuell unterstützt dieser Dienst leider nur Passwort-basierte Authentifizierung. In einer
          späteren Version ist mit Unterstützung von SSO, etc. zu rechnen.
        </p>
      </SystemAlert>

      <SystemAlert v-show="showHomeserverWarning" severity="danger">
        <p class="font-bold">Achtung: Homeserver nicht erreichbar</p>
        <p>
          Leider konnte dein Homeserver nicht erreicht bzw. aufgefunden werden. Bitte überprüfe
          deine Eingabe und versuche es erneut.
        </p>
      </SystemAlert>

      <div v-show="homeserverChecking > 0" class="flex flex-col items-center">
        <i class="fa-solid fa-spinner animate-spin text-3xl text-gray-300"></i>
        <span class="text-sm text-gray-400">Suche Homeserver...</span>
      </div>

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
        <LoginContinueButton
          id="loginbutton"
          :loading="loading"
          :disabled="showHomeserverWarning || homeserverChecking > 0"
          @continue="login"
        >
          Anmelden <i class="fa-solid fa-arrow-right-to-bracket"></i>
        </LoginContinueButton>
      </div>
    </form>
  </LoginProcessBase>
</template>
