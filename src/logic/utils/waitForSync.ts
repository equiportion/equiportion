import {useClientStateStore} from '@/stores/clientState';
import {watch} from 'vue';

/**
 * Waits until the client is done syncing for the first time.
 * Uses a reactive watcher instead of polling for better performance.
 * @returns {Promise<void>} a promise that resolves when the client is done with the first sync
 */
function waitForInitialSync(): Promise<void> {
  const clientStateStore = useClientStateStore();

  // Already synced at least once — resolve immediately
  if (clientStateStore.numberOfSyncs >= 1) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const stopWatch = watch(
      () => clientStateStore.numberOfSyncs,
      (newVal) => {
        if (newVal >= 1) {
          stopWatch();
          resolve();
        }
      }
    );
  });
}

export default waitForInitialSync;
