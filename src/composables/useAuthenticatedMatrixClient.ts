import AuthenticatedMatrixClient from '@/logic/controller/clients/AuthenticatedMatrixClient';
import router from '@/router';

export default function useAuthenticatedMatrixClient() {
  const authenticatedMatrixClient = new AuthenticatedMatrixClient();

  redirectIfUnauthenticated();

  function getAuthenticatedMatrixClient() {
    return authenticatedMatrixClient;
  }

  async function redirectIfUnauthenticated() {
    if (!(await authenticatedMatrixClient.isValid())) {
      router.push({name: 'landing-page'});
    }
  }

  return {getAuthenticatedMatrixClient, redirectIfUnauthenticated};
}
