<script setup lang="ts">
/**
 * @component {MxcImage} - Component to load full images via the Matrix client.
 * @author Philipp Stappert
 *
 * @prop {string} class - CSS class to apply to the image (optional).
 * @prop {string} mxcUrl - The mxc url of the image.
 * @prop {string} [alt] - Alternative text for the image (optional).
 * @prop {string} [title] - Title text for the image (optional).
 */

import AuthenticatedMatrixClient from '@/logic/clients/AuthenticatedMatrixClient';
import apiEndpoints from '@/logic/constants/apiEndpoints';

import {ref, watch} from 'vue';
import {useClientStateStore} from '@/stores/clientState';

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
});

const loading = ref(true);
const imageUrl = ref('');

/**
 * Converts a blob to a base64 data url.
 *
 * @param blob - Blob to convert.
 * @returns {Promise<string>} - A promise that resolves to the base64 data url.
 */
function blobToData(blob: Blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

/**
 * Loads the image and saves it in the global variable.
 *
 * @returns {Promise<void>} - A promise that resolves when the image is saved.
 */
async function loadImage(): Promise<void> {
  if (!clientStateStore.created) {
    return;
  }

  loading.value = true;

  // split mxc url into server and media id
  const mxcUrlParts = props.mxcUrl.split('/');
  const serverName = mxcUrlParts[2];
  const mediaId = mxcUrlParts[3];

  const response = await AuthenticatedMatrixClient.getClient().getRequest(
    apiEndpoints.mediaGet(serverName, mediaId),
    undefined,
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

const clientStateStore = useClientStateStore();
watch(
  () => clientStateStore.created,
  () => {
    loadImage();
  }
);

watch(
  props,
  () => {
    loadImage();
  },
  {immediate: true}
);
</script>
<template>
  <div>
    <span v-show="loading" :class="props.class" class="flex items-center justify-center h-full">
      <i class="fa-solid fa-spinner animate-spin"></i>
    </span>
    <img v-show="!loading" :class="props.class" :src="imageUrl" :alt="alt" :title="title" />
  </div>
</template>
