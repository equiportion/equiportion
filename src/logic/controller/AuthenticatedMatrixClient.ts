import {MatrixClient} from './MatrixClient';

class AuthenticatedMatrixClient extends MatrixClient {
  private accessToken: string;

  constructor(baseUrl: string, accessToken: string) {
    super(baseUrl);
    this.accessToken = accessToken;
  }
}

export {AuthenticatedMatrixClient};
