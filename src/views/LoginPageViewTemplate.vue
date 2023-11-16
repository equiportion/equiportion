<script setup lang="ts">
import {ref} from 'vue';

import InputFieldWithLabelAndError from '@/components/input/InputFieldWithLabelAndError.vue';
import LoginProcessBase from './partials/LoginProcessBase.vue';
import LoginContinueButton from './partials/LoginContinueButton.vue';
import LoginStepsBar from './partials/LoginStepsBar.vue';
import SystemAlert from '@/components/messaging/SystemAlert.vue';

const loading = ref(false);
</script>
<template>
  <LoginProcessBase>
    <form action="#" class="mt-8 flex flex-col gap-6 w-full">
      <LoginStepsBar :active="2" />

      <span class="text-center">Am Server "wtf.matrix.org" anmelden</span>

      <SystemAlert severity="warning">
        <p class="font-bold">Hinweis:</p>
        <p>
          Aktuell unterstütz dieser Dienst leider nur Passwort-basierte Authentifizierung. In einer
          späteren Version ist mit Unterstützung von SSO, etc. zu rechnen.
        </p>
      </SystemAlert>

      <InputFieldWithLabelAndError
        type="text"
        id="username"
        name="username"
        placeholder="z.B. @maxmustermann:matrix.org"
        label="Benutzername"
      />
      <InputFieldWithLabelAndError
        type="password"
        id="homeserver"
        name="homeserver"
        placeholder="Matrix-Passwort eingeben..."
        label="Passwort"
      />

      <div class="sm:flex sm:items-center sm:gap-4">
        <LoginContinueButton :loading="loading" @continue="loading = true">
          Anmelden <i class="fa-solid fa-arrow-right-to-bracket"></i>
        </LoginContinueButton>
      </div>
    </form>
  </LoginProcessBase>
</template>
