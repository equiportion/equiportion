<script setup lang="ts">
/**
 * @component {DebtorTile} - Component for displaying a debtor's information.
 * @author Yinlei Ba
 *
 * @prop {User} debtor - The debtor to display.
 */
import UserAvatar from '@/components/media/UserAvatar.vue';
import User from '@/logic/models/User';

defineProps({
  debtor: {
    type: User,
    required: true,
  },
});

const emit = defineEmits(['click']);
</script>
<template>
  <div class="relative group transition duration-200 hover:scale-110">
    <!--'x'-->
    <div
      class="absolute inset-0 flex items-center bg-gray-800 rounded-full transition-all-300 justify-center opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer"
      @click="emit('click')"
    >
      <i class="text-white fa-solid fa-trash text-2xl"></i>
    </div>
    <UserAvatar :user="debtor" class="w-20 h-20 rounded-full" />
  </div>
  <span class="text-md text-gray-700 font-bold mt-3">{{ debtor.getDisplayname() }}</span>
</template>
