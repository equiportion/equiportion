<script setup lang="ts">
/**
 * @component {ProfileImage} - Komponente zum Laden des Profilbildes eines Benutzers über den Matrix-Client.
 * Falls kein Bild geladen werden kann, wird ein Platzhalterbild angezeigt.
 * @author Philipp Stappert
 *
 * @prop {string} class - CSS-Klasse, die auf das Bild angewendet werden soll (optional).
 */
import useAuthenticatedMatrixClient from '@/composables/useAuthenticatedMatrixClient';
import User from '@/logic/models/User';
import AuthenticatedMatrixClient from '@/logic/models/clients/AuthenticatedMatrixClient';
import MxcOrPlaceholderImage from '@/components/media/MxcOrPlaceholderImage.vue';

import {ref} from 'vue';

const mxcUrl = ref('');
const altText = ref('?');
var client: AuthenticatedMatrixClient;
var user: User;

function loadUser() {
  user = client.getLoggedInUser();

  if (!user) {
    setTimeout(loadUser, 100);
  } else {
    mxcUrl.value = user.getAvatarUrl() ?? '';
    altText.value = user.getDisplayname() ?? user.getUserId();
  }
}

async function loadData(clientInstance: AuthenticatedMatrixClient) {
  client = clientInstance;

  loadUser();
}

useAuthenticatedMatrixClient(loadData);
</script>

<template>
  <MxcOrPlaceholderImage :mxcUrl="mxcUrl" :placeholderText="altText" />
</template>
