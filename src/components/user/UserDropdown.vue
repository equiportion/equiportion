<script setup lang="ts">
import DropdownMenu from '@/components/dropdowns/DropdownMenu.vue';
import DropdownSection from '@/components/dropdowns/DropdownSection.vue';
import UserTile from '@/components/user/UserTile.vue';

import User from '@/logic/models/User';

import {type PropType} from 'vue';
const props = defineProps({
  users: {
    type: Array as PropType<User[]>,
    required: true,
  },
  heading: {
    type: String,
    required: false,
    default: '',
  },
});

const emit = defineEmits(['userClick']);

function userClick(user: User, toggle: () => void) {
  emit('userClick', user);
  toggle();
}
</script>
<template>
  <DropdownMenu :inline="true">
    <template #trigger="{toggle}">
      <slot name="trigger" :toggle="toggle" />
    </template>
    <template #default="{toggle}">
      <DropdownSection v-if="heading" :heading="heading" />
      <div
        v-for="user in props.users"
        :key="user.getUserId()"
        class="p-2 cursor-pointer"
        @click="userClick(user, toggle)"
      >
        <UserTile :user="user" />
      </div>
      <span v-if="props.users.length === 0" class="p-2 text-gray-400 text-sm">
        Keine Nutzer*innen wählbar
      </span>
    </template>
  </DropdownMenu>
</template>
