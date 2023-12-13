import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useClientStateStore = defineStore('loading', () => {
  const created = ref(false);
  const numberOfSyncs = ref(0);
  const syncing = ref(false);
  const transactionId = ref(0);

  function incrementTransactionId() {
    transactionId.value++;
  }

  return {created, numberOfSyncs, syncing, transactionId, incrementTransactionId};
});
