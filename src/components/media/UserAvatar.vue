<script setup lang="ts">
/**
 * @component {UserAvatar} - Component for displaying a user's avatar.
 * @prop {User} user - The user to display.
 */

import User from '@/logic/models/User';
import MxcOrPlaceholderImage from '@/components/media/MxcOrPlaceholderImage.vue';

defineProps({
  user: {
    type: User,
    required: true,
  },
});
</script>

<template>
  <MxcOrPlaceholderImage
    :mxc-url="user.getAvatarUrl()"
    :placeholder-text="user.getDisplayname() ?? user.getUserId()"
  />
</template>
