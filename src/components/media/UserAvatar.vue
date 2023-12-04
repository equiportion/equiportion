<script setup lang="ts">
import User from '@/logic/models/User';
import MxcOrPlaceholderImage from '@/components/media/MxcOrPlaceholderImage.vue';

const props = defineProps({
  user: {
    type: User,
    required: true,
  }
})
</script>

<template>
  <MxcOrPlaceholderImage :mxcUrl="props.user.getAvatarUrl() ?? ''" :placeholderText="props.user.getDisplayname() ?? props.user.getUserId()" />
</template>