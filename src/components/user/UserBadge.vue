<script setup lang="ts">
import User from '@/logic/models/User';
import MxcOrPlaceholderImage from '../media/MxcOrPlaceholderImage.vue';
import {computed} from 'vue';

const props = defineProps({
  user: {
    type: User,
    required: true,
  },
  size: {
    type: String,
    default: 'md',
  },
});

const wrapperClasses = computed(() => {
  const classes = 'flex flex-row bg-blue-600 text-gray-100 rounded-full items-center pr-3';
  switch (props.size) {
    case 'sm':
      return classes + ' max-h-6 text-base';
    case 'lg':
      return classes + ' max-h-10 text-lg';
    case 'md':
    default:
      return classes + ' max-h-8';
  }
});

const imageClasses = computed(() => {
  const classes = 'rounded-full';
  switch (props.size) {
    case 'sm':
      return classes + ' w-6 h-6';
    case 'lg':
      return classes + ' w-10 h-10';
    case 'md':
    default:
      return classes + ' w-8 h-8';
  }
});
</script>
<template>
  <div :class="wrapperClasses" :title="user.getUserId()">
    <MxcOrPlaceholderImage
      :class="imageClasses"
      :mxc-url="user.getAvatarUrl()"
      :placeholder-text="user.getDisplayname() ?? user.getUserId()"
    />
    <span class="ml-1 truncate">
      {{ user.getDisplayname() ?? user.getUserId() ?? 'unbekannter Benutzer' }}
    </span>
  </div>
</template>
