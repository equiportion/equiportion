<script setup lang="ts">
import User from '@/logic/models/User';
import ProfileImage from '../media/ProfileImage.vue';

const props = defineProps({
  user: {
    type: User,
    required: true,
  },
});
</script>
<template>
  <div class="flex flex-row bg-gray-100 rounded-full items-center">
    <ProfileImage class="rounded-full h-8 w-8"></ProfileImage>
    <span class="mx-2">{{ props.user.getDisplayname() ?? props.user.getUserId() }}</span>
  </div>
</template>
