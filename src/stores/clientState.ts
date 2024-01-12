import {defineStore} from 'pinia';
import {ref, type Ref} from 'vue';

export const useClientStateStore = defineStore('loading', () => {
  const created = ref(false);
  const numberOfSyncs = ref(0);
  const syncing = ref(false);
  const deviceId: Ref<string | undefined> = ref(undefined);

  return {created, numberOfSyncs, syncing, deviceId};
});
