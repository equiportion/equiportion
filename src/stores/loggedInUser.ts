import User from '@/logic/models/User';
import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useLoggedInUserStore = defineStore('loggedInUser', () => {
  const user = ref(new User(''));

  return {user};
});
