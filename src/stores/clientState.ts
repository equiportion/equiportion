import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useClientStateStore = defineStore('loading', () => {
  const created = ref(false);
  const numberOfSyncs = ref(0);
  const syncing = ref(false);

  return {created, numberOfSyncs, syncing};
});
