import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const useLoggedInUserStore = defineStore('loggedInUser', () => {
  const userId: Ref<string> = ref('');
  const displayname: Ref<string | undefined> = ref();
  const avatarUrl: Ref<string | undefined> = ref();

  return {userId, displayname, avatarUrl}
});