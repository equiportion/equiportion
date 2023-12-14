<script setup lang="ts">
import User from '@/logic/models/User';
import MxcOrPlaceholderImage from '../media/MxcOrPlaceholderImage.vue';

defineProps({
  user: {
    type: User,
    required: true,
  },
});
</script>
<template>
  <div class="flex flex-row bg-gray-100 rounded-full items-center pr-3 shadow-md">
    <MxcOrPlaceholderImage
      class="rounded-full h-8 w-8"
      :mxc-url="user.getAvatarUrl()"
      :placeholder-text="user.getDisplayname() ?? '@' + user.getUserId()"
    />
    <span class="ml-1">{{ user.getDisplayname() ?? '@' + user.getUserId() }}</span>
  </div>
</template>
