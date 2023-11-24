import {AuthenticatedMatrixClient} from '@/logic/controller/clients/AuthenticatedMatrixClient';
import router from '@/router';

export default function useAuthenticatedMatrixClient(onLoad?: Function, onError?: Function) {
  getClient();

  async function getClient() {
    const client = await AuthenticatedMatrixClient.getClient();
    if (client) {
      if (onLoad) {
        onLoad(client);
      }
    } else {
      if (onError) {
        onError();
      }
      router.push({name: 'landing-page'});
    }
  }
}
