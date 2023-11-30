import AuthenticatedMatrixClient from '@/logic/models/clients/AuthenticatedMatrixClient';
import router from '@/router';

/**
 * Composable for using a authenticated matrix client. Should be used whenever data from matrix is needed.
 * @param onLoad callback for when getting the client was succesful, provides the initiated client
 * @param onError callback for when there was an error while getting the client
 */
export default function useAuthenticatedMatrixClient(
  onLoad?: (client: AuthenticatedMatrixClient) => void,
  onError?: () => void
) {
  getClient();

  async function getClient() {
    const client = await AuthenticatedMatrixClient.getClient();
    if (client) {
      if (onLoad) {
        onLoad(client);
      }
    } else {
      //client couldn't be authenticated, try to log in
      if (onError) {
        onError();
      }
      router.push({name: 'landing-page'});
    }
  }
}
