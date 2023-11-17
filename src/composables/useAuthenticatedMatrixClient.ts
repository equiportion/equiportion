import {AuthenticatedMatrixClient} from '@/logic/controller/AuthenticatedMatrixClient';
import router from '@/router';

export default function useAuthenticatedMatrixClient() {
  const authenticatedMatrixClient = new AuthenticatedMatrixClient();

  function getAuthenticatedMatrixClient() {
    return authenticatedMatrixClient;
  }

  if (!authenticatedMatrixClient.isValid()) {
    router.push({name: 'login'});
  }

  return {getAuthenticatedMatrixClient};
}
