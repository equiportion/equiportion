<script setup lang="ts">
/**
 * @component {MemberDropdown} - Component for displaying a member's information in a dropdown.
 * @author Yinlei Ba
 *
 * @prop {User} member - The member to display.
 */
import UserAvatar from '@/components/media/UserAvatar.vue';

const props = defineProps(['member']);
</script>
<template>
  <UserAvatar :user="props.member" class="w-10 h-10 rounded-full" />
  <div class="flex flex-col items-center">
    <span class="text-md text-gray-700 font-bold mt-3">{{ props.member.getDisplayname() }}</span>
  </div>
</template>
