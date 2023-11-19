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
      //TODO: should push to 'welcome'
      router.push({name: 'login'});
    }
  }

  return {getAuthenticatedMatrixClient, redirectIfUnauthenticated};
}
