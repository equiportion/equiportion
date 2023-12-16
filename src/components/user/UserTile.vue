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
  <div class="flex flex-row items-center gap-2">
    <MxcOrPlaceholderImage
      class="rounded-full w-12 h-12"
      :mxc-url="user.getAvatarUrl()"
      :placeholder-text="user.getDisplayname() ?? user.getUserId()"
    />
    <div class="flex flex-col overflow-hidden">
      <span class="text-ellipsis overflow-hidden text-gray-900">
        {{ user.getDisplayname() ?? user.getUserId() ?? 'unbekannter Benutzer' }}
      </span>
      <span
        v-if="user.getDisplayname()"
        class="text-ellipsis overflow-hidden text-sm text-gray-500"
      >
        {{ user.getUserId() }}
      </span>
    </div>
  </div>
</template>
