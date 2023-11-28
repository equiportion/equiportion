<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import ProfileImage from '@/components/media/ProfileImage.vue';
import DividerLeftText from '@/components/dividers/DividerLeftText.vue';
import PaymentInformation from '@/views/partials/PaymentInformation.vue';
import StandardButton from '@/components/buttons/StandardButton.vue';
import IbanPaymentInformation from '@/logic/models/IbanPaymentInformation';
import PayPalPaymentInformation from '@/logic/models/PayPalPaymentInformation';

import {ref} from 'vue';
import AuthenticatedMatrixClient from '@/logic/controller/clients/AuthenticatedMatrixClient';
import useAuthenticatedMatrixClient from '@/composables/useAuthenticatedMatrixClient';
import type User from '@/logic/models/User';

const payPalMail = ref('');
const iban = ref('');
const saving = ref(false);
const success = ref(false);

var client: AuthenticatedMatrixClient;

var loggedInUser: User;

const loading = ref(true);
useAuthenticatedMatrixClient(loadData);

async function loadData(clientInstance: AuthenticatedMatrixClient) {
  client = clientInstance;

  loggedInUser = client.getLoggedInUser();

  const paymentInformations = loggedInUser.getPaymentInformations()!;
  for (const paymentInformation of paymentInformations!) {
    if (paymentInformation.getType() == 'paypal') {
      payPalMail.value = paymentInformation.getInformationValue();
    } else if (paymentInformation.getType() == 'iban') {
      iban.value = paymentInformation.getInformationValue();
    }
  }

  loading.value = false;
}

async function savePaymentMethods() {
  const ibanPaymentInformation = new IbanPaymentInformation(iban.value);
  const payPalPaymentInformation = new PayPalPaymentInformation(payPalMail.value);

  loggedInUser?.setPaymentInformations([ibanPaymentInformation, payPalPaymentInformation]);

  await client?.publishPaymentInformations();

  saving.value = false;
  success.value = true;

  setTimeout(() => {
    success.value = false;
  }, 1000);
}
</script>
<template>
  <MainLayout>
    <div class="flex flex-col px-5 mt-2 items-center gap-5">
      <!--Profile image and username -->
      <div class="flex flex-col items-center lg:flex-row justify-center gap-5">
        <ProfileImage class="w-40 h-40 rounded-full" />
        <div class="flex flex-col items-center lg:items-start">
          <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
            {{ loggedInUser?.getDisplayname() }}
          </h1>
          <span class="text-md text-gray-500">{{ loggedInUser?.getUserId() }}</span>
        </div>
      </div>

      <!-- Payment methods -->
      <div class="flex flex-col items-center w-full lg:max-w-3xl gap-5">
        <DividerLeftText><h2 class="text-xl">Zahlungseinstellungen</h2></DividerLeftText>
        <PaymentInformation paymentMethodName="IBAN" v-model="iban" />
        <PaymentInformation paymentMethodName="PayPal" v-model="payPalMail" />
        <StandardButton
          :loading="saving"
          :success="success"
          @click="
            saving = true;
            savePaymentMethods();
          "
        >
          Speichern
        </StandardButton>
      </div>
    </div>
  </MainLayout>
</template>
