<script setup lang="ts">
/**
 * @component {MemberDropdown} - Component for displaying a member's information in a dropdown.
 * @author Yinlei Ba
 *
 * @prop {User} member - The member to display.
 */
import UserAvatar from '@/components/media/UserAvatar.vue';
import User from '@/logic/models/User';

defineProps({
  member: {
    type: User,
    required: true,
  },
});
</script>
<template>
  <div class="m-10 flex flex-col items-center">
    <UserAvatar :user="member" class="w-10 h-10 rounded-full" />
    <div class="flex flex-col items-center">
      <span class="text-md text-gray-700 font-bold mt-3">
        {{ member.getDisplayname() }}
      </span>
    </div>
  </div>
</template>
