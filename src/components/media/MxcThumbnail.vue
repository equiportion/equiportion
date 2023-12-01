<script setup lang="ts">
/**
 * @component {MxcThumbnail} - Komponente zum Laden von Thumbnail-Bildern über den Matrix-Client.
 * @author Philipp Stappert
 *
 * @prop {string} mxcUrl - Die MXC-URL des Bildes, das geladen werden soll (erforderlich).
 * @prop {string} [alt] - Alternativer Text für das Bild (optional).
 * @prop {string} [title] - Titel des Bildes (optional).
 */

import useAuthenticatedMatrixClient from '@/composables/useAuthenticatedMatrixClient';
import AuthenticatedMatrixClient from '@/logic/controller/clients/AuthenticatedMatrixClient';
import apiEndpoints from '@/logic/constants/apiEndpoints';

import {ref} from 'vue';

const props = defineProps({
  mxcUrl: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
});

const loading = ref(true);
const imageUrl = ref('');
var client: AuthenticatedMatrixClient;

/**
 * Lädt den authentifizierten Matrix-Clients.
 *
 * @param {AuthenticatedMatrixClient} client - Eine Instanz des authentifizierten Matrix-Clients.
 * @returns {void}
 */
async function saveClient(clientInstance: AuthenticatedMatrixClient) {
  client = clientInstance;
}

/**
 * Lädt das Thumbnail-Bild über den Matrix-Client.
 *
 * @returns {Promise<void>} - Ein Promise, das gelöst wird, wenn das Bild geladen ist.
 */
async function loadThumbnail() {
  loading.value = true;

  const response = await client.getRequest(apiEndpoints.thumbnailGet(props.mxcUrl));
  imageUrl.value = URL.createObjectURL(await response.blob());
  loading.value = false;
}

useAuthenticatedMatrixClient(saveClient);
</script>
<template>
  <img :alt="alt" :title="title" />
</template>
