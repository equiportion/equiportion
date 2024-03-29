<script setup lang="ts">
import {ref, watch, type Ref, onMounted} from 'vue';

import InputFieldWithLabelAndError from '@/components/input/InputFieldWithLabelAndError.vue';
import LoginProcessBase from '@/views/login/LoginProcessBase.vue';
import LoginContinueButton from '@/views/login/LoginContinueButton.vue';
import SystemAlert from '@/components/messaging/SystemAlert.vue';
import StandardButton from '@/components/buttons/StandardButton.vue';

import MatrixClient from '@/logic/clients/MatrixClient';
import LoginMatrixClient from '@/logic/clients/LoginMatrixClient';
import router from '@/router';

const loading = ref(false);

const userId = ref('');
const password = ref('');

const error = ref();

const loginMatrixClient = ref(new LoginMatrixClient());

async function loginWithPassword() {
  loading.value = true;

  const successful = await loginMatrixClient.value.passwordLogin(userId.value, password.value);
  if (successful) {
    error.value = undefined;
    const dashboardUrl = window.location.href.split('login')[0];
    window.location.href = dashboardUrl;
    return;
  } else {
    error.value = 'Ungültiger Benutzername oder Passwort';
  }

  loading.value = false;
}

const showNewUserInfo = ref(true);
const showHomeserverWarning = ref(false);
const homeserverChecking: Ref<number> = ref(0);

// check url for loginToken
const loginUsingToken = ref(false);
const urlParams = new URLSearchParams(window.location.search);
const loginToken = urlParams.get('loginToken');
onMounted(async () => {
  if (loginToken) {
    loginUsingToken.value = true;

    const successful = await loginMatrixClient.value.tokenLogin(loginToken);
    if (successful) {
      const dashboardUrl = window.location.href.split('login?')[0];
      window.location.href = dashboardUrl;
      return;
    } else {
      error.value = 'Ungültiger Login-Token';
    }

    loginUsingToken.value = false;
  }
});

// login form homeserver validation
watch(
  () => userId.value,
  async () => {
    if (loginToken) {
      return;
    }
    showNewUserInfo.value = !userId.value;
    if (
      (userId.value.split(':').length != 2 || userId.value.split(':')[1].length == 0) &&
      !loginToken
    ) {
      await loginMatrixClient.value.setHomeserverUrl('https://matrix.org');
      showHomeserverWarning.value = false;
      homeserverChecking.value = 0;
      return;
    }

    homeserverChecking.value++;

    const userIdValue = ref(userId.value);

    const homeserverUrlTest = 'https://' + userIdValue.value.split(':')[1];

    if (await MatrixClient.checkHomeserverUrl(homeserverUrlTest)) {
      homeserverChecking.value = 0;
      showHomeserverWarning.value = false;
      await loginMatrixClient.value.setHomeserverUrl(homeserverUrlTest);
    } else if ('https://' + userId.value.split(':')[1] == homeserverUrlTest) {
      const fromWellKnown = await MatrixClient.getHomeserverUrlFromWellKnown(homeserverUrlTest);
      const isFromWellKnownValid = fromWellKnown
        ? await MatrixClient.checkHomeserverUrl(fromWellKnown)
        : false;

      if ('https://' + userId.value.split(':')[1] == homeserverUrlTest) {
        if (isFromWellKnownValid) {
          homeserverChecking.value = 0;
          showHomeserverWarning.value = false;
          await loginMatrixClient.value.setHomeserverUrl(fromWellKnown as string);
        } else {
          showHomeserverWarning.value = true;
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
    <div id="login-form" class="mt-8 flex flex-col gap-6 w-full">
      <SystemAlert v-show="showNewUserInfo" severity="info">
        <p class="font-bold">Registrierung bei einem Matrix-Homeserver</p>
        <p>
          Falls du noch kein Konto hast, kannst du dich bei einem Matrix-Homeserver registrieren,
          wie zum Beispiel matrix.org. Klicke
          <a
            href="https://app.element.io/#/register"
            target="_blank"
            class="text-blue-500 underline hover:text-blue-700"
            >hier</a
          >, um dich zu registrieren.
        </p>
        <br />
        <p class="font-bold">Über SSO Anmelden</p>
        <p>
          Alternativ kannst du dich auch über den Button "Mit SSO Anmelden" registrieren. Du kannst
          dich mit deinem Google-, GitHub-, GitLab- oder Facebook-Konto anmelden und ein Konto
          erstellen.
        </p>
      </SystemAlert>

      <span
        v-show="!showHomeserverWarning && homeserverChecking == 0"
        class="text-center dark:text-white"
      >
        Am Server "{{ loginMatrixClient.getHomeserverUrl()?.split('://')[1] }}" anmelden
      </span>

      <SystemAlert v-show="showHomeserverWarning" id="homeserverWarning" severity="danger">
        <p class="font-bold">Achtung: Homeserver nicht erreichbar</p>
        <p>
          Leider konnte dein Homeserver nicht erreicht bzw. aufgefunden werden. Bitte überprüfe
          deine Eingabe und versuche es erneut.
        </p>
      </SystemAlert>

      <template v-if="!loginUsingToken">
        <InputFieldWithLabelAndError
          id="username"
          v-model:model-value="userId"
          type="text"
          name="username"
          placeholder="z.B. @maxmustermann:matrix.org"
          label="Benutzername"
          :error="error"
          :loading="homeserverChecking > 0"
        />
        <InputFieldWithLabelAndError
          v-show="
            homeserverChecking == 0 &&
            !showHomeserverWarning &&
            loginMatrixClient.getSupportedLoginFlows().includes('m.login.password')
          "
          id="password"
          v-model:model-value="password"
          type="password"
          name="password"
          placeholder="Matrix-Passwort eingeben..."
          label="Passwort"
          :error="error"
        />

        <div class="flex flex-col items-center gap-4">
          <LoginContinueButton
            v-show="
              homeserverChecking == 0 &&
              !showHomeserverWarning &&
              loginMatrixClient.getSupportedLoginFlows().includes('m.login.password')
            "
            id="loginbutton"
            :loading="loading"
            :disabled="showHomeserverWarning || homeserverChecking > 0"
            @continue="loginWithPassword"
          >
            Mit Passwort anmelden <i class="fa-solid fa-arrow-right-to-bracket"></i>
          </LoginContinueButton>

          <span
            v-show="
              homeserverChecking == 0 &&
              !showHomeserverWarning &&
              loginMatrixClient.getSupportedLoginFlows().includes('m.login.password') &&
              loginMatrixClient.getSupportedLoginFlows().includes('m.login.sso')
            "
            class="text-sm text-gray-600 dark:text-gray-400"
          >
            - oder -
          </span>

          <StandardButton
            v-show="
              homeserverChecking == 0 &&
              !showHomeserverWarning &&
              loginMatrixClient.getSupportedLoginFlows().includes('m.login.sso')
            "
            @click="loginMatrixClient.redirectToSsoLogin()"
          >
            Mit SSO anmelden <i class="fa-solid fa-arrow-right-to-bracket"></i>
          </StandardButton>
        </div>
      </template>
      <template v-else>
        <div class="flex flex-col items-center gap-4">
          <i class="fa-solid fa-spinner animate-spin text-3xl text-gray-400"></i>
        </div>
      </template>
    </div>
  </LoginProcessBase>
</template>
