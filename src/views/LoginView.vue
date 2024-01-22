<script setup lang="ts">
import {ref} from 'vue';

import InputFieldWithLabelAndError from '@/components/input/InputFieldWithLabelAndError.vue';
import LoginProcessBase from '@/views/partials/LoginProcessBase.vue';
import LoginContinueButton from '@/views/partials/LoginContinueButton.vue';
import LoginStepsBar from '@/views/partials/LoginStepsBar.vue';
import SystemAlert from '@/components/messaging/SystemAlert.vue';

import LoginMatrixClient from '@/logic/models/clients/LoginMatrixClient.js';
import router from '@/router';
import cookieNames from '@/logic/constants/cookieNames';
import MatrixClient from '@/logic/models/clients/MatrixClient';
import {setCookie} from '@/logic/utils/cookies';

const loading = ref(false);

const userId = ref('');
const password = ref('');

const error = ref();

var loginMatrixClient: LoginMatrixClient = new LoginMatrixClient();

async function login() {
  //parse user input to homeserver and user name
  const userName = userId.value.split(':')[0];
  const homeserverName: string = userId.value.split(':')[1];
  let homeserverUrl: string | false;
  let matrixClient: MatrixClient;

  //check if the homeserver name is a valid homeserver url
  matrixClient = new MatrixClient(homeserverName);
  const isMatrixClientValid: Boolean = await matrixClient.isHomeserverUrlValid();
  if (isMatrixClientValid) {
    homeserverUrl = homeserverName;
  }
  if (!isMatrixClientValid) {
    //try to get the homeserver url from the given server by the WellKnown
    homeserverUrl = await MatrixClient.getHomeserverUrlFromWellKnown(homeserverName);

    if (!homeserverUrl) {
      error.value = 'Fehler beim Erkennen des Matrix-Servers';
      return;
    }
    matrixClient = new MatrixClient(homeserverUrl);

    const isHomeserverUrlValid: Boolean = await matrixClient.isHomeserverUrlValid();
    console.log(isHomeserverUrlValid);
    if (!isHomeserverUrlValid) {
      error.value = 'Ungültiger Homeserver-Name';
      return;
    }
  }

  console.log('ich komm drann ' + homeserverUrl);
  //if the function did not return yet then homeserverUrl contains a valid homeserverUrl now
  error.value = undefined;
  setCookie(cookieNames.homeserverUrl, homeserverUrl);

  loginMatrixClient = new LoginMatrixClient(homeserverUrl);

  loading.value = true;

  const successful = await loginMatrixClient.passwordLogin(userName.value, password.value);
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
