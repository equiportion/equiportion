<script setup lang="ts">
/**
 * @component {ProfileImage} - Component to load profile images via the Matrix client.
 * If no avatar image is available, a placeholder image is displayed instead.
 * @author Philipp Stappert
 *
 * @prop {string} class - CSS class to apply to the image (optional).
 */

import MxcOrPlaceholderImage from '@/components/media/MxcOrPlaceholderImage.vue';
import {useLoggedInUserStore} from '@/stores/loggedInUser';
import {computed} from 'vue';

const loggedInUserStore = useLoggedInUserStore();

const placeholderText = computed(() => {
  if (loggedInUserStore.userId != '') {
    return loggedInUserStore.displayname ?? loggedInUserStore.userId;
  }
  return undefined;
});
</script>

<template>
  <MxcOrPlaceholderImage
    :mxcUrl="loggedInUserStore.avatarUrl"
    :placeholderText="placeholderText ?? '?'"
  />
</template>
