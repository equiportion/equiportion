<script setup lang="ts">
/**
 * @component {MxcOrPlaceholderImage} - Component to load images via the Matrix client
 *  or display a placeholder image if no image is available.
 * @author Philipp Stappert
 *
 * @prop {string} class - CSS class to apply to the image (optional).
 * @prop {string} mxcUrl - The mxc url of the image.
 * @prop {string} [alt] - Alternative text for the image (optional).
 * @prop {string} [title] - Title text for the image (optional).
 * @prop {number} [width] - Width of the image (optional, default: 128).
 * @prop {number} [height] - Height of the image (optional, default: 128).
 * @prop {string} [method] - Method to use for thumbnail generation (optional, default: 'crop', options: crop, scale).
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
