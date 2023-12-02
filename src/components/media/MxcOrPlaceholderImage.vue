<script setup lang="ts">
/**
 * @component {MxcOrPlaceholderImage} - Komponente zum Laden von Thumbnail-Bildern über den Matrix-Client,
 *  oder alternativ ein Platzhalterbild, falls kein Bild geladen werden kann.
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

import MxcThumbnail from '@/components/media/MxcThumbnail.vue';
import {computed} from 'vue';

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
  placeholderText: {
    type: String,
    default: '?',
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

const placeholderUrl = computed(() => {
  return (
    'https://ui-avatars.com/api/?name=' +
    props.placeholderText +
    '&size=' +
    props.width +
    '&background=random'
  );
});
</script>
<template>
  <MxcThumbnail
    v-if="mxcUrl"
    :mxcUrl="mxcUrl"
    alt=""
    :title="title"
    :width="width"
    :height="height"
    :method="method"
    :class="props.class"
  />
  <img v-else :src="placeholderUrl" :class="props.class" :alt="alt" />
</template>
