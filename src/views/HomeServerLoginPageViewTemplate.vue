<script setup lang="ts">
import {ref} from 'vue';

import InputFieldWithLabelAndError from '@/components/input/InputFieldWithLabelAndError.vue';
import LoginProcessBase from './partials/LoginProcessBase.vue';
import LoginContinueButton from './partials/LoginContinueButton.vue';
import LoginStepsBar from './partials/LoginStepsBar.vue';

const loading = ref(false);
</script>
<template>
  <LoginProcessBase>
    <form action="#" class="mt-8 flex flex-col gap-6 w-full">
      <LoginStepsBar :active="1" />
      <div>
        <InputFieldWithLabelAndError
          type="text"
          id="homeserver"
          name="homeserver"
          placeholder="z.B. https://matrix.org"
          label="Homeserver-URL"
        />
      </div>

      <div class="sm:flex sm:items-center sm:gap-4">
        <LoginContinueButton :loading="loading" @continue="loading = true">
          Weiter zum Anmelden <i class="fa-solid fa-arrow-right-to-bracket"></i>
        </LoginContinueButton>
      </div>
    </form>
  </LoginProcessBase>
</template>
