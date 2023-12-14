<script setup lang="ts">
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
