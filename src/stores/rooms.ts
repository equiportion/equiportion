import type Room from '@/logic/models/Room';
import {defineStore} from 'pinia';
import {ref, type Ref} from 'vue';

export const useLoggedInUserStore = defineStore('rooms', () => {
  const rooms: Ref<{[roomId: string]: Room}> = ref({});

  return {rooms};
});
