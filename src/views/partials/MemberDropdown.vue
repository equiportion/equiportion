<script setup lang="ts">
import UserAvatar from '@/components/media/UserAvatar.vue';

const props = defineProps(['isOpen', 'members', 'handleClick']);
</script>
<template>
    <div v-show="isOpen" class="bg-white absolute left-16 z-10 border-2 border-slate-200 rounded">
      <div
        v-for="member in members"
        :key="member.getUserId()"
        class="flex flex-col items-center m-10"
        @click="() => handleClick(member.getUserId())"
      >
        <UserAvatar :user="member" class="w-10 h-10 rounded-full" />
        <div class="flex flex-col items-center">
        <span class="text-md text-gray-700 font-bold mt-3">{{ member.getDisplayname() }}</span>
        </div>
      </div>
    </div>
  </template>