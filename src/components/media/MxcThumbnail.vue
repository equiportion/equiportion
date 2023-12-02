<script setup lang="ts">
/**
 * @component {MxcThumbnail} - Komponente zum Laden von Thumbnail-Bildern über den Matrix-Client.
 * @author Philipp Stappert
 *
 * @prop {string} class - CSS-Klasse, die auf das Bild angewendet werden soll (optional).
 * @prop {string} mxcUrl - Die MXC-URL des Bildes, das geladen werden soll (erforderlich).
 * @prop {string} [alt] - Alternativer Text für das Bild (optional).
 * @prop {string} [title] - Titel des Bildes (optional).
 * @prop {number} [width] - Breite des Bildes (optional, Standard: 128).
 * @prop {number} [height] - Höhe des Bildes (optional, Standard: 128).
 * @prop {string} [method] - Methode zur Bildskalierung (optional, Standard: 'crop').
 */

import useAuthenticatedMatrixClient from '@/composables/useAuthenticatedMatrixClient';
import AuthenticatedMatrixClient from '@/logic/models/clients/AuthenticatedMatrixClient';
import apiEndpoints from '@/logic/constants/apiEndpoints';

import {ref, watch} from 'vue';

const props = defineProps({
  class: {
    type: String,
    default: '',
  },
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
  width: {
    type: Number,
    default: 128,
  },
  height: {
    type: Number,
    default: 128,
  },
  method: {
    type: String,
    default: 'crop',
  },
});

const loading = ref(true);
const imageUrl = ref('');
var client: AuthenticatedMatrixClient;

/**
 * Lädt den authentifizierten Matrix-Clients.
 *
 * @param {AuthenticatedMatrixClient} client - Eine Instanz des authentifizierten Matrix-Clients.
 * @returns {Promise<void>} - Ein Promise, das gelöst wird, wenn der Client geladen ist.
 */
async function saveClient(clientInstance: AuthenticatedMatrixClient): Promise<void> {
  client = clientInstance;

  loadThumbnail();
}

/**
 * Konvertiert ein Blob in einen Base64-String.
 *
 * @param blob - Der Blob, der konvertiert werden soll.
 * @returns {Promise<string>} - Ein Promise, das gelöst wird, wenn die Konvertierung abgeschlossen ist.
 */
function blobToData(blob: Blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

/**
 * Lädt das Thumbnail-Bild über den Matrix-Client.
 *
 * @returns {Promise<void>} - Ein Promise, das gelöst wird, wenn das Bild geladen ist.
 */
async function loadThumbnail(): Promise<void> {
  loading.value = true;

  // split mxc url into server and media id
  const mxcUrlParts = props.mxcUrl.split('/');
  const serverName = mxcUrlParts[2];
  const mediaId = mxcUrlParts[3];

  const response = await client.getRequest(
    apiEndpoints.thumbnailGet(serverName, mediaId, props.width, props.height, props.method),
    {
      responseType: 'blob',
    }
  );
  if (response!.status == 200) {
    const base64data = await blobToData(response!.data);
    imageUrl.value = base64data as string;
  }

  loading.value = false;
}

// load client and thumbnail
useAuthenticatedMatrixClient(saveClient);

watch(props, async () => {
  loadThumbnail();
});
</script>
<template>
  <div>
    <span v-show="loading" class="flex items-center justify-center h-full">
      <i class="fa-solid fa-spinner animate-spin"></i>
    </span>
    <img v-show="!loading" :class="props.class" :src="imageUrl" :alt="alt" :title="title" />
  </div>
</template>
