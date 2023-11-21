import MatrixError from '@/logic/controller/MatrixError';
import AuthenticatedMatrixClient from '@/logic/controller/clients/AuthenticatedMatrixClient';
import InvalidHomeserverUrlError from '@/logic/controller/clients/InvalidHomeserverUrlError';
import router from '@/router';

export default function useAuthenticatedMatrixClient() {
  const authenticatedMatrixClient = new AuthenticatedMatrixClient();

  initiate();

  function getAuthenticatedMatrixClient() {
    return authenticatedMatrixClient;
  }

  async function initiate() {
    try {
      await authenticatedMatrixClient.initiate();
    } catch (error) {
      if (error instanceof InvalidHomeserverUrlError) {
        error.log();
      } else if (error instanceof MatrixError) {
        error.log();
      } else {
        console.error(error);
      }

      router.push({name: 'landing-page'});
    }
  }

  return {getAuthenticatedMatrixClient};
}
