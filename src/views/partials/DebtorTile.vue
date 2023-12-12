<script setup lang="ts">
import UserAvatar from '@/components/media/UserAvatar.vue';
const props = defineProps(['debtor', 'members', 'handleClick']);
</script>
<template>
  <div class="relative group transition duration-200 hover:scale-110">
    <!--'x'-->
    <div
      class="absolute inset-0 flex items-center bg-gray-800 rounded-full transition-all-300 justify-center opacity-0 group-hover:opacity-100 transition duration-200"
      @click="handleClick(debtor.getUserId())"
    >
      <i class="text-white fa-solid fa-xmark text-2xl"></i>
    </div>
    <UserAvatar :user="members[debtor.getUserId()]" class="w-20 h-20 rounded-full" />
  </div>
  <span class="text-md text-gray-700 font-bold mt-3">{{ debtor.getDisplayname() }}</span>
</template>
