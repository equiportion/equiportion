import type {AuthenticatedMatrixClient} from '@/logic/controller/AuthenticatedMatrixClient';
import {MatrixClient} from '@/logic/controller/MatrixClient';
import router from '@/router';

class LoginMatrixClient extends MatrixClient {
  private authenticatedMatrixClient?: AuthenticatedMatrixClient;

  public getAuthenticatedMatrixClient() {
    if (this.authenticatedMatrixClient) {
      return this.authenticatedMatrixClient;
    } else {
      router.push('/login');
      return 'You have to log in';
    }
  }
}

export {LoginMatrixClient};
