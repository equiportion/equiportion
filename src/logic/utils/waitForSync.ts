import {useClientStateStore} from '@/stores/clientState';

/**
 * Waits until the client is done syncing for the first time.
 * @returns {Promise<void>} a promise that resolves when the client is done with the first sync
 */
function waitForInitialSync(): Promise<void> {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (useClientStateStore().numberOfSyncs >= 1) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}

export default waitForInitialSync;
