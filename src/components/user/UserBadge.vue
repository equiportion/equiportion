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
  <div
    class="flex flex-row max-h-8 bg-blue-600 text-gray-100 rounded-full items-center pr-3"
    :title="user.getUserId()"
  >
    <MxcOrPlaceholderImage
      class="rounded-full w-8 h-8"
      :mxc-url="user.getAvatarUrl()"
      :placeholder-text="user.getDisplayname() ?? user.getUserId()"
    />
    <span class="ml-1 truncate">
      {{ user.getDisplayname() ?? user.getUserId() ?? 'unbekannter Benutzer' }}
    </span>
  </div>
</template>
