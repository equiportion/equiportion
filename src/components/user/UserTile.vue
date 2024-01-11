<script setup lang="ts">
import User from '@/logic/models/User';
import MxcOrPlaceholderImage from '../media/MxcOrPlaceholderImage.vue';
import {computed} from 'vue';

import {useLoggedInUserStore} from '@/stores/loggedInUser';

const loggedInUser = useLoggedInUserStore().user;

const props = defineProps({
  user: {
    type: User,
    required: false,
    default: undefined,
  },
});

const isLoggedInUser = computed(() => {
  return props.user?.getUserId() == loggedInUser.getUserId();
});

const displayNameClasses = computed(() => {
  if (isLoggedInUser.value) {
    return 'font-bold text-ellipsis overflow-hidden whitespace-nowrap';
  } else {
    return 'text-ellipsis overflow-hidden whitespace-nowrap';
  }
});
</script>
<template>
  <div class="flex flex-row items-center gap-2">
    <div class="flex-shrink-0">
      <MxcOrPlaceholderImage
        class="rounded-full w-12 h-12"
        :mxc-url="user?.getAvatarUrl()"
        :placeholder-text="user?.getDisplayname() ?? user?.getUserId()"
      />
    </div>
    <div class="flex flex-col overflow-hidden flex-shrink">
      <div class="flex flex-row text-gray-900">
        <span :class="displayNameClasses">
          {{ user?.getDisplayname() ?? user?.getUserId() ?? 'unbekannter Benutzer' }}
        </span>
        <span v-if="isLoggedInUser">&nbsp;(Ich) </span>
      </div>
      <span
        v-if="user?.getDisplayname()"
        class="text-ellipsis overflow-hidden text-sm text-gray-500"
      >
        {{ user.getUserId() }}
      </span>
    </div>
  </div>
</template>
