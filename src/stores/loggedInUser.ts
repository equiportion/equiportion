import User from '@/logic/models/User';
import {defineStore} from 'pinia';
import {ref, type Ref} from 'vue';

export const useLoggedInUserStore = defineStore('loggedInUser', () => {
  const user = ref(new User(''));

  return {user};
});
