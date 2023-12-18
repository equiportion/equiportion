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

const loggedInUser = useLoggedInUserStore().user;

const placeholderText = computed(() => {
  if (loggedInUser.getUserId() != '') {
    return loggedInUser.getDisplayname() ?? loggedInUser.getUserId();
  }
  return undefined;
});
</script>

<template>
  <MxcOrPlaceholderImage
    :mxc-url="loggedInUser.getAvatarUrl()"
    :placeholder-text="placeholderText ?? '?'"
  />
</template>
